import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const PUBLIC = process.argv[2];
const DRY = process.argv.includes('--dry');
const MAX_W = 1920;         // cap width; heroes never need more
const MIN_BYTES = 150 * 1024; // only touch files >150KB
const JPEG_Q = 80;
const PNG_Q = 80;

// Directories to scan for raster images (used + unused; slims repo too).
const SCAN = ['images', 'files', '.'];

function listImages(dir, recurse = true) {
  const out = [];
  const abs = path.join(PUBLIC, dir);
  if (!fs.existsSync(abs)) return out;
  for (const name of fs.readdirSync(abs)) {
    const full = path.join(abs, name);
    const st = fs.statSync(full);
    if (st.isDirectory()) {
      if (recurse && dir === '.') continue; // for '.' only top-level files
      if (recurse) out.push(...listImages(path.join(dir, name)));
    } else {
      out.push(full);
    }
  }
  return out;
}

// Gather candidate files.
let files = [];
files.push(...listImages('images'));
files.push(...listImages('files'));
// top-level public files only (not recursing into css/js/template/etc.)
for (const name of fs.readdirSync(PUBLIC)) {
  const full = path.join(PUBLIC, name);
  if (fs.statSync(full).isFile()) files.push(full);
}
files = [...new Set(files)];

let totalBefore = 0, totalAfter = 0, changed = 0, skipped = 0;
const rows = [];

for (const f of files) {
  // Read the whole file into memory first so sharp never holds an OS lock on
  // the path — on Windows, writing back to a path sharp still has open fails.
  const input = fs.readFileSync(f);
  let meta;
  try { meta = await sharp(input).metadata(); } catch { continue; } // not an image
  if (!meta || !['jpeg', 'png', 'webp'].includes(meta.format)) { skipped++; continue; }
  const before = input.length;
  if (before < MIN_BYTES) { skipped++; continue; }

  let pipe = sharp(input, { failOn: 'none' });
  if (meta.width && meta.width > MAX_W) pipe = pipe.resize({ width: MAX_W, withoutEnlargement: true });

  if (meta.format === 'jpeg') pipe = pipe.jpeg({ quality: JPEG_Q, mozjpeg: true });
  else if (meta.format === 'png') pipe = pipe.png({ quality: PNG_Q, compressionLevel: 9, palette: true });
  else if (meta.format === 'webp') pipe = pipe.webp({ quality: JPEG_Q });

  const buf = await pipe.toBuffer();
  // only write if we actually saved meaningful space
  if (buf.length < before * 0.92) {
    totalBefore += before; totalAfter += buf.length; changed++;
    rows.push([before, buf.length, path.relative(PUBLIC, f)]);
    if (!DRY) fs.writeFileSync(f, buf);
  } else { skipped++; }
}

rows.sort((a, b) => (b[0] - b[1]) - (a[0] - a[1]));
console.log(`${DRY ? '[DRY RUN] ' : ''}Optimized ${changed} images, skipped ${skipped}.`);
console.log(`Total: ${(totalBefore/1048576).toFixed(1)} MB -> ${(totalAfter/1048576).toFixed(1)} MB  (saved ${((totalBefore-totalAfter)/1048576).toFixed(1)} MB)`);
console.log('\nTop savings:');
for (const [b, a, name] of rows.slice(0, 15)) {
  console.log(`  ${(b/1024).toFixed(0).padStart(5)}KB -> ${(a/1024).toFixed(0).padStart(5)}KB   ${name}`);
}
