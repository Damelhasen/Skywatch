"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import DotMatrixText, { DotMatrixMarquee } from "@/components/DotMatrixText";
import PlaneAnimation from "@/components/PlaneAnimation";
import { airportPlaceLabel } from "@/lib/airports";
import type { Aircraft, DisplayState } from "@/lib/types";

type AircraftCardProps = {
  aircraft: Aircraft | null;
  candidates: Aircraft[];
  state: DisplayState;
};

function formatNumber(value?: number, suffix = "") {
  if (value === undefined || !Number.isFinite(value)) return "--";
  return `${Math.round(value)}${suffix}`;
}

export default function AircraftCard({ aircraft, candidates, state }: AircraftCardProps) {
  const airline = aircraft?.airlineName ?? "SKYTRACKER";
  const flight = aircraft?.flightNumber ?? "NO TRAFFIC";
  const headline = aircraft ? `${airline} ${flight}` : "SKYTRACKER";
  const from = aircraft?.departure ?? "----";
  const to = aircraft?.destination ?? (aircraft ? "UNFILED" : "----");
  const clear = !aircraft;

  return (
    <div className="sky-board-grid grid h-full grid-rows-[auto_auto_minmax(112px,1fr)_auto_auto_auto] gap-3 p-3 sm:gap-4 sm:p-4 md:gap-5 md:p-5 xl:gap-6 xl:p-9">
      <div className="flex items-center gap-3 overflow-hidden md:gap-5">
        <AirlineMark code={aircraft?.airlineCode} label={aircraft?.logoText ?? "ST"} />
        <div className="min-w-0 flex-1 overflow-hidden">
          <Scale>
            <DotMatrixMarquee text={headline} color="bone" />
          </Scale>
        </div>
      </div>

      <DotRule />

      <div className="grid min-h-0 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-0">
        <RouteBlock align="left" code={from} label={airportPlaceLabel(from)} />
        <PlaneAnimation aircraft={aircraft} clear={clear} />
        <RouteBlock align="right" code={to} label={airportPlaceLabel(to)} />
      </div>

      <DotRule />

      <div className="grid grid-cols-2 gap-x-3 gap-y-3 md:grid-cols-5 md:gap-x-4 xl:gap-y-5">
        <Data label="TYPE" value={aircraft?.aircraftType ?? "RADAR"} compact />
        <Data label="ALTITUDE" value={aircraft ? formatNumber(aircraft.altitudeFt, "FT") : "CLEAR"} compact />
        <Data label="SPEED" value={aircraft ? formatNumber(aircraft.speedKt, "KT") : "--"} compact />
        <Data label="DISTANCE" value={aircraft ? `${aircraft.distanceNm?.toFixed(1)}NM` : "--"} />
        <Data label="DIRECTION" value={aircraft ? `${aircraft.direction}>${headingWord(aircraft.headingDeg)}` : "SWEEP"} />
      </div>

      <DotRule />

      <OverheadHistory candidates={candidates} state={state} />
    </div>
  );
}

function headingWord(heading: number) {
  if (heading >= 22.5 && heading < 67.5) return "NE";
  if (heading >= 67.5 && heading < 112.5) return "E";
  if (heading >= 112.5 && heading < 157.5) return "SE";
  if (heading >= 157.5 && heading < 202.5) return "S";
  if (heading >= 202.5 && heading < 247.5) return "SW";
  if (heading >= 247.5 && heading < 292.5) return "W";
  if (heading >= 292.5 && heading < 337.5) return "NW";
  return "N";
}

