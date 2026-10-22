"use client";

import { useCallback, useState } from "react";
import { AnimatePresence, LayoutGroup } from "motion/react";
import { videos } from "@/data/content";
import { Section } from "@/components/ui/Section";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { VideoCard } from "@/components/ui/VideoCard";
import { VideoModal } from "@/components/ui/VideoModal";

export function Videos() {
  const [openId, setOpenId] = useState<string | null>(null);
  const active = videos.find((v) => v.id === openId) ?? null;
  const close = useCallback(() => setOpenId(null), []);

  return (
    <Section id="work" ariaLabel="Work" className="px-4 pt-24 pb-28 md:px-8 md:pt-36 md:pb-40">
      <div className="mx-auto max-w-7xl">
        <SectionTitle scene="01 — Work" title="Selected Films" sub="Scripted, prompted, generated, cut and scored by me." />
        <LayoutGroup>
          <div className="grid gap-x-6 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
            {videos.map((v, i) => (
              <VideoCard key={v.id} video={v} index={i} onOpen={setOpenId} />
            ))}
          </div>
          <AnimatePresence>{active ? <VideoModal key={active.id} video={active} onClose={close} /> : null}</AnimatePresence>
        </LayoutGroup>
      </div>
    </Section>
  );
}
