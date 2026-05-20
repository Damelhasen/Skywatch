export type AirlineBrand = {
  name: string;
  logo: string;
  colors: string[];
  pattern?: string[];
};

const maple = ["0011100", "0111110", "1101011", "1111111", "0111110", "0011100", "0001000"];
const chevron = ["1000001", "1100011", "0110110", "0011100", "0110110", "1100011", "1000001"];
const globe = ["1111111", "1001001", "1111111", "1001001", "1111111", "1001001", "1111111"];
const star = ["0001000", "0101010", "0011100", "1111111", "0011100", "0101010", "0001000"];
const wing = ["1000000", "1110000", "0111100", "0011111", "0001110", "0000110", "0000010"];
const roundel = ["0011100", "0111110", "1100011", "1100011", "0111110", "0011100", "0001000"];
const stripe = ["1111111", "1000000", "1111100", "1000000", "1111100", "1000000", "1111111"];
const tail = ["0001000", "0011100", "0111110", "1111111", "0011100", "0011100", "0011100"];
const crown = ["1010101", "1111111", "0111110", "0011100", "0011100", "0111110", "1111111"];

export const AIRLINE_BRANDS: Record<string, AirlineBrand> = {
  ACA: { name: "Air Canada", logo: "AC", colors: ["#F01428", "#F2E7C2"], pattern: maple },
  ROU: { name: "Air Canada Rouge", logo: "AR", colors: ["#B0163A", "#F01428", "#F2E7C2"], pattern: stripe },
  JZA: { name: "Jazz Aviation", logo: "JZ", colors: ["#E31B23", "#F2E7C2", "#1D1D1D"], pattern: maple },
  WJA: { name: "WestJet", logo: "WS", colors: ["#006F8F", "#00A6A3", "#7AC143"], pattern: chevron },
  WEN: { name: "WestJet Encore", logo: "WE", colors: ["#006F8F", "#00A6A3", "#7AC143"], pattern: chevron },
  POE: { name: "Porter", logo: "PD", colors: ["#0B1F33", "#BFA46A", "#F2E7C2"], pattern: roundel },
  TSC: { name: "Air Transat", logo: "TS", colors: ["#00B3F0", "#004B8D", "#F2E7C2"], pattern: star },
  FLE: { name: "Flair", logo: "F8", colors: ["#79BE20", "#4B2E83", "#F2E7C2"], pattern: stripe },
  SWG: { name: "Sunwing", logo: "WG", colors: ["#F6A800", "#E74B3C", "#F2E7C2"], pattern: roundel },
  AKT: { name: "Canadian North", logo: "5T", colors: ["#E1251B", "#111111", "#F2E7C2"], pattern: star },
  ANT: { name: "Air North", logo: "4N", colors: ["#ED1C24", "#003A70", "#F2E7C2"], pattern: wing },
  PVL: { name: "PAL Airlines", logo: "PB", colors: ["#0057A8", "#EF3340", "#F2E7C2"], pattern: wing },
  CAV: { name: "Calm Air", logo: "MO", colors: ["#005CAB", "#F2E7C2", "#E31B23"], pattern: roundel },
  BLS: { name: "Bearskin", logo: "JV", colors: ["#003A70", "#F2E7C2", "#BFA46A"], pattern: wing },
  PSC: { name: "Pascan", logo: "P6", colors: ["#005DAA", "#F2E7C2", "#7A7A7A"], pattern: chevron },
  KFA: { name: "Kelowna Flightcraft", logo: "FK", colors: ["#D71920", "#1E1E1E", "#F2E7C2"], pattern: wing },
  MPE: { name: "Canadian North", logo: "5T", colors: ["#E1251B", "#111111", "#F2E7C2"], pattern: star },
  AAL: { name: "American Airlines", logo: "AA", colors: ["#C8102E", "#0078D2", "#F2E7C2"], pattern: chevron },
  DAL: { name: "Delta Air Lines", logo: "DL", colors: ["#C8102E", "#003A70", "#F2E7C2"], pattern: tail },
  UAL: { name: "United Airlines", logo: "UA", colors: ["#005DAA", "#00A1DE", "#F2E7C2"], pattern: globe },
  SWA: { name: "Southwest", logo: "WN", colors: ["#304CB2", "#E31B23", "#FFBF27"], pattern: roundel },
  JBU: { name: "JetBlue", logo: "B6", colors: ["#003876", "#00A3E0", "#F2E7C2"], pattern: globe },
  ASA: { name: "Alaska Airlines", logo: "AS", colors: ["#01426A", "#6AAAE4", "#F2E7C2"], pattern: roundel },
  FFT: { name: "Frontier", logo: "F9", colors: ["#006747", "#A7D129", "#F2E7C2"], pattern: wing },
  NKS: { name: "Spirit", logo: "NK", colors: ["#F9E547", "#111111", "#F2E7C2"], pattern: stripe },
  SCX: { name: "Sun Country", logo: "SY", colors: ["#F58220", "#004B8D", "#F2E7C2"], pattern: star },
  HAL: { name: "Hawaiian", logo: "HA", colors: ["#4B116F", "#D7282F", "#F2E7C2"], pattern: roundel },
  VRD: { name: "Virgin America", logo: "VX", colors: ["#D71920", "#6D2077", "#F2E7C2"], pattern: chevron },
  MXY: { name: "Breeze", logo: "MX", colors: ["#84BD00", "#00A3E0", "#F2E7C2"], pattern: chevron },
  AAY: { name: "Allegiant", logo: "G4", colors: ["#005DAA", "#FFB81C", "#F2E7C2"], pattern: star },
  NJA: { name: "NetJets", logo: "NJ", colors: ["#111111", "#B7B7B7", "#F2E7C2"], pattern: wing },
  LXJ: { name: "Flexjet", logo: "LX", colors: ["#7A263A", "#BFA46A", "#F2E7C2"], pattern: wing },
  EJA: { name: "NetJets", logo: "EJ", colors: ["#111111", "#B7B7B7", "#F2E7C2"], pattern: wing },
  SKW: { name: "SkyWest", logo: "OO", colors: ["#003A70", "#C8102E", "#F2E7C2"], pattern: wing },
  RPA: { name: "Republic", logo: "YX", colors: ["#002F6C", "#A7A8AA", "#F2E7C2"], pattern: wing },
  ENY: { name: "Envoy", logo: "MQ", colors: ["#C8102E", "#0078D2", "#F2E7C2"], pattern: chevron },
  PDT: { name: "Piedmont", logo: "PT", colors: ["#C8102E", "#0078D2", "#F2E7C2"], pattern: chevron },
  JIA: { name: "PSA Airlines", logo: "OH", colors: ["#C8102E", "#0078D2", "#F2E7C2"], pattern: chevron },
  ASH: { name: "Mesa", logo: "YV", colors: ["#005DAA", "#00A1DE", "#F2E7C2"], pattern: globe },
  EDV: { name: "Endeavor", logo: "9E", colors: ["#C8102E", "#003A70", "#F2E7C2"], pattern: tail },
  QXE: { name: "Horizon", logo: "QX", colors: ["#01426A", "#6AAAE4", "#F2E7C2"], pattern: roundel },
  CFS: { name: "Contour", logo: "LF", colors: ["#1D428A", "#F2E7C2", "#76777A"], pattern: wing },
  SLH: { name: "Silver Airways", logo: "3M", colors: ["#A7A8AA", "#F2E7C2", "#005DAA"], pattern: wing },
  VOI: { name: "Volaris", logo: "Y4", colors: ["#6F2DBD", "#00A859", "#F2E7C2"], pattern: chevron },
  VIV: { name: "Viva Aerobus", logo: "VB", colors: ["#00A859", "#F2E7C2", "#E31B23"], pattern: stripe },
  AMX: { name: "Aeromexico", logo: "AM", colors: ["#002D72", "#C0C0C0", "#F2E7C2"], pattern: wing },
  WGN: { name: "Western Global", logo: "KD", colors: ["#005DAA", "#F2E7C2", "#A7A8AA"], pattern: globe },
  FDX: { name: "FedEx", logo: "FX", colors: ["#4D148C", "#FF6600", "#F2E7C2"], pattern: chevron },
  UPS: { name: "UPS", logo: "5X", colors: ["#351C15", "#FFB500", "#F2E7C2"], pattern: roundel },
  GTI: { name: "Atlas Air", logo: "5Y", colors: ["#005DAA", "#F2E7C2", "#A7A8AA"], pattern: globe },
  CKS: { name: "Kalitta Air", logo: "K4", colors: ["#C8102E", "#111111", "#F2E7C2"], pattern: wing },
  CJT: { name: "Cargojet", logo: "W8", colors: ["#E1251B", "#111111", "#F2E7C2"], pattern: stripe },
  ABX: { name: "ABX Air", logo: "GB", colors: ["#003A70", "#F2E7C2", "#A7A8AA"], pattern: wing },
  ATN: { name: "Air Transport Intl", logo: "8C", colors: ["#005DAA", "#C8102E", "#F2E7C2"], pattern: wing },
  PAC: { name: "Polar Air Cargo", logo: "PO", colors: ["#005DAA", "#D71920", "#F2E7C2"], pattern: globe },
  SOO: { name: "Southern Air", logo: "9S", colors: ["#005DAA", "#F2E7C2", "#A7A8AA"], pattern: wing },
  BAW: { name: "British Airways", logo: "BA", colors: ["#2E5C99", "#D71920", "#F2E7C2"], pattern: wing },
  AFR: { name: "Air France", logo: "AF", colors: ["#002157", "#ED2939", "#F2E7C2"], pattern: wing },
  DLH: { name: "Lufthansa", logo: "LH", colors: ["#05164D", "#FFCC00", "#F2E7C2"], pattern: wing },
  KLM: { name: "KLM", logo: "KL", colors: ["#00A1DE", "#F2E7C2", "#003A70"], pattern: crown },
  UAE: { name: "Emirates", logo: "EK", colors: ["#D71920", "#007A3D", "#F2E7C2"], pattern: wing },
  QTR: { name: "Qatar Airways", logo: "QR", colors: ["#5C0632", "#A7A8AA", "#F2E7C2"], pattern: roundel },
  THY: { name: "Turkish", logo: "TK", colors: ["#C70A0C", "#F2E7C2", "#111111"], pattern: wing },
  CPA: { name: "Cathay Pacific", logo: "CX", colors: ["#006564", "#A7A8AA", "#F2E7C2"], pattern: wing },
  ANA: { name: "All Nippon", logo: "NH", colors: ["#0033A0", "#F2E7C2", "#00A3E0"], pattern: stripe },
  JAL: { name: "Japan Airlines", logo: "JL", colors: ["#E60012", "#F2E7C2", "#111111"], pattern: roundel },
  KAL: { name: "Korean Air", logo: "KE", colors: ["#00A3E0", "#C8102E", "#F2E7C2"], pattern: roundel },
  ICE: { name: "Icelandair", logo: "FI", colors: ["#003A70", "#FFB81C", "#F2E7C2"], pattern: star },
  FIN: { name: "Finnair", logo: "AY", colors: ["#003580", "#F2E7C2", "#A7A8AA"], pattern: wing },
  ACA_ALT: { name: "Air Canada", logo: "AC", colors: ["#F01428", "#F2E7C2"], pattern: maple }
};

export function airlineBrandFromCallsign(callsign: string) {
  const code = callsign.slice(0, 3).toUpperCase();
  return {
    code,
    ...(AIRLINE_BRANDS[code] ?? {
      name: "Tracked Aircraft",
      logo: code.slice(0, 2),
      colors: colorsFromCode(code),
      pattern: hashedPattern(code)
    })
  };
}

export function colorsFromCode(code: string) {
  const palettes = [
    ["#F2E7C2", "#8C877A", "#44403A"],
    ["#005DAA", "#00A3E0", "#F2E7C2"],
    ["#C8102E", "#003A70", "#F2E7C2"],
    ["#006747", "#A7D129", "#F2E7C2"],
    ["#5C0632", "#BFA46A", "#F2E7C2"]
  ];
  const seed = [...code].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return palettes[seed % palettes.length];
}

export function hashedPattern(code: string) {
  const seed = [...code].reduce((sum, char) => sum + char.charCodeAt(0), 17);
  const patterns = [chevron, wing, roundel, stripe, star, globe, tail];
  return patterns[seed % patterns.length];
}
