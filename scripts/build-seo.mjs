import fs from 'fs';

// Single source of truth for per-page head SEO:
//  - Open Graph + Twitter card tags (title/desc/url/type/image) on every non-home page
//  - JSON-LD @graph: enriched Organization (+founders) > WebSite > WebPage
//    > BreadcrumbList (non-home) > Service (service pages) > FAQPage (pages with FAQs)
//  - Visible, accessible FAQ accordion on FAQ pages (schema text === visible text)
// Re-runnable and idempotent (marker-wrapped blocks / full-node replacement).
// Homepage OG tags are kept as-is per requirement (only its broken image path is fixed).
const GEN = 'src/generated';
const ORG = 'https://www.techknogeeks.com/#organization';
const SITE = 'https://www.techknogeeks.com';
const LOGO = SITE + '/no%20background%20logo%20-1-.png';
const OGIMG = SITE + '/LAST%20FINAL%20LOGO%20CONFIRMED.PNG';
const BOOK = 'https://techknogeeks.zohobookings.in/433051000000032055';
const FAQ = JSON.parse(fs.readFileSync('scripts/faq-data.json', 'utf8'));
const byId = (ids) => ids.map(id => ({ q: FAQ[id].q, a: FAQ[id].a }));
const svcCrumb = { name: 'Services', url: SITE + '/services' };

