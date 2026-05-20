"use client";

import { Maximize, Settings } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import AircraftCard from "@/components/AircraftCard";
import DotMatrixDisplay from "@/components/DotMatrixDisplay";
import { readSettings } from "@/components/SettingsPanel";
import type { Aircraft, AircraftResponse, TrackerSettings } from "@/lib/types";

const initialSettings: TrackerSettings = {
  lat: 42.77361,
  lon: -81.18038,
  radiusNm: 35,
  demoMode: false
};

const loadingResponse: AircraftResponse = {
  state: "loading",
  settings: initialSettings,
  aircraft: null,
  candidates: [],
  source: "demo",
  generatedAt: new Date().toISOString()
};

export default function Home() {
  const [settings, setSettings] = useState<TrackerSettings>(initialSettings);
  const [data, setData] = useState<AircraftResponse>(loadingResponse);
  const [history, setHistory] = useState<Aircraft[]>([]);
  const [fullscreenAvailable, setFullscreenAvailable] = useState(false);
  const lastAircraftRef = useRef<string | null>(null);

  useEffect(() => {
    setSettings(readSettings());
    setFullscreenAvailable(Boolean(document.documentElement.requestFullscreen));
    try {
      const stored = window.localStorage.getItem("skytracker.overheadHistory");
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch {
      setHistory([]);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const query = new URLSearchParams({
        lat: String(settings.lat),
        lon: String(settings.lon),
        radiusNm: String(settings.radiusNm),
        demo: String(settings.demoMode)
      });

      try {
        const response = await fetch(`/api/aircraft?${query.toString()}`, { cache: "no-store" });
        const payload = (await response.json()) as AircraftResponse;
        if (!cancelled) {
          setData(payload);
          lastAircraftRef.current = payload.aircraft?.id ?? lastAircraftRef.current;
          const nextSeen = [payload.aircraft, ...payload.candidates]
            .filter((aircraft): aircraft is Aircraft => aircraft !== null)
            .filter((aircraft) => (aircraft.distanceNm ?? Infinity) <= settings.radiusNm);
          if (nextSeen.length) {
            setHistory((current) => {
              const merged = [...nextSeen, ...current]
                .filter((aircraft, index, list) => list.findIndex((item) => item.id === aircraft.id) === index)
                .slice(0, 12);
              window.localStorage.setItem("skytracker.overheadHistory", JSON.stringify(merged));
              return merged;
            });
          }
        }
      } catch {
        if (!cancelled) {
          setData((current) => ({ ...current, state: "offline", aircraft: null, candidates: [] }));
        }
      }
    }

    load();
    const interval = window.setInterval(load, 12000);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [settings]);

  async function enterFullscreen() {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
      return;
    }
    await document.documentElement.requestFullscreen?.();
  }

  return (
    <main className="sky-shell relative h-dvh min-h-dvh w-screen overflow-hidden text-bone">
      <div className="absolute right-3 top-3 z-20 flex gap-2 md:right-6 md:top-6 xl:right-9 xl:top-9">
        {fullscreenAvailable && (
          <button
            aria-label="Fullscreen"
            className="grid h-10 w-10 place-items-center border border-bone/15 bg-black text-bone/55 transition hover:border-bone hover:text-bone"
            onClick={enterFullscreen}
            type="button"
          >
            <Maximize size={18} />
          </button>
        )}
        <a
          aria-label="Settings"
          className="grid h-10 w-10 place-items-center border border-bone/15 text-bone/55 transition hover:border-bone hover:text-bone"
          href="/settings"
        >
          <Settings size={18} />
        </a>
      </div>

      <div className="h-full p-2 sm:p-4 md:p-5 xl:p-9">
        <DotMatrixDisplay className="mx-auto h-full max-w-[1600px]" density="normal" label="SkyTracker board">
          <AircraftCard aircraft={data.aircraft} candidates={history.length ? history : data.candidates} state={data.state} />
        </DotMatrixDisplay>
      </div>
    </main>
  );
}
