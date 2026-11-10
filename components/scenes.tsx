import { useId, type ReactNode } from "react";

export type SceneName = "cafe" | "dinner" | "beach" | "road" | "night" | "flowers";

function Frame({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 300 400" preserveAspectRatio="xMidYMid slice" className="h-full w-full" aria-hidden>
      {children}
    </svg>
  );
}

function Cafe() {
  const id = useId().replace(/:/g, "");
  return (
    <Frame>
      <defs>
        <linearGradient id={`${id}-wall`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f6c9a4" />
          <stop offset="1" stopColor="#e7a27c" />
        </linearGradient>
      </defs>
      <rect width="300" height="400" fill={`url(#${id}-wall)`} />
      <rect x="34" y="36" width="232" height="168" rx="8" fill="#8fd0e8" />
      <rect x="46" y="48" width="96" height="68" fill="#fff4d2" opacity="0.85" />
      <rect x="158" y="48" width="96" height="68" fill="#ffe7b0" opacity="0.75" />
      <rect x="46" y="128" width="208" height="60" fill="#9fd8ec" />
      <path d="M150 36v168M34 120h232" stroke="#f7efe4" strokeWidth="6" />
      <rect x="28" y="248" width="244" height="18" rx="6" fill="#8a4b38" />
      <rect x="48" y="266" width="204" height="86" rx="8" fill="#6e3a2c" />
      <ellipse cx="108" cy="286" rx="28" ry="10" fill="#fff" />
      <rect x="96" y="270" width="24" height="16" rx="4" fill="#fff" />
      <path d="M132 278h16" stroke="#fff" strokeWidth="3" />
      <ellipse cx="192" cy="286" rx="28" ry="10" fill="#f7d7c4" />
      <rect x="180" y="268" width="24" height="18" rx="4" fill="#f7d7c4" />
      <circle cx="250" cy="250" r="26" fill="#6ea36a" />
      <rect x="246" y="268" width="8" height="28" fill="#6b3f2a" />
    </Frame>
  );
}

function Dinner() {
  return (
    <Frame>
      <rect width="300" height="400" fill="#2b1b2a" />
      <circle cx="210" cy="70" r="90" fill="#ffb067" opacity="0.35" />
      <rect x="0" y="210" width="300" height="190" fill="#4a2c33" />
      <ellipse cx="150" cy="250" rx="110" ry="28" fill="#6a3a40" />
      <ellipse cx="104" cy="236" rx="34" ry="16" fill="#f4efe6" />
      <ellipse cx="196" cy="236" rx="34" ry="16" fill="#f4efe6" />
      <circle cx="104" cy="228" r="10" fill="#e25b78" />
      <circle cx="196" cy="226" r="8" fill="#f0c36a" />
      <rect x="142" y="150" width="8" height="70" fill="#d7b48a" />
      <ellipse cx="146" cy="146" rx="16" ry="22" fill="#ffe08a" />
      <rect x="24" y="300" width="70" height="90" fill="#20141c" />
      <rect x="210" y="300" width="70" height="90" fill="#20141c" />
    </Frame>
  );
}

function Beach() {
  const id = useId().replace(/:/g, "");
  return (
    <Frame>
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffb088" />
          <stop offset="0.45" stopColor="#ff7f9e" />
          <stop offset="1" stopColor="#ffd0a6" />
        </linearGradient>
      </defs>
      <rect width="300" height="400" fill={`url(#${id}-sky)`} />
      <circle cx="214" cy="118" r="42" fill="#fff1c9" />
      <circle cx="214" cy="118" r="28" fill="#ffe08a" />
      <path d="M0 230 C60 200 100 250 160 226 C220 202 250 240 300 214 V400 H0 Z" fill="#f7c38a" />
      <path d="M0 250 C80 230 120 270 190 248 C240 232 270 260 300 246 V400 H0 Z" fill="#57b7c9" />
      <path d="M0 290 C70 274 130 310 200 286 C250 270 280 300 300 286 V400 H0 Z" fill="#2f8ea8" />
      <path d="M40 214 C70 206 78 226 108 218" stroke="#fff" strokeWidth="3" fill="none" opacity="0.7" />
    </Frame>
  );
}

function Road() {
  return (
    <Frame>
      <rect width="300" height="400" fill="#d9ecff" />
      <circle cx="230" cy="70" r="26" fill="#fff6cf" />
      <path d="M0 180 L80 150 L130 176 L190 140 L250 168 L300 146 V230 H0 Z" fill="#9fd0a8" />
      <path d="M0 210 L70 188 L140 214 L210 180 L300 208 V250 H0 Z" fill="#6eaa78" />
      <path d="M118 400 L150 168 L186 400 Z" fill="#d7dde3" />
      <path d="M146 250 H166" stroke="#fff" strokeWidth="6" strokeDasharray="10 12" />
      <path d="M140 300 H172" stroke="#fff" strokeWidth="7" strokeDasharray="12 14" />
      <rect x="0" y="300" width="300" height="100" fill="#7f8b86" />
    </Frame>
  );
}

function Night() {
  return (
    <Frame>
      <rect width="300" height="400" fill="#24183a" />
      <circle cx="214" cy="92" r="36" fill="#fff4cf" />
      <circle cx="228" cy="84" r="28" fill="#24183a" />
      {([
        [40, 50],
        [80, 90],
        [120, 40],
        [70, 150],
        [150, 120],
        [40, 200],
        [260, 160],
        [180, 70],
      ] as const).map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="1.6" fill="#fff" />
      ))}
      <rect x="48" y="210" width="204" height="150" rx="8" fill="#120c1e" />
      <path d="M48 210 H252 V250 C200 280 100 280 48 250 Z" fill="#ffd0e2" opacity="0.9" />
      <rect x="70" y="268" width="70" height="58" fill="#ffd7e6" opacity="0.8" />
      <rect x="160" y="268" width="70" height="58" fill="#ffe7a8" opacity="0.75" />
      <rect x="138" y="210" width="10" height="150" fill="#3a2a52" />
    </Frame>
  );
}