const PAGES = {
  index: {
    url: SITE + '/', homepage: true,
    faqs: [
      { q: 'What does TechKnoGeeks do?', a: 'TechKnoGeeks is a Zoho consulting and implementation partner. We help businesses integrate, automate and scale using the Zoho ecosystem — CRM, Books, Creator, Analytics and more — along with cross-platform integrations. The focus is on designing the right solution around your business process rather than selling a fixed software bundle.' },
      { q: 'Which Zoho products and tools do you work with?', a: 'We work across the Zoho suite, including Zoho CRM, Zoho One, Creator, Analytics, Books, Inventory, Desk, Campaigns and Flow, and connect them with external platforms such as Twilio, RingCentral, Power BI, QuickBooks, Shopify and custom APIs. The exact stack depends on what your business actually needs.' },
      { q: 'How do we get started with TechKnoGeeks?', a: 'The best starting point is a short discovery conversation about your business processes, current tools and goals. From there we map requirements, recommend the right Zoho setup and prepare a clear scope and estimate. You can book a free consultation to begin.' },
    ],
  },
  services: {
    url: SITE + '/services',
    service: { name: 'Zoho consulting and implementation services', serviceType: 'Zoho consulting, implementation, automation and integration services',
      description: 'Consulting, implementation, migration, customization, integrations, analytics, custom applications, accounting, telephony and AI solutions across the Zoho ecosystem.',
      audience: 'Businesses evaluating or using Zoho' },
    crumb: [svcCrumb],
    faqs: byId(['F001', 'F002', 'F003', 'F004']),
  },
  'crm-database': {
    url: SITE + '/crm-database',
    service: { name: 'Zoho CRM and Database Solutions', serviceType: 'Zoho CRM consulting, implementation, migration and automation',
      description: 'Zoho CRM setup, customization, custom modules, data migration and workflow automation, together with custom database solutions built around your business process.',
      audience: 'Businesses implementing or improving Zoho CRM' },
    crumb: [svcCrumb, { name: 'CRM & Database', url: SITE + '/crm-database' }],
    faqs: byId(['F005', 'F006', 'F007', 'F008', 'F009', 'F012', 'F013', 'F015', 'F022', 'F023', 'F028', 'F010', 'F011']),
  },
  'data-driven-decisions-seamless-integrations': {
    url: SITE + '/data-driven-decisions-seamless-integrations',
    service: { name: 'Zoho Analytics and Integration Services', serviceType: 'Zoho Analytics, dashboards and system integrations',
      description: 'Zoho Analytics dashboards and reporting, plus integrations connecting Zoho with accounting, ecommerce, communications, APIs and databases.',
      audience: 'Businesses needing analytics and integrations in Zoho' },
    crumb: [svcCrumb, { name: 'Analytics & Integration', url: SITE + '/data-driven-decisions-seamless-integrations' }],
    faqs: byId(['F017', 'F018', 'F019', 'F020', 'F021', 'F032', 'F033', 'F034']),
  },
  'web-app-development': {
    url: SITE + '/web-app-development',
    service: { name: 'Zoho Creator and Web App Development', serviceType: 'Custom Zoho Creator applications and web development',
      description: 'Design and development of custom Zoho Creator applications, portals, workflows, interfaces and integrations based on your business requirements.',
      audience: 'Businesses needing custom applications on Zoho' },
    crumb: [svcCrumb, { name: 'Web & App Development', url: SITE + '/web-app-development' }],
    faqs: byId(['F029', 'F030', 'F031']),
  },
  'telephony-ai-solutions': {
    url: SITE + '/telephony-ai-solutions',
    service: { name: 'Zoho Telephony and AI Automation', serviceType: 'Zoho telephony, Twilio/RingCentral and AI integrations',
      description: 'Twilio and RingCentral telephony connected to Zoho, plus AI chatbots and AI-assisted workflows implemented with appropriate permissions and review.',
      audience: 'Businesses adding telephony and AI to Zoho' },
    crumb: [svcCrumb, { name: 'Telephony & AI', url: SITE + '/telephony-ai-solutions' }],
    faqs: byId(['F038', 'F039', 'F040']),
  },
  'accounting-recruitment': {
    url: SITE + '/accounting-recruitment',
    service: { name: 'Zoho Books Accounting and Recruitment Automation', serviceType: 'Zoho Books accounting and Zoho Recruit hiring automation',
      description: 'Accounting automation with Zoho Books and hiring workflows with Zoho Recruit — invoicing, reconciliation, approvals, candidate pipelines and onboarding.',
      audience: 'Businesses automating finance and hiring on Zoho' },
    crumb: [svcCrumb, { name: 'Accounting & Recruitment', url: SITE + '/accounting-recruitment' }],
  },
  'growth-engine-sales-marketing-lead-mastery': {
    url: SITE + '/growth-engine-sales-marketing-lead-mastery',
    service: { name: 'Zoho Sales, Marketing and Lead Generation', serviceType: 'Zoho CRM, Campaigns and marketing automation',
      description: 'Lead generation, campaign automation, nurturing and sales–marketing alignment using Zoho CRM, Campaigns, Marketing Automation and Social.',
      audience: 'Businesses growing sales and marketing with Zoho' },
    crumb: [svcCrumb, { name: 'Sales, Marketing & Leads', url: SITE + '/growth-engine-sales-marketing-lead-mastery' }],
  },
  'about-us': { url: SITE + '/about-us', crumb: [{ name: 'About', url: SITE + '/about-us' }] },
  contact: { url: SITE + '/contact', crumb: [{ name: 'Contact', url: SITE + '/contact' }] },
  plans: { url: SITE + '/plans', crumb: [{ name: 'Plans', url: SITE + '/plans' }] },
};

// ---- helpers ----
const htmlDecode = (s) => s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"').replace(/&#0?39;|&#x27;|&apos;/g, "'").replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n));
const attrEsc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const escHtml = (t) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function readMeta(head) {
  const t = (head.match(/<title>([\s\S]*?)<\/title>/) || [])[1] || '';
  const d = (head.match(/<meta name="description" content="([\s\S]*?)"\s*\/?>/) || [])[1] || '';
  return { title: htmlDecode(t).trim(), desc: htmlDecode(d).trim() };
}

// ---- Organization (enriched, shared across all pages) ----
function orgNode() {
  return {
    '@type': 'Organization', '@id': ORG, name: 'TechKnoGeeks', url: SITE, logo: LOGO, image: OGIMG,
    description: 'TechKnoGeeks is a Zoho consulting and implementation partner helping businesses integrate, automate and scale with the Zoho ecosystem — CRM, Books, Creator, Analytics and cross-platform integrations.',
    areaServed: 'Worldwide',
    knowsAbout: ['Zoho CRM', 'Zoho Books', 'Zoho Creator', 'Zoho Analytics', 'Zoho One', 'System integration', 'Business process automation'],
    founder: [{ '@type': 'Person', name: 'Pushkal Sharma' }, { '@type': 'Person', name: 'Stuti Sharma' }],
    sameAs: ['https://www.linkedin.com/company/techknogeeks', 'https://wa.me/919878191721'],
  };
}

