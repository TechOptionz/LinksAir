"""
Import service-page copy from the supplied Word documents into
data/site-content.json, and drop their embedded images into a folder for
scripts/import-images.mjs to optimise.

    python scripts/import-docx.py <docx_dir> [--out-png <dir>] [--dry-run] [--only <slug>]

The .docx files are plain "landing page" write-ups with no Word styles: every
heading is simply a bold paragraph, sections are numbered by hand ("3. Overview",
"Section 4 – ..."), FAQs are bold "Q: ..." lines followed by an answer, lists
are literal "•" / "1." prefixes, and comparison tables are real Word tables.
This script turns that into the site's block model (p / h / ul / ol / faq /
table / img) and strips the writer's working notes (internal-linking tables,
CTA button labels, image-generation prompts).
"""
import argparse
import collections
import html
import json
import os
import re
import sys
import zipfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONTENT = os.path.join(ROOT, 'data', 'site-content.json')

# docx file stem -> site slug
MAP = {
    'AC_Service_Maintenance': 'service-maintenance',
    'Air_Conditioning_FAQ': 'faq',
    'Air_Conditioning_Installation_Landing_Page': 'air-conditioning-installation',
    'Air_Conditioning_Repair_and_Installation': 'repair-installation',
    'Back_To_Back_AC_Installation': 'back-to-back-installation',
    'Bathroom_Exhaust_Heater_Installations_Landing_Page': 'bathroom-exhaust-heater-installations',
    'CCTV_Camera_Installation': 'cctv-camera-installation',
    'Ceiling_Exhaust_Fans_Landing_Page': 'ceiling-exhaust-fans',
    'Ceiling_Fan_Installation_Landing_Page_Links_Air_Electrical': 'ceiling-fan-installation',
    'Data_Points_Landing_Page': 'data-points-and-network-cabling',
    'Design_Construction_Landing_Page': 'design-and-construction',
    'Downlights_Landing_Page': 'downlights',
    'Ducted_Air_Conditioning_Landing_Page': 'ducted-airconditioning',
    'Ducted_Multi_Zone_Landing_Page': 'ducted-multi-zone-air-conditioning',
    'EV_Charger_Installation': 'ev-charger-installation',
    'General_Electrical_Maintenance_Content': 'general-electrical-maintenance',
    'LED_Lights_Installation': 'led-lights-installation',
    'Meter_Box_Relocation_Upgrade': 'meter-box-relocation-upgrade',
    'New_House_Wiring_Landing_Page': 'new-house-wiring',
    'Other_Electrical_Services_Content_Specification': 'other-electrical-services',
    'Oven_Cooktop_Installations': 'oven-and-cooktop-installations',
    'Pendant_Light_Installer_Landing_Page': 'pendant-light-installer',
    'Power_Point_Installation_Landing_Page': 'power-point-installation',
    'Residential_Electrician_Content': 'residential-electrician',
    'Security_Camera_Installation': 'security-camera-installation',
    'Security_EV_Content_Specification': 'security-and-ev',
    'Service_Landing_Page': 'ac-services',
    'Side_Entry_AC_Installation': 'side-entry-installation',
    'Smoke_Detector_Installation_Landing_Page': 'smoke-detector-installation',
    'Split_Multi_Head_AC_Service_Page': 'split-and-multi-head-system',
    'Split_System_Landing_Page': 'split-system-aircon',
    'Switchboard_Surge_Protector_Content_Specification': 'switchboard-surge-protector-installation',
    'Switchboard_Upgrade_Landing_Page': 'electrical-switchboard-upgrade',
    'USB_Sockets_Content_Specification': 'usb-sockets',
    'Up_And_Over_Installation_Landing_Page': 'up-over-installation',
    'VRV_VRF_Air_Conditioning_Landing_Page_Links_Air': 'vrv-vrf-air-conditioning',
}

# pages that don't exist in the JSON yet
NEW_PAGES = {
    'security-and-ev': 'Security & EV',
}

# ---------------------------------------------------------------- docx reading

P_RE = re.compile(r'<w:tbl>.*?</w:tbl>|<w:p[ >].*?</w:p>|<w:p/>', re.S)
RUN_RE = re.compile(r'<w:r[ >].*?</w:r>', re.S)
T_RE = re.compile(r'<w:t[^>]*>([^<]*)</w:t>|<w:tab/>|<w:br/>')


