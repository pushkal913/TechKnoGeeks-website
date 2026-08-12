import fs from 'fs';
import path from 'path';
import Beasties from 'beasties';

const DIST = process.argv[2] || 'dist';
const ONE = process.argv[3]; // optional single file for testing

const files = ONE ? [ONE] : fs.readdirSync(DIST).filter(f => f.endsWith('.html'));

for (const f of files) {
  const file = path.join(DIST, f);
  const html = fs.readFileSync(file, 'utf8');
  const beasties = new Beasties({
    path: DIST,          // where to resolve external CSS from
    publicPath: '/',     // strip leading / from hrefs
    pruneSource: false,  // keep full external CSS (shared across pages)
    preload: 'swap',     // load full CSS async via onload swap
    inlineFonts: false,
    fonts: false,        // don't touch @font-face handling (we self-host)
    reduceInlineStyles: false, // leave the page's existing inline <style> blocks alone
    logLevel: 'warn',
  });
  const before = html.length;
  const out = await beasties.process(html);
  const inlinedKB = ((out.length - before) / 1024).toFixed(0);
  fs.writeFileSync(file, out, 'utf8');
  console.log(`${f}: +${inlinedKB}KB inlined critical, stylesheets deferred`);
}
