const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const vm=require('node:vm');
const read=p=>fs.readFileSync('public/'+p,'utf8');
test('German policy variants preserve numbered sections and factual markers',()=>{
 for(const suffix of ['','-eea-uk','-us-ca']){
 const en=read(`privacy/en/v1.4/en${suffix}.html`),pt=read(`privacy/de/v1.4/de${suffix}.html`);
 assert.match(pt,/<html lang="de">/);assert.equal((pt.match(/<h2>\d+\./g)||[]).length,15);
 const facts=s=>[...s.matchAll(/data-policy-fact="([^"]+)"/g)].map(m=>m[1]).sort();assert.deepEqual(facts(pt),facts(en));
 assert.match(pt,/Android- und iPhone-Mitglieder können einer auf Android gehosteten Gruppe beitreten/);assert.match(pt,/Android-Mitglieder können einem iPhone-Host nicht beitreten/);
 assert.match(pt,/früheren Android-Versionen mit Google ML Kit/);assert.match(pt,/27. Oktober 2026/);
 if(suffix==='-eea-uk')assert.match(pt,/Rechtsgrundlagen/);if(suffix==='-us-ca')assert.match(pt,/CCPA\/CPRA/);
 }
});
test('German terms preserve lifecycle and disabled monetization',()=>{
 const s=read('terms/de/v1.2/index.html');assert.equal((s.match(/<h2>\d+\./g)||[]).length,15);assert.match(s,/Free Host ist deaktiviert/);assert.match(s,/Beendete Sitzungen werden nicht/);assert.match(s,/Kinder unter 13 Jahren/);assert.doesNotMatch(s,/<!--(?:PHOTO|OS_|PROFILE)/);
});
test('German license inventory and original license/source links match',()=>{
 const en=read('licenses/releases/android-1.1.0-13/en/index.html'),pt=read('licenses/releases/android-1.1.0-13/de/index.html');
 const ids=s=>[...s.matchAll(/<tr><td>(.*?)<\/td><td>(.*?)<\/td>/g)].map(m=>m.slice(1));assert.deepEqual(ids(pt),ids(en));assert.equal(ids(pt).length,235);
 const links=s=>[...s.matchAll(/href="(\.\.\/(?:data|sources)\/[^"]+)"/g)].map(m=>m[1]);assert.deepEqual(links(pt),links(en));assert.doesNotMatch(pt,/com.google.mlkit:|com.google.android.datatransport:/);
});
test('de-DE and de-AT route to one German policy and terms',()=>{
 for(const [route,v] of [['privacy','v1.4'],['terms','v1.2']])for(const locale of ['de','de-DE','de-AT','de-CH']){
 let target;const location={search:'',replace:u=>target=u};vm.runInNewContext(read(route+'/index.html').match(/<script>([\s\S]*?)<\/script>/)[1],{navigator:{language:locale},location,window:{location},URLSearchParams});assert.equal(target,`/${route}/de/${v}/`);
 }
});
test('German Join uses same safe platform/store logic',()=>{
 const join=require('../public/join/join.js');for(const locale of ['de','de-DE','de-AT','de-CH'])assert.equal(join.resolveLocale(locale),'de');assert.deepEqual(Object.keys(join.copy.de).sort(),Object.keys(join.copy.en).sort());assert.equal(join.storeUrl('javascript:alert(1)','play.google.com'),'');
});
