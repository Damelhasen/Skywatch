import { calculateBearing, calculateDistance, cardinalDirection } from "@/lib/geo";
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

const AIRLINES: Record<string, { name: string; logo: string }> = {
  // Canadian passenger and regional carriers commonly visible in Canadian airspace.
  ACA: { name: "Air Canada", logo: "AC" },
  ROU: { name: "Air Canada Rouge", logo: "AR" },
  JZA: { name: "Jazz Aviation", logo: "JZ" },
  WJA: { name: "WestJet", logo: "WS" },
  WEN: { name: "WestJet Encore", logo: "WE" },
  POE: { name: "Porter", logo: "PD" },
  TSC: { name: "Air Transat", logo: "TS" },
  FLE: { name: "Flair", logo: "F8" },
  SWG: { name: "Sunwing", logo: "WG" },
  AKT: { name: "Canadian North", logo: "5T" },
  ANT: { name: "Air North", logo: "4N" },
  PVL: { name: "PAL Airlines", logo: "PB" },
  CAV: { name: "Calm Air", logo: "MO" },
  BLS: { name: "Bearskin", logo: "JV" },
  PSC: { name: "Pascan", logo: "P6" },
  KFA: { name: "Kelowna Flightcraft", logo: "FK" },
  MPE: { name: "Canadian North", logo: "5T" },
  // Frequent cross-border and international operators over Canada.
  AAL: { name: "American Airlines", logo: "AA" },
  DAL: { name: "Delta Air Lines", logo: "DL" },
  UAL: { name: "United Airlines", logo: "UA" },
  SWA: { name: "Southwest", logo: "WN" },
  JBU: { name: "JetBlue", logo: "B6" },
  ASA: { name: "Alaska Airlines", logo: "AS" },
  FFT: { name: "Frontier", logo: "F9" },
  BAW: { name: "British Airways", logo: "BA" },
  AFR: { name: "Air France", logo: "AF" },
  DLH: { name: "Lufthansa", logo: "LH" },
  KLM: { name: "KLM", logo: "KL" },
  UAE: { name: "Emirates", logo: "EK" },
  QTR: { name: "Qatar Airways", logo: "QR" },
  THY: { name: "Turkish", logo: "TK" },
  CPA: { name: "Cathay Pacific", logo: "CX" },
  ANA: { name: "All Nippon", logo: "NH" },
  JAL: { name: "Japan Airlines", logo: "JL" },
  KAL: { name: "Korean Air", logo: "KE" },
  ICE: { name: "Icelandair", logo: "FI" },
  FIN: { name: "Finnair", logo: "AY" }
};

function normalizeCallsign(value?: string) {
  return value?.trim().replace(/\s+/g, "") || "UNKNOWN";
}

function airlineFromCallsign(callsign: string) {
  const code = callsign.slice(0, 3).toUpperCase();
  return {
    code,
    name: AIRLINES[code]?.name ?? "Tracked Aircraft",
    logo: AIRLINES[code]?.logo ?? code.slice(0, 2)
  };
}

function routeFromCallsign(callsign: string) {
  const routes: Record<string, [string, string]> = {
    ACA: ["CYYZ", "CYUL"],
    ROU: ["CYYZ", "CUN"],
    JZA: ["CYUL", "CYQB"],
    AAL: ["KORD", "KLGA"],
    DAL: ["KDTW", "KJFK"],
    UAL: ["KEWR", "KORD"],
    WJA: ["CYYC", "CYYZ"],
    WEN: ["CYYC", "CYXE"],
    POE: ["CYTZ", "CYOW"],
    TSC: ["CYYZ", "LPPT"],
    FLE: ["CYYZ", "CYVR"],
    SWG: ["CYYZ", "MMUN"],
    AKT: ["CYOW", "CYFB"],
    ANT: ["CYVR", "CYXY"],
    PVL: ["CYYT", "CYHZ"],
    CAV: ["CYWG", "CYTH"],
    BLS: ["CYQT", "CYTS"],
    BAW: ["EGLL", "CYYZ"],
    AFR: ["LFPG", "CYYZ"],
    DLH: ["EDDF", "CYYZ"],
    SWA: ["KBWI", "KMDW"],
    JBU: ["KJFK", "KBOS"]
  };
  return routes[callsign.slice(0, 3).toUpperCase()];
}

function mapAircraft(raw: AdsbLolAircraft, settings: TrackerSettings): Aircraft | null {
  if (typeof raw.lat !== "number" || typeof raw.lon !== "number") {
    return null;
  }

  const callsign = normalizeCallsign(raw.flight ?? raw.r);
  const airline = airlineFromCallsign(callsign);
  const distanceNm = calculateDistance(settings.lat, settings.lon, raw.lat, raw.lon);
  const bearingDeg = calculateBearing(settings.lat, settings.lon, raw.lat, raw.lon);
  const route = routeFromCallsign(callsign);

  return {
    id: raw.hex ?? callsign,
    callsign,
    flightNumber: callsign,
    airlineName: airline.name,
    airlineCode: airline.code,
    logoText: airline.logo,
    departure: route?.[0],
    destination: route?.[1],
    aircraftType: raw.t || "TYPE UNK",
    lat: raw.lat,
    lon: raw.lon,
    altitudeFt: raw.alt_baro === "ground" || raw.alt_baro === undefined ? 0 : raw.alt_baro,
    speedKt: raw.gs ?? 0,
    headingDeg: raw.track ?? 0,
    distanceNm,
    bearingDeg,
    direction: cardinalDirection(bearingDeg),
    routeMissing: !route,
    lastSeen: new Date(Date.now() - (raw.seen ?? 0) * 1000).toISOString()
  };
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
  return (payload.ac ?? [])
    .map((aircraft) => mapAircraft(aircraft, settings))
    .filter((aircraft): aircraft is Aircraft => aircraft !== null)
    .filter((aircraft) => (aircraft.distanceNm ?? Infinity) <= settings.radiusNm);
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
      destination: "KLGA",
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
      destination: "CYYZ",
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
