import fs from 'fs';

// Generates the /plans page: three plan groups (monthly subscription, fixed-price
// project bundles, maintenance & support). Edit the data below to change anything.
const OUT = 'src/generated/plans.content.html';

// 1) Monthly subscription (development) — Razorpay, "Subscribe"
const dev = [
  { name: 'Basic', price: '$100', link: 'https://rzp.io/rzp/Ep9rsvR', feat: false, items: [
    ['Ideal for:', ' Individuals or small teams starting with CRM.'],
    ['Essential CRM Setup:', ' Basic configuration of Leads, Contacts, and Accounts.'],
    ['Standard Field Mapping:', ' Organization of your data into Zoho modules.'],
    ['Email Integration:', ' Track business emails inside the CRM.'],
  ]},
  { name: 'Standard', price: '$300', link: 'https://rzp.io/rzp/2xzZzmOA', feat: false, items: [
    ['Ideal for:', ' Growing businesses that need to save time.'],
    ['Workflow Automation:', ' Automatic tasks and email alerts for your sales team.'],
    ['Custom Pipeline:', ' Tailoring "Deals" stages to match your sales process.'],
    ['Basic Reporting:', ' Monthly dashboards to track team performance.'],
  ]},
  { name: 'Premium', price: '$800', link: 'https://rzp.io/rzp/E6hsoSP', feat: true, items: [
    ['Ideal for:', ' Companies requiring advanced logic and insights.'],
    ['Advanced Blueprints:', ' Step-by-step guided sales processes.'],
    ['Third-Party Integrations:', ' Connecting WhatsApp, Mailchimp, or Slack.'],
    ['Custom Dashboards:', ' High-level analytics for decision making.'],
  ]},
  { name: 'Pro', price: '$1000', link: 'https://rzp.io/rzp/MglCEU3X', feat: false, items: [
    ['Ideal for:', ' Businesses wanting a custom-coded ecosystem.'],
    ['Deluge Scripting:', ' Advanced "low-code" automation for complex logic.'],
    ['Finance Integration:', ' Connecting CRM with Zoho Books for invoicing.'],
    ['Dedicated Support:', ' Priority troubleshooting and health checks.'],
  ]},
];

// 2) Fixed-price project bundles (Tailored Zoho Ecosystem) — existing links, "Get Started"
const fixed = [
  { name: 'Starter', sub: 'Foundation Setup', price: '$500', link: 'https://rzp.io/rzp/ZkauJWjn', feat: false, items: [
    'Core Apps – 1 Zoho App', 'Automations – 5 Rules', 'Workflows – 5 Basic', 'Scripts – 2', 'Simple Migration – 1k Records', 'Templates 5 – Email/Inv',
  ]},
  { name: 'Standard', sub: 'Professional Growth', price: '$1000', link: 'https://rzp.io/rzp/UYi7CeI', feat: false, items: [
    'Core Apps 1–2 Zoho Apps', 'Automations 10 Rules', 'Workflows 10 Basic', 'Scripts 8', 'Standard Migration 5k Records', 'Templates 10 Email/Inv',
  ]},
  { name: 'Advanced', sub: 'Business Optimization', price: '$2000', link: 'https://rzp.io/rzp/5SwWK8fP', feat: true, items: [
    'Core Apps Up to 3 Apps', 'Automations 15 Rules', 'Workflows 15 Complex', 'Scripts 15', 'Complex Migration 10k Records', 'Templates 20 Email/Inv',
  ]},
  { name: 'Enterprise', sub: 'Digital Transformation', price: '$3000', link: 'https://rzp.io/rzp/koa3a6c', feat: false, items: [
    'Core Apps Full Zoho Suite', 'Automations 25+ Rules', 'Workflows 25+ Complex', 'Scripts Adv.', 'Logic Blueprints 3–5 Included', 'Migration 20k+ Records',
  ]},
];

