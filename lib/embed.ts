/**
 * Turns a normal YouTube / Vimeo link into an embeddable player URL.
 * Returns null when the link is empty or not recognised.
 */
export function toEmbedUrl(url: string | undefined): string | null {
  if (!url) return null;
  let u: URL;
  try {
    u = new URL(url);
  } catch {
    return null;
  }
  const host = u.hostname.replace(/^www\.|^m\./, "");

  if (host === "youtu.be" || host === "youtube.com" || host === "youtube-nocookie.com") {
    let id = "";
    if (host === "youtu.be") id = u.pathname.slice(1);
    else if (u.pathname.startsWith("/watch")) id = u.searchParams.get("v") ?? "";
    else id = u.pathname.split("/").filter(Boolean).pop() ?? ""; // /embed/ID, /shorts/ID
    return id ? `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&playsinline=1` : null;
  }

  if (host === "vimeo.com" || host === "player.vimeo.com") {
    const id = u.pathname.split("/").filter(Boolean).find((p) => /^\d+$/.test(p));
    const hash = u.pathname.split("/").filter(Boolean).find((p) => /^[0-9a-f]{6,}$/i.test(p) && !/^\d+$/.test(p));
    if (!id) return null;
    return `https://player.vimeo.com/video/${id}?autoplay=1&title=0&byline=0&portrait=0${hash ? `&h=${hash}` : ""}`;
  }

  return null;
}
