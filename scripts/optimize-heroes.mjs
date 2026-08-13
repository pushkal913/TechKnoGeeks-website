import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

// For every page: find the top banner (hero) background image; self-host + optimize
// any external (zohocdn) ones; recompress large local ones; and add a high-priority
// preload so the banner starts downloading immediately (fixes slow hero LCP).
const GEN = 'src/generated';
const PUB = 'public';
const MAX_W = 1600, Q = 70;

const heroRe = /background(?:-image)?:\s*[^;"}]*url\(([^)]+)\)/i;

async function optimizeBuffer(buf, ext) {
  let img = sharp(buf, { failOn: 'none' });
  const meta = await img.metadata();
  if (meta.width && meta.width > MAX_W) img = img.resize({ width: MAX_W, withoutEnlargement: true });
  if (meta.format === 'png') return img.png({ quality: Q, compressionLevel: 9, palette: true }).toBuffer();
  if (meta.format === 'webp') return img.webp({ quality: Q }).toBuffer();
  return img.jpeg({ quality: Q, mozjpeg: true }).toBuffer();
}

const pages = fs.readdirSync(GEN).filter(f => f.endsWith('.content.html'));
let preloaded = 0, selfHosted = 0, recompressed = 0;

for (const cf of pages) {
  const slug = cf.replace('.content.html', '');
  const cPath = path.join(GEN, cf), hPath = path.join(GEN, slug + '.head.html');
  let content = fs.readFileSync(cPath, 'utf8');
  let head = fs.readFileSync(hPath, 'utf8');

  const m = content.match(heroRe);
  if (!m) { continue; }
  let url = m[1].replace(/["']/g, '').trim();
  let localHref = url;

  if (/^https?:\/\//i.test(url)) {
    // external -> download, optimize, self-host
    try {
      const res = await fetch(url);
      const buf = Buffer.from(await res.arrayBuffer());
      const ext = (url.split('.').pop().split(/[?#]/)[0] || 'jpg').toLowerCase();
      const name = `hero-${slug}.${ext}`;
      const out = await optimizeBuffer(buf, ext);
      fs.writeFileSync(path.join(PUB, 'images', name), out);
      localHref = `/images/${name}`;
      content = content.split(url).join(localHref);
      fs.writeFileSync(cPath, content, 'utf8');
      selfHosted++;
      console.log(`self-hosted ${slug}: ${(buf.length/1024).toFixed(0)}KB -> ${(out.length/1024).toFixed(0)}KB  (${name})`);
    } catch (e) { console.log(`FAILED external ${slug}: ${e.message}`); continue; }
  } else if (url.startsWith('/')) {
    // local -> recompress if large
    const fp = path.join(PUB, decodeURIComponent(url));
    if (fs.existsSync(fp)) {
      const before = fs.statSync(fp).size;
      if (before > 110 * 1024) {
        const out = await optimizeBuffer(fs.readFileSync(fp), url.split('.').pop());
        if (out.length < before * 0.95) { fs.writeFileSync(fp, out); recompressed++; console.log(`recompressed ${slug} hero: ${(before/1024).toFixed(0)}KB -> ${(out.length/1024).toFixed(0)}KB`); }
      }
    }
  }

  // add preload (skip if already present for this href)
  if (!head.includes(`as="image"`) || !head.includes(localHref)) {
    const link = `<link rel="preload" as="image" href="${localHref}" fetchpriority="high"/>`;
    if (!head.includes(localHref)) {
      head = head.replace(/(<link rel="icon"[^>]*>)/i, `$1${link}`);
      if (!head.includes(localHref)) head = link + head;
      fs.writeFileSync(hPath, head, 'utf8');
      preloaded++;
    }
  }
}
console.log(`\nDone. self-hosted ${selfHosted}, recompressed ${recompressed}, preloads added ${preloaded}.`);
