const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');const path=require('node:path');
const root=path.resolve(__dirname,'../public');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const section=(s,n)=>s.match(new RegExp(`<h2>${n}\\.[\\s\\S]*?(?=<h2>|<footer>)`))[0].trim();
for(const lang of ['ko','en','es']){
 test(`${lang}: minimal release retains structure, rights and platform direction`,()=>{
  const t=read(`terms/${lang}/v1.2/index.html`);
  const old=read(`terms/${lang}/${lang==='ko'?'v1.1':'v1.0'}/index.html`);
  for(const n of [1,2,3,6,8,9,11,12,13,14,15])assert.equal(section(t,n),section(old,n));
  for(const suffix of ['','-eea-uk','-us-ca']){
   const p=read(`privacy/${lang}/v1.4/${lang}${suffix}.html`);
   assert.equal((p.match(/<h2>\d+\./g)||[]).length,15);
   for(const key of ['android-zxing-version13','legacy-mlkit','platform-scope','photo-storage','profile-retention','os-backup','photo-deletion'])assert.match(p,new RegExp(`data-policy-fact="${key}"`));
   assert.match(p,/ZXing-C\+\+/);assert.match(p,/Vision/);assert.match(p,/versionCode 13/);
   assert.match(p,/2026/); assert.doesNotMatch(p,/data-publication-status="draft"/);
   assert.doesNotMatch(p,/iOS 사이의 그룹 연결은 지원하지|Group connections between Android and iOS are not supported|No se admiten conexiones de grupo entre Android e iOS/);
   const direction={ko:/Android Host의 그룹에는 Android 및 iPhone Member/,en:/Android and iPhone Members can join a group hosted on Android/,es:/Los miembros Android y iPhone pueden unirse a un grupo creado por un anfitrión Android/};
   assert.match(p,direction[lang]);assert.match(t,direction[lang]);
  }
  const lic=read(`licenses/releases/android-1.1.0-13/${lang}/index.html`);
  assert.match(lic,/io.github.zxing-cpp:android/);assert.match(lic,/3\.1\.1/);
  assert.doesNotMatch(lic,/com.google.mlkit:|com.google.android.datatransport:|com.google.firebase:firebase-encoders/);
 });
}
test('new release pages have resolvable internal links and keep language/region paths',()=>{
 const walk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(d,e.name)):[path.join(d,e.name)]);
 const pages=walk(root).filter(p=>p.endsWith('.html')&&/\/v1\.4\/|\/terms\/[^/]+\/v1\.2\/|\/licenses\/releases\/|\/release-preview\//.test(p));
 for(const file of pages){
  for(const [,href] of fs.readFileSync(file,'utf8').matchAll(/(?:href|src)="([^"]+)"/g)){
   if(/^(https?:|mailto:|#)/.test(href))continue;
   let target=href.startsWith('/')?path.join(root,href):path.resolve(path.dirname(file),href);
   target=target.split(/[?#]/)[0];assert.ok(fs.existsSync(target),`${file} -> ${href}`);
  }
 }
});
test('release notices and corresponding MPL source retain their exact SHA-256',()=>{
 const crypto=require('node:crypto');const sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
 const base=path.join(root,'licenses/releases/android-1.1.0-13');
 for(const file of fs.readdirSync(path.join(base,'data')).filter(p=>/^[a-f0-9]{64}\.txt$/.test(p)))assert.equal(sha(path.join(base,'data',file)),file.slice(0,64));
 const source=JSON.parse(fs.readFileSync(path.join(base,'sources/source-manifest.json')));
 assert.equal(sha(path.join(base,'sources',source.archive)),source.sha256);
});
