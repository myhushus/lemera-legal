const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');const vm=require('node:vm');
const root=path.resolve(__dirname,'../public');const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const dates={ko:'2026년 10월 27일',en:'October 27, 2026',es:'27 de octubre de 2026',fr:'27 octobre 2026'};
for(const lang of Object.keys(dates))test(`${lang}: current privacy and terms share the approved effective date`,()=>{
 for(const p of [`terms/${lang}/v1.2/index.html`,...['','-eea-uk','-us-ca'].map(s=>`privacy/${lang}/v1.4/${lang}${s}.html`)]){
  const s=read(p);assert.ok(s.includes(dates[lang]),p);assert.doesNotMatch(s,/data-publication-status="draft"/);
 }
 for(const [page,expected] of [['privacy',`/privacy/${lang}/v1.4/`],['terms',`/terms/${lang}/v1.2/`],['licenses',`/licenses/releases/android-1.1.0-13/${lang}/`]]){
  const script=read(page+'/index.html').match(/<script>([\s\S]*?)<\/script>/)[1];let got='';const location={search:'',replace:v=>got=v};
  vm.runInNewContext(script,{navigator:{language:lang+'-XX'},location,window:{location},URLSearchParams});assert.equal(got,expected);
 }
});
