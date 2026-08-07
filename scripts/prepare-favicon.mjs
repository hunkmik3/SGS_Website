/**
 * Builds the app icons from the master mark.
 *   node scripts/prepare-favicon.mjs <source.png>
 *
 * Next's App Router picks these up by filename: icon.png and apple-icon.png
 * get <link> tags generated automatically, and favicon.ico is served at the
 * root path that older browsers and crawlers still request directly.
 */
import { writeFile } from "node:fs/promises";
import sharp from "sharp";

const SRC = process.argv[2];
if (!SRC) throw new Error("usage: node scripts/prepare-favicon.mjs <source.png>");

const APP = new URL("../src/app/", import.meta.url).pathname;

// Sample a corner so the icons keep the artwork's own background rather than
// going transparent, which reads as a hole at 16px.
const { data: corner } = await sharp(SRC)
  .extract({ left: 8, top: 8, width: 4, height: 4 })
  .raw()
  .toBuffer({ resolveWithObject: true });
const background = { r: corner[0], g: corner[1], b: corner[2], alpha: 1 };
const hex = "#" + [corner[0], corner[1], corner[2]].map((v) => v.toString(16).padStart(2, "0")).join("");
console.log(`background sampled: ${hex}`);

// ensureAlpha after flatten: the background is now opaque, but the PNG must
// still carry an alpha channel — the ICO decoder rejects RGB-only data with
// "The PNG is not in RGBA format", and that only surfaces in a production
// build, not in dev.
const render = (size) =>
  sharp(SRC)
    .resize(size, size, { fit: "cover" })
    .flatten({ background })
    .ensureAlpha()
    .png({ compressionLevel: 9 })
    .toBuffer();

await writeFile(`${APP}icon.png`, await render(512));
await writeFile(`${APP}apple-icon.png`, await render(180));
console.log("icon.png 512x512, apple-icon.png 180x180");

/**
 * Hand-packed ICO. sharp cannot write the format, but an .ico is just a small
 * header followed by whole PNG files, so no extra dependency is needed.
 */
const SIZES = [16, 32, 48];
const images = await Promise.all(SIZES.map(render));

const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // 1 = icon
header.writeUInt16LE(SIZES.length, 4);

let offset = 6 + SIZES.length * 16;
const entries = SIZES.map((size, i) => {
  const entry = Buffer.alloc(16);
  entry.writeUInt8(size === 256 ? 0 : size, 0); // width
  entry.writeUInt8(size === 256 ? 0 : size, 1); // height
  entry.writeUInt8(0, 2); // palette size
  entry.writeUInt8(0, 3); // reserved
  entry.writeUInt16LE(1, 4); // colour planes
  entry.writeUInt16LE(32, 6); // bits per pixel
  entry.writeUInt32LE(images[i].length, 8);
  entry.writeUInt32LE(offset, 12);
  offset += images[i].length;
  return entry;
});

await writeFile(`${APP}favicon.ico`, Buffer.concat([header, ...entries, ...images]));
console.log(`favicon.ico ${SIZES.join("/")} px, ${offset} bytes`);
