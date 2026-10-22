import { footer, site } from "@/data/content";

export async function Footer() {
  // Cached at build time; new Date() is not allowed in an uncached prerender.
  "use cache";
  return (
    <footer className="border-t border-line px-4 py-8 md:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 text-sm text-muted md:flex-row md:items-center md:justify-between">
        <p>
          <span className="font-display text-lg tracking-wider text-paper">{site.name}</span>
          <span className="mx-2">·</span>© {new Date().getFullYear()}
        </p>
        <a href={site.devPortfolio} target="_blank" rel="noopener noreferrer" className="text-xs transition hover:text-paper">
          {footer.devLinkText}
        </a>
      </div>
    </footer>
  );
}
