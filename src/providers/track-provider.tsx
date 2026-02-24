"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type Track = "dev" | "biz";

interface TrackContextValue {
  track: Track;
  setTrack: (t: Track) => void;
}

export const TrackContext = createContext<TrackContextValue>({
  track: "dev",
  setTrack: () => {},
});

export function TrackProvider({ children }: { children: ReactNode }) {
  const [track, setTrackState] = useState<Track>("dev");

  useEffect(() => {
    try {
      const hash = window.location.hash === "#business" ? "biz" : null;
      let saved: string | null = null;
      try { saved = localStorage.getItem("grova-track"); } catch {}
      const initial = hash || (saved as Track) || "dev";
      setTrackState(initial);
      document.documentElement.setAttribute("data-track", initial);
    } catch {
      // Fallback: keep default "dev" track
    }
  }, []);

  const setTrack = useCallback((t: Track) => {
    setTrackState(t);
    document.documentElement.setAttribute("data-track", t);
    try { localStorage.setItem("grova-track", t); } catch {}
    try { history.replaceState(null, "", t === "biz" ? "#business" : "#"); } catch {}
  }, []);

  return (
    <TrackContext.Provider value={{ track, setTrack }}>
      {children}
    </TrackContext.Provider>
  );
}
