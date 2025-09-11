import React, { useCallback, useMemo, useRef, useState } from 'react';
import { View, Platform, StyleSheet, KeyboardAvoidingView, Text, TouchableOpacity } from 'react-native';
import WebView, { WebViewMessageEvent } from 'react-native-webview';
import { v4 as uuidv4 } from 'uuid';

type Props = {
  noteId?: string;
  initialHTML?: string;
  onChange?: (html: string) => void;
  onAutoSave?: (noteId: string, html: string) => Promise<void>;
};

export function MobileNoteEditor({ noteId: externalNoteId, initialHTML = '<p></p>', onChange, onAutoSave }: Props) {
  const noteId = useMemo(() => externalNoteId ?? uuidv4(), [externalNoteId]);
  const webRef = useRef<WebView>(null);
  const [html, setHtml] = useState(initialHTML);
  const [saving, setSaving] = useState(false);
  const [timer, setTimer] = useState<any | null>(null);

  const injected = useMemo(() => `
    const style = document.createElement('style');
    style.textContent = 'html, body { height: 100%; } .ProseMirror { padding: 16px; outline: none; min-height: 100%; }';
    document.head.appendChild(style);
    true;
  `, []);

  const onMessage = useCallback(async (e: WebViewMessageEvent) => {
    try {
      const msg = JSON.parse(e.nativeEvent.data);
      if (msg.type === 'contentUpdate') {
        setHtml(msg.html);
        onChange?.(msg.html);
        if (timer) clearTimeout(timer);
        const t = setTimeout(async () => {
          if (!onAutoSave) return;
          setSaving(true);
          try {
            await onAutoSave(noteId, msg.html);
          } catch (err) {
          } finally {
            setSaving(false);
          }
        }, 800);
        setTimer(t);
      }
    } catch (err) {
    }
  }, [noteId, onAutoSave, onChange, timer]);

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.toolbar} accessibilityRole="toolbar" accessibilityLabel="Editor formatting options">
        {['bold','italic','bulletList','orderedList','h1','h2'].map((cmd) => (
          <TouchableOpacity key={cmd} style={styles.toolButton} onPress={() => webRef.current?.injectJavaScript(`window.editorCommand && window.editorCommand('${cmd}'); true;`)}>
            <Text style={styles.toolText}>{cmd.toUpperCase()}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.toolButton} onPress={() => webRef.current?.injectJavaScript(`window.editorCommand && window.editorCommand('link'); true;`)}>
          <Text style={styles.toolText}>LINK</Text>
        </TouchableOpacity>
      </View>
      <WebView
        ref={webRef}
        originWhitelist={["*"]}
        source={{ html: getEditorHTML(initialHTML) }}
        onMessage={onMessage}
        javaScriptEnabled
        domStorageEnabled
        injectedJavaScript={injected}
        keyboardDisplayRequiresUserAction={false}
      />
      <View style={styles.status}><Text style={styles.statusText}>{saving ? 'Saving…' : 'Saved'}</Text></View>
    </KeyboardAvoidingView>
  );
}

function getEditorHTML(initial: string) {
  return `<!DOCTYPE html>
  <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      <style>
        body { margin: 0; font-family: -apple-system, system-ui, Segoe UI, Roboto, Helvetica, Arial, sans-serif; }
        .ProseMirror:focus { outline: none; }
      </style>
      <script src="https://cdn.jsdelivr.net/npm/yjs@13.6.12/dist/yjs.js"></script>
      <script src="https://cdn.jsdelivr.net/npm/@tiptap/core@2.4.0/dist/tiptap-core.umd.min.js"></script>
      <script src="https://cdn.jsdelivr.net/npm/@tiptap/starter-kit@2.4.0/dist/tiptap-starter-kit.umd.min.js"></script>
      <script src="https://cdn.jsdelivr.net/npm/@tiptap/extension-link@2.4.0/dist/tiptap-extension-link.umd.min.js"></script>
      <script src="https://cdn.jsdelivr.net/npm/@tiptap/extension-image@2.4.0/dist/tiptap-extension-image.umd.min.js"></script>
    </head>
    <body>
      <div id="editor"></div>
      <script>
        const { Editor } = window['@tiptap/core'];
        const StarterKit = window['@tiptap/starter-kit'].default;
        const Link = window['@tiptap/extension-link'].default;
        const Image = window['@tiptap/extension-image'].default;

        const editor = new Editor({
          element: document.querySelector('#editor'),
          extensions: [StarterKit.configure({ codeBlock: false }), Link.configure({ openOnClick: false }), Image],
          content: ${JSON.stringify(initial)},
          onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'contentUpdate', html }));
          },
        });
        window.editorCommand = function(cmd) {
          if (!editor) return;
          const chain = editor.chain().focus();
          switch (cmd) {
            case 'bold': chain.toggleBold().run(); break;
            case 'italic': chain.toggleItalic().run(); break;
            case 'bulletList': chain.toggleBulletList().run(); break;
            case 'orderedList': chain.toggleOrderedList().run(); break;
            case 'h1': chain.toggleHeading({ level: 1 }).run(); break;
            case 'h2': chain.toggleHeading({ level: 2 }).run(); break;
            case 'link': {
              const url = prompt('URL');
              if (url === null) break;
              if (url === '') { chain.unsetLink().run(); break; }
              chain.extendMarkRange('link').setLink({ href: url }).run();
              break;
            }
          }
        }
      </script>
    </body>
  </html>`;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  toolbar: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, padding: 8, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  toolButton: { paddingHorizontal: 8, paddingVertical: 6, backgroundColor: '#f3f4f6', borderRadius: 6 },
  toolText: { fontSize: 12, fontWeight: '600' },
  status: { padding: 8, borderTopWidth: 1, borderTopColor: '#e5e7eb' },
  statusText: { fontSize: 12, color: '#6b7280' },
});

export default MobileNoteEditor;


