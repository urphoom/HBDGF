"use client";

import { memories, type Memory } from "@/data/content";
import { EditablePhoto, usePhotoEdit } from "@/components/PhotoEdit";

const spots = [
  { top: "7%", left: "2%", rot: -13, w: 188, delay: "0s", dur: "7.2s" },
  { top: "5%", right: "3%", rot: 12, w: 176, delay: "0.5s", dur: "8s" },
  { top: "38%", left: "-2%", rot: -7, w: 158, delay: "1.1s", dur: "6.6s" },
  { bottom: "6%", left: "6%", rot: 8, w: 184, delay: "0.2s", dur: "7.6s" },
  { bottom: "8%", right: "4%", rot: -12, w: 196, delay: "0.9s", dur: "8.4s" },
  { top: "42%", right: "-1%", rot: 6, w: 150, delay: "0.4s", dur: "6.9s" },
];

export function FloatingPhotos({ items = memories }: { items?: Memory[] }) {
  const { editing } = usePhotoEdit();

  return (
    <div className="pointer-events-none absolute inset-0 z-0" aria-hidden={!editing}>
      {items.slice(0, spots.length).map((memory, index) => {
        const spot = spots[index];
        return (
          <div
            key={memory.id}
            className={editing ? "floater is-still" : "floater"}
            style={{
              top: spot.top,
              left: spot.left,
              right: spot.right,
              bottom: spot.bottom,
              width: spot.w,
              animationDelay: spot.delay,
              animationDuration: spot.dur,
              ["--rot" as string]: `${spot.rot}deg`,
            }}
          >
            <EditablePhoto
              className="aspect-[3/4] bg-rose-100"
              id={memory.id}
              scene={memory.scene}
              fallback={memory.image}
              alt={memory.title}
            />
          </div>
        );
      })}
    </div>
  );
}
