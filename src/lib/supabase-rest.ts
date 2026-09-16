const supabaseUrl = (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "").replace(/\/$/, "");
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

export function hasSupabase() {
  return Boolean(supabaseUrl && serviceKey);
}

function headers(extra?: HeadersInit): HeadersInit {
  return {
    apikey: serviceKey,
    Authorization: `Bearer ${serviceKey}`,
    "Content-Type": "application/json",
    ...extra,
  };
}

async function parseError(response: Response) {
  const text = await response.text().catch(() => "");
  return text || `${response.status} ${response.statusText}`;
}

export async function dbSelect<T>(table: string, query = "select=*"): Promise<T[]> {
  if (!hasSupabase()) return [];
  const response = await fetch(`${supabaseUrl}/rest/v1/${table}?${query}`, {
    headers: headers(),
    cache: "no-store",
  });
  if (!response.ok) throw new Error(await parseError(response));
  return (await response.json()) as T[];
}

export async function dbInsert<T>(table: string, value: unknown): Promise<T[]> {
  if (!hasSupabase()) throw new Error("Supabase is not configured.");
  const response = await fetch(`${supabaseUrl}/rest/v1/${table}`, {
    method: "POST",
    headers: headers({ Prefer: "return=representation" }),
    body: JSON.stringify(value),
    cache: "no-store",
  });
  if (!response.ok) throw new Error(await parseError(response));
  return (await response.json()) as T[];
}

export async function dbUpdate<T>(
  table: string,
  filter: string,
  value: unknown,
): Promise<T[]> {
  if (!hasSupabase()) throw new Error("Supabase is not configured.");
  const response = await fetch(`${supabaseUrl}/rest/v1/${table}?${filter}`, {
    method: "PATCH",
    headers: headers({ Prefer: "return=representation" }),
    body: JSON.stringify(value),
    cache: "no-store",
  });
  if (!response.ok) throw new Error(await parseError(response));
  return (await response.json()) as T[];
}

export async function dbDelete(table: string, filter: string) {
  if (!hasSupabase()) throw new Error("Supabase is not configured.");
  const response = await fetch(`${supabaseUrl}/rest/v1/${table}?${filter}`, {
    method: "DELETE",
    headers: headers(),
    cache: "no-store",
  });
  if (!response.ok) throw new Error(await parseError(response));
}

export async function uploadPublicFile(
  bucket: string,
  path: string,
  file: File,
): Promise<string> {
  if (!hasSupabase()) throw new Error("Supabase is not configured.");
  const response = await fetch(`${supabaseUrl}/storage/v1/object/${bucket}/${path}`, {
    method: "POST",
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      "Content-Type": file.type || "application/octet-stream",
      "x-upsert": "true",
    },
    body: await file.arrayBuffer(),
    cache: "no-store",
  });
  if (!response.ok) throw new Error(await parseError(response));
  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`;
}

export async function uploadPrivateFile(
  bucket: string,
  path: string,
  file: File,
): Promise<string> {
  if (!hasSupabase()) throw new Error("Supabase is not configured.");
  const response = await fetch(`${supabaseUrl}/storage/v1/object/${bucket}/${path}`, {
    method: "POST",
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      "Content-Type": file.type || "application/octet-stream",
      "x-upsert": "false",
    },
    body: await file.arrayBuffer(),
    cache: "no-store",
  });
  if (!response.ok) throw new Error(await parseError(response));
  return path;
}

export async function createSignedUrl(bucket: string, path: string, expiresIn = 300) {
  if (!hasSupabase()) throw new Error("Supabase is not configured.");
  const response = await fetch(`${supabaseUrl}/storage/v1/object/sign/${bucket}/${path}`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ expiresIn }),
    cache: "no-store",
  });
  if (!response.ok) throw new Error(await parseError(response));
  const body = (await response.json()) as { signedURL?: string; signedUrl?: string };
  const signed = body.signedURL || body.signedUrl;
  if (!signed) throw new Error("Storage provider did not return a signed URL.");
  return signed.startsWith("http") ? signed : `${supabaseUrl}/storage/v1${signed}`;
}

export async function removeStorageFile(bucket: string, path: string) {
  if (!hasSupabase()) throw new Error("Supabase is not configured.");
  const response = await fetch(`${supabaseUrl}/storage/v1/object/${bucket}`, {
    method: "DELETE",
    headers: headers(),
    body: JSON.stringify({ prefixes: [path] }),
    cache: "no-store",
  });
  if (!response.ok) throw new Error(await parseError(response));
}
