import fs from 'fs';
import path from 'path';

// Adds descriptive alt text to <img> tags missing a meaningful alt. Descriptive
// filenames become descriptive alts; generic stock filenames fall back to a
// page-topic alt; spacers/decorative SVGs get alt="".
const GEN = 'src/generated';
const topic = {
  'about-us':'TechKnoGeeks team delivering Zoho solutions',
  'accounting-recruitment':'Accounting and recruitment automation with Zoho',
  'crm-database':'Zoho CRM and custom database solutions',
  'data-driven-decisions-seamless-integrations':'Data analytics and integration dashboards',
  'growth-engine-sales-marketing-lead-mastery':'Sales, marketing and lead generation with Zoho',
  'services':'Zoho consulting and automation services',
  'telephony-ai-solutions':'Zoho telephony and AI automation',
  'web-app-development':'Custom web and app development on Zoho Creator',
};
const STOP = new Set(['photo','pexels','premium','zpstock','image','jpg','png','webp','svg','concept','1280','640','1x1','1','2','with','and','the','a','an','on','in','of','to','is','at','her','his','new']);
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);

function altFor(src, pageTopic) {
  const name = decodeURIComponent((src.split('/').pop() || '')).replace(/\.(jpe?g|png|webp|svg)$/i, '');
  if (/logo/i.test(name)) return 'TechKnoGeeks logo';
  if (/^1x1$/i.test(name) || /^zpstock-image-\d+$/i.test(name) && /\.svg/i.test(src)) return ''; // spacer / decorative
  let n = name.replace(/-\d+$/, '').replace(/_\d+$/, '');
  const words = n.split(/[-_\s]+/).filter(w => /[a-zA-Z]/.test(w));
  const meaningful = words.filter(w => !STOP.has(w.toLowerCase()) && !/^[0-9a-f]{6,}$/i.test(w) && !/^\d+$/.test(w));
  if (meaningful.length >= 2) return cap(meaningful.slice(0, 10).join(' '));
  return pageTopic; // generic stock photo -> page context
}

let added = 0, decorative = 0;
const log = [];
for (const f of fs.readdirSync(GEN).filter(x => x.endsWith('.content.html'))) {
  const slug = f.replace('.content.html', '');
  const pageTopic = topic[slug] || 'TechKnoGeeks Zoho solutions';
  const p = path.join(GEN, f);
  let s = fs.readFileSync(p, 'utf8');
  s = s.replace(/<img\b[^>]*>/gi, (tag) => {
    const am = tag.match(/\salt="([^"]*)"/i);
    if (am && am[1].trim()) return tag; // already has meaningful alt
    const src = (tag.match(/src="([^"]+)"/) || [])[1] || '';
    const alt = altFor(src, pageTopic);
    if (alt === '') decorative++; else added++;
    log.push([slug, (src.split('/').pop()||'').slice(0,34), alt || '(decorative "")']);
    if (am) return tag.replace(/\salt="[^"]*"/i, ` alt="${alt}"`);
    return tag.replace(/<img\b/i, `<img alt="${alt}"`);
  });
  fs.writeFileSync(p, s, 'utf8');
}
console.log(`Added ${added} descriptive alts, ${decorative} decorative (alt="").\n`);
for (const [pg, src, alt] of log) console.log('  ' + pg.slice(0,26).padEnd(27) + src.padEnd(35) + alt);
