import fs from 'fs';
import path from 'path';

// Adds loading="lazy" + decoding="async" to <img> tags that lack a loading attr.
// Runs only on page CONTENT fragments (not the header, whose logo is above the fold).
const GEN = process.argv[2];
const files = fs.readdirSync(GEN).filter(f => f.endsWith('.content.html'));

let totalImgs = 0, patched = 0;
for (const f of files) {
  const p = path.join(GEN, f);
  let s = fs.readFileSync(p, 'utf8');
  let first = true; // leave the first image on each page eager (potential LCP)
  s = s.replace(/<img\b[^>]*>/gi, (tag) => {
    totalImgs++;
    if (first) { first = false; return tag; }
    if (/\bloading\s*=/i.test(tag)) return tag;
    patched++;
    return tag.replace(/<img\b/i, '<img loading="lazy" decoding="async"');
  });
  fs.writeFileSync(p, s, 'utf8');
}
console.log(`Scanned ${totalImgs} <img> tags across ${files.length} pages; added lazy-loading to ${patched}.`);
