const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const read=p=>fs.readFileSync(path.join(__dirname,'../public',p),'utf8');
const locales=['bn','bn-BD','bn-IN','bn_US'];
const scripts=s=>[...s.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]);
function doc(){
  const nodes={};
  return {nodes,documentElement:{},querySelector(){return this.getElementById('store-list');},getElementById(id){return nodes[id]||=(
    {textContent:'',dataset:{},attrs:{'aria-disabled':'true'},classes:new Set(),
      setAttribute(k,v){this.attrs[k]=v;},removeAttribute(k){delete this.attrs[k];if(k==='href')delete this.href;},
      addEventListener(k,fn){this[k]=fn;},classList:{toggle(){}}});}};
}
test('Bengali translated policy sections, existing version dates and fact markers match source',()=>{
  for(const suffix of ['','-eea-uk','-us-ca']){
    const bn=read(`privacy/bn/v1.4/bn${suffix}.html`),en=read(`privacy/en/v1.4/en${suffix}.html`);
    assert.match(bn,/<html lang="bn">/);
    assert.equal((bn.match(/<h2>[০-৯]+\./g)||[]).length,15);
    const facts=s=>[...s.matchAll(/data-policy-fact="([^"]+)"/g)].map(m=>m[1]).sort();
    assert.deepEqual(facts(bn),facts(en));
    assert.match(bn,/২৭ অক্টোবর ২০২৬/);assert.match(bn,/সবক্যাম/);
    assert.match(bn,/Google ML Kit-সহ আগের Android সংস্করণে/);
    assert.match(bn,/Android সদস্যরা iPhone হোস্টের গ্রুপে যোগ দিতে পারেন না/);
  }
  const terms=read('terms/bn/v1.2/index.html');
  assert.equal((terms.match(/<h2>[০-৯]+\./g)||[]).length,15);
  assert.doesNotMatch(terms,/<!--|href="(?:privacy|licenses)\.html"/);
  assert.match(terms,/Free Host/);
});
test('Bengali licenses preserve every package, version, scope, license and MPL/source target',()=>{
  const en=read('licenses/releases/android-1.1.0-13/en/index.html');
  const bn=read('licenses/releases/android-1.1.0-13/bn/index.html');
  const tbody=s=>s.match(/<tbody>([\s\S]*?)<\/tbody>/)[1];
  assert.equal(tbody(bn),tbody(en));
  assert.equal((tbody(bn).match(/<tr>/g)||[]).length,235);
  const links=s=>[...s.matchAll(/href="(\.\.\/(?:data|sources)\/[^"]+)"/g)].map(m=>m[1]);
  assert.deepEqual(links(bn),links(en));
});
for(const locale of locales)test(`Bengali ${locale}: directory routes and explicit chooser preserved`,()=>{
  for(const [page,target] of [['privacy','/privacy/bn/v1.4/'],['terms','/terms/bn/v1.2/'],['licenses','/licenses/releases/android-1.1.0-13/bn/']]){
    let destination; const location={search:'',replace:v=>destination=v};
    const env={navigator:{language:locale},location,window:{location},URLSearchParams};
    vm.runInNewContext(scripts(read(page+'/index.html'))[0],env);assert.equal(destination,target);
    destination=undefined;location.search='?choose=1';
    vm.runInNewContext(scripts(read(page+'/index.html'))[0],env);assert.equal(destination,undefined);
  }
});
for(const locale of locales)test(`Bengali ${locale}: Home brand, legal links and switching back`,()=>{
  const document=doc(); const context={document,navigator:{language:locale},location:{search:''},URLSearchParams};
  scripts(read('index.html')).forEach(s=>vm.runInNewContext(s,context));
  assert.equal(document.documentElement.lang,'bn');assert.match(document.nodes['service-name-text'].textContent,/সবক্যাম/);
  assert.equal(document.nodes.privacy.href,'/privacy/bn/v1.4/bn.html');
  assert.equal(document.nodes['nav-terms'].href,'/terms/bn/v1.2/');
  assert.equal(document.nodes['nav-home'].href,'/?lang=bn');
  assert.equal(document.nodes.language.attrs['aria-label'],'ভাষা');
  for(const language of ['ko','en','es','fr','pt','id','de','ja','hi','bn']){
    document.nodes.language.value=language;document.nodes.language.change();
    assert.equal(document.documentElement.lang,language);
    assert.equal(document.nodes['service-name-link'].href,'/names/#'+language);
  }
});
for(const locale of locales)for(const userAgent of ['Android','iPhone','Macintosh'])test(`Bengali ${locale} ${userAgent}: Join and Download preserve store readiness and local links`,()=>{
  const navigator={language:locale,userAgent,platform:'MacIntel',maxTouchPoints:0};
  const config={googlePlayUrl:'https://play.google.com/store/apps/details?id=com.meroviq.lemera',appStoreUrl:''};
  const join=require('../public/join/join.js'); const j=doc();join.mount(j,navigator,config,join);
  assert.equal(j.documentElement.lang,'bn');assert.equal(j.nodes.brand.textContent,'সবক্যাম');
  assert.equal(j.nodes.play.href,config.googlePlayUrl);assert.equal(j.nodes.apple.href,undefined);
  assert.equal(j.nodes.privacy.href,'/privacy/bn/v1.4/');
  assert.equal(j.nodes.brand.href,'/?lang=bn');
  assert.equal(j.nodes.language.attrs['aria-label'],'ভাষা');
  const document=doc();vm.runInNewContext(read('download/download.js'),{document,navigator,window:{LEMERA_DOWNLOAD_CONFIG:config}});
  assert.equal(document.documentElement.lang,'bn');assert.equal(document.nodes['download-title'].textContent,'সবক্যাম ডাউনলোড করুন');
  assert.equal(document.nodes['play-store-link'].href,config.googlePlayUrl);
  assert.equal(document.nodes['app-badge'].textContent,'শীঘ্রই আসছে');
  assert.equal(document.nodes['download-foot-privacy'].href,'/privacy/bn/v1.4/');
  assert.equal(document.nodes['download-brand'].href,'/?lang=bn');
  assert.equal(document.nodes['download-language'].attrs['aria-label'],'ভাষা');
  document.nodes['download-language'].value='en';document.nodes['download-language'].onchange();
  assert.equal(document.documentElement.lang,'en');assert.equal(document.nodes['play-store-link'].href,config.googlePlayUrl);
});
