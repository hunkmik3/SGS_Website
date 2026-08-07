/**
 * Trims and normalises the "Trusted by" client logos.
 *   node scripts/prepare-logos.mjs
 *
 * Colours are left exactly as exported — each logo keeps its own ink.
 * Sources carry a lot of transparent padding, and the amount differs per file,
 * so trimming first is what makes the per-logo heights in src/lib/logos.ts
 * mean the same thing across the row.
 */
import { mkdir, readFile } from "node:fs/promises";
import sharp from "sharp";

const OUT_DIR = new URL("../public/images/logos/", import.meta.url).pathname;
const HEIGHT = 200; // ~4x the tallest on-screen size

const files = [
  ["ninety-eight", "/Users/mac/Downloads/Logo/nighty.png"],
  ["avis", "/Users/mac/Downloads/Logo/avis.png"],
  ["globalcomix", "/Users/mac/Downloads/Logo/global mix.png"],
  ["inkr", "/Users/mac/Downloads/Logo/inkr.png"],
  ["fanfan", "/Users/mac/Downloads/logo fanfan 1.svg"],
  ["kadokawa", "/Users/mac/Downloads/Logo/kado.png"],
  ["byteplus", "/Users/mac/Downloads/Logo/byteplus.png"],
];

/**
 * Figma "SVG" exports here are a raster wrapped in an <svg><pattern> shell, not
 * real vector paths. Rasterising the shell resamples an already-small bitmap,
 * so pull the original image straight out of the data URI instead.
 */
async function load(path) {
  if (!path.endsWith(".svg")) return readFile(path);
  const svg = await readFile(path, "utf8");
  const m = svg.match(/data:image\/(?:png|jpeg);base64,([A-Za-z0-9+/=]+)/);
  if (!m) return readFile(path); // a genuine vector — let sharp render it
  return Buffer.from(m[1], "base64");
}

await mkdir(OUT_DIR, { recursive: true });

for (const [slug, file] of files) {
  // A tolerant threshold: some exports have faint non-zero alpha at the edges
  // that defeats the default trim.
  const trimmed = await sharp(await load(file))
    .ensureAlpha()
    .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 }, threshold: 12 })
    .toBuffer({ resolveWithObject: true });

  const dest = `${OUT_DIR}${slug}.png`;
  await sharp(trimmed.data)
    .resize({ height: HEIGHT, fit: "inside" })
    .png({ compressionLevel: 9 })
    .toFile(dest);

  const out = await sharp(dest).metadata();
  console.log(
    `${slug.padEnd(13)} ${out.width}x${out.height}  ratio ${(out.width / out.height).toFixed(2)}`,
  );
}
