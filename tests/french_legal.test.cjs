const {test}=require('node:test');const assert=require('node:assert/strict');
const fs=require('node:fs');const path=require('node:path');const vm=require('node:vm');
const root=path.resolve(__dirname,'../public');const read=p=>fs.readFileSync(path.join(root,p),'utf8');
for(const suffix of ['','-eea-uk','-us-ca'])test(`French privacy ${suffix||'global'} preserves structure and verified processing`,()=>{
 const h=read(`privacy/fr/v1.4/fr${suffix}.html`);
 assert.match(h,/<html lang="fr">/);assert.equal((h.match(/<h2>\d+\./g)||[]).length,15);
 assert.match(h,/27 octobre 2026/);assert.doesNotMatch(h,/data-publication-status="draft"/);
 for(const key of ['photo-storage','platform-scope','android-zxing-version13','legacy-mlkit','profile-retention','os-backup','photo-deletion','ios-local-network'])assert.match(h,new RegExp(`data-policy-fact="${key}"`));
 assert.match(h,/Les membres Android et iPhone peuvent rejoindre un groupe hébergé sur Android/);
 assert.match(h,/les membres Android ne peuvent pas rejoindre un hôte iPhone/);
 assert.match(h,/ZXing-C\+\+/);assert.match(h,/versionCode 13/);assert.match(h,/Vision/);
 assert.match(h,/anciennes versions Android contenant Google ML Kit/);
 assert.match(h,/n’est pas garantie/);assert.match(h,/profil.*distinct/s);
 if(suffix==='-eea-uk')assert.match(h,/Bases juridiques/);
 if(suffix==='-us-ca')assert.match(h,/CCPA\/CPRA/);
});
test('French terms distinguish withdrawal, deletion, ending and free status',()=>{
 const h=read('terms/fr/v1.2/index.html');assert.equal((h.match(/<h2>\d+\./g)||[]).length,15);
 assert.match(h,/gratuite.*Free Host.*désactivée/);assert.match(h,/sessions terminées ne sont pas restaurées/);
 for(const key of ['photo-storage','session-ending','photo-deletion','os-backup','profile-retention','platform-scope'])assert.match(h,new RegExp(`data-policy-fact="${key}"`));
 assert.match(h,/moins de 13 ans/);assert.match(h,/Droit applicable/);
});
test('French licenses use the identical component/version inventory and original texts',()=>{
 const en=read('licenses/releases/android-1.1.0-13/en/index.html');const fr=read('licenses/releases/android-1.1.0-13/fr/index.html');
 const ids=s=>[...s.matchAll(/<tr><td>(.*?)<\/td><td>(.*?)<\/td>/g)].map(x=>x.slice(1));
 assert.deepEqual(ids(fr),ids(en));assert.equal(ids(fr).length,235);
 assert.deepEqual([...fr.matchAll(/href="(\.\.\/(?:data|sources)\/[^"]+)"/g)].map(x=>x[1]),[...en.matchAll(/href="(\.\.\/(?:data|sources)\/[^"]+)"/g)].map(x=>x[1]));
 assert.match(fr,/io.github.zxing-cpp:android/);assert.doesNotMatch(fr,/com.google.mlkit:|com.google.android.datatransport:/);
 assert.match(fr,/tabindex="0" role="region"/);
});
test('regional French resolves to French policy while unsupported locales still fall back',()=>{
 for(const [page,expected,english] of [['privacy','/privacy/fr/v1.4/','/privacy/en/v1.4/'],['terms','/terms/fr/v1.2/','/terms/en/v1.2/']]){
  const script=read(page+'/index.html').match(/<script>([\s\S]*?)<\/script>/)[1];
  for(const locale of ['fr-FR','fr-CA','fr-BE','fr-CH','fr']){
   let got='';const location={search:'',replace:u=>got=u};
   vm.runInNewContext(script,{navigator:{language:locale},location,window:{location},URLSearchParams});assert.equal(got,expected);
  }
  let got='';const location={search:'',replace:u=>got=u};vm.runInNewContext(script,{navigator:{language:'it-IT'},location,window:{location},URLSearchParams});assert.equal(got,english);
 }
});
test('French navigation has no missing static targets',()=>{
 const walk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(d,e.name)):[path.join(d,e.name)]);
 for(const f of walk(root).filter(p=>p.endsWith('.html'))){
  for(const [,href] of fs.readFileSync(f,'utf8').matchAll(/(?:href|src)="([^"]+)"/g)){
   if(/^(?:https?:|mailto:|#)/.test(href))continue;
   const raw=href.split(/[?#]/)[0];const target=raw.startsWith('/')?path.join(root,raw):path.resolve(path.dirname(f),raw);
   assert.ok(fs.existsSync(target),`${f} => ${href}`);
  }
 }
});
