import { Editor } from '@tiptap/react';
import { marked } from 'marked';

export function importMarkdown(editor: Editor, markdown: string) {
  // TipTap doesn't parse Markdown natively; simple approach via HTML
  const html = marked.parse(markdown);
  editor.commands.setContent(html as string, false);
}

export function exportMarkdown(editor: Editor): string {
  // Basic export by converting to plain text or HTML > Markdown requires full serializer
  // For now, return text content; can be replaced with tiptap-markdown package later.
  return editor.getText();
}