const MARKS: Record<string, { colors: string[]; pattern: string[] }> = {
  ACA: {
    colors: ["#F01428", "#F2E7C2"],
    pattern: ["0011100", "0111110", "1101011", "1111111", "0111110", "0011100", "0001000"]
  },
  ROU: {
    colors: ["#B0163A", "#F01428", "#F2E7C2"],
    pattern: ["1110001", "1110011", "0010110", "0011100", "0110100", "1100111", "1000111"]
  },
  WJA: {
    colors: ["#006F8F", "#00A6A3", "#7AC143"],
    pattern: ["1100011", "1100011", "0110110", "0111110", "0011100", "0011100", "0001000"]
  },
  WEN: {
    colors: ["#006F8F", "#00A6A3", "#7AC143"],
    pattern: ["1000001", "1100011", "0110110", "0011100", "0110110", "1100011", "1000001"]
  },
  POE: {
    colors: ["#0B1F33", "#BFA46A", "#F2E7C2"],
    pattern: ["0011100", "0111110", "1100011", "1100011", "0111110", "0011100", "0001000"]
  },
  TSC: {
    colors: ["#00B3F0", "#004B8D", "#F2E7C2"],
    pattern: ["0001000", "0101010", "0011100", "1111111", "0011100", "0101010", "0001000"]
  },
  FLE: {
    colors: ["#79BE20", "#4B2E83", "#F2E7C2"],
    pattern: ["1111111", "1000000", "1111100", "1000000", "1000000", "1000000", "1000000"]
  },
  SWG: {
    colors: ["#F6A800", "#E74B3C", "#F2E7C2"],
    pattern: ["0011100", "0111110", "1110111", "1100011", "1110111", "0111110", "0011100"]
  },
  AAL: {
    colors: ["#C8102E", "#0078D2", "#F2E7C2"],
    pattern: ["1000001", "1100011", "0110110", "0011100", "0110110", "1100011", "1000001"]
  },
  DAL: {
    colors: ["#C8102E", "#003A70", "#F2E7C2"],
    pattern: ["0001000", "0011100", "0111110", "1111111", "0011100", "0011100", "0011100"]
  },
  UAL: {
    colors: ["#005DAA", "#00A1DE", "#F2E7C2"],
    pattern: ["1111111", "1001001", "1111111", "1001001", "1111111", "1001001", "1111111"]
  },
  BAW: {
    colors: ["#2E5C99", "#D71920", "#F2E7C2"],
    pattern: ["1000000", "1110000", "0111100", "0011111", "0001110", "0000110", "0000010"]
  },
  AFR: {
    colors: ["#002157", "#ED2939", "#F2E7C2"],
    pattern: ["1000100", "1001100", "1011100", "1111100", "1011100", "1001100", "1000100"]
  },
  DLH: {
    colors: ["#05164D", "#FFCC00", "#F2E7C2"],
    pattern: ["0011110", "0110000", "1100110", "1101100", "1100000", "0110000", "0011110"]
  }
};

function AirlineMark({ code, label }: { code?: string; label: string }) {
  const mark = MARKS[code ?? ""] ?? {
    colors: ["#F2E7C2", "#8C877A", "#F2E7C2"],
    pattern: ["1111111", "1000001", "1011101", "1010101", "1011101", "1000001", "1111111"]
  };

  return (
    <div className="grid h-16 w-16 shrink-0 place-items-center rounded-full border border-bone/10 sm:h-20 sm:w-20 md:h-24 md:w-24 xl:h-32 xl:w-32" aria-label={label}>
      <div
        className="grid"
        style={{ gridTemplateColumns: "repeat(7, min(8px, 1.1vmin))", gridAutoRows: "min(8px, 1.1vmin)", gap: "min(5px, .68vmin)" }}
      >
        {mark.pattern.flatMap((row, rowIndex) =>
          row.split("").flatMap((cell, columnIndex) => {
            if (cell !== "1") return [];
            const color = mark.colors[(rowIndex + columnIndex) % mark.colors.length];
            return [
              <span
                aria-hidden
                className="rounded-full"
                key={`${rowIndex}-${columnIndex}`}
                style={{ background: color, gridColumn: columnIndex + 1, gridRow: rowIndex + 1 }}
              />
            ];
          })
        )}
      </div>
    </div>
  );
}

