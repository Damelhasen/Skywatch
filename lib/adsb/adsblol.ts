import { calculateBearing, calculateDistance, cardinalDirection } from "@/lib/geo";
import { airlineBrandFromCallsign } from "@/lib/airlineBranding";
import type { Aircraft, TrackerSettings } from "@/lib/types";

type AdsbLolAircraft = {
  hex?: string;
  flight?: string;
  r?: string;
  t?: string;
  lat?: number;
  lon?: number;
  alt_baro?: number | "ground";
  gs?: number;
  track?: number;
  seen?: number;
};

type AdsbLolResponse = {
  ac?: AdsbLolAircraft[];
  msg?: string;
};

type AdsbDbRouteResponse = {
  response?: {
    flightroute?: {
      origin?: {
        icao_code?: string;
        municipality?: string;
        country_name?: string;
      };
      destination?: {
        icao_code?: string;
        municipality?: string;
        country_name?: string;
      };
    };
  };
};

type FlightRoute = {
  departure: string;
  departureLabel?: string;
  destination: string;
  destinationLabel?: string;
};

const routeCache = new Map<string, { route: FlightRoute | null; expiresAt: number }>();
const ROUTE_CACHE_MS = 6 * 60 * 60 * 1000;
const ROUTE_MISS_CACHE_MS = 30 * 60 * 1000;
const MAX_ROUTE_LOOKUPS = 40;

function normalizeCallsign(value?: string) {
  return value?.trim().replace(/\s+/g, "") || "UNKNOWN";
}

function airlineFromCallsign(callsign: string) {
  const brand = airlineBrandFromCallsign(callsign);
  return { code: brand.code, name: brand.name, logo: brand.logo };
}

function isCommercialCallsign(callsign: string) {
  return /^[A-Z]{3}\d+[A-Z]?$/.test(callsign);
}

function airportLabel(airport?: { municipality?: string; country_name?: string }) {
  const city = airport?.municipality?.trim();
  const country = airport?.country_name?.trim();
  if (!city || !country) return undefined;
  const normalizedCountry =
    country.toLowerCase() === "united states"
      ? "USA"
      : country.toLowerCase() === "united kingdom"
        ? "UK"
        : country.toUpperCase();
  return `${city} ${normalizedCountry}`.toUpperCase();
}

async function fetchRouteForCallsign(callsign: string): Promise<FlightRoute | null> {
  if (!isCommercialCallsign(callsign)) {
    return null;
  }

  const cached = routeCache.get(callsign);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.route;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 2500);
  const baseUrl = process.env.ADSBDB_BASE_URL ?? "https://api.adsbdb.com/v0";

  try {
    const response = await fetch(`${baseUrl}/callsign/${encodeURIComponent(callsign)}`, {
      headers: { accept: "application/json" },
      signal: controller.signal,
      next: { revalidate: 60 * 60 }
    });

    if (!response.ok) {
      routeCache.set(callsign, { route: null, expiresAt: Date.now() + ROUTE_MISS_CACHE_MS });
      return null;
    }

    const payload = (await response.json()) as AdsbDbRouteResponse;
    const origin = payload.response?.flightroute?.origin;
    const arrival = payload.response?.flightroute?.destination;
    const departure = origin?.icao_code?.trim().toUpperCase();
    const destination = arrival?.icao_code?.trim().toUpperCase();
    const route =
      departure && destination
        ? {
            departure,
            departureLabel: airportLabel(origin),
            destination,
            destinationLabel: airportLabel(arrival)
          }
        : null;

    routeCache.set(callsign, {
      route,
      expiresAt: Date.now() + (route ? ROUTE_CACHE_MS : ROUTE_MISS_CACHE_MS)
    });

    return route;
  } catch {
    return cached?.route ?? null;
  } finally {
    clearTimeout(timeout);
  }
}

function mapAircraft(raw: AdsbLolAircraft, settings: TrackerSettings): Aircraft | null {
  if (typeof raw.lat !== "number" || typeof raw.lon !== "number") {
    return null;
  }

  const callsign = normalizeCallsign(raw.flight ?? raw.r);
  const airline = airlineFromCallsign(callsign);
  const distanceNm = calculateDistance(settings.lat, settings.lon, raw.lat, raw.lon);
  const bearingDeg = calculateBearing(settings.lat, settings.lon, raw.lat, raw.lon);

  return {
    id: raw.hex ?? callsign,
    callsign,
    flightNumber: callsign,
    airlineName: airline.name,
    airlineCode: airline.code,
    logoText: airline.logo,
    aircraftType: raw.t || "TYPE UNK",
    lat: raw.lat,
    lon: raw.lon,
    altitudeFt: raw.alt_baro === "ground" || raw.alt_baro === undefined ? 0 : raw.alt_baro,
    speedKt: raw.gs ?? 0,
    headingDeg: raw.track ?? 0,
    distanceNm,
    bearingDeg,
    direction: cardinalDirection(bearingDeg),
    routeMissing: true,
    lastSeen: new Date(Date.now() - (raw.seen ?? 0) * 1000).toISOString()
  };
}

