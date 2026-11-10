"use client";

import { useState } from "react";
import { birthday } from "@/data/content";

export function Envelope() {
  const [open, setOpen] = useState(false);

  return (
    <section id="letter" className="relative z-10 mx-auto flex max-w-xl flex-col items-center px-4 pb-36 pt-10 text-center">
      <p className="text-sm font-semibold tracking-wide text-rose-400">สุดท้ายแล้ว</p>
      <h2 className="font-thai mt-2 text-4xl text-rose-500 sm:text-5xl">จดหมายถึงเธอ</h2>
      <p className="mt-3 text-sm text-rose-400">
        {open ? "ซองเปิดแล้ว อ่านได้เลย" : "กดที่ซองจดหมาย"}
      </p>

      <button
        type="button"
        className={open ? "envelope is-open" : "envelope"}
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label={open ? "ปิดซองจดหมาย" : "เปิดซองจดหมาย"}
      >
        <span className="env-back" />
        <span className="env-flap" />
        <span className="env-pocket" />
        <span className="env-seal">♥</span>
      </button>

      {open && (
        <article className="letter">
          {birthday.letter.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <p className="font-thai sign">{birthday.signOff}</p>
          <button type="button" className="fold" onClick={() => setOpen(false)}>
            พับจดหมาย
          </button>
        </article>
      )}
    </section>
  );
}
