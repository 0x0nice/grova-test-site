"use client";

import { useFontSize, type FontSizePreset } from "@/providers/font-size-provider";

const LABELS = ["Small", "Default", "Large", "Extra Large"] as const;

export function FontSizeControl() {
  const { preset, setPreset } = useFontSize();

  return (
    <div className="flex flex-col gap-4">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <span className="font-mono text-micro text-text3 uppercase tracking-[0.08em]">
          Text size
        </span>
        <span className="font-mono text-micro text-accent font-medium">
          {LABELS[preset]}
        </span>
      </div>

      {/* Slider row */}
      <div className="flex items-center gap-4">
        <span
          className="font-serif text-text3 select-none shrink-0 leading-none"
          style={{ fontSize: "0.7rem" }}
          aria-hidden="true"
        >
          A
        </span>

        <div className="flex-1 flex flex-col gap-3">
          <input
            type="range"
            min={0}
            max={3}
            step={1}
            value={preset}
            onChange={(e) => setPreset(Number(e.target.value) as FontSizePreset)}
            className="font-size-slider"
            aria-label="Text size"
            aria-valuetext={LABELS[preset]}
          />

          {/* Dot indicators */}
          <div className="flex justify-between px-[2px]">
            {LABELS.map((label, i) => (
              <button
                key={label}
                onClick={() => setPreset(i as FontSizePreset)}
                className="group flex flex-col items-center gap-1.5 cursor-pointer"
                aria-label={`Set text size to ${label}`}
              >
                <div
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    i === preset
                      ? "bg-accent scale-110"
                      : i < preset
                        ? "bg-accent/40"
                        : "bg-border2 group-hover:bg-text3"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <span
          className="font-serif text-text3 select-none shrink-0 leading-none"
          style={{ fontSize: "1.3rem" }}
          aria-hidden="true"
        >
          A
        </span>
      </div>

      {/* Preview sentence */}
      <p className="font-mono text-footnote text-text3 leading-relaxed mt-1">
        The quick brown fox jumps over the lazy dog.
      </p>
    </div>
  );
}
