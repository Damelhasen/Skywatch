"use client";

import type { CSSProperties } from "react";

const FONT: Record<string, string[]> = {
  " ": ["00000", "00000", "00000", "00000", "00000", "00000", "00000"],
  "-": ["00000", "00000", "00000", "11111", "00000", "00000", "00000"],
  ".": ["00000", "00000", "00000", "00000", "00000", "01100", "01100"],
  "/": ["00001", "00010", "00100", "00100", "01000", "10000", "00000"],
  ">": ["10000", "01000", "00100", "00010", "00100", "01000", "10000"],
  A: ["01110", "10001", "10001", "11111", "10001", "10001", "10001"],
  B: ["11110", "10001", "10001", "11110", "10001", "10001", "11110"],
  C: ["01111", "10000", "10000", "10000", "10000", "10000", "01111"],
  D: ["11110", "10001", "10001", "10001", "10001", "10001", "11110"],
  E: ["11111", "10000", "10000", "11110", "10000", "10000", "11111"],
  F: ["11111", "10000", "10000", "11110", "10000", "10000", "10000"],
  G: ["01111", "10000", "10000", "10011", "10001", "10001", "01110"],
  H: ["10001", "10001", "10001", "11111", "10001", "10001", "10001"],
  I: ["11111", "00100", "00100", "00100", "00100", "00100", "11111"],
  J: ["00111", "00010", "00010", "00010", "10010", "10010", "01100"],
  K: ["10001", "10010", "10100", "11000", "10100", "10010", "10001"],
  L: ["10000", "10000", "10000", "10000", "10000", "10000", "11111"],
  M: ["10001", "11011", "10101", "10101", "10001", "10001", "10001"],
  N: ["10001", "11001", "10101", "10011", "10001", "10001", "10001"],
  O: ["01110", "10001", "10001", "10001", "10001", "10001", "01110"],
  P: ["11110", "10001", "10001", "11110", "10000", "10000", "10000"],
  Q: ["01110", "10001", "10001", "10001", "10101", "10010", "01101"],
  R: ["11110", "10001", "10001", "11110", "10100", "10010", "10001"],
  S: ["01111", "10000", "10000", "01110", "00001", "00001", "11110"],
  T: ["11111", "00100", "00100", "00100", "00100", "00100", "00100"],
  U: ["10001", "10001", "10001", "10001", "10001", "10001", "01110"],
  V: ["10001", "10001", "10001", "10001", "10001", "01010", "00100"],
  W: ["10001", "10001", "10001", "10101", "10101", "10101", "01010"],
  X: ["10001", "10001", "01010", "00100", "01010", "10001", "10001"],
  Y: ["10001", "10001", "01010", "00100", "00100", "00100", "00100"],
  Z: ["11111", "00001", "00010", "00100", "01000", "10000", "11111"],
  "0": ["01110", "10001", "10011", "10101", "11001", "10001", "01110"],
  "1": ["00100", "01100", "00100", "00100", "00100", "00100", "01110"],
  "2": ["01110", "10001", "00001", "00010", "00100", "01000", "11111"],
  "3": ["11110", "00001", "00001", "01110", "00001", "00001", "11110"],
  "4": ["10010", "10010", "10010", "11111", "00010", "00010", "00010"],
  "5": ["11111", "10000", "10000", "11110", "00001", "00001", "11110"],
  "6": ["01110", "10000", "10000", "11110", "10001", "10001", "01110"],
  "7": ["11111", "00001", "00010", "00100", "01000", "01000", "01000"],
  "8": ["01110", "10001", "10001", "01110", "10001", "10001", "01110"],
  "9": ["01110", "10001", "10001", "01111", "00001", "00001", "01110"]
};

type DotMatrixTextProps = {
  text: string;
  dot?: number;
  gap?: number;
  color?: "bone" | "dim" | "red";
  className?: string;
  "aria-label"?: string;
  "aria-hidden"?: boolean;
  reverse?: boolean;
};

export default function DotMatrixText({
  text,
  dot = 7,
  gap = 5,
  color = "bone",
  className = "",
  "aria-label": ariaLabel,
  "aria-hidden": ariaHidden
}: DotMatrixTextProps) {
  const cells: Array<{ row: number; column: number }> = [];
  const normalized = text.toUpperCase();
  const glyphs = [...normalized].map((char) => FONT[char] ?? FONT[" "]);
  const columns = glyphs.length * 6 - 1;

  for (let row = 0; row < 7; row += 1) {
    let column = 0;
    glyphs.forEach((glyph, glyphIndex) => {
      glyph[row].split("").forEach((cell) => {
        if (cell === "1") {
          cells.push({ row, column });
        }
        column += 1;
      });
      if (glyphIndex < glyphs.length - 1) {
        column += 1;
      }
    });
  }

  const palette = {
    bone: "rgba(242, 231, 194, .96)",
    dim: "rgba(242, 231, 194, .46)",
    red: "rgba(224, 66, 49, .96)"
  };

  return (
    <span
      aria-label={ariaLabel ?? text}
      aria-hidden={ariaHidden}
      className={`inline-grid align-middle ${className}`}
      style={
        {
          gridTemplateColumns: `repeat(${columns}, ${dot}px)`,
          gridAutoRows: `${dot}px`,
          gap: `${gap}px`,
          "--matrix-on": palette[color]
        } as CSSProperties
      }
    >
      {cells.map((cell, index) => (
        <span
          aria-hidden
          className="rounded-full bg-[var(--matrix-on)]"
          key={index}
          style={{
            gridColumn: cell.column + 1,
            gridRow: cell.row + 1
          }}
        />
      ))}
    </span>
  );
}

export function DotMatrixMarquee({
  text,
  dot = 7,
  gap = 5,
  color = "bone",
  className = "",
  reverse = false
}: DotMatrixTextProps) {
  return (
    <span className={`block overflow-hidden ${className}`} aria-label={text}>
      <span
        className={`inline-flex min-w-max gap-14 pr-14 ${
          reverse
            ? "animate-[matrix-marquee-reverse_18s_linear_infinite]"
            : "animate-[matrix-marquee_18s_linear_infinite]"
        }`}
      >
        <DotMatrixText text={text} dot={dot} gap={gap} color={color} aria-label={text} />
        <DotMatrixText text={text} dot={dot} gap={gap} color={color} aria-hidden />
      </span>
    </span>
  );
}
