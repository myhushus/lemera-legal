const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const vm=require('node:vm');
const read=p=>fs.readFileSync('public/'+p,'utf8');
test('Hindi policy variants preserve numbered sections and factual markers',()=>{
 for(const suffix of ['','-eea-uk','-us-ca']){
 const en=read(`privacy/en/v1.4/en${suffix}.html`),pt=read(`privacy/hi/v1.4/hi${suffix}.html`);
 assert.match(pt,/<html lang="hi">/);assert.equal((pt.match(/<h2>\d+\./g)||[]).length,15);
 const facts=s=>[...s.matchAll(/data-policy-fact="([^"]+)"/g)].map(m=>m[1]).sort();assert.deepEqual(facts(pt),facts(en));
 assert.match(pt,/Android पर होस्ट किए गए ग्रुप से Android और iPhone सदस्य जुड़ सकते हैं/);assert.match(pt,/Android सदस्य iPhone होस्ट से नहीं जुड़ सकते/);
 assert.match(pt,/Google ML Kit वाले पुराने Android संस्करणों/);assert.match(pt,/27 अक्टूबर 2026/);
 if(suffix==='-eea-uk')assert.match(pt,/कानूनी आधार/);if(suffix==='-us-ca')assert.match(pt,/CCPA\/CPRA/);
 }
});
test('Hindi terms preserve lifecycle and disabled monetization',()=>{
 const s=read('terms/hi/v1.2/index.html');assert.equal((s.match(/<h2>\d+\./g)||[]).length,15);assert.match(s,/Free Host सदस्य सीमा बंद है/);assert.match(s,/समाप्त सत्र बाद में/);assert.match(s,/13 साल से कम उम्र/);assert.doesNotMatch(s,/<!--(?:PHOTO|OS_|PROFILE)/);
});
test('Hindi license inventory and original license/source links match',()=>{
 const en=read('licenses/releases/android-1.1.0-13/en/index.html'),pt=read('licenses/releases/android-1.1.0-13/hi/index.html');
 const ids=s=>[...s.matchAll(/<tr><td>(.*?)<\/td><td>(.*?)<\/td>/g)].map(m=>m.slice(1));assert.deepEqual(ids(pt),ids(en));assert.equal(ids(pt).length,235);
 const links=s=>[...s.matchAll(/href="(\.\.\/(?:data|sources)\/[^"]+)"/g)].map(m=>m[1]);assert.deepEqual(links(pt),links(en));assert.doesNotMatch(pt,/com.google.mlkit:|com.google.android.datatransport:/);
});
test('hi and hi-IN route to one Hindi policy and terms',()=>{
 for(const [route,v] of [['privacy','v1.4'],['terms','v1.2']])for(const locale of ['hi','hi-IN']){
 let target;const location={search:'',replace:u=>target=u};vm.runInNewContext(read(route+'/index.html').match(/<script>([\s\S]*?)<\/script>/)[1],{navigator:{language:locale},location,window:{location},URLSearchParams});assert.equal(target,`/${route}/hi/${v}/`);
 }
});
test('Hindi Join uses same safe platform/store logic',()=>{
 const join=require('../public/join/join.js');for(const locale of ['hi','hi-IN'])assert.equal(join.resolveLocale(locale),'hi');assert.deepEqual(Object.keys(join.copy.hi).sort(),Object.keys(join.copy.en).sort());assert.equal(join.storeUrl('javascript:alert(1)','play.google.com'),'');
});
