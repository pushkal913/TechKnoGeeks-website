import fs from 'fs';

// Generates the /plans page content (heading + description + pricing cards)
// matching the approved design. Edit the data below to change plans/prices/links.
const OUT = 'src/generated/plans.content.html';

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

const li = ([b, t]) => `<li>${b ? `<b>${b}</b>` : ''}${t}</li>`;
const btn = (link) => `<a class="btn" href="${link}" target="_blank" rel="noopener noreferrer">Subscribe</a>`;

const devCard = (p) => `<div class="card${p.feat ? ' feat' : ''}">${p.feat ? '<span class="badge">Most Popular</span>' : ''}
  <h3>${p.name}</h3>
  <div class="price">${p.price}<span>/month</span></div>
  <ul>${p.items.map(li).join('')}</ul>
  ${btn(p.link)}</div>`;

const maintCard = (p) => `<div class="card${p.feat ? ' feat' : ''}">${p.feat ? '<span class="badge">Recommended</span>' : ''}
  <h3>${p.name}</h3>
  <div class="price">${p.price}<span>/month</span></div>
  <div class="subt">${p.sub}</div>
  <p class="desc">${p.desc}</p>
  <hr/>
  <ul>${p.items.map(li).join('')}</ul>
  ${btn(p.link)}</div>`;

const style = `<style>
.tkg-plans{font-family:"Muli","Lato","Segoe UI",system-ui,sans-serif;color:#0f172a;background:#f5f8fc;padding:64px 20px}
.tkg-plans *{box-sizing:border-box}
.tkg-plans .head{max-width:840px;margin:0 auto 46px;text-align:center}
.tkg-plans .head h1{font-family:"Merriweather",serif;color:#0b1f3a;font-size:clamp(1.9rem,4.4vw,2.9rem);line-height:1.15;margin:0 0 18px}
.tkg-plans .head p{color:#475569;font-size:1.06rem;line-height:1.65;margin:0}
.tkg-plans .group{max-width:1200px;margin:0 auto}
.tkg-plans .group-title{margin:52px 0 26px;font-family:"Merriweather",serif;color:#0b1f3a;font-size:1.5rem;text-align:center}
.tkg-plans .cards{display:grid;gap:22px;align-items:stretch}
.tkg-plans .cards.dev{grid-template-columns:repeat(4,1fr)}
.tkg-plans .cards.maint{grid-template-columns:repeat(3,1fr)}
.tkg-plans .card{background:#fff;border:1px solid #e7eef6;border-radius:16px;padding:30px 26px;display:flex;flex-direction:column;box-shadow:0 10px 26px -18px rgba(11,31,58,.28);transition:.2s}
.tkg-plans .card:hover{transform:translateY(-4px);box-shadow:0 18px 40px -18px rgba(11,31,58,.3)}
.tkg-plans .card.feat{border:2px solid #2563eb;box-shadow:0 18px 44px -18px rgba(37,99,235,.5)}
.tkg-plans .badge{align-self:flex-start;background:#2563eb;color:#fff;font-size:.68rem;font-weight:800;letter-spacing:.09em;text-transform:uppercase;padding:5px 11px;border-radius:999px;margin-bottom:14px}
.tkg-plans .card h3{font-family:"Merriweather",serif;font-size:1.5rem;color:#0b1f3a;margin:0 0 14px}
.tkg-plans .price{font-size:2.5rem;font-weight:900;color:#2563eb;line-height:1;margin-bottom:8px;letter-spacing:-.02em}
.tkg-plans .price span{font-size:.95rem;font-weight:600;color:#6b7a90;letter-spacing:0}
.tkg-plans .subt{font-family:"Merriweather",serif;font-weight:700;color:#0b1f3a;font-size:1.08rem;margin:8px 0 8px}
.tkg-plans .desc{color:#475569;font-size:.92rem;line-height:1.55;margin:0 0 6px}
.tkg-plans hr{border:0;border-top:1px solid #e7eef6;margin:16px 0}
.tkg-plans ul{list-style:none;padding:0;margin:6px 0 24px;flex:1}
.tkg-plans li{position:relative;padding-left:27px;margin-bottom:13px;color:#334155;font-size:.93rem;line-height:1.5}
.tkg-plans li::before{content:"\\2713";position:absolute;left:0;top:0;color:#2563eb;font-weight:900}
.tkg-plans li b{color:#0b1f3a}
.tkg-plans .btn{display:block;text-align:center;background:#1666c1;color:#fff;font-weight:800;padding:15px;border-radius:11px;text-decoration:none;transition:.18s;margin-top:auto}
.tkg-plans .btn:hover{background:#0d4f9e}
.tkg-plans .card.feat .btn{background:#2563eb}
.tkg-plans .card.feat .btn:hover{background:#1d4ed8}
@media(max-width:1000px){.tkg-plans .cards.dev{grid-template-columns:repeat(2,1fr)}}
@media(max-width:820px){.tkg-plans .cards.maint{grid-template-columns:1fr;max-width:480px;margin:0 auto}}
@media(max-width:560px){.tkg-plans .cards.dev{grid-template-columns:1fr;max-width:480px;margin:0 auto}}
</style>`;

const html = `${style}
<div class="tkg-plans">
  <div class="head">
    <h1>Flexible Monthly Plans Built to Scale</h1>
    <p>Choose from flexible, pay-as-you-go monthly plans designed to provide your business with expert technical support and seamless system integration&mdash;all without long-term contracts or hidden fees. Scale your service level up or down as your operational needs evolve.</p>
  </div>
  <div class="group">
    <h2 class="group-title">Development Plans</h2>
    <div class="cards dev">${dev.map(devCard).join('')}</div>
  </div>
  <div class="group">
    <h2 class="group-title">Maintenance &amp; Support</h2>
    <div class="cards maint">${maint.map(maintCard).join('')}</div>
  </div>
</div>`;

fs.writeFileSync(OUT, html, 'utf8');
console.log('Wrote ' + OUT + ' (' + (html.length/1024).toFixed(1) + ' KB), ' + (dev.length+maint.length) + ' plans.');
