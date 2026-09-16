"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function AdminLoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: form.get("password") }),
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) {
      setError(body.error || "Could not sign in.");
      setLoading(false);
      return;
    }
    router.replace("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="mt-10 border-t border-white/18">
      <label className="block border-b border-white/10 py-5">
        <span className="block font-[var(--font-mono)] text-[8px] uppercase tracking-[0.11em] text-white/38">Admin password</span>
        <input autoFocus name="password" type="password" required className="mt-2 w-full bg-transparent py-1 text-sm outline-none placeholder:text-white/20" placeholder="Enter password" />
      </label>
      <button type="submit" disabled={loading} className="mt-5 min-h-11 w-full bg-[#eef0f1] px-5 text-[11px] font-bold text-[#111] transition hover:-translate-y-0.5 disabled:opacity-50">{loading ? "Signing in…" : "Sign in"}</button>
      {error ? <p className="mt-4 text-[11px] text-[#f17a62]">{error}</p> : null}
    </form>
  );
}
