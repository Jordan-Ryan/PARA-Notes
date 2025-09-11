import * as React from 'react';
import { uploadAttachment, UploadedFile } from '@/lib/editor/storage';

type Props = {
  bucket: string;
  folder: string;
  onUploaded?: (file: UploadedFile) => void;
};

export function AttachmentPanel({ bucket, folder, onUploaded }: Props) {
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const [isUploading, setUploading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setUploading(true);
    setError(null);
    try {
      const uploaded = await uploadAttachment(bucket, f, folder);
      onUploaded?.(uploaded);
    } catch (err: any) {
      console.error('[AttachmentPanel] upload failed', err);
      setError(err?.message ?? 'Upload failed');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  return (
    <div className="flex items-center gap-2">
      <input
        ref={inputRef}
        type="file"
        aria-label="Upload attachment"
        onChange={onChange}
        disabled={isUploading}
      />
      {isUploading && <span className="text-sm text-gray-500">Uploading…</span>}
      {error && <span className="text-sm text-red-600" role="alert">{error}</span>}
    </div>
  );
}


