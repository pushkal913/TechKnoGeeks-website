import fs from 'fs';
import path from 'path';

// Removes decorative, non-unique SVG-internal id attributes (Sketch/Figma export
// leftovers like id="Path", id="Oval"). These are never referenced by ARIA
// (verified: only zptab-* ids are aria-referenced), so stripping them is safe and
// eliminates hundreds of duplicate-id violations without touching functional ids.
const GEN = process.argv[2];
const SAFE = /^(Path|Oval|Shape|Rectangle|Group|Page-1|Combined-Shape|Line|Fill|Stroke|Mask|Clip|Polygon|Star|Triangle|Vector|Ellipse|Icon)(-[A-Za-z0-9]+)*(-Copy(-[0-9]+)?)?$/;

let removed = 0;
const files = fs.readdirSync(GEN).filter(f => f.endsWith('.content.html') || f === 'header.html' || f === 'footer.html' || f === 'afterfooter.html');
for (const f of files) {
  const p = path.join(GEN, f);
  let s = fs.readFileSync(p, 'utf8');
  s = s.replace(/\s+id="([^"]+)"/g, (m, id) => {
    if (SAFE.test(id)) { removed++; return ''; }
    return m;
  });
  fs.writeFileSync(p, s, 'utf8');
}
console.log(`Removed ${removed} decorative SVG id attributes.`);
