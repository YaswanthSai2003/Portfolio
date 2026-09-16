// Verifies file content against known magic bytes, rather than trusting the
// browser-supplied `file.type` (which is just a client-side label and can be
// set to anything). This is defense-in-depth: uploads already require an
// authenticated admin session and are additionally constrained by the
// Supabase Storage bucket's `allowed_mime_types`, but content-sniffing
// catches a mislabeled file before either of those layers.

const SIGNATURES: Record<string, { bytes: number[]; offset?: number }[]> = {
  "image/png": [{ bytes: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a] }],
  "image/jpeg": [{ bytes: [0xff, 0xd8, 0xff] }],
  "image/gif": [{ bytes: [0x47, 0x49, 0x46, 0x38] }],
  "image/webp": [
    { bytes: [0x52, 0x49, 0x46, 0x46] }, // "RIFF" at offset 0
    { bytes: [0x57, 0x45, 0x42, 0x50], offset: 8 }, // "WEBP" at offset 8
  ],
  "application/pdf": [{ bytes: [0x25, 0x50, 0x44, 0x46] }], // "%PDF"
};

async function matches(buffer: ArrayBuffer, signature: { bytes: number[]; offset?: number }) {
  const offset = signature.offset ?? 0;
  const view = new Uint8Array(buffer, offset, signature.bytes.length);
  return signature.bytes.every((byte, index) => view[index] === byte);
}

async function signatureFits(head: ArrayBuffer, signature: { bytes: number[]; offset?: number }) {
  const start = signature.offset ?? 0;
  return head.byteLength >= start + signature.bytes.length && (await matches(head, signature));
}

/** Reads the first bytes of `file` and checks them against `mimeType`'s known signature. */
export async function hasValidSignature(file: File, mimeType: string): Promise<boolean> {
  const signatures = SIGNATURES[mimeType];
  if (!signatures) return true; // No signature registered for this type; skip the check.
  const head = await file.slice(0, 32).arrayBuffer();
  if (head.byteLength < 4) return false;

  if (mimeType === "image/webp") {
    // WebP requires both the "RIFF" header (offset 0) and the "WEBP" marker (offset 8).
    const [riff, webp] = signatures;
    return (await signatureFits(head, riff)) && (await signatureFits(head, webp));
  }

  for (const signature of signatures) {
    if (await signatureFits(head, signature)) return true;
  }
  return false;
}
