import fs from 'fs';

// Replaces the Zoho 'Our Expertise at a Glance' carousel with a clean, custom,
// responsive carousel. Re-runnable: on first run it swaps out the Zoho section;
// afterwards it replaces its own marker block. Edit the `items` list to change,
// add, or remove services — nothing else needed.
const FILE = 'src/generated/index.content.html';

const items = [
  { img: '/Zoho.png', name: 'Zoho', full: 'Streamline your business operations with comprehensive Zoho automation and integration.', short: 'Comprehensive Zoho automation & integration.' },
  { img: '/5842fb7ba6515b1e0ad75b33.png', name: 'Zapier', full: 'Connect your favorite apps and automate workflows effortlessly using Zapier.', short: 'Automate workflows across your apps.' },
  { img: '/power-bi-icon.webp', name: 'Microsoft Power BI', full: 'Unlock actionable insights from your data with cutting-edge Power BI dashboards.', short: 'Actionable insights with Power BI.' },
  { img: '/MySQL.svg', name: 'MySQL', full: 'Manage and organize your business data securely with robust MySQL solutions.', short: 'Secure, robust data management.' },
  { img: '/quickbooks-brand-preferred-logo-50-50-black-external.png', name: 'QuickBooks', full: 'Simplify your accounting and finances with seamless QuickBooks integration.', short: 'Seamless accounting integration.' },
  { img: '/WordPress.png', name: 'WordPress', full: 'Build and customize dynamic websites with expert WordPress development.', short: 'Custom WordPress websites.' },
  { img: '/Airtable.webp', name: 'Airtable', full: 'Organize, collaborate, and automate your workflows with Airtable&rsquo;s flexible database platform.', short: 'Flexible database & workflows.' },
  { img: '/Mongo%20DB%20Upload.jpg', name: 'MongoDB', full: 'Build agile, scalable applications backed by the power of MongoDB&rsquo;s NoSQL database.', short: 'Agile, scalable NoSQL apps.' },
  { img: '/twilio-logo.webp', name: 'Twilio', full: 'Empower your business communications with Twilio&rsquo;s scalable messaging and voice APIs.', short: 'Scalable messaging & voice APIs.' },
  { img: '/logo-jpg-rendition.webp', name: 'RingCentral', full: 'Enhance team collaboration and connectivity with RingCentral&rsquo;s unified cloud communications.', short: 'Unified cloud communications.' },
  { img: '/images/icon-ai-automation.svg', name: 'AI & Automation', full: 'Build tailored AI workflows and autonomous bots to handle complex business processes end-to-end.', short: 'Tailored AI workflows & bots.' },
  { img: '/images/icon-web-app.svg', name: 'Web & App Portals', full: 'Tailor-made web portals and mobile applications built to bridge your business logic with backend integrations.', short: 'Custom web portals & mobile apps.' },
];

const esc = (t) => t.replace(/&(?!amp;|rsquo;|nbsp;|lsquo;|mdash;)/g, '&amp;');
const card = (it) => `<div class="tkg-card"><div class="tkg-logo"><img src="${it.img}" alt="${esc(it.name)}" loading="lazy"/></div><h4>${esc(it.name)}</h4><p class="full">${esc(it.full)}</p><p class="short">${esc(it.short)}</p></div>`;

const STYLE = `<style>
.tkg-exp{--brand:#0074C1;--navy:#0b1f3a;--slate:#516079;font-family:"Merriweather",Georgia,serif;position:relative;max-width:1180px;margin:6px auto 46px;padding:6px 58px 0}
.tkg-exp *{box-sizing:border-box}
.tkg-vp{overflow:hidden}
.tkg-track{display:flex;transition:transform .55s cubic-bezier(.4,0,.2,1);will-change:transform}
.tkg-card{flex:0 0 33.3333%;max-width:33.3333%;padding:16px 20px;text-align:center;display:flex;flex-direction:column;align-items:center}
.tkg-logo{height:72px;width:100%;display:flex;align-items:center;justify-content:center;margin-bottom:18px}
.tkg-logo img{height:100%;width:100%;object-fit:contain;object-position:center}
.tkg-card h4{font-family:"Merriweather",serif;font-weight:700;color:var(--navy);font-size:1.12rem;margin:0 0 7px;letter-spacing:-.01em}
.tkg-card p{color:var(--slate);font-size:.93rem;line-height:1.55;margin:0;max-width:280px}
.tkg-card p.short{display:none}
.tkg-arrow{position:absolute;top:calc(50% - 22px);transform:translateY(-50%);width:44px;height:44px;border-radius:50%;border:1.5px solid #d6e2f0;background:#fff;color:var(--brand);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:.18s;z-index:2;padding:0}
.tkg-arrow svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:2.5;stroke-linecap:round;stroke-linejoin:round}
.tkg-arrow:hover{background:var(--brand);color:#fff;border-color:var(--brand);box-shadow:0 10px 22px -8px rgba(0,116,193,.55)}
.tkg-prev{left:4px}.tkg-next{right:4px}
.tkg-dots{display:flex;justify-content:center;gap:9px;margin-top:24px}
.tkg-dot{width:9px;height:9px;border-radius:50%;background:#cfdcea;border:0;padding:0;cursor:pointer;transition:.25s}
.tkg-dot.active{background:var(--brand);width:26px;border-radius:6px}
@media(max-width:1000px){.tkg-card{flex-basis:50%;max-width:50%}}
@media(max-width:680px){
  .tkg-exp{padding:4px 38px 0;margin-bottom:34px}
  .tkg-card{flex-basis:100%;max-width:100%;padding:10px 14px}
  .tkg-logo{height:56px;margin-bottom:12px}
  .tkg-card h4{font-size:1.04rem}
  .tkg-card p.full{display:none}.tkg-card p.short{display:block;font-size:.92rem}
  .tkg-arrow{width:38px;height:38px}
  .tkg-prev{left:-2px}.tkg-next{right:-2px}
}
</style>`;

