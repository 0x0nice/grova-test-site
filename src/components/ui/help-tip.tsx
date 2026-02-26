"use client";

import { useState, useRef } from "react";

export function HelpTip({ children }: { children: React.ReactNode }) {
  const [show, setShow] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout>>(undefined);

  function enter() {
    clearTimeout(timeout.current);
    setShow(true);
  }
  function leave() {
    timeout.current = setTimeout(() => setShow(false), 150);
  }

  function toggle() {
    setShow((s) => !s);
  }

  return (
    <span
      className="relative inline-flex items-center ml-1.5"
      onMouseEnter={enter}
      onMouseLeave={leave}
    >
      <button
        type="button"
        onClick={toggle}
        onFocus={enter}
        onBlur={leave}
        className="inline-flex items-center justify-center w-[15px] h-[15px] rounded-full
                   border border-border2 text-text3 text-[0.5rem] leading-none cursor-help
                   hover:border-accent hover:text-accent transition-colors"
        aria-label="Help"
      >
        ?
      </button>
      {show && (
        <span
          className="absolute bottom-full right-0 mb-2 w-[260px]
                     bg-bg2 border border-border rounded p-3 shadow-lg z-50
                     font-mono text-[0.62rem] text-text2 leading-[1.65] font-normal
                     normal-case tracking-normal"
        >
          {children}
          <span className="absolute top-full right-[4px] w-0 h-0
                          border-l-[5px] border-r-[5px] border-t-[5px]
                          border-l-transparent border-r-transparent border-t-border" />
        </span>
      )}
    </span>
  );
}
