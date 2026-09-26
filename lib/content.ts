import raw from '@/data/site-content.json';
import { img as asset, type Img } from './images';
import { AREAS, NAV, c, type NavChild, type NavGroup, type NavItem } from './site';

export * from './site';

/* ============ types ============ */
export type Block = {
  t: 'p' | 'h' | 'ul' | 'ol' | 'kv' | 'faq' | 'img' | 'table';
  text?: string;
  lvl?: number;
  items?: any[];
  rows?: string[][];
  /** img: manifest key (see lib/images.ts) + alt text */
  src?: string;
  alt?: string;
  /** table: optional header row; body rows live in `rows` */
  head?: string[] | null;
};
export type Entry = {
  title: string;
  url?: string;
  slug: string;
  blocks: Block[];
  images?: string[];
  date?: string;
  /** manifest key of the hero image; overrides the IMGS lookup below */
  hero?: string;
  /** hero strap-line; when absent the first long paragraph is used */
  intro?: string;
};

export type Shaped = Block & {
  isH2: boolean;
  isH3: boolean;
  isP: boolean;
  isUl: boolean;
  isOl: boolean;
  isKv: boolean;
  isFaq: boolean;
  isImg: boolean;
  isTable: boolean;
  steps?: { n: number; text: string }[];
  kvRows?: { k: string; v: string }[];
  img?: Img;
};

/* ============ constants ported 1:1 from the template ============ */
/* Images are keyed by their original WordPress uploads path; the real files
   live in public/img/ and are resolved via asset() from lib/images.ts. */

export const TITLES: Record<string, string> = {
  'home': 'Home', 'ac-services': 'Air Conditioning Services', 'ducted-airconditioning': 'Ducted Air Conditioning', 'electrical-services': 'Electrical Services',
  'meter-box-relocation-upgrade': 'Meter Box Relocation & Upgrade', 'power-point-installation': 'Power Point Installation', 'vrv-vrf-air-conditioning': 'VRV / VRF Air Conditioning',
  'split-and-multi-head-system': 'Split & Multi-Head Systems', 'ducted-multi-zone-air-conditioning': 'Ducted Multi Zone Air Conditioning', 'building-and-construction': 'Building & Construction',
  'repair-installation': 'Repair & Installation', 'service-maintenance': 'Service & Maintenance', 'thank-you': 'Thank You', 'terms-conditions': 'Terms & Conditions', 'about-us': 'About Us',
  'security-and-ev': 'Security & EV',
};

export const IMGS: Record<string, string> = {
  'split-system-aircon': '2024/09/split_innerimg01.jpg', 'back-to-back-installation': '2024/09/Outdoor-9.1kW-scaled.jpg', 'side-entry-installation': '2024/09/20211027_111742.jpg', 'up-over-installation': '2024/09/20220621_142833.jpg',
  'ducted-airconditioning': '2025/04/DaikinDuctedSystem_14kw.webp', 'ducted-multi-zone-air-conditioning': '2025/04/Ducted-aircon-zoning.jpg', 'vrv-vrf-air-conditioning': '2024/09/Samsung-duct-S2_-ducted-outdoor-unit-AC120TXAPKG_SA_800x.webp',
  'design-and-construction': '2024/09/6-outlets-900x442-1.jpg', 'repair-installation': '2024/09/MHI-10kW-Open-scaled.jpg', 'service-maintenance': '2024/09/Ducted-outdoor.jpg', 'air-conditioning-installation': '2024/09/Tripple-installation.jpg',
  'ac-services': 'docs/ac-services-1.png', 'split-and-multi-head-system': '2024/09/Multihead-8Kw-scaled.jpg', 'electrical-services': 'docs/electrical-services-1.png', 'residential-electrician': '2024/10/residential_innerimg1.jpg',
  'data-points-and-network-cabling': '2024/10/data_pointsinnerimg1.jpg', 'downlights': '2024/09/LED_lights.jpeg', 'led-lights-installation': '2024/09/kitchen-lighting-led-under-cabinet-light-bar.jpg', 'electrical-switchboard-upgrade': '2024/09/NICEIC.jpg',
  'ceiling-fan-installation': '2024/09/Fan-Pic-04.jpg.webp', 'ceiling-exhaust-fans': '2024/09/20210628_113722-scaled.jpg', 'oven-and-cooktop-installations': '2024/09/Cooktop.png', 'ev-charger-installation': '2024/09/EV-Charger.png',
  'building-and-construction': 'docs/building-and-construction-1.png', 'pendant-light-installer': '2024/09/download.jpg', 'bathroom-exhaust-heater-installations': '2024/09/Inspirasjon-bad-vatrom.jpg', 'about-us': 'docs/about-us-1.png',
  'reviews': 'docs/reviews-1.png', 'terms-conditions': 'docs/terms-conditions-1.png', 'privacy-policy': 'docs/privacy-policy-1.png',
};

