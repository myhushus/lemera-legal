const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.resolve(__dirname,'../public');
const load=p=>fs.readFileSync(path.join(root,p),'utf8');
const privacy=['es.html','es-eea-uk.html','es-us-ca.html'];

test('Spanish privacy variants and terms preserve all numbered sections',()=>{
  for(const file of privacy) {
    const html=load('privacy/es/v1.2/'+file);
    assert.match(html,/<html lang="es">/);
    assert.equal((html.match(/<h2>\d+\./g)||[]).length,15);
    assert.match(html,/Versión:<\/strong> 1\.2/);
    assert.match(html,/5 de octubre de 2026/);
    assert.match(html,/lemera@meroviq\.com/);
  }
  assert.match(load('privacy/es/v1.2/es-eea-uk.html'),/Bases jurídicas/);
  assert.match(load('privacy/es/v1.2/es-us-ca.html'),/CCPA\/CPRA/);
  const terms=load('terms/es/v1.0/index.html');
  assert.equal((terms.match(/<h2>\d+\./g)||[]).length,15);
  assert.match(terms,/17 de agosto de 2026/);
});
test('Spanish license package inventory matches English table rows',()=>{
  const source=load('licenses/history/pre-zxing-20261027/index.html').split('<hr>')[0];
  const spanish=load('licenses/es/index.html');
  assert.equal((spanish.match(/<tr>/g)||[]).length,(source.match(/<tr>/g)||[]).length);
  assert.match(spanish,/Licencias de código abierto/);
  for(const id of ['camera_android_camerax','mobile_scanner','shared_preferences'])assert.ok(spanish.includes(id));
});
test('Spanish policy and terms are selected from browser locale; English fallback preserved',()=>{
  const specs=[
    ['privacy','/privacy/es/v1.4/','/privacy/en/v1.4/','/privacy/ko/v1.4/'],
    ['terms','/terms/es/v1.2/','/terms/en/v1.2/','/terms/ko/v1.2/'],
  ];
  for(const [page,es,en,ko] of specs){
    const html=load(page+'/index.html');
    const script=html.match(/<script>([\s\S]*?)<\/script>/)[1];
    for(const [locale,expected] of [['es-ES',es],['es-MX',es],['en-US',en],['ko-KR',ko],['it-IT',en]]){
      let redirected='';
      const location={search:'',replace(u){redirected=u;}};
      vm.runInNewContext(script,{navigator:{language:locale},location,window:{location},URLSearchParams});
      assert.equal(redirected,expected,page+' '+locale);
    }
    let redirected='';
    const location={search:'?choose=1',replace(u){redirected=u;}};
    vm.runInNewContext(script,{navigator:{language:'es-MX'},location,window:{location},URLSearchParams});
    assert.equal(redirected,'');
  }
});
test('Spanish links do not alter join/download endpoints or application links',()=>{
  for(const p of ['join/index.html','download/index.html'])assert.match(load(p),/value="es"/);
  assert.match(load('privacy/index.html'),/privacy\/es\/v1\.4/);
  assert.match(load('terms/index.html'),/terms\/es\/v1\.2/);
  assert.match(load('licenses/index.html'),/licenses\/releases\/android-1\.1\.0-13\/es/);
});