async function enrichRoutes(aircraft: Aircraft[]) {
  const routeCandidates = [...aircraft]
    .filter((candidate) => isCommercialCallsign(candidate.callsign))
    .sort((a, b) => (a.distanceNm ?? Infinity) - (b.distanceNm ?? Infinity))
    .slice(0, MAX_ROUTE_LOOKUPS);

  await Promise.all(
    routeCandidates.map(async (candidate) => {
      const route = await fetchRouteForCallsign(candidate.callsign);
      if (!route) return;
      candidate.departure = route.departure;
      candidate.departureLabel = route.departureLabel;
      candidate.destination = route.destination;
      candidate.destinationLabel = route.destinationLabel;
      candidate.routeMissing = false;
    })
  );
}

export async function fetchNearbyAircraft(settings: TrackerSettings): Promise<Aircraft[]> {
  if (settings.demoMode || process.env.SKYTRACKER_DEMO_MODE === "true") {
    return getDemoAircraft(settings);
  }

  const baseUrl = process.env.ADSBLOL_BASE_URL ?? "https://api.adsb.lol/v2";
  const url = `${baseUrl}/lat/${settings.lat}/lon/${settings.lon}/dist/${settings.radiusNm}`;
  const response = await fetch(url, {
    headers: { accept: "application/json" },
    next: { revalidate: 0 }
  });

  if (!response.ok) {
    throw new Error(`ADSB.lol returned ${response.status}`);
  }

  const payload = (await response.json()) as AdsbLolResponse;
  const aircraft = (payload.ac ?? [])
    .map((aircraft) => mapAircraft(aircraft, settings))
    .filter((aircraft): aircraft is Aircraft => aircraft !== null)
    .filter((aircraft) => (aircraft.distanceNm ?? Infinity) <= settings.radiusNm);

  await enrichRoutes(aircraft);
  return aircraft;
}

export function getDemoAircraft(settings: TrackerSettings): Aircraft[] {
  const now = Date.now();
  const phase = (now / 1000) % 120;
  const sweep = (phase / 120) * Math.PI * 2;
  const nearLat = settings.lat + Math.sin(sweep) * 0.08;
  const nearLon = settings.lon + Math.cos(sweep * 0.82) * 0.13;
  const farLat = settings.lat + Math.sin(sweep + 2.1) * 0.22;
  const farLon = settings.lon + Math.cos(sweep + 1.4) * 0.25;

  const demo: Array<Omit<Aircraft, "distanceNm" | "bearingDeg" | "direction" | "lastSeen">> = [
    {
      id: "demo-aca728",
      callsign: "ACA728",
      flightNumber: "AC728",
      airlineName: "Air Canada",
      airlineCode: "ACA",
      logoText: "AC",
      departure: "CYYZ",
      departureLabel: "TORONTO CANADA",
      destination: "KLGA",
      destinationLabel: "NEW YORK USA",
      aircraftType: "A220-300",
      lat: nearLat,
      lon: nearLon,
      altitudeFt: 8400 + Math.round(Math.sin(sweep) * 900),
      speedKt: 292,
      headingDeg: (78 + phase * 1.8) % 360,
      routeMissing: false
    },
    {
      id: "demo-wja410",
      callsign: "WJA410",
      flightNumber: "WS410",
      airlineName: "WestJet",
      airlineCode: "WJA",
      logoText: "WS",
      departure: "CYUL",
      departureLabel: "MONTREAL CANADA",
      destination: "CYYZ",
      destinationLabel: "TORONTO CANADA",
      aircraftType: "B737 MAX 8",
      lat: farLat,
      lon: farLon,
      altitudeFt: 18600,
      speedKt: 412,
      headingDeg: (226 + phase) % 360,
      routeMissing: false
    },
    {
      id: "demo-unk19",
      callsign: "N817QS",
      flightNumber: "N817QS",
      airlineName: "Private Flight",
      airlineCode: "N",
      logoText: "NQ",
      aircraftType: "C680",
      lat: settings.lat - 0.16,
      lon: settings.lon + 0.05,
      altitudeFt: 5200,
      speedKt: 238,
      headingDeg: 14,
      routeMissing: true
    }
  ];

  return demo.map((aircraft) => {
    const distanceNm = calculateDistance(settings.lat, settings.lon, aircraft.lat, aircraft.lon);
    const bearingDeg = calculateBearing(settings.lat, settings.lon, aircraft.lat, aircraft.lon);
    return {
      ...aircraft,
      distanceNm,
      bearingDeg,
      direction: cardinalDirection(bearingDeg),
      lastSeen: new Date().toISOString()
    };
  });
}
