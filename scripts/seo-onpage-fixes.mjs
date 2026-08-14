import fs from 'fs';
import path from 'path';

// One-time on-page SEO pass: convert each page's hero <h2> to a semantic keyword-led
// <h1> (keeping styling), set a keyword title, and add a unique meta description.
const GEN = 'src/generated';
const esc = (t) => t.replace(/&/g, '&amp;');

const M = {
  'about-us': { h1:'About TechKnoGeeks — Your Zoho Partner', title:'About TechKnoGeeks | Zoho Implementation Partner',
    desc:"Meet TechKnoGeeks — a certified Zoho partner helping businesses integrate, automate and scale with CRM, Books, Creator and Analytics. Let's build your stack." },
  'services': { h1:'Zoho Implementation & Automation Services', title:'Zoho Implementation & Automation Services | TechKnoGeeks',
    desc:"End-to-end Zoho implementation and automation services — CRM, Books, Creator, Analytics and cross-platform integrations tailored to your workflows. Book a call." },
  'crm-database': { h1:'Zoho CRM & Custom Database Solutions', title:'Zoho CRM & Custom Database Solutions | TechKnoGeeks',
    desc:"Custom Zoho CRM setup and database solutions — clean data, smart automation and integrations that give your team one source of truth. Get a free consultation." },
  'web-app-development': { h1:'Zoho Creator & Custom Web App Development', title:'Zoho Creator & Web App Development | TechKnoGeeks',
    desc:"Custom web portals and mobile apps built on Zoho Creator and wired into your business logic. Turn manual processes into software. Talk to our team today." },
  'telephony-ai-solutions': { h1:'Zoho Telephony & AI Automation', title:'Zoho Telephony & AI Automation | TechKnoGeeks',
    desc:"Connect Twilio and RingCentral to Zoho and add AI chatbots and voice automation for smarter communication and fewer manual tasks. Explore our AI solutions." },
  'data-driven-decisions-seamless-integrations': { h1:'Zoho Analytics & Data Integration', title:'Zoho Analytics & Data Integration | TechKnoGeeks',
    desc:"Zoho Analytics and Power BI dashboards plus seamless integrations that turn scattered data into clear decisions. See your business clearly — book a free call." },
  'accounting-recruitment': { h1:'Zoho Books & Recruitment Automation', title:'Zoho Books & Recruitment Automation | TechKnoGeeks',
    desc:"Automate accounting with Zoho Books and streamline hiring with Zoho Recruit — accurate finances and faster recruitment without the busywork. Get started today." },
  'contact': { h1:'Contact TechKnoGeeks', title:'Contact TechKnoGeeks | Zoho Consulting & Support',
    desc:"Get in touch with TechKnoGeeks for Zoho implementation, automation and support. Email, call or send a message — we reply fast. Book your free consultation." },
  // already have an <h1>; title + meta only
  'plans': { title:'Zoho Development & Support Plans | TechKnoGeeks',
    desc:"Flexible monthly and fixed-price Zoho plans — from CRM setup to custom-coded ecosystems and ongoing support. No lock-in. Pick the tier that fits and scale." },
  'growth-engine-sales-marketing-lead-mastery': { title:'Sales, Marketing & Lead Generation | TechKnoGeeks',
    desc:"Fuel growth with Zoho-powered sales, marketing and lead generation — campaigns, automation and pipelines that compound. Turn leads into revenue. Book a call." },
};

const rows = [];
for (const [slug, cfg] of Object.entries(M)) {
  const cPath = path.join(GEN, slug + '.content.html');
  const hPath = path.join(GEN, slug + '.head.html');

  // --- H1: convert first hero <h2> -> <h1>, keep class + first span style, new text ---
  if (cfg.h1) {
    let c = fs.readFileSync(cPath, 'utf8');
    const m = c.match(/<h2\b([^>]*)>([\s\S]*?)<\/h2>/i);
    if (m) {
      const spanStyle = (m[2].match(/<span style="([^"]*)"/) || [])[1];
      const inner = spanStyle ? `<span style="${spanStyle}">${esc(cfg.h1)}</span>` : esc(cfg.h1);
      c = c.replace(m[0], `<h1${m[1]}>${inner}</h1>`);
      fs.writeFileSync(cPath, c, 'utf8');
    }
  }

  // --- head: title + meta description ---
  let h = fs.readFileSync(hPath, 'utf8');
  if (cfg.title) h = h.replace(/<title>[\s\S]*?<\/title>/i, `<title>${esc(cfg.title)}</title>`);
  if (cfg.desc) {
    const meta = `<meta name="description" content="${esc(cfg.desc)}"/>`;
    if (/<meta name="description"[^>]*>/i.test(h)) h = h.replace(/<meta name="description"[^>]*>/i, meta);
    else h = h.replace(/(<link rel="canonical"[^>]*>)/i, `$1${meta}`);
  }
  fs.writeFileSync(hPath, h, 'utf8');
  rows.push([slug, cfg.title || '(kept)', (cfg.desc || '').length]);
}

console.log('slug'.padEnd(46), 'descLen', ' title');
for (const [s, t, dl] of rows) console.log(s.padEnd(46), String(dl).padStart(6), ' ', t);