export const EXPECT = ['Fully licensed and insured technicians', 'On-time and tidy service', 'Clear quotes – no hidden fees', 'Australian standard compliance', 'Great communication from start to finish'];

export const TESTIMONIALS = [
  { name: 'John Gould', text: 'Work was done for installation of air con unit. Work was done so professional and polite. Contacted links and next day was installed. Wife and I are extremely happy. Recommend this company to anyone and price was so affordable' },
  { name: 'Margaret McFarlane', text: 'Excellent service. Would highly recommend for any aircon or electrical work. A pleasure to deal with.' },
  { name: 'Safari Hair', text: 'Links Air & Electrical did an amazing job on a short notice of an Aircon install. Despite the challenging nature of the job. I am very satisfied with the outcome.' },
  { name: 'Sancha Ochsner', text: 'Polite and thorough. Economically priced, on time, and worked completed well. Will definitely use again, Thank you' },
  { name: 'Dmitry', text: "I'm very happy with Links. Needed a power outlet. The job was well done. Thanks" },
  { name: 'vinc menn', text: 'Very professional team a wonderful job was done thanks' },
];

export const GALLERY: [string, string][] = [['2024/09/gallery_img2.jpg', 'Split system install, Brisbane'], ['2024/09/DaikinDuctedSystem_14kw.webp', 'Daikin 14kW ducted system'], ['2024/09/EV-Charger.png', 'EV charger installation, Oxley'], ['2024/09/AirTouch5.png', 'AirTouch 5 zone controller'], ['2024/09/Cooktop.png', 'Cooktop installation'], ['2024/09/Screenshot_20250420_141657_Photos2.jpg', 'Aircon installation, Springfield'], ['2024/09/Tripple-installation.jpg', 'Triple outdoor unit installation'], ['2024/09/15.jpg', 'Ducted air conditioning, Capalaba'], ['2024/09/20210804_185147-scaled.jpg', 'Ducted system, Wynnum'], ['2024/09/NICEIC.jpg', 'Switchboard upgrade, Woolloongabba'], ['2024/09/LED_lights.jpeg', 'Downlights, Teneriffe'], ['2024/09/Fan-Pic-04.jpg.webp', 'Ceiling fan installation']];

export const BRANDS: [string, string][] = [['2025/05/logo-4.webp', 'Hisense'], ['2025/05/logo-3.webp', 'TECO'], ['2025/05/logo-2.webp', 'Daikin'], ['2025/05/logo-1.webp', 'Mitsubishi Heavy Industries'], ['2025/05/logo-5.png', 'Fujitsu'], ['2025/05/logo-6.png', 'Mitsubishi Electric'], ['2025/05/logo-7.png', 'ActronAir'], ['2025/05/logo-8.jpg', 'Panasonic']];

export const HOME_FAQ = [
  { q: 'Are you licensed and insured?', a: 'Yes, all our technicians are fully licensed and insured for both electrical and aircon work.' },
  { q: 'Can you supply air conditioning units too?', a: 'Yes – we can supply, install, and recommend trusted brands for both split and ducted systems.' },
  { q: 'What if I only need one small job done?', a: 'No problem – we’re happy to help with jobs big or small.' },
  { q: 'Do you offer emergency electrical services?', a: 'Yes – we offer emergency callouts across Brisbane and Gold Coast.' },
  { q: 'How much do you charge?', a: 'We provide upfront quotes before we begin. No surprises.' },
];

export const PRIVACY: Block[] = [
  { t: 'p', text: 'Links Air & Electrical respects your privacy. This policy explains what personal information we collect through this website and how we use it.' },
  { t: 'h', lvl: 3, text: 'What we collect' }, { t: 'p', text: 'When you request a quote, call us or use the chat assistant we may collect your name, phone number, email address, suburb and details of the work you need. We also collect standard website analytics data.' },
  { t: 'h', lvl: 3, text: 'How we use it' }, { t: 'p', text: 'We use your information to respond to your enquiry, provide quotes, schedule and carry out work, and send service reminders you have asked for. We do not sell or share your details with third parties for marketing.' },
  { t: 'h', lvl: 3, text: 'Access and contact' }, { t: 'p', text: 'You can ask us to access, correct or delete your personal information at any time by emailing info@linksairelectrical.com.au or calling 1300 010 393.' },
];

