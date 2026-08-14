/**
 * Prepares a background video for the web, plus a poster frame.
 *   node scripts/prepare-video.mjs <source.mp4> <slug> [posterSeconds]
 *
 * One file serves both the silent loop and the click-to-play viewing, so it is
 * a stream copy rather than a re-encode. The source is expected to
 * already be at delivery quality, and running it through x264 again would only
 * add a second generation of loss for no benefit. Hand this a raw master and it
 * will pass the master's weight straight through — compress it first.
 *
 * faststart moves the moov atom to the front of both files so playback can
 * begin before the whole thing has arrived. That is what keeps the click
 * responsive on the larger file.
 */
import { execFileSync } from "node:child_process";
import { mkdir, stat } from "node:fs/promises";

const [src, slug, posterAt = "0"] = process.argv.slice(2);
if (!src || !slug) {
  throw new Error("usage: node scripts/prepare-video.mjs <source.mp4> <slug> [posterSeconds]");
}

const OUT = new URL("../public/video/", import.meta.url).pathname;
await mkdir(OUT, { recursive: true });

const full = `${OUT}${slug}.mp4`;
const poster = `${OUT}${slug}-poster.jpg`;

const run = (args) =>
  execFileSync("ffmpeg", ["-y", ...args], { stdio: ["ignore", "ignore", "pipe"] });

run(["-i", src, "-c", "copy", "-movflags", "+faststart", full]);

run(["-ss", posterAt, "-i", full, "-frames:v", "1", "-q:v", "4", poster]);

const size = async (p) => (await stat(p)).size;
const mb = (n) => (n / 1048576).toFixed(1);
const dims = (p) =>
  execFileSync("ffprobe", [
    "-v", "error", "-select_streams", "v:0",
    "-show_entries", "stream=width,height",
    "-of", "csv=p=0:s=x", p,
  ]).toString().trim();
const hasAudio = (p) =>
  execFileSync("ffprobe", [
    "-v", "error", "-select_streams", "a",
    "-show_entries", "stream=codec_name",
    "-of", "csv=p=0", p,
  ]).toString().trim() !== "";

console.log(`nguồn                ${mb(await size(src))}MB  ${dims(src)}`);
console.log(`${slug}.mp4          ${mb(await size(full))}MB  ${dims(full)}  audio: ${hasAudio(full) ? "có" : "không"}  (stream copy, không giải nén lại)`);
console.log(`${slug}-poster.jpg   ${Math.round((await size(poster)) / 1024)}KB`);
