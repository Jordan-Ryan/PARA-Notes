import * as React from 'react';
import { Editor } from '@tiptap/react';
import { ToolbarButton } from './ToolbarButton';

type Props = {
  editor: Editor | null;
};

export function EditorMenuBar({ editor }: Props) {
  if (!editor) return null;
  return (
    <div role="toolbar" aria-label="Editor formatting options" className="flex flex-wrap gap-1 border-b p-2 bg-white sticky top-0 z-10">
      <ToolbarButton
        label="Bold"
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        active={editor.isActive('bold')}
      >B</ToolbarButton>
      <ToolbarButton
        label="Italic"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        active={editor.isActive('italic')}
      ><em>I</em></ToolbarButton>
      <ToolbarButton
        label="Bullet List"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        active={editor.isActive('bulletList')}
      >• List</ToolbarButton>
      <ToolbarButton
        label="Ordered List"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        active={editor.isActive('orderedList')}
      >1. List</ToolbarButton>
      <ToolbarButton label="H1" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive('heading', { level: 1 })}>H1</ToolbarButton>
      <ToolbarButton label="H2" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })}>H2</ToolbarButton>
      <ToolbarButton label="Link" onClick={() => {
        const previousUrl = editor.getAttributes('link')['href'];
        const url = window.prompt('URL', previousUrl || '');
        if (url === null) return;
        if (url === '') {
          editor.chain().focus().unsetLink().run();
          return;
        }
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
      }}>Link</ToolbarButton>
      <ToolbarButton label="Code Block" onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive('codeBlock')}>Code</ToolbarButton>
      <ToolbarButton label="Table" onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}>Table</ToolbarButton>
      <ToolbarButton label="Undo" onClick={() => editor.chain().focus().undo().run()}>Undo</ToolbarButton>
      <ToolbarButton label="Redo" onClick={() => editor.chain().focus().redo().run()}>Redo</ToolbarButton>
    </div>
  );
}


