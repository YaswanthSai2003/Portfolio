"use client";

import { useState } from "react";
import { ContactForm } from "./contact-form";

export function ContactDisclosure() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="group inline-flex items-center gap-3 text-[13px] font-bold"
        aria-expanded={open}
      >
        <span>{open ? "Close message form" : "Send a message"}</span>
        <span className="grid size-8 place-items-center rounded-full border border-current/20 text-[15px] transition-transform group-hover:rotate-45">
          {open ? "×" : "+"}
        </span>
      </button>

      {open ? (
        <div className="mt-10 max-w-3xl border-t border-black/12 pt-4 dark:border-white/12">
          <ContactForm />
        </div>
      ) : null}
    </div>
  );
}
