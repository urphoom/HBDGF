import { mkdir, readFile, unlink, writeFile } from "fs/promises";
import path from "path";
import { memories } from "@/data/content";

const dir = path.join(process.cwd(), "public", "photos");
const manifestPath = path.join(dir, "manifest.json");

type Manifest = Record<string, number>;

function allowed(id: string) {
  return memories.some((memory) => memory.id === id);
}

async function readManifest(): Promise<Manifest> {
  try {
    const raw = await readFile(manifestPath, "utf8");
    const data = JSON.parse(raw) as unknown;
    if (!data || typeof data !== "object" || Array.isArray(data)) return {};
    const manifest: Manifest = {};
    for (const [key, value] of Object.entries(data)) {
      if (allowed(key) && typeof value === "number") manifest[key] = value;
    }
    return manifest;
  } catch {
    return {};
  }
}

async function writeManifest(manifest: Manifest) {
  await mkdir(dir, { recursive: true });
  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
}

export async function POST(request: Request) {
  const form = await request.formData();
  const id = String(form.get("id") ?? "");
  const file = form.get("file");

  if (!allowed(id)) {
    return Response.json({ error: "ไม่พบรูปนี้" }, { status: 400 });
  }
  if (!(file instanceof File) || file.size === 0) {
    return Response.json({ error: "ยังไม่ได้เลือกรูป" }, { status: 400 });
  }
  if (file.type !== "image/jpeg") {
    return Response.json({ error: "ใช้ไฟล์ jpg หรือ png" }, { status: 400 });
  }
  if (file.size > 6 * 1024 * 1024) {
    return Response.json({ error: "รูปใหญ่เกินไป" }, { status: 400 });
  }

  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, `${id}.jpg`), Buffer.from(await file.arrayBuffer()));

  const manifest = await readManifest();
  const updated = Date.now();
  manifest[id] = updated;
  await writeManifest(manifest);

  return Response.json({ id, src: `/photos/${id}.jpg?v=${updated}` });
}

export async function DELETE(request: Request) {
  const id = new URL(request.url).searchParams.get("id") ?? "";
  if (!allowed(id)) {
    return Response.json({ error: "ไม่พบรูปนี้" }, { status: 400 });
  }

  await unlink(path.join(dir, `${id}.jpg`)).catch(() => {});
  const manifest = await readManifest();
  delete manifest[id];
  await writeManifest(manifest);

  return Response.json({ id, src: null });
}
