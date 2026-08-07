/**
 * Derives the footer logo from the master artwork: the black mark and
 * "SLEEPY GIANT" become cream, the red "STUDIO" is left untouched.
 *   node scripts/prepare-logo-light.mjs
 *
 * This is a derivation, not an official asset — replace it with the real
 * light-background export when there is one.
 */
import sharp from "sharp";

const SRC = "/Users/mac/Downloads/2 copLogo full png.png";
const OUT = new URL("../public/images/logo-sleepy-giant-light.png", import.meta.url).pathname;
const CREAM = [241, 236, 227];

const trimmed = await sharp(SRC).trim({ threshold: 1 }).toBuffer();
const { data, info } = await sharp(trimmed)
  .resize({ height: 220 })
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

let recoloured = 0;
for (let i = 0; i < data.length; i += info.channels) {
  if (data[i + 3] === 0) continue;
  const isRed = data[i] - data[i + 1] > 60 && data[i] > 120;
  if (isRed) continue;
  [data[i], data[i + 1], data[i + 2]] = CREAM;
  recoloured++;
}

await sharp(data, { raw: { width: info.width, height: info.height, channels: info.channels } })
  .png({ compressionLevel: 9 })
  .toFile(OUT);

console.log(`${info.width}x${info.height}, recoloured ${recoloured} px to cream, red kept`);
