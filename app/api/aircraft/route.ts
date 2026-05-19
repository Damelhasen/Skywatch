import { NextRequest, NextResponse } from "next/server";
import { fetchNearbyAircraft } from "@/lib/adsb/adsblol";
import { selectPriorityAircraft } from "@/lib/aircraft/selectPriorityAircraft";
import type { AircraftResponse, TrackerSettings } from "@/lib/types";

export const dynamic = "force-dynamic";

function numberParam(request: NextRequest, key: string, fallback: number) {
  const value = Number(request.nextUrl.searchParams.get(key));
  return Number.isFinite(value) ? value : fallback;
}

export async function GET(request: NextRequest) {
  const fixedLat = Number(process.env.SKYTRACKER_DEFAULT_LAT ?? 42.77361);
  const fixedLon = Number(process.env.SKYTRACKER_DEFAULT_LON ?? -81.18038);
  const settings: TrackerSettings = {
    lat: fixedLat,
    lon: fixedLon,
    radiusNm: numberParam(request, "radiusNm", Number(process.env.SKYTRACKER_DEFAULT_RADIUS_NM ?? 35)),
    demoMode:
      request.nextUrl.searchParams.get("demo") === "true" ||
      process.env.SKYTRACKER_DEMO_MODE === "true"
  };

  try {
    const aircraft = await fetchNearbyAircraft(settings);
    const priority = selectPriorityAircraft(aircraft, { radiusNm: settings.radiusNm });
    const payload: AircraftResponse = {
      state: priority ? (priority.routeMissing ? "missing-route" : "aircraft") : "clear",
      settings,
      aircraft: priority,
      candidates: aircraft,
      source: settings.demoMode ? "demo" : "adsb.lol",
      generatedAt: new Date().toISOString()
    };

    return NextResponse.json(payload, {
      headers: {
        "Cache-Control": "no-store"
      }
    });
  } catch (error) {
    const payload: AircraftResponse = {
      state: "offline",
      settings,
      aircraft: null,
      candidates: [],
      source: settings.demoMode ? "demo" : "adsb.lol",
      generatedAt: new Date().toISOString(),
      error: error instanceof Error ? error.message : "Unknown ADSB provider failure"
    };

    return NextResponse.json(payload, { status: 502 });
  }
}