function Flowers() {
  return (
    <Frame>
      <rect width="300" height="220" fill="#ffd0e0" />
      <circle cx="70" cy="70" r="40" fill="#fff" opacity="0.45" />
      <rect y="200" width="300" height="200" fill="#f3a9c4" />
      <rect y="250" width="300" height="150" fill="#ee8eb2" />
      {[
        [60, 230],
        [120, 250],
        [180, 226],
        [230, 258],
        [90, 300],
        [160, 310],
        [220, 320],
      ].map(([x, y]) => (
        <g key={`${x}-${y}`}>
          <circle cx={x - 10} cy={y} r="12" fill="#fff" />
          <circle cx={x + 10} cy={y} r="12" fill="#fff" />
          <circle cx={x} cy={y - 10} r="12" fill="#fff" />
          <circle cx={x} cy={y + 8} r="12" fill="#fff" />
          <circle cx={x} cy={y} r="7" fill="#ffd15c" />
        </g>
      ))}
    </Frame>
  );
}

const scenes: Record<SceneName, () => ReactNode> = {
  cafe: Cafe,
  dinner: Dinner,
  beach: Beach,
  road: Road,
  night: Night,
  flowers: Flowers,
};

export function Scene({ name }: { name: SceneName }) {
  const Draw = scenes[name];
  return (
    <div className="scene h-full w-full">
      <Draw />
    </div>
  );
}

export function MemoryVisual({
  scene,
  image,
  alt,
}: {
  scene: SceneName;
  image?: string;
  alt: string;
}) {
  if (image) {
    return <img src={image} alt={alt} className="h-full w-full object-cover" />;
  }
  return <Scene name={scene} />;
}