function graph(cfg, meta) {
  const g = { '@context': 'https://schema.org', '@graph': [
    orgNode(),
    { '@type': 'WebSite', '@id': SITE + '/#website', url: SITE, name: 'TechKnoGeeks', publisher: { '@id': ORG } },
  ] };
  const wp = { '@type': 'WebPage', '@id': cfg.url + '#webpage', url: cfg.url, name: meta.title,
    description: meta.desc, isPartOf: { '@id': SITE + '/#website' }, about: { '@id': ORG } };
  if (cfg.faqs) wp.hasPart = { '@id': cfg.url + '#faq' };
  if (cfg.service) wp.mainEntity = { '@id': cfg.url + '#service' };
  if (cfg.crumb) wp.breadcrumb = { '@id': cfg.url + '#breadcrumb' };
  g['@graph'].push(wp);
  if (cfg.crumb) {
    const trail = [{ name: 'Home', url: SITE + '/' }, ...cfg.crumb];
    g['@graph'].push({ '@type': 'BreadcrumbList', '@id': cfg.url + '#breadcrumb',
      itemListElement: trail.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: c.url })) });
  }
  if (cfg.service) g['@graph'].push({ '@type': 'Service', '@id': cfg.url + '#service', name: cfg.service.name,
    serviceType: cfg.service.serviceType, description: cfg.service.description, url: cfg.url, provider: { '@id': ORG },
    audience: { '@type': 'Audience', audienceType: cfg.service.audience }, areaServed: 'Worldwide' });
  if (cfg.faqs) g['@graph'].push({ '@type': 'FAQPage', '@id': cfg.url + '#faq',
    mainEntity: cfg.faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) });
  return '<script type="application/ld+json">' + JSON.stringify(g) + '</script>';
}

function ogBlock(cfg, meta) {
  const T = attrEsc(meta.title), D = attrEsc(meta.desc), U = cfg.url;
  return ['<!--tkg-og-start-->',
    `<meta property="og:type" content="website">`,
    `<meta property="og:site_name" content="TechKnoGeeks">`,
    `<meta property="og:url" content="${U}">`,
    `<meta property="og:title" content="${T}">`,
    `<meta property="og:description" content="${D}">`,
    `<meta property="og:image" content="${OGIMG}">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:url" content="${U}">`,
    `<meta name="twitter:title" content="${T}">`,
    `<meta name="twitter:description" content="${D}">`,
    `<meta name="twitter:image" content="${OGIMG}">`,
    '<!--tkg-og-end-->'].join('');
}

// ---- FAQ visible section ----
const STYLE = `<style>
.tkg-faq{background:#f5f8fc;padding:60px 20px;font-family:"Merriweather",Georgia,serif}
.tkg-faq *{box-sizing:border-box}
.tkg-faq-wrap{max-width:840px;margin:0 auto}
.tkg-faq h2{font-family:"Merriweather",serif;color:#0b1f3a;text-align:center;font-size:clamp(1.6rem,3.6vw,2.2rem);margin:0 0 30px;letter-spacing:-.01em}
.tkg-faq-list{display:flex;flex-direction:column;gap:12px}
.tkg-faq-item{background:#fff;border:1px solid #e2ecf6;border-radius:12px}
.tkg-faq-item summary{list-style:none;cursor:pointer;padding:18px 22px;font-weight:700;color:#0b1f3a;font-size:1.04rem;line-height:1.4;display:flex;justify-content:space-between;align-items:center;gap:18px}
.tkg-faq-item summary::-webkit-details-marker{display:none}
.tkg-faq-item summary:focus-visible{outline:2px solid #0074C1;outline-offset:3px;border-radius:12px}
.tkg-faq-item .ic{flex:0 0 auto;width:24px;height:24px;border-radius:50%;border:2px solid #0074C1;color:#0074C1;display:flex;align-items:center;justify-content:center;font-size:18px;line-height:1;transition:transform .2s}
.tkg-faq-item[open] .ic{transform:rotate(45deg)}
.tkg-faq-a{padding:0 22px 20px;color:#475569;font-size:.98rem;line-height:1.7}
.tkg-faq-a p{margin:0}
.tkg-faq-cta{text-align:center;margin-top:28px;color:#475569;font-size:1rem}
.tkg-faq-cta a{color:#0074C1;font-weight:800;text-decoration:none}
.tkg-faq-cta a:hover{text-decoration:underline}
@media(max-width:600px){.tkg-faq{padding:44px 16px}.tkg-faq-item summary{font-size:.98rem;padding:16px 18px}.tkg-faq-a{padding:0 18px 18px}}
</style>`;

