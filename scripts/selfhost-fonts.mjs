import fs from 'fs';
import path from 'path';

// Reads the trimmed Google/Zoho webfont CSS, keeps only Latin subsets,
// downloads those woff2 files locally, writes public/fonts/fonts.css, and
// rewrites every page head to use the local stylesheet instead of the
// external webfonts.zoho.in request.
const SITE = process.argv[2];
const CSS_IN = process.argv[3]; // path to fetched fonts CSS
const FONTS_DIR = path.join(SITE, 'public', 'fonts');
const GEN = path.join(SITE, 'src', 'generated');
fs.mkdirSync(FONTS_DIR, { recursive: true });

const css = fs.readFileSync(CSS_IN, 'utf8');
const blocks = css.split('@font-face').slice(1).map(b => '@font-face' + b.slice(0, b.indexOf('}') + 1));

const KEEP = /font_latin(\.|_ext\.)woff2/i;
let kept = [];
let downloads = [];
for (const b of blocks) {
  const m = b.match(/url\("(\/\/[^"]+\.woff2)"\)/i);
  if (!m) continue;
  if (!KEEP.test(m[1])) continue;
  const url = 'https:' + m[1];
  // unique local name from <variantDir>_<file>
  const parts = m[1].split('/');
  const local = parts[parts.length - 2] + '_' + parts[parts.length - 1];
  downloads.push({ url, local });
  kept.push(b.replace(m[1], '/fonts/' + local));
}

// de-dupe downloads
const seen = new Set();
downloads = downloads.filter(d => (seen.has(d.local) ? false : seen.add(d.local)));

console.log(`Keeping ${kept.length} @font-face blocks, downloading ${downloads.length} woff2 files...`);
let ok = 0, fail = 0;
for (const d of downloads) {
  const dest = path.join(FONTS_DIR, d.local);
  if (fs.existsSync(dest)) { ok++; continue; }
  try {
    const res = await fetch(d.url);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const buf = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(dest, buf);
    ok++;
  } catch (e) { console.log('  FAIL', d.local, e.message); fail++; }
}
console.log(`Downloaded ${ok} fonts (${fail} failed).`);

fs.writeFileSync(path.join(FONTS_DIR, 'fonts.css'), kept.join('\n'), 'utf8');
console.log('Wrote public/fonts/fonts.css (' + (fs.statSync(path.join(FONTS_DIR,'fonts.css')).size/1024).toFixed(1) + ' KB)');

// Patch page heads: remove external webfonts links, inject local stylesheet + preload.
const localLink = '<link rel="stylesheet" href="/fonts/fonts.css"/>';
const preload = '<link rel="preload" as="font" type="font/woff2" href="/fonts/merriweatherregular_font_latin.woff2" crossorigin/>';
let patched = 0;
for (const f of fs.readdirSync(GEN).filter(f => f.endsWith('.head.html'))) {
  const p = path.join(GEN, f);
  let s = fs.readFileSync(p, 'utf8');
  const before = s;
  // drop any <link ... webfonts.zoho.in ...>
  s = s.replace(/<link\b[^>]*webfonts\.zoho\.in[^>]*>/gi, '');
  // inject our local links once (after the icon/favicon link)
  if (!s.includes('/fonts/fonts.css')) {
    s = s.replace(/(<link rel="icon"[^>]*>)/i, `$1${preload}${localLink}`);
    if (!s.includes('/fonts/fonts.css')) s = preload + localLink + s; // fallback
  }
  if (s !== before) { fs.writeFileSync(p, s, 'utf8'); patched++; }
}
console.log(`Patched ${patched} page heads to use local fonts.`);
