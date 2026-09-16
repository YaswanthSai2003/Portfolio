"use client";

import { useState } from "react";

export function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }
  return <button type="button" onClick={copy} className="text-[9px] font-semibold text-white/42 transition hover:text-white">{copied ? "Copied ✓" : "Copy URL"}</button>;
}
