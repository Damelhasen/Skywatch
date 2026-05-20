export type DisplayState = "loading" | "aircraft" | "clear" | "missing-route" | "offline";

export type Aircraft = {
  id: string;
  callsign: string;
  flightNumber: string;
  airlineName: string;
  airlineCode: string;
  logoText: string;
  departure?: string;
  departureLabel?: string;
  destination?: string;
  destinationLabel?: string;
  aircraftType?: string;
  lat: number;
  lon: number;
  altitudeFt: number;
  speedKt: number;
  headingDeg: number;
  distanceNm?: number;
  bearingDeg?: number;
  direction?: string;
  routeMissing?: boolean;
  lastSeen: string;
};

export type TrackerSettings = {
  lat: number;
  lon: number;
  radiusNm: number;
  demoMode: boolean;
};

export type AircraftResponse = {
  state: DisplayState;
  settings: TrackerSettings;
  aircraft: Aircraft | null;
  candidates: Aircraft[];
  source: "adsb.lol" | "demo";
  generatedAt: string;
  error?: string;
};
