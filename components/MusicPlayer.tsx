"use client";

type Props = {
  visible: boolean;
  playing: boolean;
  title: string;
  index: number;
  total: number;
  onToggle: () => void;
  onPrev: () => void;
  onNext: () => void;
};

export function MusicPlayer({ visible, playing, title, index, total, onToggle, onPrev, onNext }: Props) {
  if (!visible) return null;

  return (
    <div className="player" role="region" aria-label="เครื่องเล่นเพลง">
      <button type="button" onClick={onPrev} aria-label="เพลงก่อนหน้า">
        ‹
      </button>
      <div className="min-w-0 flex-1 text-left">
        <p className="text-[11px] font-semibold tracking-wide text-rose-300">
          เพลง {index + 1}/{total}
        </p>
        <p className="truncate text-sm font-semibold text-rose-700">{title}</p>
      </div>
      <button type="button" className="play" onClick={onToggle} aria-pressed={playing}>
        {playing ? "ปิดเพลง" : "เปิดเพลง"}
      </button>
      <button type="button" onClick={onNext} aria-label="เพลงถัดไป">
        ›
      </button>
      {playing && (
        <span className="bars" aria-hidden>
          <i />
          <i />
          <i />
        </span>
      )}
    </div>
  );
}
