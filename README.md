# Pulkit Mathur – AI Video Producer portfolio

A one-page cinematic portfolio: dark film-studio look, a showreel hero with a 3D dust-in-a-projector-beam scene, a video grid with a shared-element modal player, a pinned "Prompt → Raw → Final" breakdown, a 3D character-sheet ring and a contact section.

**Stack:** Next.js 16 (App Router, TypeScript) · Tailwind CSS v4 · React Three Fiber + drei · GSAP + ScrollTrigger · Motion (Framer Motion) · Lenis

---

## Run it locally

You need Node 20+ and pnpm.

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

Other commands:

```bash
pnpm build        # production build
pnpm start        # serve the production build
pnpm lint
```

The intro countdown shows once per browser session. To see it again, open a new tab or clear `sessionStorage`.

---

## Where everything lives

```
data/content.ts          ← ALL text, videos, character sheets, tools, skills
public/
  resume.pdf             ← add your resume here (the "Download Resume" buttons point to it)
  hero/poster.jpg        ← hero still (shown before / instead of the showreel)
  videos/                ← showreel + hover previews + breakdown clips (create this folder)
  thumbs/                ← 16:9 video thumbnails
  characters/            ← character sheets (4:5 portrait works best)
  bts/                   ← posters for the breakdown's raw / final clips
  about/pulkit.jpg       ← About photo
app/
  layout.tsx             ← fonts, SEO metadata
  opengraph-image.jpg    ← social share image (1200×630), replace with a still from your best video
  icon.png, apple-icon.png ← favicon
components/
  sections/              ← one file per page section
  ui/                    ← cards, modal, lightbox, cursor, grain, letterbox, timecode…
  three/HeroScene.tsx    ← the R3F hero scene (loaded lazily, client-only)
  providers/SmoothScroll.tsx ← Lenis + ScrollTrigger sync
hooks/                   ← media queries, in-view / auto-pause, tilt
lib/embed.ts             ← turns YouTube / Vimeo links into embed URLs
```

Search `data/content.ts` for **`[PLACEHOLDER]`** to find everything that still needs real content.

---

## Add a new video

1. Put a 16:9 thumbnail in `public/thumbs/`, e.g. `public/thumbs/my-film.jpg` (1280×720 is plenty).
2. *(Optional)* Put a short muted hover preview in `public/videos/`, e.g. `my-film-preview.mp4` (2–6 seconds, under ~1.5 MB).
3. Add an entry to the `videos` array in `data/content.ts`:

```ts
{
  id: "my-film",                       // unique, no spaces
  title: "MY FILM",
  type: "Brand Film",
  duration: "0:45",
  tagline: "One line shown on the card.",
  description: "Full description shown in the player.",
  thumbnail: "/thumbs/my-film.jpg",
  previewSrc: "/videos/my-film-preview.mp4", // or ""
  url: "https://youtu.be/XXXXXXXXXXX",       // YouTube or Vimeo, normal link is fine
  tools: ["Google Gemini (Veo)", "CapCut"],
  roles: ["Script", "Prompts", "Generation", "Edit", "Sound"],
},
```

The order of the array is the order on the page. To remove the "Coming soon" card, delete the entry with `comingSoon: true`.

### RAAKH and the Diamond short
Their entries are already there. Just fill in `url`, `duration`, the real title for the Diamond short, and swap the thumbnails.

### Hero showreel
Export a short loop (10–20 s, **under 5 MB**, no audio), e.g. with HandBrake at 1080p / RF 28. Save it as `public/videos/showreel.mp4` (and optionally `.webm`), then set `hero.showreelMp4` (and `hero.showreelWebm`) in `content.ts`. Replace `public/hero/poster.jpg` with a still from it.

### Behind the Scenes breakdown
Edit `breakdown` in `content.ts`: paste your real prompt, and point `raw.src` / `final.src` at two short clips in `public/videos/`. Replace the posters in `public/bts/`.

---

## Add a character sheet

1. Export the sheet as a JPG, ideally **4:5 portrait** (e.g. 1200×1500), and save it in `public/characters/`.
2. Add an entry to `characters` in `data/content.ts`:

```ts
{
  id: "new-character",
  name: "The Priest",
  project: "RAAKH",
  note: "Same face across all night shots.",
  image: "/characters/new-character.jpg",
  width: 1200,
  height: 1500,
},
```

On desktop the cards sit in a 3D ring, which works best with 4–8 sheets. On phones they become a swipe carousel.

---

## Other things to fill in

- `site.devPortfolio`: your developer portfolio URL (footer link).
- `site.url`: your final domain, used for Open Graph links.
- `public/resume.pdf`: your resume.
- `app/opengraph-image.jpg`: a 1200×630 still from your best video.
- `tools`: add more tools. The `icon` field is `"gemini"`, `"capcut"` or `"plus"` (generic).

---

## Deploy to Vercel

1. Push this repo to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new), import the repo and keep the defaults (Framework: Next.js, install command `pnpm install`, build command `pnpm build`).
3. Click **Deploy**. There are no environment variables to set.
4. *(Optional)* Add your custom domain under **Project → Settings → Domains**, then update `site.url` in `content.ts`.

Every push to the main branch redeploys automatically.

### Performance notes
- Keep the showreel under 5 MB and the hover previews under ~1.5 MB. Full videos are never hosted here; they play from YouTube/Vimeo inside the modal.
- The 3D canvas loads lazily, renders fewer particles on phones and stops rendering when the hero is off screen.
- Videos only play while they are on screen.
- With **Reduce motion** turned on in the OS, the intro, 3D, smooth scroll, custom cursor and scroll animations are switched off.
