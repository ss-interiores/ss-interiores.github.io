// Publishes optimized WebP versions of the project renders.
// The PNGs in public/images/projetos stay as the source of truth; this script
// writes resized WebP files to public/images/otimizadas and a manifest with
// intrinsic dimensions and a tiny placeholder for each published render.
//
// Usage: node scripts/optimize-images.mjs [--force]
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve(import.meta.dirname, '..');
const publicDir = path.join(root, 'public');
const sourceDir = path.join(publicDir, 'images/projetos');
const outputDir = path.join(publicDir, 'images/otimizadas');
const manifestFile = path.join(root, 'src/app/shared/responsive-photos.generated.ts');
const approvedFile = path.join(root, 'src/app/shared/approved-photo-assets.ts');

const WIDTHS = [480, 960, 1440];
const WEBP = { quality: 76, effort: 6, smartSubsample: true };
const PLACEHOLDER_WIDTH = 16;
const force = process.argv.includes('--force');

const toPosix = (file) => file.split(path.sep).join('/');

async function walk(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map((entry) => {
    const file = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(file) : [file];
  }));
  return files.flat();
}

async function mtime(file) {
  try {
    return (await fs.stat(file)).mtimeMs;
  } catch {
    return -1;
  }
}

/** Originals replaced by an approved version are never published. */
async function supersededSources() {
  const source = await fs.readFile(approvedFile, 'utf8');
  const match = source.match(/= (\{[\s\S]*\});/);
  if (!match) throw new Error('Cannot read approved photo assets');
  return new Set(Object.keys(JSON.parse(match[1])).filter((key) => key.endsWith('.png')));
}

async function previousManifest() {
  try {
    const source = await fs.readFile(manifestFile, 'utf8');
    const match = source.match(/= (\{[\s\S]*\});/);
    return match ? JSON.parse(match[1]) : {};
  } catch {
    return {};
  }
}

/** Runs async jobs with bounded concurrency (sharp already uses a thread pool). */
async function pool(items, limit, job) {
  const results = new Array(items.length);
  let next = 0;
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (next < items.length) {
      const index = next++;
      results[index] = await job(items[index]);
    }
  }));
  return results;
}

async function optimize(file, previous) {
  const key = toPosix(path.relative(publicDir, file)); // images/projetos/...png
  const base = toPosix(path.relative(path.join(publicDir, 'images'), file)).replace(/\.png$/i, '');
  const sourceTime = await mtime(file);
  const metadata = await sharp(file).metadata();
  const { width, height } = metadata;
  const widths = [...new Set(WIDTHS.map((target) => Math.min(target, width)))];
  const outputs = widths.map((target) => ({ target, file: path.join(outputDir, `${base}-${target}.webp`) }));

  const stale = [];
  for (const output of outputs) {
    if (force || (await mtime(output.file)) < sourceTime) stale.push(output);
  }

  let placeholder = previous?.width === width && previous?.height === height ? previous.placeholder : undefined;
  if (stale.length || !placeholder) {
    // Renders are opaque; dropping an unused alpha channel keeps the WebP smaller.
    const opaque = !metadata.hasAlpha || (await sharp(file).stats()).isOpaque;
    const input = () => (opaque ? sharp(file).removeAlpha() : sharp(file));
    for (const output of stale) {
      await fs.mkdir(path.dirname(output.file), { recursive: true });
      await input().resize({ width: output.target, withoutEnlargement: true }).webp(WEBP).toFile(output.file);
    }
    const tiny = await input().resize({ width: PLACEHOLDER_WIDTH }).webp({ quality: 40, effort: 6 }).toBuffer();
    placeholder = tiny.toString('base64');
  }

  const sizes = await Promise.all(outputs.map(async (output) => (await fs.stat(output.file)).size));
  return {
    key,
    entry: { width, height, widths, placeholder },
    files: outputs.map((output) => output.file),
    generated: stale.length,
    sourceBytes: (await fs.stat(file)).size,
    largestBytes: sizes.at(-1),
    mediumBytes: sizes[Math.min(1, sizes.length - 1)],
  };
}

async function prune(expected) {
  let removed = 0;
  const files = await walk(outputDir).catch(() => []);
  for (const file of files) {
    if (!expected.has(file)) {
      await fs.rm(file);
      removed++;
    }
  }
  // Remove directories left empty by superseded renders.
  const directories = async (directory) => {
    const entries = await fs.readdir(directory, { withFileTypes: true }).catch(() => []);
    for (const entry of entries) if (entry.isDirectory()) await directories(path.join(directory, entry.name));
    if (directory !== outputDir && !(await fs.readdir(directory)).length) await fs.rmdir(directory);
  };
  await directories(outputDir);
  return removed;
}

const superseded = await supersededSources();
const sources = (await walk(sourceDir))
  .filter((file) => /\.png$/i.test(file))
  .filter((file) => !superseded.has(toPosix(path.relative(publicDir, file))))
  .sort();
const previous = await previousManifest();
const results = await pool(sources, 4, (file) => optimize(file, previous[toPosix(path.relative(publicDir, file))]));
const removed = await prune(new Set(results.flatMap((result) => result.files)));

const manifest = Object.fromEntries(results.map((result) => [result.key, result.entry]));
const source = `// Generated by scripts/optimize-images.mjs. Do not edit by hand; run \`npm run images\`.
export interface ResponsivePhotoEntry {
  readonly width: number;
  readonly height: number;
  readonly widths: readonly number[];
  /** Base64 WebP, ${PLACEHOLDER_WIDTH}px wide, used as a blurred placeholder. */
  readonly placeholder: string;
}

export const RESPONSIVE_PHOTOS: Readonly<Record<string, ResponsivePhotoEntry>> = ${JSON.stringify(manifest, null, 2)};
`;
const current = await fs.readFile(manifestFile, 'utf8').catch(() => '');
if (current !== source) await fs.writeFile(manifestFile, source);

const mb = (bytes) => `${(bytes / 1024 / 1024).toFixed(1)} MB`;
const total = (field) => results.reduce((sum, result) => sum + result[field], 0);
console.log(
  `Optimized renders: ${results.length} sources, ${total('generated')} WebP files written, ${removed} stale files removed.\n` +
  `  PNG originals: ${mb(total('sourceBytes'))} | WebP 960w: ${mb(total('mediumBytes'))} | WebP largest: ${mb(total('largestBytes'))}`,
);