// 3) Maintenance & support — Razorpay, "Subscribe"
const maint = [
  { name: 'Basic', price: '$200', sub: 'Essential Health', link: 'https://rzp.io/rzp/EYeaO4om', feat: false,
    desc: 'Keep your system stable and secure with expert troubleshooting and quarterly health checks.', items: [
    ['Tickets:', ' 5 per month'], ['Response Time:', ' 48 Hours'], ['User Admin:', ' Pass/Login Help'],
    ['Health Check:', ' Quarterly'], ['Bug Fixes:', ' Included'], ['Training:', ' Docs Only'], ['', 'Email Support Only'],
  ]},
  { name: 'Pro', price: '$500', sub: 'Advanced Maintenance', link: 'https://rzp.io/rzp/ZkauJWjn', feat: true,
    desc: 'Priority support for active businesses requiring fast response times and role management.', items: [
    ['Tickets:', ' 15 per month'], ['Response Time:', ' 24 Hours'], ['User Admin:', ' Permissions/Roles'],
    ['Health Check:', ' Monthly'], ['Bug Fixes:', ' Included'], ['Training:', ' 1 Video Session/mo'], ['', 'Email & Zoho Cliq Support'],
  ]},
  { name: 'Elite', price: '$800', sub: 'Full Managed Service', link: 'https://rzp.io/rzp/E6hsoSP', feat: false,
    desc: 'A dedicated technical partner. Instant access via Slack/WhatsApp and weekly audits.', items: [
    ['Tickets:', ' Unlimited'], ['Response Time:', ' 4 Hours (Priority)'], ['User Admin:', ' Full Security Audit'],
    ['Health Check:', ' Weekly'], ['Bug Fixes:', ' Included'], ['Training:', ' 3 Video Sessions/mo'], ['', 'Dedicated WhatsApp / Slack'],
  ]},
];

const liKV = ([b, t]) => `<li>${b ? `<b>${b}</b>` : ''}${t}</li>`;
const liPlain = (t) => `<li>${t}</li>`;
const btn = (link, label) => `<a class="btn" href="${link}" target="_blank" rel="noopener noreferrer">${label}</a>`;
const badge = (p, text) => p.feat ? `<span class="badge">${text}</span>` : '';

const devCard = (p) => `<div class="card${p.feat ? ' feat' : ''}">${badge(p, 'Most Popular')}
  <h3>${p.name}</h3><div class="price">${p.price}<span>/month</span></div>
  <ul>${p.items.map(liKV).join('')}</ul>${btn(p.link, 'Subscribe')}</div>`;

const fixedCard = (p) => `<div class="card${p.feat ? ' feat' : ''}">${badge(p, 'Best Value')}
  <h3>${p.name}</h3><div class="subt">${p.sub}</div><div class="price">${p.price}</div><hr/>
  <ul>${p.items.map(liPlain).join('')}</ul>${btn(p.link, 'Get Started')}</div>`;

const maintCard = (p) => `<div class="card${p.feat ? ' feat' : ''}">${badge(p, 'Recommended')}
  <h3>${p.name}</h3><div class="price">${p.price}<span>/month</span></div><div class="subt">${p.sub}</div>
  <p class="desc">${p.desc}</p><hr/><ul>${p.items.map(liKV).join('')}</ul>${btn(p.link, 'Subscribe')}</div>`;

