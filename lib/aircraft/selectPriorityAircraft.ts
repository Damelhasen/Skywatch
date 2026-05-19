import type { Aircraft } from "@/lib/types";
import { headingRelationToUser } from "@/lib/geo";

type SelectOptions = {
  radiusNm: number;
};

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

export function scoreAircraft(aircraft: Aircraft, { radiusNm }: SelectOptions) {
  const distance = aircraft.distanceNm ?? radiusNm;
  const distanceScore = clamp(1 - distance / radiusNm);
  const altitudeSweetSpot = 1 - Math.min(Math.abs(aircraft.altitudeFt - 9000) / 26000, 1);
  const headingScore =
    aircraft.bearingDeg === undefined ? 0.45 : headingRelationToUser(aircraft.headingDeg, aircraft.bearingDeg);
  const visibleScore = clamp((aircraft.speedKt - 80) / 420) * 0.45 + clamp(aircraft.altitudeFt / 12000) * 0.55;
  const routeScore = aircraft.routeMissing ? 0.34 : 1;
  const commercialScore = /^[A-Z]{3}\d+/.test(aircraft.callsign) ? 1 : 0.72;

  return (
    (distanceScore * 0.5 + altitudeSweetSpot * 0.18 + headingScore * 0.2 + visibleScore * 0.12) *
    routeScore *
    commercialScore
  );
}

export function selectPriorityAircraft(aircraft: Aircraft[], options: SelectOptions) {
  const nearby = aircraft.filter((candidate) => (candidate.distanceNm ?? Infinity) <= options.radiusNm);
  const filed = nearby.filter((candidate) => !candidate.routeMissing);
  return (filed.length ? filed : nearby).sort((a, b) => scoreAircraft(b, options) - scoreAircraft(a, options))[0] ?? null;
}
