/**
 * ALL site content lives here. Edit this file to add videos, character
 * sheets, tools or change any text. Components read from it and never
 * hard-code content.
 *
 * Search for "[PLACEHOLDER]" to find everything that still needs real data.
 */

export type Role = "Script" | "Shot planning" | "Prompts" | "Generation" | "Edit" | "Voice-over" | "Sound";

export type Video = {
  id: string;
  title: string;
  /** e.g. "Folklore Horror Short (Trailer)" */
  type: string;
  /** Display string, e.g. "1:12" or "~50 sec" */
  duration: string;
  /** One line, shown on the card */
  tagline: string;
  /** Full description, shown in the modal */
  description: string;
  /** Path in /public, 16:9 image */
  thumbnail: string;
  /** Optional short muted MP4 (2–6 s, < 1.5 MB) played on card hover */
  previewSrc?: string;
  /** YouTube or Vimeo link (normal watch URL is fine; it is converted to an embed URL) */
  url?: string;
  tools: string[];
  roles: Role[];
  /** Shows a locked / blurred "Coming soon" card */
  comingSoon?: boolean;
};

export type CharacterSheet = {
  id: string;
  name: string;
  project: string;
  note: string;
  /** Path in /public/characters/ — portrait 4:5 works best (e.g. 1200×1500) */
  image: string;
  width: number;
  height: number;
};

export const site = {
  name: "Pulkit Mathur",
  title: "AI Video Producer | AI Filmmaker",
  location: "Bengaluru, India",
  email: "mpulkit0@gmail.com",
  linkedin: "https://www.linkedin.com/in/pulkit-mathur-6858453a0/",
  // [PLACEHOLDER] your developer portfolio URL
  devPortfolio: "#",
  // Drop your resume at /public/resume.pdf
  resume: "/resume.pdf",
  // [PLACEHOLDER] your final domain (used for SEO / Open Graph links)
  url: "https://pulkit-mathur.vercel.app",
  seo: {
    title: "Pulkit Mathur – AI Video Producer",
    description:
      "Pulkit Mathur is an AI Video Producer and AI Filmmaker in Bengaluru. Script, shot planning, prompts, AI generation, edit, voice-over and sound, all end to end.",
  },
};

export const hero = {
  // [PLACEHOLDER] add a short compressed showreel loop (< 5 MB). Leave empty to show the poster only.
  showreelMp4: "", // e.g. "/videos/showreel.mp4"
  showreelWebm: "", // e.g. "/videos/showreel.webm"
  // [PLACEHOLDER] a still from your best video (1920×1080)
  poster: "/hero/poster.jpg",
  kicker: "Script → Prompt → Generate → Edit → Sound",
  ctaPrimary: "Watch My Work",
  ctaSecondary: "Download Resume",
};

export const videos: Video[] = [
  {
    id: "raakh",
    title: "RAAKH",
    type: "Folklore Horror Short (Trailer)",
    duration: "[PLACEHOLDER] 1:00",
    tagline: "An Indian folklore horror story set around Dussehra.",
    description:
      "An original Indian folklore horror story set around Dussehra, cut as a trailer and carried by an old-man narrator voice-over. Minimal characters and two locations, built for atmosphere and dread.",
    thumbnail: "/thumbs/raakh.jpg",
    previewSrc: "", // [PLACEHOLDER] e.g. "/videos/raakh-preview.mp4"
    url: "", // [PLACEHOLDER] RAAKH-LINK (YouTube or Vimeo)
    tools: ["Google Gemini (Veo)", "CapCut"],
    roles: ["Script", "Shot planning", "Prompts", "Generation", "Edit", "Voice-over", "Sound"],
  },
  {
    id: "diamond",
    title: "[PLACEHOLDER] DIAMOND",
    type: "Realistic Message Short",
    duration: "~50 sec",
    tagline: "A man digging for diamonds gets lost in his phone.",
    description:
      "A realistic short: a man digging in a diamond cave gets distracted by phone scrolling and walks away from what he came for. A short, direct “stop being distracted” message.",
    thumbnail: "/thumbs/diamond.jpg",
    previewSrc: "", // [PLACEHOLDER] e.g. "/videos/diamond-preview.mp4"
    url: "", // [PLACEHOLDER] DIAMOND-LINK (YouTube or Vimeo)
    tools: ["Google Gemini (Veo)", "CapCut"],
    roles: ["Script", "Prompts", "Generation", "Edit", "Sound"],
  },
  {
    id: "coming-soon",
    title: "Next Project",
    type: "In production",
    duration: "Soon",
    tagline: "Something new is being generated.",
    description: "",
    thumbnail: "/thumbs/coming-soon.jpg",
    tools: [],
    roles: [],
    comingSoon: true,
  },
];

