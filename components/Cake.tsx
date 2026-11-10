"use client";

import { useMemo } from "react";

export type Phase = "lit" | "blowing" | "out";

const COLORS = ["#fffdfb", "#ffd0e4", "#ffe39a", "#eadcff", "#ffd6e2", "#fff"];

function makeCandles(count: number) {
  const outerN = count > 12 ? Math.round(count * 0.67) : count;
  const innerN = count - outerN;
  const rings = [
    { n: outerN, rx: 40, ry: 34 },
    ...(innerN > 0 ? [{ n: innerN, rx: 17, ry: 15 }] : []),
  ];
  const candles: { x: number; y: number; color: string }[] = [];
  let index = 0;
  for (const ring of rings) {
    for (let i = 0; i < ring.n; i += 1) {
      const angle = (i / ring.n) * Math.PI * 2 - Math.PI / 2;
      candles.push({
        x: 50 + Math.cos(angle) * ring.rx,
        y: 50 + Math.sin(angle) * ring.ry,
        color: COLORS[index % COLORS.length],
      });
      index += 1;
    }
  }
  return candles;
}

export function Cake({
  count,
  phase,
  onBlow,
}: {
  count: number;
  phase: Phase;
  onBlow: () => void;
}) {
  const candles = useMemo(() => makeCandles(count), [count]);
  const dark = phase !== "lit";

  return (
    <div className="cake-stack" onClick={onBlow} role="presentation">
      {phase === "blowing" && <span className="wind" />}
      <div className="cake-top">
        {candles.map((candle, index) => {
          const depth = 0.78 + (candle.y / 100) * 0.28;
          return (
            <span
              key={index}
              className={dark ? "candle is-out" : "candle"}
              style={{
                left: `${candle.x}%`,
                top: `${candle.y}%`,
                zIndex: Math.round(candle.y),
                transform: `translate(-50%, -100%) scale(${depth})`,
                ["--d" as string]: `${index * 42}ms`,
                ["--flick" as string]: `${0.12 + (index % 4) * 0.035}s`,
              }}
            >
              <span className="smoke" />
              <span className="flame" />
              <span className="stick" style={{ background: candle.color }} />
            </span>
          );
        })}
      </div>
      <div className="cake-body">
        {[10, 24, 40, 56, 72, 86].map((left, index) => (
          <span
            key={left}
            className="drip"
            style={{ left: `${left}%`, height: `${22 + (index % 3) * 8}px` }}
          />
        ))}
        <span className="band">♥ &nbsp; ♥ &nbsp; ♥</span>
      </div>
      <div className="cake-plate" />
    </div>
  );
}
