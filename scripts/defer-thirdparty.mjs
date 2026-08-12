import fs from 'fs';
import path from 'path';

// Moves the two heavy third-party scripts (PageSense analytics + SalesIQ chat)
// off the critical load path. Both are KEPT and fully functional — analytics
// loads just after the page is interactive; chat loads on first user
// interaction (or a short idle fallback). This cuts main-thread work during
// load, which is what drags/destabilizes the mobile Lighthouse score.
const GEN = process.argv[2];

const PAGESENSE = '<script src="https://cdn-in.pagesense.io/js/stutisharma9918gmaildotcom/772c420c414c42ad9e4bb6097a088269.js"></script>';
const SALESIQ = '<script id="zsiqscript" src="https://salesiq.zohopublic.in/widget?wc=siq4417325ecced2321f3cb2e00ecf8b19c0b2e2ec69b37413612bccfa9c60b576b" defer></script>';

const LOADER = '<script>(function(){function inject(src,id){var s=document.createElement("script");if(id)s.id=id;s.src=src;s.defer=true;document.head.appendChild(s);}'
  + 'function loadAnalytics(){inject("https://cdn-in.pagesense.io/js/stutisharma9918gmaildotcom/772c420c414c42ad9e4bb6097a088269.js");}'
  + 'var chatDone=false;function loadChat(){if(chatDone)return;chatDone=true;inject("https://salesiq.zohopublic.in/widget?wc=siq4417325ecced2321f3cb2e00ecf8b19c0b2e2ec69b37413612bccfa9c60b576b","zsiqscript");}'
  + 'function afterLoad(){(window.requestIdleCallback||function(f){setTimeout(f,1200)})(loadAnalytics);}'
  + 'if(document.readyState==="complete"){afterLoad();}else{window.addEventListener("load",afterLoad);}'
  + '["mousemove","touchstart","scroll","keydown","click"].forEach(function(ev){window.addEventListener(ev,loadChat,{once:true,passive:true});});'
  + 'setTimeout(loadChat,15000);})();</script>';

let patched = 0;
for (const f of fs.readdirSync(GEN).filter(x => x.endsWith('.head.html'))) {
  const p = path.join(GEN, f);
  let s = fs.readFileSync(p, 'utf8');
  const before = s;
  s = s.split(PAGESENSE).join('');
  s = s.split(SALESIQ).join('');
  if (!s.includes('loadChat')) s = s + LOADER; // append loader once
  if (s !== before) { fs.writeFileSync(p, s, 'utf8'); patched++; }
}
console.log(`Deferred PageSense + SalesIQ on ${patched} pages (both kept, loaded lazily).`);
