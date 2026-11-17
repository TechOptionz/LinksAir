'use client';

import { useEffect } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { Markdown } from 'tiptap-markdown';
import { sx } from '@/lib/sx';

type HasMarkdown = { storage: unknown };
const md = (e: HasMarkdown) => (e.storage as { markdown: { getMarkdown: () => string } }).markdown.getMarkdown();

// A word-processor style editor that reads and writes Markdown, so what the owner sees as headings,
// bold text, lists and the price tables is exactly what the AI assistant reads.
export function MarkdownEditor({ value, onChange, label }: { value: string; onChange: (markdown: string) => void; label: string }) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3, 4] } }),
      Link.configure({ openOnClick: false, autolink: true }),
      Table.configure({ resizable: false }),
      TableRow,
      TableHeader,
      TableCell,
      Markdown.configure({ html: false, tightLists: true, linkify: true, breaks: false, transformPastedText: true, transformCopiedText: true }),
    ],
    content: value,
    editorProps: { attributes: { class: 'lae-rte', 'aria-label': label } },
    onUpdate: ({ editor: e }) => onChange(md(e)),
  });

  // a reload from the server (after someone else saved) replaces the text without creating a new editor
  useEffect(() => {
    if (!editor) return;
    const current = md(editor);
    if (current.trim() !== value.trim() && !editor.isFocused) editor.commands.setContent(value, { emitUpdate: false });
  }, [editor, value]);

  if (!editor) return <div style={sx('min-height:160px;border:1px solid #D4DEE8;border-radius:10px;background:#fff')} />;

  const inTable = editor.isActive('table');
  const b = (title: string, active: boolean, run: () => void, text: string, disabled = false) => (
    <button
      type="button"
      title={title}
      aria-label={title}
      aria-pressed={active}
      disabled={disabled}
      onMouseDown={(e) => e.preventDefault()}
      onClick={run}
      style={sx(`border:1px solid ${active ? '#1279BF' : '#D4DEE8'};background:${active ? '#F0F6FB' : '#fff'};color:${disabled ? '#A8B5C3' : active ? '#1279BF' : '#14263A'};border-radius:8px;padding:6px 10px;font-size:13px;font-weight:700;cursor:${disabled ? 'default' : 'pointer'};min-width:34px`)}
    >
      {text}
    </button>
  );
  const run = (fn: () => void) => () => {
    fn();
    editor.chain().focus().run();
  };

  return (
    <div style={sx('border:1px solid #D4DEE8;border-radius:12px;background:#fff;overflow:hidden')}>
      <div style={sx('display:flex;flex-wrap:wrap;gap:6px;padding:8px;border-bottom:1px solid #E1E8F0;background:#F8FAFC')}>
        {b('Heading', editor.isActive('heading', { level: 3 }), run(() => editor.chain().focus().toggleHeading({ level: 3 }).run()), 'Heading')}
        {b('Bold', editor.isActive('bold'), run(() => editor.chain().focus().toggleBold().run()), 'B')}
        {b('Italic', editor.isActive('italic'), run(() => editor.chain().focus().toggleItalic().run()), 'I')}
        {b('Bullet list', editor.isActive('bulletList'), run(() => editor.chain().focus().toggleBulletList().run()), '• List')}
        {b('Numbered list', editor.isActive('orderedList'), run(() => editor.chain().focus().toggleOrderedList().run()), '1. List')}
        <span style={sx('width:1px;background:#E1E8F0;margin:0 4px')} />
        {b('Insert table', false, run(() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()), 'Table', inTable)}
        {b('Add row below', false, run(() => editor.chain().focus().addRowAfter().run()), '+ Row', !inTable)}
        {b('Add column after', false, run(() => editor.chain().focus().addColumnAfter().run()), '+ Col', !inTable)}
        {b('Delete row', false, run(() => editor.chain().focus().deleteRow().run()), '− Row', !inTable)}
        {b('Delete column', false, run(() => editor.chain().focus().deleteColumn().run()), '− Col', !inTable)}
        {b('Delete table', false, run(() => editor.chain().focus().deleteTable().run()), 'Remove table', !inTable)}
        <span style={sx('flex:1')} />
        {b('Undo', false, run(() => editor.chain().focus().undo().run()), '↶', !editor.can().undo())}
        {b('Redo', false, run(() => editor.chain().focus().redo().run()), '↷', !editor.can().redo())}
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
