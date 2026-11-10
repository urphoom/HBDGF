"use client";

import { useEffect, useRef, useState } from "react";
import { birthday, tracks } from "@/data/content";
import { createAudioContext, playWhoosh, startLoop } from "@/lib/music";
import { Cake, type Phase } from "@/components/Cake";
import { FloatingPhotos } from "@/components/FloatingPhotos";
import { MemoryFeed } from "@/components/MemoryFeed";
import { Envelope } from "@/components/Envelope";
import { MusicPlayer } from "@/components/MusicPlayer";
import { PhotoEditProvider } from "@/components/PhotoEdit";

const hearts = Array.from({ length: 16 }, (_, index) => ({
  id: index,
  left: `${8 + ((index * 37) % 84)}%`,
  delay: `${(index % 7) * 0.07}s`,
  drift: `${(index % 2 === 0 ? -1 : 1) * (16 + (index % 5) * 10)}px`,
}));

export function BirthdayExperience() {
  const [phase, setPhase] = useState<Phase>("lit");
  const [showPlayer, setShowPlayer] = useState(false);
  const [songIndex, setSongIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [blowId, setBlowId] = useState(0);
  const ctxRef = useRef<AudioContext | null>(null);
  const stopRef = useRef<(() => void) | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const songRef = useRef(0);
  const playingRef = useRef(false);

  songRef.current = songIndex;
  playingRef.current = playing;

  useEffect(() => {
    if (phase !== "blowing") return;
    const id = window.setTimeout(() => setPhase("out"), 1650);
    return () => window.clearTimeout(id);
  }, [phase]);

  useEffect(() => {
    return () => {
      stopRef.current?.();
      audioRef.current?.pause();
      void ctxRef.current?.close();
    };
  }, []);

  const ensureCtx = () => {
    if (!ctxRef.current || ctxRef.current.state === "closed") {
      ctxRef.current = createAudioContext();
    }
    return ctxRef.current;
  };

  const stopCurrent = () => {
    stopRef.current?.();
    stopRef.current = null;
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const playSong = (index: number) => {
    const track = tracks[index];
    if (!track) return;
    stopCurrent();
    if (track.src) {
      const audio = audioRef.current ?? new Audio();
      audioRef.current = audio;
      audio.loop = true;
      audio.volume = 0.85;
      audio.src = track.src;
      audio.load();
      audio.onerror = () => setPlaying(false);
      void audio.play().catch(() => setPlaying(false));
    } else if (track.songId) {
      const ctx = ensureCtx();
      if (!ctx) return;
      void ctx.resume();
      stopRef.current = startLoop(ctx, track.songId);
    }
    setSongIndex(index);
    setPlaying(true);
  };

  const blow = () => {
    if (phase === "blowing") return;
    if (phase === "out") {
      setPhase("lit");
      return;
    }
    setPhase("blowing");
    setShowPlayer(true);
    setBlowId((value) => value + 1);
    const ctx = ensureCtx();
    if (ctx) {
      void ctx.resume();
      playWhoosh(ctx);
    }
    if (!playingRef.current) playSong(songRef.current);
  };

  const track = tracks[songIndex];

  return (
    <PhotoEditProvider>
    <main>
      <section className="hero">
        <FloatingPhotos />
        <div className="hero-scrim" />
        <div className="hero-copy">
          <p className="kicker">สำหรับ{birthday.nickname}</p>
          <h1 className="hb-title">Happy Birthday</h1>
          <p className="font-thai subline">สุขสันต์วันเกิดนะ</p>
          <p className="age-pill">ปีที่ {birthday.age}</p>
          <Cake count={birthday.age} phase={phase} onBlow={blow} />
          <button
            type="button"
            className={phase === "out" ? "blow-btn relight" : "blow-btn"}
            onClick={blow}
            disabled={phase === "blowing"}
          >
            {phase === "lit" && "เป่าเทียน"}
            {phase === "blowing" && "กำลังเป่า..."}
            {phase === "out" && "จุดเทียนอีกครั้ง"}
          </button>
          <p className="hint">
            {phase === "out"
              ? "สุขสันต์วันเกิดนะ ขอให้สมหวังทุกอย่างเลย"
              : "กดเป่าเทียน แล้วเพลงจะดังขึ้น เปลี่ยนเพลงได้ด้านล่าง"}
          </p>
          <a className="scroll-cue" href="#stories">
            เลื่อนลงไปดูเรื่องของเรา
            <span>↓</span>
          </a>
        </div>
        {phase !== "lit" && (
          <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
            {hearts.map((heart) => (
              <span
                key={`${blowId}-${heart.id}`}
                className="rise-heart"
                style={{
                  left: heart.left,
                  animationDelay: heart.delay,
                  ["--drift" as string]: heart.drift,
                }}
              >
                ♥
              </span>
            ))}
          </div>
        )}
      </section>

      <MemoryFeed />
      <Envelope />
      <MusicPlayer
        visible={showPlayer}
        playing={playing}
        title={track?.title ?? ""}
        index={songIndex}
        total={tracks.length}
        onToggle={() => {
          if (playingRef.current) {
            stopCurrent();
            setPlaying(false);
            return;
          }
          playSong(songRef.current);
        }}
        onPrev={() => playSong((songRef.current - 1 + tracks.length) % tracks.length)}
        onNext={() => playSong((songRef.current + 1) % tracks.length)}
      />
    </main>
    </PhotoEditProvider>
  );
}
