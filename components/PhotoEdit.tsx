"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { MemoryVisual, type SceneName } from "@/components/scenes";

type Manifest = Record<string, number>;

type PhotoEditContextValue = {
  editing: boolean;
  setEditing: (value: boolean) => void;
  srcFor: (id: string) => string | undefined;
  upload: (id: string, file: File) => Promise<void>;
  clear: (id: string) => Promise<void>;
  busyId: string | null;
  message: string | null;
};

const PhotoEditContext = createContext<PhotoEditContextValue | null>(null);

export function usePhotoEdit() {
  const value = useContext(PhotoEditContext);
  if (!value) throw new Error("usePhotoEdit must be used within PhotoEditProvider");
  return value;
}

async function shrinkToJpeg(file: File) {
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    throw new Error("ใช้ไฟล์ jpg หรือ png");
  }

  const max = 1600;
  const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bitmap.close();
    throw new Error("ใช้ไฟล์ jpg หรือ png");
  }
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.86));
  if (!blob) throw new Error("ใช้ไฟล์ jpg หรือ png");
  return blob;
}

export function PhotoEditProvider({ children }: { children: ReactNode }) {
  const [editing, setEditing] = useState(false);
  const [versions, setVersions] = useState<Manifest>({});
  const [busyId, setBusyId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`/photos/manifest.json?t=${Date.now()}`, { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : {}))
      .then((data: Manifest) => {
        if (!cancelled && data && typeof data === "object" && !Array.isArray(data)) setVersions(data);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const srcFor = useCallback(
    (id: string) => {
      const version = versions[id];
      return typeof version === "number" ? `/photos/${id}.jpg?v=${version}` : undefined;
    },
    [versions],
  );

  const upload = useCallback(async (id: string, file: File) => {
    setBusyId(id);
    setMessage(null);
    try {
      const blob = await shrinkToJpeg(file);
      const body = new FormData();
      body.set("id", id);
      body.set("file", new File([blob], `${id}.jpg`, { type: "image/jpeg" }));
      const response = await fetch("/api/photos", { method: "POST", body });
      const data = (await response.json()) as { src?: string; error?: string };
      if (!response.ok || !data.src) throw new Error(data.error || "บันทึกรูปไม่สำเร็จ");
      const version = Number(data.src.split("v=")[1]) || Date.now();
      setVersions((current) => ({ ...current, [id]: version }));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "บันทึกรูปไม่สำเร็จ");
    } finally {
      setBusyId(null);
    }
  }, []);

  const clear = useCallback(async (id: string) => {
    setBusyId(id);
    setMessage(null);
    try {
      const response = await fetch(`/api/photos?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(data.error || "เอารูปออกไม่สำเร็จ");
      setVersions((current) => {
        const next = { ...current };
        delete next[id];
        return next;
      });
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "เอารูปออกไม่สำเร็จ");
    } finally {
      setBusyId(null);
    }
  }, []);

  const value = useMemo(
    () => ({ editing, setEditing, srcFor, upload, clear, busyId, message }),
    [editing, srcFor, upload, clear, busyId, message],
  );

  return (
    <PhotoEditContext.Provider value={value}>
      {children}
      <div className="edit-dock">
        {message && <p className="edit-error">{message}</p>}
        {editing && <p className="edit-hint">กดเปลี่ยนรูปบนใบที่อยากเปลี่ยน รูปจะถูกเซฟไว้ในโปรเจกต์</p>}
        <button
          type="button"
          className={editing ? "edit-toggle on" : "edit-toggle"}
          onClick={() => {
            setEditing(!editing);
            setMessage(null);
          }}
        >
          {editing ? "เสร็จแล้ว" : "แก้ไขรูป"}
        </button>
      </div>
    </PhotoEditContext.Provider>
  );
}

export function EditablePhoto({
  id,
  scene,
  fallback,
  alt,
  className,
  onOpen,
}: {
  id: string;
  scene: SceneName;
  fallback?: string;
  alt: string;
  className?: string;
  onOpen?: () => void;
}) {
  const { editing, srcFor, upload, clear, busyId } = usePhotoEdit();
  const custom = srcFor(id);
  const image = custom || fallback;
  const busy = busyId === id;

  const visual = <MemoryVisual scene={scene} image={image} alt={alt} />;

  return (
    <div className={className ? `photo-frame ${className}` : "photo-frame"}>
      {onOpen ? (
        <button type="button" className="photo-open" onClick={onOpen} aria-label={alt}>
          {visual}
        </button>
      ) : (
        visual
      )}
      {editing && (
        <div className="photo-edit">
          {custom && <span className="photo-edit-badge">ใส่รูปแล้ว</span>}
          <label className="photo-edit-btn">
            {busy ? "กำลังบันทึก..." : "เปลี่ยนรูป"}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              disabled={busy}
              onChange={(event) => {
                const file = event.target.files?.[0];
                event.target.value = "";
                if (file) void upload(id, file);
              }}
            />
          </label>
          {custom && (
            <button type="button" className="photo-edit-btn ghost" disabled={busy} onClick={() => void clear(id)}>
              ใช้ภาพวาด
            </button>
          )}
        </div>
      )}
    </div>
  );
}