function RouteBlock({ code, align, label }: { code: string; align: "left" | "right"; label: string }) {
  const codeScale = code.length > 4 ? "scale-[.62] sm:scale-[.74] md:scale-[.88]" : "scale-[.72] sm:scale-[.82] md:scale-100";

  return (
    <div
      className={`grid w-[clamp(140px,24vw,360px)] overflow-hidden ${
        align === "right" ? "justify-items-end pr-2 text-right md:pr-3" : "justify-items-start pl-2 md:pl-3"
      }`}
    >
      <Scale align={align} className={codeScale}>
        <DotMatrixText text={code.slice(0, 6)} dot={5} gap={4} color="bone" />
      </Scale>
      <div className="mt-1 w-full max-w-full overflow-hidden md:mt-3">
        {label.length > 10 ? (
          <DotMatrixMarquee text={label} dot={3} gap={2} color="dim" reverse={align === "right"} />
        ) : (
          <DotMatrixText text={label} dot={3} gap={2} color="dim" />
        )}
      </div>
    </div>
  );
}

function Data({ label, value, compact = false }: { label: string; value: string; compact?: boolean }) {
  const shouldScroll = value.length > 10;
  const dot = compact ? 3 : 4;
  const gap = compact ? 2 : 3;

  return (
    <div className="min-w-0 overflow-hidden border-l border-dotted border-bone/25 pl-2 first:border-l-0 first:pl-0 md:pl-4">
      <DotMatrixText text={label.slice(0, 9)} dot={3} gap={2} color="dim" />
      <div className="mt-2 overflow-hidden md:mt-4">
        {shouldScroll ? (
          <DotMatrixMarquee text={value} dot={dot} gap={gap} color="bone" />
        ) : (
          <DotMatrixText text={value} dot={dot} gap={gap} color="bone" />
        )}
      </div>
    </div>
  );
}

function DotRule() {
  return (
    <div className="flex justify-between" aria-hidden>
      {Array.from({ length: 88 }, (_, index) => (
        <span className="h-[clamp(4px,.72vmin,7px)] w-[clamp(4px,.72vmin,7px)] rounded-full bg-bone/85" key={index} />
      ))}
    </div>
  );
}

function OverheadHistory({ candidates, state }: { candidates: Aircraft[]; state: DisplayState }) {
  const rows = candidates
    .filter((candidate) => (candidate.distanceNm ?? Infinity) <= 50)
    .slice(0, 4);
  const fallback = state === "offline" ? "SIGNAL LOST" : state === "loading" ? "SCANNING" : "NO OVERHEAD LOG";

  return (
    <div className="grid gap-2 overflow-hidden md:gap-3">
      <div className="flex items-center justify-between gap-4">
        <DotMatrixText text="OVERHEAD LOG" dot={4} gap={3} color="dim" />
        <DotMatrixText text={rows.length ? "LIVE" : fallback} dot={4} gap={3} color={state === "offline" ? "red" : "dim"} />
      </div>
      <div className="grid grid-cols-2 gap-x-3 gap-y-2 lg:grid-cols-4 lg:gap-x-5 lg:gap-y-3">
        {(rows.length ? rows : [null, null, null, null]).map((candidate, index) => (
          <HistoryCell aircraft={candidate} key={candidate?.id ?? index} />
        ))}
      </div>
    </div>
  );
}

function HistoryCell({ aircraft }: { aircraft: Aircraft | null }) {
  const label = aircraft?.flightNumber ?? "----";
  const detail = aircraft ? `${aircraft.distanceNm?.toFixed(0)}NM ${aircraft.direction ?? ""}` : "--";

  return (
    <div className="min-w-0 overflow-hidden border-l border-dotted border-bone/20 pl-2 first:border-l-0 first:pl-0 md:pl-4">
      <DotMatrixText text={label.slice(0, 8)} dot={4} gap={3} color="bone" />
      <div className="mt-2">
        <DotMatrixText text={detail.slice(0, 8)} dot={3} gap={2} color="dim" />
      </div>
    </div>
  );
}

function Scale({
  children,
  align = "left",
  className = "scale-[.72] sm:scale-[.82] md:scale-100"
}: {
  children: ReactNode;
  align?: "left" | "right";
  className?: string;
}) {
  return (
    <div className={`${align === "right" ? "origin-right" : "origin-left"} ${className}`}>
      {children}
    </div>
  );
}
