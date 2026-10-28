const {chromium}=require('/Volumes/DevSSD/caches/npm-user-20261023/_npx/e41f203b7505f1fb/node_modules/playwright');const fs=require('fs');
(async()=>{const browser=await chromium.launch({channel:'chrome',headless:true});const cases=[],errors=[];try{
for(const locale of ['ja','ja-JP'])for(const width of [320,390,768,1280])for(const colorScheme of ['light','dark']){
 const page=await browser.newPage({viewport:{width,height:844},locale,colorScheme});page.on('pageerror',e=>errors.push(String(e)));
 for(const route of ['/','/privacy/','/privacy/ja/v1.4/ja-eea-uk.html','/privacy/ja/v1.4/ja-us-ca.html','/terms/','/licenses/','/licenses/ja/','/join/','/download/']){
  await page.goto('http://127.0.0.1:8774'+route,{waitUntil:'load'});
  const r=await page.evaluate(()=>({lang:document.documentElement.lang,overflow:document.documentElement.scrollWidth>innerWidth+1,play:document.querySelector('#play,#play-store-link')?.getAttribute('href')}));cases.push({locale,width,colorScheme,route,...r});
  if(locale==='ja-JP'&&width===390&&colorScheme==='light'&&['/','/privacy/','/terms/','/download/'].includes(route))await page.screenshot({path:'docs/japanese-preparation/'+(route==='/'?'home':route.split('/')[1])+'.png'});
 }
 await page.close();
}
for(const route of ['/','/join/','/download/']){
 const page=await browser.newPage({viewport:{width:320,height:844},locale:'en-US'});await page.goto('http://127.0.0.1:8774'+route);
 for(const lang of ['ko','en','es','fr','pt','de','ja']){await page.locator('select').selectOption(lang);const actual=await page.locator('html').getAttribute('lang');if(actual!==lang)errors.push('language switch '+route+' '+lang);}
 await page.addStyleTag({content:'html{font-size:200%} body{font-size:2rem}'});const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);cases.push({route,locale:'ja',width:320,largeText:true,lang:'ja',overflow});await page.close();
}
const failures=cases.filter(c=>c.lang!=='ja'||c.overflow||['/join/','/download/'].includes(c.route)&&!c.largeText&&c.play!=='https://play.google.com/store/apps/details?id=com.meroviq.lemera');fs.writeFileSync('docs/japanese-preparation/browser.json',JSON.stringify({cases,failures,errors},null,2));console.log(JSON.stringify({cases:cases.length,failures,errors}));if(failures.length||errors.length)process.exitCode=1;
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exitCode=1});