def run_text(run):
    out = []
    for m in T_RE.finditer(run):
        if m.group(0) == '<w:tab/>':
            out.append(' ')
        elif m.group(0) == '<w:br/>':
            out.append('\n')
        else:
            out.append(html.unescape(m.group(1)))
    return ''.join(out)


def parse_para(p):
    """-> dict(text, bold, size, lead, rest, num, img)"""
    runs = [(run_text(r), ('<w:b/>' in r or '<w:b ' in r) and '<w:b w:val="0"' not in r,
             re.search(r'<w:sz w:val="(\d+)"', r)) for r in RUN_RE.findall(p)]
    runs = [(t, b, int(s.group(1)) if s else 0) for t, b, s in runs if t]
    text = ''.join(t for t, _, _ in runs)
    nonblank = [(t, b, s) for t, b, s in runs if t.strip()]
    bold = bool(nonblank) and all(b for _, b, _ in nonblank)
    size = nonblank[0][2] if nonblank else 0
    # bold lead + normal remainder inside one paragraph ("Safety NoticeRefrigerant …")
    lead = rest = ''
    if nonblank and not bold and nonblank[0][1]:
        i = 0
        while i < len(runs) and (runs[i][1] or not runs[i][0].strip()):
            lead += runs[i][0]
            i += 1
        rest = ''.join(t for t, _, _ in runs[i:])
    return {
        'text': text.strip(), 'bold': bold, 'size': size,
        'lead': lead.strip(), 'rest': rest.strip(),
        'num': '<w:numPr>' in p, 'img': '<w:drawing' in p or '<w:pict' in p,
    }


def read_docx(path):
    z = zipfile.ZipFile(path)
    xml = z.read('word/document.xml').decode('utf8')
    body = re.search(r'<w:body>(.*)</w:body>', xml, re.S).group(1)
    items = []
    for m in P_RE.finditer(body):
        s = m.group(0)
        if s.startswith('<w:tbl>'):
            rows = []
            for tr in re.findall(r'<w:tr[ >].*?</w:tr>', s, re.S):
                cells = []
                for tc in re.findall(r'<w:tc>.*?</w:tc>', tr, re.S):
                    paras = [parse_para(p) for p in re.findall(r'<w:p[ >].*?</w:p>', tc, re.S)]
                    cells.append([p for p in paras if p['text']])
                rows.append(cells)
            items.append({'kind': 'tbl', 'rows': rows})
        else:
            d = parse_para(s)
            if d['text'] or d['img']:
                d['kind'] = 'p'
                items.append(d)
    media = sorted(n for n in z.namelist() if n.startswith('word/media/'))
    images = [z.read(n) for n in media]
    return items, images


# ---------------------------------------------------------------- text helpers

ACRONYMS = {'hvac', 'led', 'ev', 'cctv', 'vrv', 'vrf', 'ac', 'usb', 'rcd', 'spd', 'faq', 'faqs', 'diy',
            'gpo', 'gpos', 'ip', 'wifi', 'wi-fi', 'tv', 'nbn', 'ptz', 'kw', 'mr16', 'gu10', 'usb-a', 'usb-c'}
