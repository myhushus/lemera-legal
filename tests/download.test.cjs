const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const script = fs.readFileSync(require.resolve('../public/download/download.js'), 'utf8');
const configScript = fs.readFileSync(require.resolve('../public/download/config.js'), 'utf8');
const context = { window: {} };
vm.runInNewContext(configScript, context);
const config = context.window.LEMERA_DOWNLOAD_CONFIG;
const playUrl = 'https://play.google.com/store/apps/details?id=com.meroviq.lemera';
function mount(navigator, cfg = config) {
  const nodes = {};
  const document = {getElementById(id) {return nodes[id] ||= {
    textContent: '', dataset: {}, attributes: {'aria-disabled':'true'},
    removeAttribute(key) {delete this.attributes[key];},
    addEventListener(type, handler) {this[type] = handler;},
  };}};
  vm.runInNewContext(script, {window:{LEMERA_DOWNLOAD_CONFIG:cfg}, navigator, document});
  return nodes;
}
for(const [name,userAgent,platform,maxTouchPoints,expected] of [
  ['Android','Android','Linux',5,'android'],
  ['iPhone','iPhone','iPhone',5,'ios'],
  ['iPad','iPad','iPad',5,'ios'],
  ['iPad desktop UA','Macintosh','MacIntel',5,'ios'],
  ['desktop','Macintosh','MacIntel',0,'other'],
  ['unknown','','',0,'other'],
]) for(const language of ['ko-KR','en-US','es-ES','es-MX','ja-JP','it-IT']) test(`deployed download: ${name} ${language}`,()=>{
  const nodes=mount({userAgent,platform,maxTouchPoints,language});
  assert.equal(nodes['play-store-link'].href,playUrl);
  assert.equal(nodes['app-store-link'].href,undefined);
  assert.equal(nodes['app-store-link'].attributes['aria-disabled'],'true');
  const expectedCopy=language.startsWith('ko')?'출시 예정':language.startsWith('es')?'Próximamente':language.startsWith('ja')?'近日公開':'Coming Soon';
  assert.equal(nodes['app-badge'].textContent,expectedCopy);
  assert.equal(nodes['play-store-link'].dataset.recommended,expected==='android'?'true':undefined);
  assert.equal(nodes['app-store-link'].dataset.recommended,expected==='ios'?'true':undefined);
  let prevented=false;nodes['app-store-link'].click({preventDefault(){prevented=true;}});assert.equal(prevented,true);
});
test('deployed download config is shared and stays unpublished on iOS',()=>{
  assert.equal(config.googlePlayUrl,playUrl);assert.equal(config.appStoreUrl,'');
});
test('one shared config value enables the published App Store link',()=>{
  const appUrl='https://apps.apple.com/app/id6815128720';
  const nodes=mount({userAgent:'iPhone',language:'en'}, {...config,appStoreUrl:appUrl});
  assert.equal(nodes['app-store-link'].href,appUrl);
  assert.equal(nodes['app-store-link'].attributes['aria-disabled'],undefined);
  assert.equal(nodes['play-store-link'].href,playUrl);
});
test('deployed download has no fragment read, storage, analytics or redirect',()=>{
  assert.doesNotMatch(script,/location\s*[.\[]|localStorage|sessionStorage|sendBeacon|fetch\s*\(|window\.open/);
});

test('download Spanish language can be selected manually without changing store URLs',()=>{
  const nodes=mount({userAgent:'Android',language:'en-US'});
  nodes['download-language'].value='es';
  nodes['download-language'].onchange();
  assert.equal(nodes['download-title'].textContent,'Descargar Lemera');
  assert.equal(nodes['app-badge'].textContent,'Próximamente');
  assert.equal(nodes['play-store-link'].href,playUrl);
  nodes['download-language'].value='ko';
  nodes['download-language'].onchange();
  assert.equal(nodes['app-badge'].textContent,'출시 예정');
});
