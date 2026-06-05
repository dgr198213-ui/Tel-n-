import { createClient } from '@supabase/supabase-js';
import { nanoid } from 'nanoid';

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

const DEFAULT_BUCKET = 'uploads';

function normalizeKey(relKey: string): string {
  return relKey.replace(/^\/+/, "");
}

function appendHashSuffix(relKey: string): string {
  const hash = nanoid(8);
  const lastDot = relKey.lastIndexOf(".");
  if (lastDot === -1) return `${relKey}_${hash}`;
  return `${relKey.slice(0, lastDot)}_${hash}${relKey.slice(lastDot)}`;
}

export async function storagePut(
  relKey: string,
  data: Buffer | Uint8Array | string,
  contentType = "application/octet-stream",
  bucket = DEFAULT_BUCKET
): Promise<{ key: string; url: string }> {
  const key = appendHashSuffix(normalizeKey(relKey));
  
  const { data: uploadData, error } = await supabase.storage
    .from(bucket)
    .upload(key, data, {
      contentType,
      upsert: true
    });

  if (error) {
    throw new Error(`Supabase Storage upload failed: ${error.message}`);
  }

  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(key);

  return { key, url: publicUrl };
}

export async function storageGet(relKey: string, bucket = DEFAULT_BUCKET): Promise<{ key: string; url: string }> {
  const key = normalizeKey(relKey);
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(key);
    
  return { key, url: publicUrl };
}

export async function storageGetSignedUrl(relKey: string, bucket = DEFAULT_BUCKET, expiresIn = 3600): Promise<string> {
  const key = normalizeKey(relKey);
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(key, expiresIn);

  if (error) {
    throw new Error(`Supabase Storage signed URL failed: ${error.message}`);
  }

  return data.signedUrl;
}
