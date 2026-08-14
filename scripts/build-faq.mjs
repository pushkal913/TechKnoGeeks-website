import fs from 'fs';

// Adds a visible, accessible FAQ section + a connected JSON-LD @graph (WebPage +
// Service + Organization + FAQPage) to a page. Data-driven — add pages to PAGES.
// Only "Approved" FAQs are included; gated ones stay commented in the workbook until
// the owner confirms. Schema answer text is IDENTICAL to the visible answer.
const GEN = 'src/generated';
const ORG = 'https://www.techknogeeks.com/#organization';
const SITE = 'https://www.techknogeeks.com';

const PAGES = {
  services: {
    url: SITE + '/services',
    webName: 'Zoho Implementation, Automation & Support Services',
    webDesc: 'End-to-end Zoho implementation and automation services — CRM, Books, Creator, Analytics and cross-platform integrations tailored to your workflows.',
    service: {
      name: 'Zoho consulting and implementation services',
      serviceType: 'Zoho consulting, implementation, automation and integration services',
      description: 'Consulting, implementation, migration, customization, integrations, analytics, custom applications, accounting, telephony and AI solutions across the Zoho ecosystem.',
      audience: 'Businesses evaluating or using Zoho',
      areaServed: 'Worldwide',
    },
    faqs: [
      { q: 'What Zoho services does TechKnoGeeks provide?',
        a: 'TechKnoGeeks provides Zoho consulting, implementation, customization, migration, automation, integration, analytics, custom application, accounting, telephony and AI-related services. The team works across products such as Zoho CRM, Zoho One, Creator, Analytics, Books, Inventory, Desk, Campaigns and Flow, together with external platforms and APIs. The final solution should be based on the business process rather than a fixed software bundle.' },
      { q: 'What information do you need to scope a Zoho project?',
        a: 'A useful project brief includes the business processes involved, number and types of users, current applications, required Zoho products, data to migrate, integrations, reports, automations, permissions, training needs and target timeline. If these details are not yet documented, discovery can be used to map the requirements before preparing a detailed scope and estimate.' },
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
  return `<!--tkg-faq-start-->${STYLE}<section class="tkg-faq" aria-labelledby="tkg-faq-h"><div class="tkg-faq-wrap"><h2 id="tkg-faq-h">Frequently Asked Questions</h2><div class="tkg-faq-list">${items}</div><p class="tkg-faq-cta">Still have a question? <a href="/contact">Book a free consultation &rarr;</a></p></div></section><!--tkg-faq-end-->`;
}

function graph(cfg) {
  const g = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'Organization', '@id': ORG, name: 'TechKnoGeeks', url: SITE,
        logo: SITE + '/no%20background%20logo%20-1-.png',
        sameAs: ['https://www.linkedin.com/company/techknogeeks', 'https://wa.me/919878191721'] },
      { '@type': 'WebSite', '@id': SITE + '/#website', url: SITE, name: 'TechKnoGeeks',
        publisher: { '@id': ORG } },
      { '@type': 'WebPage', '@id': cfg.url + '#webpage', url: cfg.url, name: cfg.webName,
        description: cfg.webDesc, isPartOf: { '@id': SITE + '/#website' },
        mainEntity: { '@id': cfg.url + '#service' }, hasPart: { '@id': cfg.url + '#faq' } },
      { '@type': 'Service', '@id': cfg.url + '#service', name: cfg.service.name,
        serviceType: cfg.service.serviceType, description: cfg.service.description, url: cfg.url,
        provider: { '@id': ORG },
        audience: { '@type': 'Audience', audienceType: cfg.service.audience },
        areaServed: cfg.service.areaServed },
      { '@type': 'FAQPage', '@id': cfg.url + '#faq',
        mainEntity: cfg.faqs.map(f => ({ '@type': 'Question', name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a } })) },
    ],
  };
  return '<script type="application/ld+json">' + JSON.stringify(g) + '</script>';
}

for (const [slug, cfg] of Object.entries(PAGES)) {
  // content: inject/replace the FAQ section (marker-wrapped, before the footer)
  const cPath = `${GEN}/${slug}.content.html`;
  let c = fs.readFileSync(cPath, 'utf8');
  const section = faqSection(cfg);
  if (c.includes('<!--tkg-faq-start-->')) c = c.replace(/<!--tkg-faq-start-->[\s\S]*?<!--tkg-faq-end-->/, section);
  else c = c + section;
  fs.writeFileSync(cPath, c, 'utf8');

  // head: replace the old Zoho JSON-LD with our connected graph (one consistent Organization)
  const hPath = `${GEN}/${slug}.head.html`;
  let h = fs.readFileSync(hPath, 'utf8');
  const gscript = graph(cfg);
  if (/<script type="application\/ld\+json" id="schemagenerator">[\s\S]*?<\/script>/.test(h))
    h = h.replace(/<script type="application\/ld\+json" id="schemagenerator">[\s\S]*?<\/script>/, gscript);
  else if (/<script type="application\/ld\+json">[\s\S]*?<\/script>/.test(h))
    h = h.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, gscript);
  else h = h + gscript;
  fs.writeFileSync(hPath, h, 'utf8');

  console.log(`${slug}: ${cfg.faqs.length} FAQ(s) + connected @graph (WebPage→Service→Org, hasPart→FAQPage)`);
}
