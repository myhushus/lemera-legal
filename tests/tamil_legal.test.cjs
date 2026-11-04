const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const read=p=>fs.readFileSync(path.join(__dirname,'../public',p),'utf8');
const locales=['ta','ta-IN','ta-LK','ta-SG','ta-MY','ta_SG'];
const scripts=s=>[...s.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]);
function doc(){
  const nodes={};
  return {nodes,documentElement:{},querySelector(){return this.getElementById('store-list');},getElementById(id){return nodes[id]||=(
    {textContent:'',dataset:{},attrs:{'aria-disabled':'true'},classes:new Set(),
      setAttribute(k,v){this.attrs[k]=v;},removeAttribute(k){delete this.attrs[k];if(k==='href')delete this.href;},
      addEventListener(k,fn){this[k]=fn;},classList:{toggle(){}}});}};
}
test('Tamil translated policy sections, existing version dates and fact markers match source',()=>{
  for(const suffix of ['','-eea-uk','-us-ca']){
    const ta=read(`privacy/ta/v1.4/ta${suffix}.html`),en=read(`privacy/en/v1.4/en${suffix}.html`);
    assert.match(ta,/<html lang="ta">/);
    assert.equal((ta.match(/<h2>[0-9]+\./g)||[]).length,15);
    const facts=s=>[...s.matchAll(/data-policy-fact="([^"]+)"/g)].map(m=>m[1]).sort();
    assert.deepEqual(facts(ta),facts(en));
    assert.match(ta,/27 அக்டோபர் 2026/);assert.match(ta,/நம்கேம்/);
    assert.match(ta,/Google ML Kit உள்ள முந்தைய Android பதிப்புகளில்/);
    assert.match(ta,/Android உறுப்பினர்களால் iPhone ஹோஸ்டுடன் இணைய முடியாது/);
  }
  const terms=read('terms/ta/v1.2/index.html');
  assert.equal((terms.match(/<h2>[0-9]+\./g)||[]).length,15);
  assert.doesNotMatch(terms,/<!--|href="(?:privacy|licenses)\.html"/);
  assert.match(terms,/Free Host/);
});
test('Tamil licenses preserve every package, version, scope, license and MPL/source target',()=>{
  const en=read('licenses/releases/android-1.1.0-13/en/index.html');
  const ta=read('licenses/releases/android-1.1.0-13/ta/index.html');
  const tbody=s=>s.match(/<tbody>([\s\S]*?)<\/tbody>/)[1];
  assert.equal(tbody(ta),tbody(en));
  assert.equal((tbody(ta).match(/<tr>/g)||[]).length,235);
  const links=s=>[...s.matchAll(/href="(\.\.\/(?:data|sources)\/[^"]+)"/g)].map(m=>m[1]);
  assert.deepEqual(links(ta),links(en));
});
for(const locale of locales)test(`Tamil ${locale}: directory routes and explicit chooser preserved`,()=>{
  for(const [page,target] of [['privacy','/privacy/ta/v1.4/'],['terms','/terms/ta/v1.2/'],['licenses','/licenses/releases/android-1.1.0-13/ta/']]){
    let destination; const location={search:'',replace:v=>destination=v};
    const env={navigator:{language:locale},location,window:{location},URLSearchParams};
    vm.runInNewContext(scripts(read(page+'/index.html'))[0],env);assert.equal(destination,target);
    destination=undefined;location.search='?choose=1';
    vm.runInNewContext(scripts(read(page+'/index.html'))[0],env);assert.equal(destination,undefined);
  }
});
for(const locale of locales)test(`Tamil ${locale}: Home brand, legal links and switching back`,()=>{
  const document=doc(); const context={document,navigator:{language:locale},location:{search:''},URLSearchParams};
  scripts(read('index.html')).forEach(s=>vm.runInNewContext(s,context));
  assert.equal(document.documentElement.lang,'ta');assert.match(document.nodes['service-name-text'].textContent,/நம்கேம்/);
  assert.equal(document.nodes.privacy.href,'/privacy/ta/v1.4/ta.html');
  assert.equal(document.nodes['nav-terms'].href,'/terms/ta/v1.2/');
  assert.equal(document.nodes['nav-home'].href,'/?lang=ta');
  assert.equal(document.nodes.language.attrs['aria-label'],'மொழி');
  for(const language of ['ko','en','es','fr','pt','id','de','ja','hi','bn','mr','te','ta']){
    document.nodes.language.value=language;document.nodes.language.change();
    assert.equal(document.documentElement.lang,language);
    assert.equal(document.nodes['service-name-link'].href,'/names/#'+language);
  }
});
for(const locale of locales)for(const userAgent of ['Android','iPhone','Macintosh'])test(`Tamil ${locale} ${userAgent}: Join and Download preserve store readiness and local links`,()=>{
  const navigator={language:locale,userAgent,platform:'MacIntel',maxTouchPoints:0};
  const config={googlePlayUrl:'https://play.google.com/store/apps/details?id=com.meroviq.lemera',appStoreUrl:''};
  const join=require('../public/join/join.js'); const j=doc();join.mount(j,navigator,config,join);
  assert.equal(j.documentElement.lang,'ta');assert.equal(j.nodes.brand.textContent,'நம்கேம்');
  assert.equal(j.nodes.play.href,config.googlePlayUrl);assert.equal(j.nodes.apple.href,undefined);
  assert.equal(j.nodes.privacy.href,'/privacy/ta/v1.4/');
  assert.equal(j.nodes.brand.href,'/?lang=ta');
  assert.equal(j.nodes.language.attrs['aria-label'],'மொழி');
  const document=doc();vm.runInNewContext(read('download/download.js'),{document,navigator,window:{LEMERA_DOWNLOAD_CONFIG:config}});
  assert.equal(document.documentElement.lang,'ta');assert.equal(document.nodes['download-title'].textContent,'நம்கேமைப் பதிவிறக்குங்கள்');
  assert.equal(document.nodes['play-store-link'].href,config.googlePlayUrl);
  assert.equal(document.nodes['app-badge'].textContent,'விரைவில்');
  assert.equal(document.nodes['download-foot-privacy'].href,'/privacy/ta/v1.4/');
  assert.equal(document.nodes['download-brand'].href,'/?lang=ta');
  assert.equal(document.nodes['download-language'].attrs['aria-label'],'மொழி');
  document.nodes['download-language'].value='en';document.nodes['download-language'].onchange();
  assert.equal(document.documentElement.lang,'en');assert.equal(document.nodes['play-store-link'].href,config.googlePlayUrl);
});