const arrow = (dir, cls) => `<button class="tkg-arrow ${cls}" aria-label="${dir==='l'?'Previous':'Next'}"><svg viewBox="0 0 24 24"><path d="${dir==='l'?'m15 18-6-6 6-6':'m9 18 6-6-6-6'}"/></svg></button>`;

const JS = `<script>(function(){
  var root=document.getElementById('tkgExp'); if(!root||root._i)return; root._i=1;
  var track=root.querySelector('.tkg-track'), cards=[].slice.call(root.querySelectorAll('.tkg-card'));
  var dots=root.querySelector('.tkg-dots'), prev=root.querySelector('.tkg-prev'), next=root.querySelector('.tkg-next');
  var total=cards.length, page=0, per=3, pages=1, timer=null;
  function pv(){var w=window.innerWidth;return w<=680?1:(w<=1000?2:3);}
  function move(instant){track.style.transition=instant?'none':'';track.style.transform='translateX(-'+(page*100)+'%)';if(instant){track.offsetHeight;track.style.transition='';}[].forEach.call(dots.children,function(d,i){d.classList.toggle('active',i===page);});}
  function go(p){page=((p%pages)+pages)%pages;move(false);}
  function build(){dots.innerHTML='';for(var i=0;i<pages;i++){(function(i){var b=document.createElement('button');b.className='tkg-dot'+(i===page?' active':'');b.setAttribute('aria-label','Go to slide '+(i+1));b.onclick=function(){go(i);reset();};dots.appendChild(b);})(i);}}
  function layout(){per=pv();cards.forEach(function(c){c.style.flexBasis=(100/per)+'%';c.style.maxWidth=(100/per)+'%';});pages=Math.ceil(total/per);if(page>pages-1)page=pages-1;build();move(true);}
  function start(){stop();timer=setInterval(function(){go(page+1);},2000);}function stop(){if(timer)clearInterval(timer);}function reset(){start();}
  prev.onclick=function(){go(page-1);reset();};next.onclick=function(){go(page+1);reset();};
  root.addEventListener('mouseenter',stop);root.addEventListener('mouseleave',start);
  var x0=null,vp=root.querySelector('.tkg-vp');
  vp.addEventListener('touchstart',function(e){x0=e.touches[0].clientX;stop();},{passive:true});
  vp.addEventListener('touchend',function(e){if(x0==null)return;var dx=e.changedTouches[0].clientX-x0;if(Math.abs(dx)>40){dx<0?go(page+1):go(page-1);}x0=null;start();},{passive:true});
  window.addEventListener('resize',function(){clearTimeout(root._rt);root._rt=setTimeout(layout,150);});
  layout();start();
})();</script>`;

const BLOCK = `<!--tkg-exp-start-->${STYLE}<div class="tkg-exp" id="tkgExp">${arrow('l','tkg-prev')}<div class="tkg-vp"><div class="tkg-track">${items.map(card).join('')}</div></div>${arrow('r','tkg-next')}<div class="tkg-dots"></div></div>${JS}<!--tkg-exp-end-->`;

// --- replace the existing carousel (Zoho section OR our previous marker block) ---
const VOID=new Set(['area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr']);
function matchElement(s,start){const re=/<(\/?)([a-zA-Z][a-zA-Z0-9-]*)((?:[^>"']|"[^"]*"|'[^']*')*?)(\/?)>/g;re.lastIndex=start;let d=0,m,o=false;while((m=re.exec(s))){const c=m[1]==='/',t=m[2].toLowerCase(),sc=m[4]==='/'||VOID.has(t);if(!c&&!sc&&(t==='style'||t==='script')){const cl=new RegExp('</'+t+'\\s*>','i');const cm=cl.exec(s.slice(re.lastIndex));if(cm)re.lastIndex=re.lastIndex+cm.index+cm[0].length;if(d===0&&!o)return re.lastIndex;continue;}if(!c&&!sc){d++;o=true;}else if(c){d--;if(d<=0)return re.lastIndex;}if(o&&d===0)return re.lastIndex;}return -1;}

let s = fs.readFileSync(FILE, 'utf8');
if (s.includes('<!--tkg-exp-start-->')) {
  s = s.replace(/<!--tkg-exp-start-->[\s\S]*?<!--tkg-exp-end-->/, BLOCK);
  console.log('Replaced existing custom carousel with a fresh build.');
} else {
  const si = s.indexOf('elm_on9O4bWtywiN7KmVyTAcSg');
  if (si < 0) { console.error('Zoho carousel section not found'); process.exit(1); }
  const start = s.lastIndexOf('<div', si);
  const end = matchElement(s, start);
  s = s.slice(0, start) + BLOCK + s.slice(end);
  console.log('Replaced the Zoho carousel section with the custom carousel.');
}
fs.writeFileSync(FILE, s, 'utf8');
console.log('Done. Items:', items.length);
