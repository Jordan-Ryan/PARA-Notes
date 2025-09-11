import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { createLowlight } from 'lowlight';
import { Table } from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import { Extension } from '@tiptap/core';
import isUrl from 'is-url-superb';

// Basic URL validator used by Link and attachments
export function isValidUrl(href: string): boolean {
  try {
    if (!href) return false;
    if (!isUrl(href)) return false;
    // Further validation to ensure protocol
    const u = new URL(href);
    return ['http:', 'https:'].includes(u.protocol);
  } catch (error) {
    console.error('[editor:isValidUrl] invalid url', error);
    return false;
  }
}

// Ensure images are selectable and resizable in future; for now basic handling
export const ImageExtension = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      alt: {
        default: null,
      },
      title: {
        default: null,
      },
    } as any;
  },
});

// Analytics/word count utility extension
export const WordCountExtension = Extension.create({
  name: 'wordCountMeta',
  addStorage() {
    return { words: 0, chars: 0 } as { words: number; chars: number };
  },
  onTransaction({ editor }) {
    const text = editor.getText();
    const words = (text.trim().match(/\S+/g) || []).length;
    const chars = text.length;
    (this.storage as { words: number; chars: number }).words = words;
    (this.storage as { words: number; chars: number }).chars = chars;
  },
});

export function createBaseExtensions() {
  return [
    StarterKit.configure({
      bulletList: { keepAttributes: true },
      orderedList: { keepAttributes: true },
      codeBlock: false,
    }),
    Link.configure({
      protocols: ['http', 'https', 'mailto'],
      validate: (href) => isValidUrl(href),
      openOnClick: true,
    }),
    ImageExtension.configure({ inline: false, allowBase64: false }),
    CodeBlockLowlight.configure({ lowlight: createLowlight() }),
    Table.configure({ resizable: true }),
    TableRow,
    TableHeader,
    TableCell,
    WordCountExtension,
  ];
}

export type EditorExtensions = ReturnType<typeof createBaseExtensions>;