const style = `<style>
.tkg-banner{position:relative;color:#fff;text-align:center;padding:78px 20px;overflow:hidden;background:#0b1f3a}
.tkg-banner .bg{position:absolute;inset:0;background:url(/images/user-or-customer-choosing-subscription-plan-option-monthly-product-package-for-online-service.jpg) center/cover;opacity:.3}
.tkg-banner .ov{position:absolute;inset:0;background:linear-gradient(120deg,rgba(11,31,58,.92),rgba(0,116,193,.7))}
.tkg-banner .inner{position:relative;max-width:860px;margin:0 auto}
.tkg-banner h1{font-family:"Merriweather",serif;color:#fff;font-size:clamp(2.3rem,5.6vw,3.6rem);margin:0 0 18px;letter-spacing:-.01em}
.tkg-banner p{font-size:1.05rem;line-height:1.65;color:#dbe4f2;margin:0}
.tkg-plans{font-family:"Merriweather",Georgia,serif;color:#0f172a;background:#f5f8fc;padding:24px 20px 68px}
.tkg-plans *{box-sizing:border-box}
.tkg-plans .group:first-child .group-title{margin-top:34px}
.tkg-plans .group{max-width:1450px;margin:0 auto}
.tkg-plans .group-title{margin:56px 0 10px;font-family:"Merriweather",serif;color:#0b1f3a;font-size:clamp(1.4rem,3vw,1.9rem);text-align:center}
.tkg-plans .group-desc{max-width:900px;margin:0 auto 28px;text-align:center;color:#475569;font-size:1rem;line-height:1.6;font-style:italic}
.tkg-plans .cards{display:grid;gap:22px;align-items:stretch}
.tkg-plans .cards.dev,.tkg-plans .cards.fixed{grid-template-columns:repeat(4,1fr)}
.tkg-plans .cards.maint{grid-template-columns:repeat(3,1fr)}
.tkg-plans .card{background:#fff;border:1px solid #e7eef6;border-radius:16px;padding:30px 26px;display:flex;flex-direction:column;box-shadow:0 10px 26px -18px rgba(11,31,58,.28);transition:.2s}
.tkg-plans .card:hover{transform:translateY(-4px);box-shadow:0 18px 40px -18px rgba(11,31,58,.3)}
.tkg-plans .card.feat{border:2px solid #0074C1;box-shadow:0 18px 44px -18px rgba(0,116,193,.5)}
.tkg-plans .badge{align-self:flex-start;background:#0074C1;color:#fff;font-size:.68rem;font-weight:800;letter-spacing:.09em;text-transform:uppercase;padding:5px 11px;border-radius:999px;margin-bottom:14px}
.tkg-plans .card h3{font-family:"Merriweather",serif;font-size:1.5rem;color:#0b1f3a;margin:0 0 10px}
.tkg-plans .price{font-size:1.75rem;font-weight:900;color:#0074C1;line-height:1;margin:6px 0 8px;letter-spacing:-.02em}
.tkg-plans .price span{font-size:.95rem;font-weight:600;color:#6b7a90;letter-spacing:0}
.tkg-plans .subt{font-family:"Merriweather",serif;font-weight:700;color:#0b1f3a;font-size:1.08rem;margin:2px 0}
.tkg-plans .desc{color:#475569;font-size:.92rem;line-height:1.55;margin:6px 0 0}
.tkg-plans hr{border:0;border-top:1px solid #e7eef6;margin:16px 0}
.tkg-plans ul{list-style:none;padding:0;margin:6px 0 24px;flex:1}
.tkg-plans li{position:relative;padding-left:27px;margin-bottom:13px;color:#334155;font-size:.93rem;line-height:1.5}
.tkg-plans li::before{content:"\\2713";position:absolute;left:0;top:0;color:#0074C1;font-weight:900}
.tkg-plans li b{color:#0b1f3a}
.tkg-plans .btn{display:block;text-align:center;background:#0074C1;color:#fff;font-weight:800;padding:15px;border-radius:11px;text-decoration:none;transition:.18s;margin-top:auto}
.tkg-plans .btn:hover{background:#005a99}
.tkg-plans .card.feat .btn{background:#0074C1}
.tkg-plans .card.feat .btn:hover{background:#005a99}
@media(max-width:1000px){.tkg-plans .cards.dev,.tkg-plans .cards.fixed{grid-template-columns:repeat(2,1fr)}}
@media(max-width:820px){.tkg-plans .cards.maint{grid-template-columns:1fr;max-width:480px;margin:0 auto}}
@media(max-width:560px){.tkg-plans .cards.dev,.tkg-plans .cards.fixed{grid-template-columns:1fr;max-width:480px;margin:0 auto}}
</style>`;

const html = `${style}
<div class="tkg-banner">
  <div class="bg"></div><div class="ov"></div>
  <div class="inner">
    <h1>Plans</h1>
    <p>Partner with TechKnoGeeks to unlock the full potential of your Zoho ecosystem. We offer tiered development plans that grow with your business, providing everything from initial environment setup to advanced, custom-coded applications and deep-dive analytics.</p>
  </div>
</div>
<div class="tkg-plans">
  <div class="group">
    <h2 class="group-title">Flexible Monthly Plans Built to Scale</h2>
    <p class="group-desc">Choose from flexible, pay-as-you-go monthly plans designed to provide your business with expert technical support and seamless system integration&mdash;all without long-term contracts or hidden fees. Scale your service level up or down as your operational needs evolve.</p>
    <div class="cards dev">${dev.map(devCard).join('')}</div>
  </div>
  <div class="group">
    <h2 class="group-title">Tailored Zoho Ecosystem</h2>
    <p class="group-desc">Stop struggling with manual data entry and disconnected apps. Our fixed-price &lsquo;Launch&rsquo; bundles are designed to get your Zoho ecosystem running at peak performance with zero guesswork&mdash;from initial setup to advanced Deluge scripting, we handle the technical heavy lifting so you can focus on growing your business.</p>
    <div class="cards fixed">${fixed.map(fixedCard).join('')}</div>
  </div>
  <div class="group">
    <h2 class="group-title">Maintenance &amp; Support</h2>
    <p class="group-desc">Proactive support for a high-performing business. Our maintenance and support packages offer guaranteed response times, regular system audits, and dedicated training to ensure your team stays productive. Whether you need basic troubleshooting or full managed security, we provide the expert care required to keep your Zoho apps running at peak efficiency.</p>
    <div class="cards maint">${maint.map(maintCard).join('')}</div>
  </div>
</div>`;

fs.writeFileSync(OUT, html, 'utf8');
console.log('Wrote ' + OUT + ' (' + (html.length/1024).toFixed(1) + ' KB), ' + (dev.length+fixed.length+maint.length) + ' plans across 3 groups.');
