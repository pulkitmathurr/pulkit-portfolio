import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Inter, JetBrains_Mono } from "next/font/google";
import { site } from "@/data/content";
import "./globals.css";

const bebas = Bebas_Neue({ variable: "--font-bebas", weight: "400", subsets: ["latin"] });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const mono = JetBrains_Mono({ variable: "--font-jetbrains", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.seo.title,
  description: site.seo.description,
  openGraph: {
    title: site.seo.title,
    description: site.seo.description,
    type: "website",
    locale: "en_IN",
  },
  twitter: { card: "summary_large_image", title: site.seo.title, description: site.seo.description },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
};

// Runs before paint: show the intro only on the first visit of the session,
// and never when the user prefers reduced motion.
const introScript = `try{if(!sessionStorage.getItem("intro-seen")&&!matchMedia("(prefers-reduced-motion: reduce)").matches){document.documentElement.dataset.intro="1"}}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${bebas.variable} ${inter.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
