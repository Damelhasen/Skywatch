export type AirportPlace = {
  city: string;
  country: string;
};

export const AIRPORT_PLACES: Record<string, AirportPlace> = {
  CYYZ: { city: "TORONTO", country: "CANADA" },
  CYTZ: { city: "TORONTO", country: "CANADA" },
  CYUL: { city: "MONTREAL", country: "CANADA" },
  CYOW: { city: "OTTAWA", country: "CANADA" },
  CYVR: { city: "VANCOUVER", country: "CANADA" },
  CYYC: { city: "CALGARY", country: "CANADA" },
  CYEG: { city: "EDMONTON", country: "CANADA" },
  CYWG: { city: "WINNIPEG", country: "CANADA" },
  CYHZ: { city: "HALIFAX", country: "CANADA" },
  CYYT: { city: "ST JOHNS", country: "CANADA" },
  CYQB: { city: "QUEBEC", country: "CANADA" },
  CYXE: { city: "SASKATOON", country: "CANADA" },
  CYQR: { city: "REGINA", country: "CANADA" },
  CYQT: { city: "THUNDER BAY", country: "CANADA" },
  CYTS: { city: "TIMMINS", country: "CANADA" },
  CYTH: { city: "THOMPSON", country: "CANADA" },
  CYFB: { city: "IQALUIT", country: "CANADA" },
  CYXY: { city: "WHITEHORSE", country: "CANADA" },
  KJFK: { city: "NEW YORK", country: "USA" },
  KLGA: { city: "NEW YORK", country: "USA" },
  KEWR: { city: "NEWARK", country: "USA" },
  KORD: { city: "CHICAGO", country: "USA" },
  KDTW: { city: "DETROIT", country: "USA" },
  KBOS: { city: "BOSTON", country: "USA" },
  KBWI: { city: "BALTIMORE", country: "USA" },
  KMDW: { city: "CHICAGO", country: "USA" },
  CUN: { city: "CANCUN", country: "MEXICO" },
  MMUN: { city: "CANCUN", country: "MEXICO" },
  LPPT: { city: "LISBON", country: "PORTUGAL" },
  EGLL: { city: "LONDON", country: "UK" },
  LFPG: { city: "PARIS", country: "FRANCE" },
  EDDF: { city: "FRANKFURT", country: "GERMANY" }
};

export function airportPlaceLabel(code?: string) {
  if (!code) return "UNKNOWN";
  const place = AIRPORT_PLACES[code.toUpperCase()];
  if (!place) return "UNKNOWN";
  return `${place.city} ${place.country}`;
}