export const breakdown = {
  // Which video this breakdown belongs to
  videoTitle: "RAAKH",
  intro: "One shot, three stages. The prompt I wrote, what the model gave back, and what made the cut.",
  prompt: {
    // [PLACEHOLDER] paste the real prompt you used
    text: "Cinematic wide shot, dusk, a small North Indian village lane during Dussehra. A tall Ravan effigy stands unlit at the end of the lane, paper face cracked, eyes painted red. Ash drifts through the air like snow. An old man in a grey shawl sits on a charpai in the foreground, backlit, face in shadow. Slow dolly-in. 35mm anamorphic, shallow depth of field, warm tungsten practicals, cold blue sky, film grain, 2.39:1, horror, unsettling stillness.",
    model: "Google Gemini (Veo)",
    settings: "Text-to-video · 8 s · 16:9",
  },
  raw: {
    label: "Raw AI clip",
    note: "Straight out of the model. No grade, no sound, no cut.",
    poster: "/bts/raw.jpg",
    src: "", // [PLACEHOLDER] e.g. "/videos/bts-raw.mp4"
  },
  final: {
    label: "Final edit",
    note: "Re-timed, graded, letterboxed, with the narrator VO and sound design laid in.",
    poster: "/bts/final.jpg",
    src: "", // [PLACEHOLDER] e.g. "/videos/bts-final.mp4"
  },
};

export const characters: CharacterSheet[] = [
  {
    id: "old-narrator",
    name: "The Old Narrator",
    project: "RAAKH",
    note: "Old narrator: the voice that tells the story.",
    image: "/characters/old-narrator.jpg",
    width: 1200,
    height: 1500,
  },
  {
    id: "village-girl",
    name: "[PLACEHOLDER] Village Girl",
    project: "RAAKH",
    note: "Kept consistent across both locations.",
    image: "/characters/village-girl.jpg",
    width: 1200,
    height: 1500,
  },
  {
    id: "ravan-effigy",
    name: "The Effigy",
    project: "RAAKH",
    note: "The Dussehra effigy, designed as a character.",
    image: "/characters/ravan-effigy.jpg",
    width: 1200,
    height: 1500,
  },
  {
    id: "miner",
    name: "The Miner",
    project: "[PLACEHOLDER] DIAMOND",
    note: "Same face and outfit in every shot of the cave.",
    image: "/characters/miner.jpg",
    width: 1200,
    height: 1500,
  },
  {
    id: "placeholder-5",
    name: "[PLACEHOLDER] Character 05",
    project: "Upcoming",
    note: "Next character sheet goes here.",
    image: "/characters/placeholder-5.jpg",
    width: 1200,
    height: 1500,
  },
];

export const tools: { name: string; note: string; icon: "gemini" | "capcut" | "plus" }[] = [
  { name: "Google Gemini (Veo)", note: "Text & image to video", icon: "gemini" },
  { name: "CapCut", note: "Edit, captions, sound", icon: "capcut" },
  { name: "[PLACEHOLDER] More tools", note: "Add yours in content.ts", icon: "plus" },
];

export const skills = [
  "Text-to-video",
  "Image-to-video",
  "Prompt writing",
  "Character consistency",
  "Scriptwriting",
  "Shot planning",
  "Editing",
  "Voice-over",
  "Sound design",
];

export const about = {
  lines: [
    "I make AI films and brand-style videos end to end: script, shot plan, prompts, generation, edit, voice-over and sound.",
    "I have a Computer Applications (BCA) background, so I pick up new AI tools fast and build workflows that save time.",
    "I'm based in Bengaluru and open to full-time AI Video Producer and AI Video Creator roles.",
  ],
  // Optional. Set to "" to hide the photo.
  photo: "/about/pulkit.jpg",
};

export const contact = {
  heading: "Let's make something.",
  sub: "Open to full-time AI Video Producer / AI Video Creator roles.",
  hireMe: "Hire me",
};

export const footer = {
  devLinkText: "I also build web apps → developer portfolio",
};

export const nav = [
  { id: "work", label: "Work" },
  { id: "process", label: "Process" },
  { id: "characters", label: "Characters" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];