export const slugify = (s: string) => s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80);

/* ============ data ============ */
const data = raw as { pages: Entry[]; posts: Entry[] };
export const pages: Entry[] = data.pages;
export const posts: Entry[] = data.posts.map((p) => ({ ...p, slug: slugify(p.title) }));

export const getPage = (slug: string) => pages.find((p) => p.slug === slug);
export const getPost = (slug: string) => posts.find((p) => p.slug === slug);
export const titleOf = (p: Entry) => TITLES[p.slug] || p.title;

/* ============ block shaping (verbatim port of shape()) ============ */
export function shape(blocks: Block[]): Shaped[] {
  return (blocks || []).map((b) => {
    const o: Shaped = { ...b, isH2: false, isH3: false, isP: false, isUl: false, isOl: false, isKv: false, isFaq: false, isImg: false, isTable: false };
    if (b.t === 'h') { if ((b.lvl ?? 2) <= 3) o.isH2 = true; else o.isH3 = true; }
    else if (b.t === 'img') { o.isImg = true; o.img = asset(b.src!); }
    else if (b.t === 'table') o.isTable = true;
    else if (b.t === 'p') { const short = (b.text || '').split(/\s+/).length <= 7 && !/[.!?,]$/.test(b.text || ''); if (short) { o.isH3 = true; } else o.isP = true; }
    else if (b.t === 'ul') o.isUl = true;
    else if (b.t === 'ol') { o.isOl = true; o.steps = (b.items || []).map((text: string, i: number) => ({ n: i + 1, text })); }
    else if (b.t === 'kv') { o.isKv = true; o.kvRows = (b.rows || []).map((r) => ({ k: r[0], v: r[1] })); }
    else if (b.t === 'faq') o.isFaq = true;
    return o;
  });
}

/* ============ nav parent lookup (verbatim port of findParent()) ============ */
export function findParent(slug: string): { item: NavItem; g?: NavGroup; self?: boolean; hub?: boolean } | null {
  for (const item of NAV) {
    if (!item.groups) continue;
    for (const g of item.groups) {
      if (g.href === '/' + slug) return { item, g, self: true };
      if (g.children.some((ch) => ch.slug === slug)) return { item, g };
    }
    if (item.href === '/' + slug) return { item, hub: true };
  }
  return null;
}

/* ============ page model (verbatim port of renderVals() content branch) ============ */
export type ContentModel = {
  title: string;
  intro: string;
  blocks: Shaped[];
  isThin: boolean;
  hasImg: boolean;
  img: Img | null;
  imgAlt: string;
  hasParent: boolean;
  parentHref: string;
  parentLabel: string;
  hasSiblings: boolean;
  sectionLabel: string;
  siblings: { label: string; href: string; slug: string; color: string; weight: string }[];
  hasRelated: boolean;
  related: NavChild[];
};

export function contentModel(slug: string): ContentModel {
  const src: Entry =
    getPage(slug) ||
    (slug === 'privacy-policy'
      ? { slug: 'privacy-policy', title: 'Privacy Policy', blocks: PRIVACY, images: [], hero: 'docs/privacy-policy-1.png' }
      : { slug, title: '', blocks: [], images: [] });
  const blocks = src.blocks || [];
  const firstP = blocks.find((b) => b.t === 'p' && (b.text || '').split(/\s+/).length > 8);
  let intro = src.intro || (firstP ? firstP.text! : 'Licensed, insured and local. Upfront quotes, tidy work and warranties on every job across Brisbane and the Gold Coast.');
  if (intro.length > 230) {
    const cut = intro.slice(0, 230);
    intro = cut.slice(0, Math.max(cut.lastIndexOf('. '), cut.lastIndexOf(', '), 120) + 1).trim();
    if (!/[.!?]$/.test(intro)) intro += '…';
  }
  const parent = findParent(src.slug);
  const sibs: { label: string; href: string; slug: string }[] =
    parent && parent.g
      ? [...(parent.g.href ? [{ label: parent.g.label + ' overview', href: parent.g.href, slug: parent.g.href.slice(1) }] : []), ...parent.g.children]
      : parent && parent.hub
        ? (parent.item.groups || []).flatMap((g) => (g.href ? [{ label: g.label, href: g.href, slug: g.href.slice(1) }] : g.children))
        : [];
  const related = parent ? (parent.item.groups || []).flatMap((g) => g.children).filter((x) => x.slug !== src.slug).slice(0, 6) : [];
  const imgKey = src.hero || IMGS[src.slug];
  return {
    title: titleOf(src),
    intro,
    blocks: shape(blocks),
    isThin: blocks.length < 6,
    hasImg: !!imgKey,
    img: imgKey ? asset(imgKey) : null,
    imgAlt: (src.images && src.images[0]) || titleOf(src),
    hasParent: !!parent,
    parentHref: parent ? parent.item.href : '',
    parentLabel: parent ? parent.item.label : '',
    hasSiblings: sibs.length > 0,
    sectionLabel: parent ? (parent.g ? parent.g.label : parent.item.label) : '',
    siblings: sibs.map((s) => ({ ...s, color: s.slug === src.slug ? '#1279BF' : '#2B3F55', weight: s.slug === src.slug ? '700' : '400' })),
    hasRelated: related.length > 0,
    related,
  };
}

