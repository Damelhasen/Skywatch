"use client";

import { motion, useAnimationFrame } from "framer-motion";
import { useState } from "react";
import type { Aircraft } from "@/lib/types";

type PlaneAnimationProps = {
  aircraft: Aircraft | null;
  clear?: boolean;
};

const DOT_COUNT = 76;

export default function PlaneAnimation({ aircraft, clear = false }: PlaneAnimationProps) {
  const [activeDot, setActiveDot] = useState(0);
  const inactive = clear || !aircraft;

  useAnimationFrame((time) => {
    setActiveDot(Math.floor((time / 95) % DOT_COUNT));
  });

  return (
    <div className="relative h-24 w-full overflow-visible sm:h-28 md:h-32 xl:h-44">
      <div className="absolute left-[-1px] right-[-1px] top-1/2 flex -translate-y-1/2 justify-between">
        {Array.from({ length: DOT_COUNT }, (_, index) => {
          const distance = Math.min(
            Math.abs(index - activeDot),
            DOT_COUNT - Math.abs(index - activeDot)
          );
          const wave = Math.max(0, 1 - distance / 5);

          return (
            <motion.span
              aria-hidden
              className="h-[clamp(4px,.72vmin,7px)] w-[clamp(4px,.72vmin,7px)] shrink-0 rounded-full bg-bone"
              key={index}
              animate={{
                opacity: inactive ? 0.38 + wave * 0.28 : 0.62 + wave * 0.38,
                scale: 1 + wave * 0.45
              }}
              transition={{ duration: 0.16, ease: "linear" }}
            />
          );
        })}
      </div>
    </div>
  );
}
