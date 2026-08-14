import fs from 'fs';

// Adds a visible, accessible FAQ section + a connected JSON-LD @graph to each page.
// Interim plan (Option B): approved FAQs placed on existing pages, no duplicates.
// FAQ text is loaded from faq-data.json (extracted from the owner's workbook);
// homepage FAQs are broad brand-level Q&As. Schema answer text === visible answer.
const GEN = 'src/generated';
const ORG = 'https://www.techknogeeks.com/#organization';
const SITE = 'https://www.techknogeeks.com';
const FAQ = JSON.parse(fs.readFileSync('scripts/faq-data.json', 'utf8'));
const byId = (ids) => ids.map(id => ({ q: FAQ[id].q, a: FAQ[id].a }));

const PAGES = {
  services: {
    url: SITE + '/services', webName: 'Zoho Implementation, Automation & Support Services',
    webDesc: 'End-to-end Zoho implementation and automation services — CRM, Books, Creator, Analytics and cross-platform integrations tailored to your workflows.',
    service: { name: 'Zoho consulting and implementation services', serviceType: 'Zoho consulting, implementation, automation and integration services',
      description: 'Consulting, implementation, migration, customization, integrations, analytics, custom applications, accounting, telephony and AI solutions across the Zoho ecosystem.',
      audience: 'Businesses evaluating or using Zoho', areaServed: 'Worldwide' },
    faqs: byId(['F001', 'F002', 'F003', 'F004']),
  },
  'crm-database': {
    url: SITE + '/crm-database', webName: 'Zoho CRM & Custom Database Solutions',
    webDesc: 'Custom Zoho CRM setup and database solutions — clean data, smart automation and integrations that give your team one source of truth.',
    service: { name: 'Zoho CRM and Database Solutions', serviceType: 'Zoho CRM consulting, implementation, migration and automation',
      description: 'Zoho CRM setup, customization, custom modules, data migration and workflow automation, together with custom database solutions built around your business process.',
      audience: 'Businesses implementing or improving Zoho CRM', areaServed: 'Worldwide' },
    faqs: byId(['F005', 'F006', 'F007', 'F008', 'F009', 'F012', 'F013', 'F015', 'F022', 'F023', 'F028', 'F010', 'F011']),
  },
  'data-driven-decisions-seamless-integrations': {
    url: SITE + '/data-driven-decisions-seamless-integrations', webName: 'Zoho Analytics & Data Integration',
    webDesc: 'Zoho Analytics and Power BI dashboards plus seamless integrations that turn scattered data into clear decisions.',
    service: { name: 'Zoho Analytics and Integration Services', serviceType: 'Zoho Analytics, dashboards and system integrations',
      description: 'Zoho Analytics dashboards and reporting, plus integrations connecting Zoho with accounting, ecommerce, communications, APIs and databases.',
      audience: 'Businesses needing analytics and integrations in Zoho', areaServed: 'Worldwide' },
    faqs: byId(['F017', 'F018', 'F019', 'F020', 'F021', 'F032', 'F033', 'F034']),
  },
  'web-app-development': {
    url: SITE + '/web-app-development', webName: 'Zoho Creator & Custom Web App Development',
    webDesc: 'Custom web portals and mobile apps built on Zoho Creator and wired into your business logic. Turn manual processes into software.',
    service: { name: 'Zoho Creator and Web App Development', serviceType: 'Custom Zoho Creator applications and web development',
      description: 'Design and development of custom Zoho Creator applications, portals, workflows, interfaces and integrations based on your business requirements.',
      audience: 'Businesses needing custom applications on Zoho', areaServed: 'Worldwide' },
    faqs: byId(['F029', 'F030', 'F031']),
  },
  'telephony-ai-solutions': {
    url: SITE + '/telephony-ai-solutions', webName: 'Zoho Telephony & AI Automation',
    webDesc: 'Connect Twilio and RingCentral to Zoho and add AI chatbots and voice automation for smarter communication and fewer manual tasks.',
    service: { name: 'Zoho Telephony and AI Automation', serviceType: 'Zoho telephony, Twilio/RingCentral and AI integrations',
      description: 'Twilio and RingCentral telephony connected to Zoho, plus AI chatbots and AI-assisted workflows implemented with appropriate permissions and review.',
      audience: 'Businesses adding telephony and AI to Zoho', areaServed: 'Worldwide' },
    faqs: byId(['F038', 'F039', 'F040']),
  },
  index: {
    url: SITE + '/', homepage: true, webName: 'TechKnoGeeks — Zoho Integrations & Automation',
    webDesc: 'TechKnoGeeks helps businesses integrate, automate and scale with the complete Zoho Suite — CRM, Books, Creator, Analytics and cross-platform integrations.',
    faqs: [
      { q: 'What does TechKnoGeeks do?', a: 'TechKnoGeeks is a Zoho consulting and implementation partner. We help businesses integrate, automate and scale using the Zoho ecosystem — CRM, Books, Creator, Analytics and more — along with cross-platform integrations. The focus is on designing the right solution around your business process rather than selling a fixed software bundle.' },
      { q: 'Which Zoho products and tools do you work with?', a: 'We work across the Zoho suite, including Zoho CRM, Zoho One, Creator, Analytics, Books, Inventory, Desk, Campaigns and Flow, and connect them with external platforms such as Twilio, RingCentral, Power BI, QuickBooks, Shopify and custom APIs. The exact stack depends on what your business actually needs.' },
      { q: 'How do we get started with TechKnoGeeks?', a: 'The best starting point is a short discovery conversation about your business processes, current tools and goals. From there we map requirements, recommend the right Zoho setup and prepare a clear scope and estimate. You can book a free consultation to begin.' },
    ],
  },
};

