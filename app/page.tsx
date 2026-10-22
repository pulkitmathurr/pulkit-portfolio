import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { Loader } from "@/components/sections/Loader";
import { Nav } from "@/components/sections/Nav";
import { Hero } from "@/components/sections/Hero";
import { Videos } from "@/components/sections/Videos";
import { BehindTheScenes } from "@/components/sections/BehindTheScenes";
import { Characters } from "@/components/sections/Characters";
import { Tools } from "@/components/sections/Tools";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";
import { FilmGrain } from "@/components/ui/FilmGrain";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { HireMeButton } from "@/components/ui/HireMeButton";

export default function Home() {
  return (
    <SmoothScroll>
      <Loader />
      <Nav />
      <main>
        <Hero />
        <Videos />
        <BehindTheScenes />
        <Characters />
        <Tools />
        <About />
        <Contact />
      </main>
      <Footer />
      <HireMeButton />
      <CustomCursor />
      <FilmGrain />
    </SmoothScroll>
  );
}
