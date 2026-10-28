const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const vm=require('node:vm');
const read=p=>fs.readFileSync('public/'+p,'utf8');
test('Portuguese policy variants preserve numbered sections and factual markers',()=>{
 for(const suffix of ['','-eea-uk','-us-ca']){
 const en=read(`privacy/en/v1.4/en${suffix}.html`),pt=read(`privacy/pt/v1.4/pt${suffix}.html`);
 assert.match(pt,/<html lang="pt">/);assert.equal((pt.match(/<h2>\d+\./g)||[]).length,15);
 const facts=s=>[...s.matchAll(/data-policy-fact="([^"]+)"/g)].map(m=>m[1]).sort();assert.deepEqual(facts(pt),facts(en));
 assert.match(pt,/Membros Android e iPhone podem entrar num grupo hospedado no Android/);assert.match(pt,/membros Android não podem entrar num grupo de um anfitrião iPhone/);
 assert.match(pt,/versões anteriores do Android que contêm Google ML Kit/);assert.match(pt,/27 de outubro de 2026/);
 if(suffix==='-eea-uk')assert.match(pt,/Bases legais/);if(suffix==='-us-ca')assert.match(pt,/CCPA\/CPRA/);
 }
});
test('Portuguese terms preserve lifecycle and disabled monetization',()=>{
 const s=read('terms/pt/v1.2/index.html');assert.equal((s.match(/<h2>\d+\./g)||[]).length,15);assert.match(s,/Free Host está desativado/);assert.match(s,/Sessões encerradas não são restauradas/);assert.match(s,/menores de 13 anos/);assert.doesNotMatch(s,/<!--(?:PHOTO|OS_|PROFILE)/);
});
test('Portuguese license inventory and original license/source links match',()=>{
 const en=read('licenses/releases/android-1.1.0-13/en/index.html'),pt=read('licenses/releases/android-1.1.0-13/pt/index.html');
 const ids=s=>[...s.matchAll(/<tr><td>(.*?)<\/td><td>(.*?)<\/td>/g)].map(m=>m.slice(1));assert.deepEqual(ids(pt),ids(en));assert.equal(ids(pt).length,235);
 const links=s=>[...s.matchAll(/href="(\.\.\/(?:data|sources)\/[^"]+)"/g)].map(m=>m[1]);assert.deepEqual(links(pt),links(en));assert.doesNotMatch(pt,/com.google.mlkit:|com.google.android.datatransport:/);
});
test('pt-BR and pt-PT route to one Portuguese policy and terms',()=>{
 for(const [route,v] of [['privacy','v1.4'],['terms','v1.2']])for(const locale of ['pt','pt-BR','pt-PT']){
 let target;const location={search:'',replace:u=>target=u};vm.runInNewContext(read(route+'/index.html').match(/<script>([\s\S]*?)<\/script>/)[1],{navigator:{language:locale},location,window:{location},URLSearchParams});assert.equal(target,`/${route}/pt/${v}/`);
 }
});
test('Portuguese Join uses same safe platform/store logic',()=>{
 const join=require('../public/join/join.js');for(const locale of ['pt','pt-BR','pt-PT'])assert.equal(join.resolveLocale(locale),'pt');assert.deepEqual(Object.keys(join.copy.pt).sort(),Object.keys(join.copy.en).sort());assert.equal(join.storeUrl('javascript:alert(1)','play.google.com'),'');
});