/* ============ area model (verbatim port of the area branch) ============ */
export function areaModel(slug: string) {
  const src = getPage(slug);
  const blocks = src?.blocks || [];
  const areaGroups: { label: string; items: string[] }[] = [];
  const areaParas: string[] = [];
  let lbl = 'Suburbs we service';
  for (const b of blocks) {
    if (b.t === 'h' && (b.lvl ?? 0) >= 4) lbl = b.text!;
    else if (b.t === 'p' && (b.text || '').split(/\s+/).length <= 4) lbl = b.text!;
    else if (b.t === 'ul') { areaGroups.push({ label: lbl, items: b.items || [] }); lbl = 'More suburbs'; }
    else if (b.t === 'p') areaParas.push(b.text!);
  }
  return { title: TITLES[slug] || (src ? src.title : slug), areaGroups, areaParas };
}

/* ============ blog helpers (verbatim port) ============ */
function blogDates(): Record<string, string> {
  const blogPage = getPage('our-blog');
  const dates: Record<string, string> = {};
  (blogPage?.blocks || []).forEach((b) => {
    if (b.t === 'ul')
      (b.items || []).forEach((it: string) => {
        const m = it.match(/^(\d{4}-\d{2}-\d{2})\s*\|\s*(.*)$/);
        if (m) dates[slugify(m[2])] = m[1];
      });
  });
  return dates;
}

export function postCards() {
  const dates = blogDates();
  return posts.map((p) => {
    const fp = (p.blocks || []).find((b) => b.t === 'p' && (b.text || '').length > 60);
    const d = dates[p.slug] || p.date || '';
    const tag = /switchboard|electric|power|downlight|light|fan|oven|camera|cctv|ev /i.test(p.title) ? 'Electrical' : 'Air conditioning';
    return {
      title: p.title,
      href: '/blog/' + p.slug,
      excerpt: fp ? fp.text!.slice(0, 140).replace(/\s\S*$/, '') + '…' : '',
      date: d ? new Date(d).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' }) : '',
      tag,
    };
  });
}

export function postDate(post: Entry) {
  const dates = blogDates();
  const d = post.date || dates[post.slug] || '';
  return d ? new Date(d).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' }) : '';
}

/* ============ FAQ / areas cards (verbatim port) ============ */
export function allFaq() {
  const faqPage = getPage('faq');
  return [...HOME_FAQ, ...((faqPage?.blocks || []).flatMap((b) => (b.t === 'faq' ? (b.items as { q: string; a: string }[]) : [])))];
}

/** FAQ page sections: the home-page basics first, then the FAQ page's own
 *  headed groups (a heading block starts a group, faq blocks fill it). */
export function faqGroups(): { label: string; intro: string[]; items: { q: string; a: string }[] }[] {
  const groups: { label: string; intro: string[]; items: { q: string; a: string }[] }[] = [{ label: 'General', intro: [], items: [...HOME_FAQ] }];
  let cur: (typeof groups)[number] | null = null;
  for (const b of getPage('faq')?.blocks || []) {
    if (b.t === 'h') { cur = { label: b.text || '', intro: [], items: [] }; groups.push(cur); }
    else if (b.t === 'faq') { if (!cur) { cur = { label: 'Air conditioning', intro: [], items: [] }; groups.push(cur); } cur.items.push(...(b.items as { q: string; a: string }[])); }
    else if (b.t === 'p' && b.text) { if (cur) cur.intro.push(b.text); else groups[0].intro.push(b.text); }
  }
  return groups.filter((g) => g.items.length || g.intro.length);
}

