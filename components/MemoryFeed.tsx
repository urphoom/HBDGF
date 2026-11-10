"use client";

import { useEffect, useState } from "react";
import { birthday, memories, type Memory } from "@/data/content";
import { EditablePhoto } from "@/components/PhotoEdit";

export function MemoryFeed() {
  const [active, setActive] = useState<Memory | null>(null);

  useEffect(() => {
    if (!active) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActive(null);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [active]);

  return (
    <section id="stories" className="relative z-10 mx-auto max-w-5xl px-4 py-20">
      <div className="mb-10 text-center">
        <p className="text-sm font-semibold tracking-wide text-rose-400">เลื่อนมาถึงตรงนี้แล้ว</p>
        <h2 className="font-thai mt-2 text-4xl text-rose-500 sm:text-5xl">เรื่องราวของเรา</h2>
        <p className="mt-3 text-rose-400">กดที่โพสต์ เพื่ออ่านสิ่งที่อยากบอก</p>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {memories.map((memory) => (
          <article key={memory.id} className="post-card text-left">
            <button type="button" className="post-open" onClick={() => setActive(memory)}>
              <div className="flex items-center gap-3 px-3 py-3">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-rose-300 to-pink-500 text-sm text-white">
                  ♥
                </span>
                <span>
                  <span className="block text-sm font-semibold text-rose-700">{birthday.nickname}</span>
                  <span className="block text-xs text-rose-300">
                    {memory.tag} · {memory.date}
                  </span>
                </span>
              </div>
            </button>
            <EditablePhoto
              className="aspect-[4/5] bg-rose-100"
              id={memory.id}
              scene={memory.scene}
              fallback={memory.image}
              alt={memory.title}
              onOpen={() => setActive(memory)}
            />
            <button type="button" className="post-open" onClick={() => setActive(memory)}>
              <div className="px-3 py-3">
                <p className="text-sm font-semibold text-rose-600">{memory.title}</p>
                <p className="mt-1 line-clamp-2 text-sm leading-6 text-rose-400">{memory.caption}</p>
              </div>
            </button>
          </article>
        ))}
      </div>

      {active && (
        <div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-rose-950/45 p-3 backdrop-blur-sm sm:items-center"
          onClick={() => setActive(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="memory-title"
            className="modal-card relative max-h-[92vh] w-full max-w-md overflow-auto rounded-[28px] bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-rose-500 shadow"
              onClick={() => setActive(null)}
              aria-label="ปิด"
            >
              ×
            </button>
            <EditablePhoto
              className="aspect-[4/5] bg-rose-100"
              id={active.id}
              scene={active.scene}
              fallback={active.image}
              alt={active.title}
            />
            <div className="px-5 py-5">
              <p className="text-xs font-semibold tracking-wide text-rose-400">
                {active.tag} · {active.date}
              </p>
              <h3 id="memory-title" className="font-thai mt-1 text-3xl text-rose-600">
                {active.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-rose-700">{active.caption}</p>
              <p className="mt-3 text-sm leading-7 text-rose-500">{active.story}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
