/**
 * Resizes the About collage stills.
 *   node scripts/prepare-about-images.mjs <top> <middle> <bottom>
 *   node scripts/prepare-about-images.mjs <slug> <source>     # replace just one
 *
 * Crops to 16:9 rather than trusting the source to be it. The collage renders
 * each still at its own intrinsic ratio, so one 3:2 photo among 16:9 ones comes
 * out taller than the rows either side of it. Sources already at 16:9 are
 * unaffected — cover at the same ratio is a no-op.
 *
 * Greyscale is not applied: every source so far has arrived that way, and
 * desaturating one that had colour would hide the fact that it needs grading.
 */
import { mkdir } from "node:fs/promises";
import sharp from "sharp";

const OUT_DIR = new URL("../public/images/about/", import.meta.url).pathname;
const WIDTH = 1600; // ~2x the 821px the image occupies at a 1920 viewport

const slugs = ["human-craft", "ip-ownership", "speed-without-compromise"];

const args = process.argv.slice(2);

/** Either all three in order, or one named slug and its source. */
const jobs =
  args.length === 2 && slugs.includes(args[0])
    ? [[args[0], args[1]]]
    : args.length === slugs.length
      ? slugs.map((slug, i) => [slug, args[i]])
      : null;

if (!jobs) {
  throw new Error(
    `Expected ${slugs.length} images, or a slug (${slugs.join(" | ")}) and one source`,
  );
}

await mkdir(OUT_DIR, { recursive: true });

for (const [slug, src] of jobs) {
  const dest = `${OUT_DIR}${slug}.jpg`;
  const before = await sharp(src).metadata();
  await sharp(src)
    .resize({ width: WIDTH, height: Math.round((WIDTH * 9) / 16), fit: "cover" })
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile(dest);
  const out = await sharp(dest).metadata();
  const ratio = (n) => (n.width / n.height).toFixed(3);
  console.log(
    `${slug}.jpg  ${before.width}x${before.height} (${ratio(before)})  ->  ` +
      `${out.width}x${out.height} (${ratio(out)})`,
  );
}