SMALL = {'a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'in', 'of', 'on', 'or', 'the', 'to', 'vs', 'vs.', 'with'}


def titlecase(s):
    words = s.split()
    out = []
    for i, w in enumerate(words):
        core = w.strip('()/&:,-–').lower()
        if core in ACRONYMS:
            out.append(w.upper())
        elif i and core in SMALL:
            out.append(w.lower())
        else:
            out.append(w[:1].upper() + w[1:].lower())
    return ' '.join(out)


def clean(s):
    s = s.replace(' ', ' ').replace('\n', ' ')
    s = EMOJI.sub('', s)
    s = re.sub(r'[ \t]+', ' ', s)
    return s.strip()


STEP = re.compile(r'^\s*step\s+\d+\s*[—–:\-.]\s*', re.I)
ANSWER_SPLIT = re.compile(r'\s*(?:\n|\bAnswer\s*:|\bA\s*:)\s*', re.I)
LABELLED = re.compile(r'^[A-Z][^:.!?]{2,60}:\s+\S')


NUM_PREFIX = re.compile(r'^\s*(?:section\s+)?\d+(?:\.\d+)*[.)]?\s*(?:[–\-:—])?\s+', re.I)
Q_PREFIX = re.compile(r'^\s*(?:q\s*\d*\s*[:.\-–)]|(?:security|ev|general|installation|service)\s+faq\s*:)\s*', re.I)
A_PREFIX = re.compile(r'^\s*a\s*[:.\-–)]\s+', re.I)
BULLET = re.compile(r'^\s*[•●▪◦■\-–—]\s+')
NUMBERED = re.compile(r'^\s*\d{1,2}[.)]\s+')

SKIP_SECTION = re.compile(r'internal[- ]link|internal website link|website links|anchor text|linking (strategy|suggestions|recommendations|opportunities|architecture|plan)|'
                          r'image[- ]generation|image specifications|ai prompt|ai image|image \d|suggested internal', re.I)
LINKING_PARA = re.compile(r'internal link|linking structure|the following (strategic )?(internal )?links', re.I)
EMOJI = re.compile(r'[\U0001F300-\U0001FAFF☀-➿⭐⬆✅️]\s*')
INLINE_BULLET = re.compile(r'\s*[•●▪]\s*')
INLINE_STEP = re.compile(r'(?:(?<=^)|(?<=\s))(?=\d{1,2}\.\s+[A-Z])')
CTA_HEADING = re.compile(r'call[- ]?to[- ]?action|^cta\b', re.I)
FAQ_HEADING = re.compile(r'frequently asked|\bfaqs?\b', re.I)
DROP_LINE = re.compile(r'^\s*(?:(?:primary|secondary|final|professional)\s+)?call[- ]to[- ]action|^\s*(?:\w+\s+)?cta\s*(?:button|heading|:)|^\s*secondary action|'
                       r'^\s*internal link|^\s*suggested anchor|^\s*anchor text|^\s*meta (?:title|description)|'
                       r'^\s*image (?:number|type|\d)|^\s*destination(?: page)?\s*:|^\s*context\s*/|^\s*placement\s*:', re.I)
STRIP_LABEL = re.compile(r'^\s*(?:supporting headline|short supporting paragraph|detailed hero explanation|headline|heading|body text|h[1-3]|'
                         r'tailored coverage note|safety warning|strict safety warning|balanced approach|important note on scope)\s*:\s*', re.I)


def words(s):
    return len(s.split())


def is_heading_text(t):
    return words(t) <= 14 and not t.endswith('.') and not t.endswith(',')


# ---------------------------------------------------------------- conversion


class Converter:
    def __init__(self, slug, title, items):
        self.slug, self.title, self.items = slug, title, items
        self.blocks = []
        self.faq = None      # current faq item list
        self.q = None        # current question
        self.ans = []
        self.ul = []
        self.ol = []
        self.skip = False
        self.in_faq = False
        self.img_seen = 0
        self.h2size = self.pick_h2size()

    # --- heading level threshold ------------------------------------------------
    def pick_h2size(self):
        sizes = collections.Counter()
        numbered = collections.Counter()
        first = True
        for it in self.items:
            if it['kind'] != 'p':
                continue
            if first:
                first = False
                continue  # the document title
            t = it['text']
            if it['bold'] and is_heading_text(t) and not Q_PREFIX.match(t) and not t.endswith('?'):
                sizes[it['size']] += 1
                if NUM_PREFIX.match(t):
                    numbered[it['size']] += 1
        if sum(numbered.values()) >= 5:
            return numbered.most_common(1)[0][0]
        # unnumbered docs: the main sections are the largest size that is used
        # repeatedly; a size used only a couple of times is a stray call-out
        for floor in (5, 3, 1):
            big = [s for s, n in sizes.items() if n >= floor]
            if big:
                return max(big)
        return 0

    # --- emit helpers ------------------------------------------------------------
    def flush_lists(self):
        if self.ul:
            self.blocks.append({'t': 'ul', 'items': self.ul}); self.ul = []
        if self.ol:
            items, self.ol = self.ol, []
            # hand-numbered section titles that weren't bolded ("22. Final Call to Action")
            if all(words(x) <= 8 and is_heading_text(x) for x in items):
                for x in items:
                    self.handle_heading(x, self.h2size)
            else:
                self.blocks.append({'t': 'ol', 'items': items})

    def flush_q(self):
        if self.q is not None:
            if self.ans:
                self.faq.append({'q': self.q, 'a': ' '.join(self.ans)})
            self.q, self.ans = None, []

    def flush_faq(self):
        self.flush_q()
        if self.faq:
            self.blocks.append({'t': 'faq', 'items': self.faq})
        self.faq = None

    def flush_all(self):
        self.flush_lists(); self.flush_faq()

    def heading(self, text, lvl):
        self.flush_all()
        text = clean(text)
        if text.isupper():
            text = titlecase(text)
        # the site's shape() renders lvl <= 3 as <h2> and lvl >= 4 as <h3>
        self.blocks.append({'t': 'h', 'lvl': 2 if lvl == 2 else 4, 'text': text})

    def para(self, text):
        text = clean(text)
        if not text or LINKING_PARA.search(text):
            return
        if self.q is not None:
            self.ans.append(A_PREFIX.sub('', text)); return
        self.flush_lists()
        # a whole bullet list squeezed into one paragraph: "intro: • a • b • c"
        if text.count('•') + text.count('●') + text.count('▪') >= 2:
            parts = [p.strip() for p in INLINE_BULLET.split(text) if p.strip()]
            if parts and not text.lstrip().startswith(('•', '●', '▪')):
                self.blocks.append({'t': 'p', 'text': parts.pop(0)})
            self.blocks.append({'t': 'ul', 'items': parts}); return
        # numbered steps squeezed into one paragraph: "1. A … 2. B … 3. C …"
        steps = [p.strip() for p in INLINE_STEP.split(text) if p.strip()]
        if len(steps) >= 3 and all(NUMBERED.match(s) for s in steps[1:]):
            if not NUMBERED.match(steps[0]):
                self.blocks.append({'t': 'p', 'text': steps.pop(0)})
            self.blocks.append({'t': 'ol', 'items': [NUMBERED.sub('', s) for s in steps]}); return
        self.blocks.append({'t': 'p', 'text': text})

    def question(self, text, answer=None):
        self.flush_lists()
        self.flush_q()
        if self.faq is None:
            self.faq = []
        self.q = clean(Q_PREFIX.sub('', NUMBERED.sub('', text)))
        if answer:
            self.ans.append(clean(A_PREFIX.sub('', answer)))

    def try_inline_qa(self, raw):
        """'Q: …? A: …' / '1. …?\\nAnswer: …' / bold '…?' lead + answer -> faq item"""
        if '?' not in raw:
            return False
        parts = ANSWER_SPLIT.split(raw, maxsplit=1)
        if len(parts) == 2 and parts[0].rstrip().endswith('?') and words(parts[1]) >= 3:
            self.question(parts[0], parts[1]); return True
        return False

    def image(self):
        self.img_seen += 1
        if self.img_seen == 2:
            self.flush_all()
            self.blocks.append({'t': 'img', 'src': f'docs/{self.slug}-2.png', 'alt': f'{self.title} explained – Links Air & Electrical'})

    # --- main ---------------------------------------------------------------------
    def level_for(self, size):
        return 2 if size >= self.h2size else 3

    def handle_heading(self, text, size, in_box=False):
        raw = text
        text = NUM_PREFIX.sub('', text) if not Q_PREFIX.match(text) else text
        if SKIP_SECTION.search(text):
            self.flush_all(); self.skip = True; return
        if DROP_LINE.match(raw) or DROP_LINE.match(text):
            return
        if CTA_HEADING.search(text):
            # writer's "Final Call to Action" label: keep the copy that follows, drop the label
            self.flush_all(); self.skip = False; return
        self.skip = False
        if in_box:
            self.heading(text, 3); return
        if Q_PREFIX.match(text) or (self.in_faq and text.endswith('?')):
            self.question(text); return
        if FAQ_HEADING.search(text) and not text.endswith('?'):
            self.in_faq = True
            self.heading('Frequently asked questions', 2); return
        lvl = self.level_for(size)
        if lvl == 2:
            self.in_faq = False
        self.heading(text, lvl)

    def handle_text(self, it, in_box=False):
        raw = it['text']
        t = clean(raw)
        if not t:
            return
        if it['bold'] and is_heading_text(t):
            self.handle_heading(t, it['size'], in_box); return
        if DROP_LINE.match(t):
            return
        m = STRIP_LABEL.match(t)
        if m:
            t = t[m.end():]
            raw = raw[m.end():]
            if not t:
                return
        if self.skip:
            return
        # "Q: …" on its own line (not bold in some documents)
        if Q_PREFIX.match(t):
            if not self.try_inline_qa(raw):
                self.question(t)
            return
        # "1. Question?\nAnswer: …" inside an FAQ section
        if self.in_faq and NUMBERED.match(t) and '?' in t and self.try_inline_qa(raw):
            return
        # bold "Question? —" lead with the answer in the same paragraph
        lead = it['lead'].rstrip(' —–-:')
        if lead.endswith('?') and it['rest'] and words(lead) <= 25:
            self.question(lead, it['rest'].lstrip(' —–-:')); return
        # bold lead + body inside one paragraph -> sub-heading + paragraph
        if it['lead'] and it['rest'] and not it['lead'].rstrip().endswith(':') and not it['rest'].startswith(':') \
                and words(it['lead']) <= 12 and words(it['rest']) >= 5 and not BULLET.match(t) and not NUMBERED.match(t):
            self.handle_heading(clean(it['lead']), it['size'], in_box=True)
            if self.skip:
                return
            self.para(it['rest']); return
        if it['num'] or BULLET.match(t):
            if self.q is None:
                self.flush_faq()
            self.ol_flush_if_needed()
            # several bullets may be squeezed into one paragraph: "• a • b • c"
            self.ul.extend(s for s in (x.strip() for x in INLINE_BULLET.split(BULLET.sub('', t))) if s); return
        if (NUMBERED.match(t) or STEP.match(t)) and not it['bold']:
            if self.q is None:
                self.flush_faq()
            if self.ul:
                self.blocks.append({'t': 'ul', 'items': self.ul}); self.ul = []
            # several steps may be squeezed into one paragraph: "1. A … 2. B …"
            pieces = [s.strip() for s in INLINE_STEP.split(t) if s.strip()] or [t]
            self.ol.extend(STEP.sub('', NUMBERED.sub('', s)) for s in pieces); return
        self.para(t)

    def ol_flush_if_needed(self):
        if self.ol:
            self.flush_lists()

    def handle_table(self, rows):
        if self.skip:
            return
        if len(rows) == 1 and len(rows[0]) == 1:
            # a boxed note / callout
            paras = rows[0][0]
            if not paras:
                return
            head = paras[0]
            lead = head['lead'] if head['lead'] and head['rest'] else (head['text'] if head['bold'] else '')
            if lead and (SKIP_SECTION.search(lead) or DROP_LINE.match(lead)):
                return
            if lead and SKIP_SECTION.search(head['text']):
                return
            self.flush_all()
            for p in paras:
                self.handle_text(p, in_box=True)
            self.skip = False
            return
        cells = [[clean(' '.join(p['text'] for p in c)) for c in r] for r in rows]
        cells = [r for r in cells if any(r)]
        if not cells:
            return
        if any(SKIP_SECTION.search(c) for c in cells[0]):
            return
        head = None
        if all(p['bold'] for c in rows[0] for p in c if p['text']):
            head = cells[0]; cells = cells[1:]
        self.flush_all()
        ncol = max(len(r) for r in ([head] if head else []) + cells)
        self.blocks.append({'t': 'table', 'head': head, 'rows': [r + [''] * (ncol - len(r)) for r in cells]})

    def run(self):
        first = True
        self.tagline = ''
        for it in self.items:
            if it['kind'] == 'tbl':
                self.handle_table(it['rows']); continue
            if it['img']:
                self.image()
                if not it['text']:
                    continue
            if first and it['text']:
                first = False
                if words(it['text']) <= 12:
                    continue  # document title -> page h1 comes from the site
            # a short strap-line right under the title becomes the hero intro
            if not self.blocks and not self.tagline and not it['bold'] and 5 <= words(it['text']) <= 22 \
                    and len(it['text']) <= 230 and not DROP_LINE.match(it['text']) and not STRIP_LABEL.match(it['text']):
                self.tagline = clean(it['text']); continue
            self.handle_text(it)
        self.flush_all()
        return self.tidy(self.blocks)

    @staticmethod
    def tidy(blocks):
        out = []
        for b in blocks:
            if b['t'] == 'h' and out and out[-1]['t'] == 'h':
                if out[-1]['text'].lower() == b['text'].lower():
                    continue
            out.append(b)
        # runs of "Label: short explanation" paragraphs were bullet lists in the
        # source that lost their bullet glyphs - render them as lists again
        merged, i = [], 0
        while i < len(out):
            j = i
            while j < len(out) and out[j]['t'] == 'p' and LABELLED.match(out[j]['text']) and words(out[j]['text']) <= 45:
                j += 1
            if j - i >= 2:
                merged.append({'t': 'ul', 'items': [b['text'] for b in out[i:j]]}); i = j
            else:
                merged.append(out[i]); i += 1
        out = merged
        # "… typically covers:" followed by short one-sentence paragraphs is a
        # list whose bullet glyphs were lost
        merged, i = [], 0
        while i < len(out):
            b = out[i]
            merged.append(b)
            if b['t'] == 'p' and b['text'].endswith(':'):
                j = i + 1
                while j < len(out) and out[j]['t'] == 'p' and words(out[j]['text']) <= 25 \
                        and out[j]['text'].count('. ') == 0 and not out[j]['text'].endswith(':'):
                    j += 1
                if j - i - 1 >= 2:
                    merged.append({'t': 'ul', 'items': [x['text'] for x in out[i + 1:j]]}); i = j; continue
            i += 1
        out = merged
        # drop a trailing heading with nothing under it
        while out and out[-1]['t'] == 'h':
            out.pop()
        return out


# ---------------------------------------------------------------- outline / io

def outline(slug, blocks):
    c = collections.Counter(('h2' if b['lvl'] == 2 else 'h3') if b['t'] == 'h' else b['t'] for b in blocks)
    n = sum(len(b['items']) for b in blocks if b['t'] == 'faq')
    print(f'\n### {slug}  {dict(c)}  faq_items={n}')
    for b in blocks:
        if b['t'] == 'h':
            print(('  h2 ' if b['lvl'] == 2 else '      h3 ') + b['text'])
        elif b['t'] == 'table':
            print(f"      [table {len(b['rows'])}x{len(b['rows'][0]) if b['rows'] else 0}] {b['head']}")
        elif b['t'] == 'img':
            print('      [img]')
        elif b['t'] in ('ul', 'ol'):
            print(f"      [{b['t']} {len(b['items'])}] {b['items'][0][:60]}")
        elif b['t'] == 'faq':
            print(f"      [faq {len(b['items'])}] {b['items'][0]['q'][:60]}")
        else:
            print(f"      p({words(b['text'])}w) {b['text'][:70]}")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('docx_dir')
    ap.add_argument('--out-png', default=None)
    ap.add_argument('--dry-run', action='store_true')
    ap.add_argument('--outline', action='store_true')
    ap.add_argument('--only', default=None)
    args = ap.parse_args()

    with open(CONTENT, encoding='utf-8') as f:
        data = json.load(f)
    by_slug = {p['slug']: p for p in data['pages']}

    for stem, slug in MAP.items():
        if args.only and slug != args.only:
            continue
        path = os.path.join(args.docx_dir, stem + '.docx')
        if not os.path.exists(path):
            print('MISSING', path); continue
        page = by_slug.get(slug)
        title = page['title'] if page else NEW_PAGES[slug]
        items, images = read_docx(path)
        conv = Converter(slug, title, items)
        blocks = conv.run()
        if args.outline:
            outline(slug, blocks)
        alts = [f'{title} – Links Air & Electrical', f'{title} explained']
        if args.out_png:
            os.makedirs(args.out_png, exist_ok=True)
            for i, buf in enumerate(images[:2], 1):
                with open(os.path.join(args.out_png, f'{slug}-{i}.png'), 'wb') as f:
                    f.write(buf)
        if page is None:
            page = {'title': title, 'url': f'https://linksairelectrical.com.au/{slug}/', 'slug': slug, 'blocks': [], 'images': []}
            data['pages'].append(page); by_slug[slug] = page
        page['blocks'] = blocks
        page['images'] = alts
        if conv.tagline:
            page['intro'] = conv.tagline
        else:
            page.pop('intro', None)
        if images:
            page['hero'] = f'docs/{slug}-1.png'
        wc = sum(words(b.get('text', '')) + sum(words(x if isinstance(x, str) else x['q'] + ' ' + x['a']) for x in b.get('items', []))
                 + sum(words(' '.join(r)) for r in b.get('rows', []) if isinstance(r, list)) for b in blocks)
        if not args.outline:
            print(f'{slug:42} blocks={len(blocks):3} words={wc:5} imgs={len(images)}')

    if not args.dry_run:
        with open(CONTENT, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=1)
            f.write('\n')
        print('wrote', CONTENT)


if __name__ == '__main__':
    sys.stdout.reconfigure(encoding='utf-8')
    main()
