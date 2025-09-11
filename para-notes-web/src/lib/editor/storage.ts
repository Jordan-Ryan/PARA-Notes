import { createClient } from '@/lib/supabase/client';

export type UploadedFile = {
  path: string;
  url: string;
  mimeType?: string | null;
  size?: number | null;
};

export async function uploadAttachment(bucket: string, file: File, folder: string): Promise<UploadedFile> {
  const supabase = createClient();
  const key = `${folder}/${Date.now()}_${file.name}`;
  const { error } = await supabase.storage.from(bucket).upload(key, file, {
    cacheControl: '3600',
    upsert: false,
  });
  if (error) {
    console.error('[storage:uploadAttachment] failed', error);
    throw error;
  }
  const { data: publicUrl } = supabase.storage.from(bucket).getPublicUrl(key);
  return { path: key, url: publicUrl.publicUrl, mimeType: file.type, size: file.size };
}


