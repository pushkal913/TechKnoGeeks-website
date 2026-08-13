import fs from 'fs';

// Replaces the Zoho tabs element (category -> tools) with a clean custom
// chips-based tabs section. Re-runnable via marker block. Edit `cats` to change.
const FILE = 'src/generated/index.content.html';

const cats = [
  { name: 'Database / CRM', tools: ['Zoho CRM','MySQL','Airtable','HubSpot','MongoDB','Monday.com'] },
  { name: 'Data Analysis', tools: ['Zoho Analytics','Zoho DataPrep','Microsoft Power BI','IoT (Internet of Things)','Zoho PageSense'] },
  { name: 'Web & App Development', tools: ['Zoho Creator','Shopify','WooCommerce','WordPress','Zoho Commerce','Zoho Sites'] },
  { name: 'Third-Party Integrations', tools: ['API Integration','AI (ChatGPT, DeepSeek)','Zapier','Zoho Flow','Make.com','Twilio'] },
  { name: 'Online Accounting', tools: ['Zoho Books','QuickBooks','Zoho Inventory'] },
  { name: 'Sales & Marketing', tools: ['Zoho Campaigns','Marketing Automation','Zoho Desk','SalesIQ (AI & Chatbot)','SMS, WhatsApp & Voicedrop'] },
  { name: 'Lead Generation', tools: ['Zoho Forms','JotForms','Zapier','HubSpot','Data Scraping','LinkedIn','Sales Navigator'] },
  { name: 'Social Media', tools: ['Facebook','Instagram','WhatsApp','Twitter','Zapier'] },
];

const esc = (t) => t.replace(/&(?!amp;)/g,'&amp;');
const tabBtn = (c,i) => `<button class="tkg-tab${i===0?' active':''}" type="button">${esc(c.name)}</button>`;
const chip = (t) => `<span class="tkg-chip">${esc(t)}</span>`;
const panel = (c,i) => `<div class="tkg-panel${i===0?' active':''}"><div class="tkg-chips">${c.tools.map(chip).join('')}</div></div>`;

const STYLE = `<style>
.tkg-tabs{--brand:#0074C1;--navy:#0b1f3a;--soft:#eef4fb;font-family:"Merriweather",Georgia,serif;max-width:1100px;margin:0 auto 56px;padding:0 20px;text-align:center}
.tkg-tabs *{box-sizing:border-box}
.tkg-tabs h3{font-family:"Merriweather",serif;color:var(--navy);font-size:clamp(1.35rem,3vw,1.9rem);margin:0 0 26px;letter-spacing:-.01em}
.tkg-tablist{display:flex;flex-wrap:wrap;justify-content:center;gap:10px;margin-bottom:30px}
.tkg-tab{font-family:"Merriweather",serif;font-size:.95rem;font-weight:700;color:var(--navy);background:var(--soft);border:1.5px solid transparent;border-radius:999px;padding:11px 20px;cursor:pointer;transition:.2s;white-space:nowrap}
.tkg-tab:hover{border-color:#bcd6ef}
.tkg-tab.active{background:var(--brand);color:#fff;box-shadow:0 8px 20px -8px rgba(0,116,193,.5)}
.tkg-panel{display:none}
.tkg-panel.active{display:block;animation:tkgFade .35s ease}
@keyframes tkgFade{from{opacity:0;transform:translateY(7px)}to{opacity:1;transform:none}}
.tkg-chips{display:flex;flex-wrap:wrap;justify-content:center;gap:12px;max-width:880px;margin:0 auto}
.tkg-chip{display:inline-flex;align-items:center;gap:9px;font-family:"Merriweather",serif;font-size:.95rem;color:var(--navy);background:#fff;border:1.5px solid #e2ecf6;border-radius:12px;padding:12px 18px;transition:transform .18s,box-shadow .18s,border-color .18s}
.tkg-chip::before{content:"";width:8px;height:8px;border-radius:50%;background:var(--brand);flex:0 0 auto}
.tkg-chip:hover{border-color:var(--brand);box-shadow:0 8px 18px -10px rgba(0,116,193,.5);transform:translateY(-2px)}
@media(max-width:680px){
  .tkg-tabs{padding:0 14px;margin-bottom:40px}
  .tkg-tablist{flex-wrap:nowrap;overflow-x:auto;justify-content:flex-start;padding-bottom:8px;-webkit-overflow-scrolling:touch;scrollbar-width:none}
  .tkg-tablist::-webkit-scrollbar{display:none}
  .tkg-tab{font-size:.86rem;padding:9px 15px}
  .tkg-chips{gap:9px}
  .tkg-chip{font-size:.86rem;padding:10px 14px}
}
</style>`;

const JS = `<script>(function(){
  var root=document.getElementById('tkgTabs'); if(!root||root._i)return; root._i=1;
  var tabs=[].slice.call(root.querySelectorAll('.tkg-tab')), panels=[].slice.call(root.querySelectorAll('.tkg-panel'));
  tabs.forEach(function(t,i){ t.addEventListener('click',function(){
    tabs.forEach(function(x){x.classList.remove('active');}); panels.forEach(function(p){p.classList.remove('active');});
    t.classList.add('active'); panels[i].classList.add('active');
  }); });
})();</script>`;

const BLOCK = `<!--tkg-tabs-start-->${STYLE}<div class="tkg-tabs" id="tkgTabs"><h3>Tools &amp; Platforms We Work With</h3><div class="tkg-tablist" role="tablist">${cats.map(tabBtn).join('')}</div>${cats.map(panel).join('')}</div>${JS}<!--tkg-tabs-end-->`;

const VOID=new Set(['area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr']);
function matchElement(s,start){const re=/<(\/?)([a-zA-Z][a-zA-Z0-9-]*)((?:[^>"']|"[^"]*"|'[^']*')*?)(\/?)>/g;re.lastIndex=start;let d=0,m,o=false;while((m=re.exec(s))){const c=m[1]==='/',t=m[2].toLowerCase(),sc=m[4]==='/'||VOID.has(t);if(!c&&!sc&&(t==='style'||t==='script')){const cl=new RegExp('</'+t+'\\s*>','i');const cm=cl.exec(s.slice(re.lastIndex));if(cm)re.lastIndex=re.lastIndex+cm.index+cm[0].length;if(d===0&&!o)return re.lastIndex;continue;}if(!c&&!sc){d++;o=true;}else if(c){d--;if(d<=0)return re.lastIndex;}if(o&&d===0)return re.lastIndex;}return -1;}

let s = fs.readFileSync(FILE,'utf8');
if (s.includes('<!--tkg-tabs-start-->')) {
  s = s.replace(/<!--tkg-tabs-start-->[\s\S]*?<!--tkg-tabs-end-->/, BLOCK);
  console.log('Replaced existing custom tabs with a fresh build.');
} else {
  const ti = s.indexOf('zpelem-tabs');
  if (ti < 0) { console.error('Zoho tabs element not found'); process.exit(1); }
  const start = s.lastIndexOf('<div', ti);
  const end = matchElement(s, start);
  s = s.slice(0, start) + BLOCK + s.slice(end);
  console.log('Replaced the Zoho tabs element with the custom chips tabs.');
}
fs.writeFileSync(FILE, s, 'utf8');
console.log('Done. Categories:', cats.length, 'total tools:', cats.reduce((n,c)=>n+c.tools.length,0));