function faqSection(cfg) {
  const items = cfg.faqs.map(f =>
    `<details class="tkg-faq-item"><summary><span>${escHtml(f.q)}</span><span class="ic" aria-hidden="true">+</span></summary><div class="tkg-faq-a"><p>${escHtml(f.a)}</p></div></details>`
  ).join('');
  return `<!--tkg-faq-start-->${STYLE}<section class="tkg-faq" aria-labelledby="tkg-faq-h"><div class="tkg-faq-wrap"><h2 id="tkg-faq-h">Frequently Asked Questions</h2><div class="tkg-faq-list">${items}</div><p class="tkg-faq-cta">Still have a question? <a href="${BOOK}" target="_blank" rel="noopener">Book a free consultation &rarr;</a></p></div></section><!--tkg-faq-end-->`;
}

// ---- apply ----
let faqTotal = 0;
for (const [slug, cfg] of Object.entries(PAGES)) {
  const hPath = `${GEN}/${slug}.head.html`;
  let h = fs.readFileSync(hPath, 'utf8');
  const meta = readMeta(h);

  // OG/Twitter: homepage keeps its existing tags (only fix broken image path); others get a fresh complete set.
  if (cfg.homepage) {
    h = h.replace(/\/files\/LAST%20FINAL%20LOGO%20CONFIRMED\.PNG/g, '/LAST%20FINAL%20LOGO%20CONFIRMED.PNG');
  } else {
    h = h.replace(/<!--tkg-og-start-->[\s\S]*?<!--tkg-og-end-->/g, '');
    h = h.replace(/\s*<meta property="og:[^"]*"[^>]*>/g, '');
    h = h.replace(/\s*<meta name="twitter:[^"]*"[^>]*>/g, '');
    // place the fresh block right after the canonical link
    if (/<link rel="canonical"[^>]*>/.test(h)) h = h.replace(/(<link rel="canonical"[^>]*>)/, `$1${ogBlock(cfg, meta)}`);
    else h = h + ogBlock(cfg, meta);
  }

  // JSON-LD: replace ALL existing ld+json (legacy Zoho schemagenerator or prior graph) with one connected graph.
  h = h.replace(/\s*<script type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/g, '');
  h = h + graph(cfg, meta);
  fs.writeFileSync(hPath, h, 'utf8');

  // Visible FAQ accordion (only pages with FAQs).
  if (cfg.faqs) {
    const cPath = `${GEN}/${slug}.content.html`;
    let c = fs.readFileSync(cPath, 'utf8');
    const section = faqSection(cfg);
    c = c.includes('<!--tkg-faq-start-->') ? c.replace(/<!--tkg-faq-start-->[\s\S]*?<!--tkg-faq-end-->/, section) : c + section;
    fs.writeFileSync(cPath, c, 'utf8');
    faqTotal += cfg.faqs.length;
  }

  const tags = ['Org+Web+Page'];
  if (cfg.crumb) tags.push('Breadcrumb');
  if (cfg.service) tags.push('Service');
  if (cfg.faqs) tags.push('FAQ(' + cfg.faqs.length + ')');
  console.log(slug.padEnd(46) + (cfg.homepage ? 'OG kept' : 'OG set ') + '  ' + tags.join('+'));
}
console.log('\nPages processed: ' + Object.keys(PAGES).length + ', FAQs: ' + faqTotal);
