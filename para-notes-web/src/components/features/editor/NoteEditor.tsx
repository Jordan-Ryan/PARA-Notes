import * as React from 'react';
import { useEditor, EditorContent, Editor } from '@tiptap/react';
import { createBaseExtensions } from '@/lib/editor/extensions';
import { EditorMenuBar } from './EditorMenuBar';
import { AttachmentPanel } from './AttachmentPanel';
import { exportMarkdown, importMarkdown } from '@/lib/editor/markdown';
import { encryptStringGCM } from '@/lib/editor/crypto';
import { enqueue } from '@/lib/editor/offlineQueue';
import { v4 as uuidv4 } from 'uuid';

export type NoteEditorProps = {
  noteId?: string;
  initialContent?: string; // HTML
  initialMarkdown?: string; // if provided, overrides HTML
  onChange?: (html: string) => void;
  onAutoSave?: (noteId: string, html: string) => Promise<void>;
  onConflict?: (serverHtml: string, localHtml: string) => void;
  attachmentsBucket?: string;
  attachmentsFolder?: string;
  encryptionPassphrase?: string; // optional client-side encryption
};

type AutoSaveState = {
  timer: any | null;
  lastSavedHtml: string;
  saving: boolean;
  lastError?: string | null;
};

export function NoteEditor({
  noteId: externalNoteId,
  initialContent,
  initialMarkdown,
  onChange,
  onAutoSave,
  onConflict,
  attachmentsBucket = 'attachments',
  attachmentsFolder = 'notes',
  encryptionPassphrase,
}: NoteEditorProps) {
  const [noteId] = React.useState(externalNoteId ?? uuidv4());
  const [auto, setAuto] = React.useState<AutoSaveState>({ timer: null, lastSavedHtml: initialContent ?? '', saving: false });

  const editor = useEditor({
    extensions: createBaseExtensions(),
    content: initialMarkdown ? '<p></p>' : (initialContent || '<p></p>'),
    editorProps: {
      attributes: { 'aria-label': 'Note editor', class: 'prose max-w-none focus:outline-none p-4' },
      handlePaste: (_view, _event) => {
        // Future: detect URLs and auto-link
        return false;
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange?.(html);
      scheduleAutoSave(editor);
    },
    onCreate: ({ editor }) => {
      if (initialMarkdown) {
        importMarkdown(editor, initialMarkdown);
      }
    },
  });

  function scheduleAutoSave(ed: Editor) {
    if (!onAutoSave) return;
    if (auto.timer) clearTimeout(auto.timer);
    const html = ed.getHTML();
    const timer = setTimeout(async () => {
      try {
        setAuto((s) => ({ ...s, saving: true, lastError: null }));
        // naive conflict detection
        if (auto.lastSavedHtml && auto.lastSavedHtml === html) {
          setAuto((s) => ({ ...s, saving: false }));
          return;
        }
        let payload = html;
        if (encryptionPassphrase) {
          try {
            payload = await encryptStringGCM(html, encryptionPassphrase);
          } catch (e: any) {
            console.error('[NoteEditor] encrypt failed', e);
          }
        }
        if (navigator.onLine) {
          await onAutoSave(noteId, payload);
        } else {
          enqueue({ id: uuidv4(), noteId, html: payload, createdAt: Date.now() });
        }
        setAuto({ timer: null, lastSavedHtml: html, saving: false, lastError: null });
      } catch (e: any) {
        console.error('[NoteEditor] autosave failed', e);
        setAuto((s) => ({ ...s, saving: false, lastError: e?.message ?? 'Autosave failed' }));
        // optional: call onConflict with server copy
        if (onConflict) onConflict(auto.lastSavedHtml, html);
      }
    }, 800);
    setAuto((s) => ({ ...s, timer }));
  }

  function handleInsertImage(url: string) {
    editor?.chain().focus().setImage({ src: url }).run();
  }

  if (!editor) return null;

  const wordCount = (editor.extensionStorage as any)?.wordCountMeta?.words ?? 0;
  const readingTimeMinutes = Math.max(1, Math.round(wordCount / 200));

  return (
    <div className="border rounded-md overflow-hidden">
      <EditorMenuBar editor={editor} />
      <div className="flex items-center justify-between px-4 py-2 border-b bg-gray-50 text-xs text-gray-600" role="status" aria-live="polite">
        <div>
          {auto.saving ? 'Saving…' : auto.lastError ? `Save error: ${auto.lastError}` : 'Saved'}
        </div>
        <div>{wordCount} words • ~{readingTimeMinutes} min</div>
      </div>
      <EditorContent editor={editor} className="min-h-[300px]" />
      <div className="px-4 py-2 border-t bg-gray-50">
        <AttachmentPanel
          bucket={attachmentsBucket}
          folder={`${attachmentsFolder}/${noteId}`}
          onUploaded={(file) => handleInsertImage(file.url)}
        />
        <div className="mt-2 flex gap-2">
          <button
            className="text-sm underline"
            onClick={() => {
              const md = exportMarkdown(editor);
              const blob = new Blob([md], { type: 'text/markdown' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `${noteId}.md`;
              a.click();
              URL.revokeObjectURL(url);
            }}
          >Export Markdown</button>
        </div>
      </div>
    </div>
  );
}


