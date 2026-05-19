"use client";

import { Save } from "lucide-react";
import { useEffect, useState } from "react";
import type { TrackerSettings } from "@/lib/types";

const defaults: TrackerSettings = {
  lat: 42.77361,
  lon: -81.18038,
  radiusNm: 35,
  demoMode: false
};

export function readSettings(): TrackerSettings {
  if (typeof window === "undefined") return defaults;
  try {
    const stored = window.localStorage.getItem("skytracker.settings.v2");
    return stored ? { ...defaults, ...JSON.parse(stored) } : defaults;
  } catch {
    return defaults;
  }
}

export function readDisplaySettings(): TrackerSettings {
  const saved = readSettings();
  return {
    ...saved,
    lat: defaults.lat,
    lon: defaults.lon
  };
}

export default function SettingsPanel() {
  const [settings, setSettings] = useState<TrackerSettings>(defaults);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSettings(readSettings());
  }, []);

  function save() {
    window.localStorage.setItem("skytracker.settings.v2", JSON.stringify(settings));
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  }

  return (
    <main className="sky-shell min-h-screen overflow-y-auto px-5 py-8 text-bone md:px-10">
      <div className="mx-auto max-w-3xl">
        <a className="matrix-copy text-sm uppercase tracking-[0.35em] text-dim" href="/">
          SkyTracker
        </a>
        <h1 className="dot-text mt-8 text-5xl font-black uppercase md:text-8xl">SETTINGS</h1>
        <div className="mt-10 border border-bone/18 bg-black/70 p-5 md:p-8">
          <Field label="Latitude" value={settings.lat} onChange={(lat) => setSettings({ ...settings, lat })} />
          <Field label="Longitude" value={settings.lon} onChange={(lon) => setSettings({ ...settings, lon })} />
          <Field
            label="Radius NM"
            value={settings.radiusNm}
            min={5}
            max={120}
            onChange={(radiusNm) => setSettings({ ...settings, radiusNm })}
          />
          <label className="mt-8 flex items-center justify-between border-t border-bone/14 pt-6 text-xl uppercase tracking-[0.12em]">
            Demo Mode
            <input
              checked={settings.demoMode}
              className="h-7 w-7 accent-bone"
              type="checkbox"
              onChange={(event) => setSettings({ ...settings, demoMode: event.target.checked })}
            />
          </label>
          <button
            className="mt-10 flex items-center gap-3 border border-bone/35 px-5 py-4 text-lg uppercase tracking-[0.18em] text-bone transition hover:bg-bone hover:text-ink"
            onClick={save}
          >
            <Save size={22} />
            {saved ? "SAVED" : "SAVE"}
          </button>
        </div>
      </div>
    </main>
  );
}

function Field({
  label,
  value,
  min,
  max,
  onChange
}: {
  label: string;
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="mt-6 block border-t border-bone/14 pt-5 text-sm uppercase tracking-[0.32em] text-dim first:mt-0 first:border-t-0 first:pt-0">
      {label}
      <input
        className="mt-3 w-full border border-bone/24 bg-black px-4 py-4 text-3xl text-bone outline-none focus:border-bone"
        max={max}
        min={min}
        step="0.0001"
        type="number"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}
