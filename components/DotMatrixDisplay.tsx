"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type DotMatrixDisplayProps = {
  children?: ReactNode;
  className?: string;
  density?: "open" | "normal" | "tight";
  glow?: boolean;
  label?: string;
};

export default function DotMatrixDisplay({
  children,
  className = "",
  density = "normal",
  glow = true,
  label
}: DotMatrixDisplayProps) {
  return (
    <motion.section
      aria-label={label}
      className={`relative overflow-hidden border border-bone/18 bg-black ${className}`}
      initial={{ opacity: 0.96 }}
      animate={{ opacity: [0.96, 1, 0.98] }}
      transition={{ duration: 9, repeat: Infinity, ease: "steps(2)" }}
    >
      {glow && <div aria-hidden className="absolute inset-0 shadow-[inset_0_0_0_1px_rgba(242,231,194,.06)]" />}
      <div className="relative z-10 h-full">{children}</div>
    </motion.section>
  );
}
