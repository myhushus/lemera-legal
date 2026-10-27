const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const {mount} = require('../public/join/join.js');
const helpers = require('../public/join/join.js');
const configContext = {window: {}};
vm.runInNewContext(fs.readFileSync(require.resolve('../public/download/config.js'), 'utf8'), configContext);
vm.runInNewContext(fs.readFileSync(require.resolve('../public/join/config.js'), 'utf8'), configContext);
const config = configContext.window.LEMERA_JOIN_CONFIG;
const playUrl = 'https://play.google.com/store/apps/details?id=com.meroviq.lemera';
const appUrl = 'https://apps.apple.com/app/id6815128720';
function document() {
  const ids = ['brand','privacy','terms','join-title','join-lead','join-note','play','apple','soon','language'];
  const nodes = Object.fromEntries(ids.map(id => [id, {
    textContent: '', attrs: id === 'apple' ? {'aria-disabled':'true'} : {},
    classes: new Set(),
    setAttribute(k,v) {this.attrs[k]=v;},
    removeAttribute(k) {if(k==='href')delete this.href; delete this.attrs[k];},
    classList: {toggle(k,on) {if(on)nodes[id].classes.add(k);else nodes[id].classes.delete(k);}},
  }]));
  return {documentElement:{}, getElementById(id){return nodes[id];}, nodes};
}
for(const [name,userAgent,maxTouchPoints,platform] of [
  ['Android','Android',5,'android'],['iPhone','iPhone',5,'ios'],['iPad','iPad',5,'ios'],
  ['iPad desktop UA','Macintosh',5,'ios'],['desktop','Macintosh',0,'other'],['unknown','',0,'other'],
]) for(const language of ['ko-KR','en-US','es-ES','es-MX','fr-FR']) test(`${name} ${language}: install fallback, local copy, manual choice`,()=>{
  const doc = document(); mount(doc,{userAgent,maxTouchPoints,language},config,helpers);
  assert.equal(doc.nodes.play.href,playUrl);
  assert.equal(doc.nodes.apple.href,undefined);
  assert.equal(doc.nodes.apple.attrs['aria-disabled'],'true');
  const locale=language.startsWith('ko')?'ko':language.startsWith('es')?'es':language.startsWith('fr')?'fr':'en';
  const soon={ko:'출시 준비 중',en:'Coming Soon',es:'Próximamente',fr:'Bientôt disponible'};
  assert.equal(doc.nodes.soon.textContent,soon[locale]);
  assert.equal(doc.nodes.brand.textContent,locale==='ko'?'공카':'Lemera');
  assert.equal(doc.documentElement.lang,locale);
  assert.equal(doc.nodes.language.value,locale);
  assert.equal(doc.nodes.play.classes.has('recommended'),platform==='android');
  assert.equal(doc.nodes.apple.classes.has('recommended'),platform==='ios');
  if(platform==='ios')assert.match(doc.nodes['join-lead'].textContent,/출시 준비|coming soon|disponible próximamente|bientôt disponible/);
  const next=locale==='es'?'en':'es';
  doc.nodes.language.value=next;
  doc.nodes.language.onchange();
  assert.equal(doc.documentElement.lang,next);
  assert.equal(doc.nodes.play.href,playUrl);
});
test('one shared config activates App Store without an app update',()=>{
  const doc=document(); mount(doc,{userAgent:'iPhone',language:'en'}, {...config,appStoreUrl:appUrl},helpers);
  assert.equal(doc.nodes.apple.href,appUrl);
  assert.equal(doc.nodes.apple.attrs['aria-disabled'],undefined);
  assert.equal(doc.nodes.soon.textContent,'');
  assert.doesNotMatch(doc.nodes['join-lead'].textContent,/coming soon/);
  assert.equal(config,configContext.window.LEMERA_DOWNLOAD_CONFIG);
});
test('page never reads fragment, sends credentials, persists them or redirects',()=>{
  const doc=document(); const nav={userAgent:'Android',language:'ko'};
  const window={document:doc,navigator:nav,LEMERA_JOIN_CONFIG:config,LemeraStoreLinks:helpers};
  for(const key of ['location','localStorage','sessionStorage','fetch','XMLHttpRequest','indexedDB'])
    Object.defineProperty(window,key,{get(){throw new Error(`Forbidden: ${key}`);}});
  vm.runInNewContext(fs.readFileSync(require.resolve('../public/join/join.js'),'utf8'),{window,URL});
  assert.equal(doc.nodes.play.href,playUrl);
  for(const file of ['../public/join/join.js','../public/join/config.js']) {
    const script=fs.readFileSync(require.resolve(file),'utf8');
    assert.doesNotMatch(script,/location\s*[.\[]|localStorage|sessionStorage|fetch\s*\(|sendBeacon|XMLHttpRequest|window\.open/);
  }
  const html=fs.readFileSync(require.resolve('../public/join/index.html'),'utf8');
  assert.match(html,/name="referrer" content="no-referrer"/);
  assert.match(html,/connect-src 'none'/);
  assert.doesNotMatch(html,/http-equiv="refresh"|https?:\/\/(?!play\.google\.com)/);
});
test('invalid store URLs do not become navigable links',()=>{
  for(const appStoreUrl of ['javascript:alert(1)','https://evil.test','https://apps.apple.com.evil.test']) {
    const doc=document();mount(doc,{userAgent:'iPhone'}, {...config,appStoreUrl},helpers);
    assert.equal(doc.nodes.apple.href,undefined);
  }
});
test('DAL uses user-confirmed PLAY app signing, never upload certificate',()=>{
  const dal=require('../public/.well-known/assetlinks.json');
  assert.equal(dal[0].target.package_name,'com.meroviq.lemera');
  assert.deepEqual(dal[0].target.sha256_cert_fingerprints,[
    'A3:73:EC:05:BA:F6:77:C0:8D:AB:B6:F6:24:76:0A:4E:EC:15:BC:88:1C:7F:F7:2E:A2:3E:DF:C1:D5:3C:45:CB',
  ]);
  const aasa=JSON.parse(fs.readFileSync(path.join(__dirname,'../public/.well-known/apple-app-site-association'),'utf8'));
  assert.deepEqual(aasa.applinks.details,[]); // iPhone must use web until public release.
});
test('future Universal Links generation uses existing real Team ID and only join paths',()=>{
  const saved={};
  const script=fs.readFileSync(require.resolve('../scripts/prepare-app-links.cjs'),'utf8');
  const source=require('../config/app-links.json');
  const context={__dirname:path.join(__dirname,'../scripts'),console,
    require(name) {
      if(name==='../config/app-links.json')return {...source,iosUniversalLinksEnabled:true};
      if(name==='node:fs')return {writeFileSync(file,value){saved[path.basename(file)]=JSON.parse(value);}};
      return require(name);
    }};
  vm.runInNewContext(script,context);
  const details=saved['apple-app-site-association'].applinks.details[0];
  assert.equal(details.appID,'R6FXDSF43S.com.meroviq.lemera');
  assert.equal(JSON.stringify(details.paths),JSON.stringify(['/join','/join/*']));
});