const escHtml = (t) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
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
  return `<!--tkg-faq-start-->${STYLE}<section class="tkg-faq" aria-labelledby="tkg-faq-h"><div class="tkg-faq-wrap"><h2 id="tkg-faq-h">Frequently Asked Questions</h2><div class="tkg-faq-list">${items}</div><p class="tkg-faq-cta">Still have a question? <a href="https://techknogeeks.zohobookings.in/433051000000032055" target="_blank" rel="noopener">Book a free consultation &rarr;</a></p></div></section><!--tkg-faq-end-->`;
}

function orgNode(enriched) {
  const o = { '@type': 'Organization', '@id': ORG, name: 'TechKnoGeeks', url: SITE,
    logo: SITE + '/no%20background%20logo%20-1-.png',
    sameAs: ['https://www.linkedin.com/company/techknogeeks', 'https://wa.me/919878191721'] };
  if (enriched) {
    o.description = 'TechKnoGeeks is a Zoho consulting and implementation partner helping businesses integrate, automate and scale with the Zoho ecosystem and cross-platform integrations.';
    o.areaServed = 'Worldwide';
    o.knowsAbout = ['Zoho CRM', 'Zoho Books', 'Zoho Creator', 'Zoho Analytics', 'Zoho One', 'Business process automation', 'System integration'];
  }
  return o;
}

function graph(cfg) {
  const g = { '@context': 'https://schema.org', '@graph': [
    orgNode(cfg.homepage),
    { '@type': 'WebSite', '@id': SITE + '/#website', url: SITE, name: 'TechKnoGeeks', publisher: { '@id': ORG } },
  ] };
  const webpage = { '@type': 'WebPage', '@id': cfg.url + '#webpage', url: cfg.url, name: cfg.webName,
    description: cfg.webDesc, isPartOf: { '@id': SITE + '/#website' }, hasPart: { '@id': cfg.url + '#faq' } };
  if (cfg.service) webpage.mainEntity = { '@id': cfg.url + '#service' };
  g['@graph'].push(webpage);
  if (cfg.service) g['@graph'].push({ '@type': 'Service', '@id': cfg.url + '#service', name: cfg.service.name,
    serviceType: cfg.service.serviceType, description: cfg.service.description, url: cfg.url, provider: { '@id': ORG },
    audience: { '@type': 'Audience', audienceType: cfg.service.audience }, areaServed: cfg.service.areaServed });
  g['@graph'].push({ '@type': 'FAQPage', '@id': cfg.url + '#faq',
    mainEntity: cfg.faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) });
  return '<script type="application/ld+json">' + JSON.stringify(g) + '</script>';
}

let total = 0;
for (const [slug, cfg] of Object.entries(PAGES)) {
  const cPath = `${GEN}/${slug}.content.html`;
  let c = fs.readFileSync(cPath, 'utf8');
  const section = faqSection(cfg);
  c = c.includes('<!--tkg-faq-start-->') ? c.replace(/<!--tkg-faq-start-->[\s\S]*?<!--tkg-faq-end-->/, section) : c + section;
  fs.writeFileSync(cPath, c, 'utf8');

  const hPath = `${GEN}/${slug}.head.html`;
  let h = fs.readFileSync(hPath, 'utf8');
  const gs = graph(cfg);
  if (/<script type="application\/ld\+json" id="schemagenerator">[\s\S]*?<\/script>/.test(h)) h = h.replace(/<script type="application\/ld\+json" id="schemagenerator">[\s\S]*?<\/script>/, gs);
  else if (/<script type="application\/ld\+json">[\s\S]*?<\/script>/.test(h)) h = h.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, gs);
  else h = h + gs;
  fs.writeFileSync(hPath, h, 'utf8');
  total += cfg.faqs.length;
  console.log(slug.padEnd(46) + cfg.faqs.length + ' FAQ' + (cfg.service ? ' + Service' : ' (homepage)'));
}
console.log('\nTotal FAQs placed: ' + total);
