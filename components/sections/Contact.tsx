"use client";

import { useEffect, useRef, useState } from "react";
import { contact, site } from "@/data/content";
import { Section } from "@/components/ui/Section";
import { Toast } from "@/components/ui/Toast";

export function Contact() {
  const [toast, setToast] = useState<string | null>(null);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copyEmail = async () => {
    let msg = "Email copied to clipboard";
    try {
      await navigator.clipboard.writeText(site.email);
    } catch {
      msg = site.email;
    }
    setToast(msg);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setToast(null), 2200);
  };

  return (
    <Section id="contact" ariaLabel="Contact" className="px-4 pt-28 pb-24 md:px-8 md:pt-40 md:pb-32">
      <div className="mx-auto max-w-7xl">
        <p className="mb-6 flex items-center gap-3 font-mono text-[11px] tracking-[0.3em] text-muted uppercase">
          <span className="inline-block h-px w-8 bg-accent" />
          06 — Contact
        </p>
        <h2 className="font-display text-[clamp(3.5rem,13vw,12rem)] leading-[0.85] tracking-tight text-paper uppercase">
          {contact.heading.split(" ").map((w, i, arr) => (
            <span key={i} className={i === arr.length - 1 ? "text-accent" : ""}>
              {w}
              {i < arr.length - 1 ? " " : ""}
            </span>
          ))}
        </h2>
        <p className="mt-6 max-w-xl text-lg text-muted">{contact.sub}</p>

        <div className="mt-12 grid gap-px border border-line bg-line md:grid-cols-3">
          <button
            type="button"
            onClick={copyEmail}
            className="group flex flex-col items-start gap-2 bg-ink p-6 text-left transition hover:bg-ink-2 md:p-8"
          >
            <span className="font-mono text-[11px] tracking-[0.25em] text-muted uppercase">Email · click to copy</span>
            <span className="text-xl font-semibold break-all text-paper transition group-hover:text-accent md:text-2xl">{site.email}</span>
          </button>
          <a
            href={site.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-start gap-2 bg-ink p-6 transition hover:bg-ink-2 md:p-8"
          >
            <span className="font-mono text-[11px] tracking-[0.25em] text-muted uppercase">LinkedIn</span>
            <span className="font-display text-2xl text-paper transition group-hover:text-accent md:text-3xl">Pulkit Mathur ↗</span>
          </a>
          <a href={site.resume} download className="group flex flex-col items-start gap-2 bg-ink p-6 transition hover:bg-ink-2 md:p-8">
            <span className="font-mono text-[11px] tracking-[0.25em] text-muted uppercase">Resume · PDF</span>
            <span className="font-display text-2xl text-paper transition group-hover:text-accent md:text-3xl">Download ↓</span>
          </a>
        </div>
      </div>
      <Toast message={toast} />
    </Section>
  );
}
