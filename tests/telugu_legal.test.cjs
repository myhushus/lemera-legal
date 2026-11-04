const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const read=p=>fs.readFileSync(path.join(__dirname,'../public',p),'utf8');
const locales=['te','te-IN','te-US','te_US'];
const scripts=s=>[...s.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]);
function doc(){
  const nodes={};
  return {nodes,documentElement:{},querySelector(){return this.getElementById('store-list');},getElementById(id){return nodes[id]||=(
    {textContent:'',dataset:{},attrs:{'aria-disabled':'true'},classes:new Set(),
      setAttribute(k,v){this.attrs[k]=v;},removeAttribute(k){delete this.attrs[k];if(k==='href')delete this.href;},
      addEventListener(k,fn){this[k]=fn;},classList:{toggle(){}}});}};
}
test('Telugu translated policy sections, existing version dates and fact markers match source',()=>{
  for(const suffix of ['','-eea-uk','-us-ca']){
    const te=read(`privacy/te/v1.4/te${suffix}.html`),en=read(`privacy/en/v1.4/en${suffix}.html`);
    assert.match(te,/<html lang="te">/);
    assert.equal((te.match(/<h2>[0-9]+\./g)||[]).length,15);
    const facts=s=>[...s.matchAll(/data-policy-fact="([^"]+)"/g)].map(m=>m[1]).sort();
    assert.deepEqual(facts(te),facts(en));
    assert.match(te,/27 అక్టోబర్ 2026/);assert.match(te,/మనక్యామ్/);
    assert.match(te,/Google ML Kit ఉన్న పాత Android వెర్షన్‌లలో/);
    assert.match(te,/Android సభ్యులు iPhone హోస్ట్ గ్రూప్‌లో చేరలేరు/);
  }
  const terms=read('terms/te/v1.2/index.html');
  assert.equal((terms.match(/<h2>[0-9]+\./g)||[]).length,15);
  assert.doesNotMatch(terms,/<!--|href="(?:privacy|licenses)\.html"/);
  assert.match(terms,/Free Host/);
});
test('Telugu licenses preserve every package, version, scope, license and MPL/source target',()=>{
  const en=read('licenses/releases/android-1.1.0-13/en/index.html');
  const te=read('licenses/releases/android-1.1.0-13/te/index.html');
  const tbody=s=>s.match(/<tbody>([\s\S]*?)<\/tbody>/)[1];
  assert.equal(tbody(te),tbody(en));
  assert.equal((tbody(te).match(/<tr>/g)||[]).length,235);
  const links=s=>[...s.matchAll(/href="(\.\.\/(?:data|sources)\/[^"]+)"/g)].map(m=>m[1]);
  assert.deepEqual(links(te),links(en));
});
for(const locale of locales)test(`Telugu ${locale}: directory routes and explicit chooser preserved`,()=>{
  for(const [page,target] of [['privacy','/privacy/te/v1.4/'],['terms','/terms/te/v1.2/'],['licenses','/licenses/releases/android-1.1.0-13/te/']]){
    let destination; const location={search:'',replace:v=>destination=v};
    const env={navigator:{language:locale},location,window:{location},URLSearchParams};
    vm.runInNewContext(scripts(read(page+'/index.html'))[0],env);assert.equal(destination,target);
    destination=undefined;location.search='?choose=1';
    vm.runInNewContext(scripts(read(page+'/index.html'))[0],env);assert.equal(destination,undefined);
  }
});
for(const locale of locales)test(`Telugu ${locale}: Home brand, legal links and switching back`,()=>{
  const document=doc(); const context={document,navigator:{language:locale},location:{search:''},URLSearchParams};
  scripts(read('index.html')).forEach(s=>vm.runInNewContext(s,context));
  assert.equal(document.documentElement.lang,'te');assert.match(document.nodes['service-name-text'].textContent,/మనక్యామ్/);
  assert.equal(document.nodes.privacy.href,'/privacy/te/v1.4/te.html');
  assert.equal(document.nodes['nav-terms'].href,'/terms/te/v1.2/');
  assert.equal(document.nodes['nav-home'].href,'/?lang=te');
  assert.equal(document.nodes.language.attrs['aria-label'],'భాష');
  for(const language of ['ko','en','es','fr','pt','id','de','ja','hi','bn','mr','te']){
    document.nodes.language.value=language;document.nodes.language.change();
    assert.equal(document.documentElement.lang,language);
    assert.equal(document.nodes['service-name-link'].href,'/names/#'+language);
  }
});
for(const locale of locales)for(const userAgent of ['Android','iPhone','Macintosh'])test(`Telugu ${locale} ${userAgent}: Join and Download preserve store readiness and local links`,()=>{
  const navigator={language:locale,userAgent,platform:'MacIntel',maxTouchPoints:0};
  const config={googlePlayUrl:'https://play.google.com/store/apps/details?id=com.meroviq.lemera',appStoreUrl:''};
  const join=require('../public/join/join.js'); const j=doc();join.mount(j,navigator,config,join);
  assert.equal(j.documentElement.lang,'te');assert.equal(j.nodes.brand.textContent,'మనక్యామ్');
  assert.equal(j.nodes.play.href,config.googlePlayUrl);assert.equal(j.nodes.apple.href,undefined);
  assert.equal(j.nodes.privacy.href,'/privacy/te/v1.4/');
  assert.equal(j.nodes.brand.href,'/?lang=te');
  assert.equal(j.nodes.language.attrs['aria-label'],'భాష');
  const document=doc();vm.runInNewContext(read('download/download.js'),{document,navigator,window:{LEMERA_DOWNLOAD_CONFIG:config}});
  assert.equal(document.documentElement.lang,'te');assert.equal(document.nodes['download-title'].textContent,'మనక్యామ్ డౌన్‌లోడ్ చేయండి');
  assert.equal(document.nodes['play-store-link'].href,config.googlePlayUrl);
  assert.equal(document.nodes['app-badge'].textContent,'త్వరలో వస్తుంది');
  assert.equal(document.nodes['download-foot-privacy'].href,'/privacy/te/v1.4/');
  assert.equal(document.nodes['download-brand'].href,'/?lang=te');
  assert.equal(document.nodes['download-language'].attrs['aria-label'],'భాష');
  document.nodes['download-language'].value='en';document.nodes['download-language'].onchange();
  assert.equal(document.documentElement.lang,'en');assert.equal(document.nodes['play-store-link'].href,config.googlePlayUrl);
});
