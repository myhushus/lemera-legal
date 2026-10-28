const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const vm=require('node:vm');
const read=p=>fs.readFileSync('public/'+p,'utf8');
test('Japanese policy variants preserve numbered sections and factual markers',()=>{
 for(const suffix of ['','-eea-uk','-us-ca']){
 const en=read(`privacy/en/v1.4/en${suffix}.html`),pt=read(`privacy/ja/v1.4/ja${suffix}.html`);
 assert.match(pt,/<html lang="ja">/);assert.equal((pt.match(/<h2>\d+\./g)||[]).length,15);
 const facts=s=>[...s.matchAll(/data-policy-fact="([^"]+)"/g)].map(m=>m[1]).sort();assert.deepEqual(facts(pt),facts(en));
 assert.match(pt,/Androidをホストとするグループには、AndroidとiPhoneのメンバーが参加できます/);assert.match(pt,/Androidのメンバーは参加できません/);
 assert.match(pt,/Google ML Kitを含む以前のAndroidバージョン/);assert.match(pt,/2026年10月27日/);
 if(suffix==='-eea-uk')assert.match(pt,/法的根拠/);if(suffix==='-us-ca')assert.match(pt,/CCPA\/CPRA/);
 }
});
test('Japanese terms preserve lifecycle and disabled monetization',()=>{
 const s=read('terms/ja/v1.2/index.html');assert.equal((s.match(/<h2>\d+\./g)||[]).length,15);assert.match(s,/Free Hostのメンバー数制限は無効/);assert.match(s,/終了したセッションを復元して/);assert.match(s,/13歳未満/);assert.doesNotMatch(s,/<!--(?:PHOTO|OS_|PROFILE)/);
});
test('Japanese license inventory and original license/source links match',()=>{
 const en=read('licenses/releases/android-1.1.0-13/en/index.html'),pt=read('licenses/releases/android-1.1.0-13/ja/index.html');
 const ids=s=>[...s.matchAll(/<tr><td>(.*?)<\/td><td>(.*?)<\/td>/g)].map(m=>m.slice(1));assert.deepEqual(ids(pt),ids(en));assert.equal(ids(pt).length,235);
 const links=s=>[...s.matchAll(/href="(\.\.\/(?:data|sources)\/[^"]+)"/g)].map(m=>m[1]);assert.deepEqual(links(pt),links(en));assert.doesNotMatch(pt,/com.google.mlkit:|com.google.android.datatransport:/);
});
test('ja and ja-JP route to one Japanese policy and terms',()=>{
 for(const [route,v] of [['privacy','v1.4'],['terms','v1.2']])for(const locale of ['ja','ja-JP']){
 let target;const location={search:'',replace:u=>target=u};vm.runInNewContext(read(route+'/index.html').match(/<script>([\s\S]*?)<\/script>/)[1],{navigator:{language:locale},location,window:{location},URLSearchParams});assert.equal(target,`/${route}/ja/${v}/`);
 }
});
test('Japanese Join uses same safe platform/store logic',()=>{
 const join=require('../public/join/join.js');for(const locale of ['ja','ja-JP'])assert.equal(join.resolveLocale(locale),'ja');assert.deepEqual(Object.keys(join.copy.ja).sort(),Object.keys(join.copy.en).sort());assert.equal(join.storeUrl('javascript:alert(1)','play.google.com'),'');
});