export function areaCards() {
  return AREAS.map((s) => {
    const p = getPage(s);
    const n = (p?.blocks || []).filter((b) => b.t === 'ul').reduce((a, b) => a + (b.items || []).length, 0);
    return { label: TITLES[s] || (p ? p.title : s), href: '/' + s, count: n || 'All' };
  });
}

/* ============ home page data (verbatim port) ============ */
export const TRUST_STATS = [{ v: '5.0 ★', l: '200+ Google reviews' }, { v: '2014', l: 'Serving Brisbane since' }, { v: '24/7', l: 'On call for emergencies' }, { v: '100%', l: 'Licensed & insured' }, { v: '$0', l: 'Hidden charges' }];

export const PILLARS = [
  { title: 'Air Conditioning Services', text: 'Supply, installation, repairs and maintenance of split system, multi-head and ducted air conditioners across Brisbane & Gold Coast.', href: '/ac-services', img: asset('docs/ac-services-1.png'), alt: 'Air conditioning installation', short: 'air conditioning' },
  { title: 'Electrical Services', text: 'Licensed residential and commercial electricians for lighting, power points, switchboards, safety switches, EV chargers and emergency repairs.', href: '/electrical-services', img: asset('docs/electrical-services-1.png'), alt: 'Electrical services', short: 'electrical' },
  { title: 'Building & Construction', text: 'Complete electrical for new house builds, working with builders from under-slab to rough-in to fit-off, plus air conditioning wiring.', href: '/building-and-construction', img: asset('docs/building-and-construction-1.png'), alt: 'Electrical for new builds', short: 'new builds' },
];

export const WHAT_WE_DO = [{ n: '01', t: 'General electrical work (lights, fans, power points)', href: '/general-electrical-maintenance' }, { n: '02', t: 'Switchboard upgrades & safety checks', href: '/electrical-switchboard-upgrade' }, { n: '03', t: 'Indoor & outdoor lighting installations', href: '/led-lights-installation' }, { n: '04', t: 'Split system & ducted air conditioning installs', href: '/split-system-aircon' }, { n: '05', t: 'Air conditioning servicing & maintenance', href: '/service-maintenance' }, { n: '06', t: 'Oven, cooktop & appliance installation', href: '/oven-and-cooktop-installations' }, { n: '07', t: 'Ceiling fan installations', href: '/ceiling-fan-installation' }, { n: '08', t: 'Emergency electrical repairs', href: '/electrical-services' }];

export const USPS = [{ t: 'Servicing top brands', d: 'Daikin, Mitsubishi, Fujitsu, Panasonic, ActronAir & more' }, { t: 'Zero damage installation', d: 'Careful, tidy installs, repairs and maintenance' }, { t: 'No hidden charges', d: 'Fixed quote before we start' }, { t: 'Financing available', d: 'Spread the cost of a new system' }, { t: 'Emergency service', d: '24 · 7 · 365 days a year' }, { t: 'Wi-Fi & zone control', d: 'Programmable thermostats and app control' }];

export const POPULAR_SERVICES = [c('Split System Aircon', 'split-system-aircon'), c('Ducted Air Conditioning', 'ducted-airconditioning'), c('Air Conditioning Installation', 'air-conditioning-installation'), c('Electrical Switchboard Upgrade', 'electrical-switchboard-upgrade'), c('Ceiling Fan Installation', 'ceiling-fan-installation'), c('EV Charger Installation', 'ev-charger-installation')];

export const CONTACT_CARDS = [
  { l: 'Call (landline)', v: '1300 010 393', href: 'tel:1300010393', target: '_self' },
  { l: 'Call or text (mobile)', v: '0447 440 050', href: 'tel:0447440050', target: '_self' },
  { l: 'WhatsApp', v: 'Message us', href: 'https://wa.me/61447440050', target: '_blank' },
  { l: 'Email', v: 'info@linksairelectrical.com.au', href: 'mailto:info@linksairelectrical.com.au', target: '_self' },
  { l: 'Service area', v: 'Brisbane & Gold Coast · On call 24/7', href: '/service-area', target: '_self' },
];

/* ============ routing helpers ============ */
const SPECIAL_ROUTES = ['home', 'contact-us', 'faq', 'our-blog', 'service-area', 'thank-you'];

/** Slugs served by the catch-all [slug] route: every JSON page that doesn't
 *  have a dedicated route, plus privacy-policy (defined in code, like the original). */
export function contentSlugs(): string[] {
  const fromJson = pages.map((p) => p.slug).filter((s) => !SPECIAL_ROUTES.includes(s));
  return [...fromJson, 'privacy-policy'];
}
