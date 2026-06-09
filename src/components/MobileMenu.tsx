import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface NavLink {
  href: string;
  label: string;
}

interface Props {
  links: NavLink[];
  brandName: string;
  /** URL CTA (es. LinkedIn) — se omesso il pulsante non viene mostrato. */
  ctaHref?: string;
  ctaLabel?: string;
  labels: { menu: string; close: string };
}

/**
 * Menu di navigazione mobile (island React).
 * Pulsante hamburger che apre un overlay a tutto schermo.
 * Visibile solo sotto il breakpoint md (gestito dal contenitore in Navbar).
 */
export default function MobileMenu({ links, brandName, ctaHref, ctaLabel, labels }: Props) {
  const [open, setOpen] = useState(false);

  // Blocca lo scroll del body quando il menu è aperto e chiudi con ESC.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label={labels.menu}
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen(true)}
        className="inline-flex h-10 w-10 items-center justify-center rounded-md text-text transition-colors hover:bg-surface-2"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {open &&
        createPortal(
          <div
          id="mobile-menu"
          className="fixed inset-0 z-50 flex flex-col bg-bg"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <span className="font-semibold tracking-tight">{brandName}</span>
            <button
              type="button"
              aria-label={labels.close}
              onClick={() => setOpen(false)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-md text-text transition-colors hover:bg-surface-2"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <nav className="flex flex-1 flex-col gap-2 px-6 py-8">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-2 py-3 text-2xl font-medium text-text transition-colors hover:text-accent"
              >
                {link.label}
              </a>
            ))}
            {ctaHref && ctaLabel && (
              <a
                href={ctaHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="mt-4 inline-flex items-center justify-center rounded-lg bg-accent px-5 py-3 text-base font-semibold text-bg transition-opacity hover:opacity-90"
              >
                {ctaLabel}
              </a>
            )}
          </nav>
          </div>,
          document.body
        )}
    </div>
  );
}
