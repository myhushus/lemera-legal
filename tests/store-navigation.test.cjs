const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const {start,destination}=require('../public/download/store-navigation.js');
const apple='https://apps.apple.com/app/id6815128720';
const play='https://play.google.com/store/apps/details?id=com.meroviq.lemera';
const config={appStoreUrl:apple,googlePlayUrl:play};
const iphone={userAgent:'iPhone',platform:'iPhone',maxTouchPoints:5};
const devices=[['iPhone',iphone,apple],['iPad',{userAgent:'iPad',platform:'iPad',maxTouchPoints:5},apple],['iPad desktop',{userAgent:'Macintosh',platform:'MacIntel',maxTouchPoints:5},apple],['iPad desktop without platform',{userAgent:'Macintosh',maxTouchPoints:5},apple],['Android',{userAgent:'Android',platform:'Linux',maxTouchPoints:5},play],['desktop',{userAgent:'Macintosh',platform:'MacIntel',maxTouchPoints:0},null],['unknown',{userAgent:'',platform:'',maxTouchPoints:0},null]];
function events(object={}) {
 const handlers={};
 object.addEventListener=(name,callback)=>{(handlers[name]||=[]).push(callback);};
 object.emit=(name,event={})=>{for(const fn of handlers[name]||[])fn(event);};
 return object;
}
function environment({state=null,hidden=false,ready='complete',blockNavigation=false,badHistory=false}={}) {
 const calls=[],writes=[],timers=new Map(),callbacks=[];let id=0,now=0;
 const doc=events({visibilityState:hidden?'hidden':'visible',readyState:ready});
 const history={state,replaceState(next,title,...url){if(badHistory)throw Error('history blocked');assert.equal(url.length,0);writes.push(next);this.state=next;}};
 const location={assign(url){calls.push(url);if(blockNavigation)throw Error('navigation blocked');}};
 for(const key of ['href','hash','search','pathname','origin'])Object.defineProperty(location,key,{get(){throw Error('URL read: '+key);}});
 const win=events({history,location,setTimeout(fn,ms){timers.set(++id,{fn,time:now+ms});callbacks.push(fn);return id;},clearTimeout(key){timers.delete(key);}});
 for(const key of ['localStorage','sessionStorage','fetch','XMLHttpRequest','indexedDB'])Object.defineProperty(win,key,{get(){throw Error('Forbidden '+key);}});
 return {win,doc,calls,writes,callbacks,timers,tick(ms=1200){now+=ms;for(const [key,t]of [...timers])if(t.time<=now){timers.delete(key);t.fn();}}};
}
for(const [name,nav,target]of devices)test(name+' routes only to the exact official store',()=>{
 const e=environment();start(e.win,e.doc,nav,config);e.tick(1199);assert.deepEqual(e.calls,[]);e.tick(1);assert.deepEqual(e.calls,target?[target]:[]);e.tick(5000);assert.equal(e.calls.length,target?1:0);
});
for(const field of ['appStoreUrl','googlePlayUrl'])for(const value of ['',undefined,'javascript:alert(1)','http://apps.apple.com/app/id6815128720','https://apps.apple.com.evil.test/app/id6815128720',apple+'?invite=synthetic',apple+'#synthetic',play+'&invite=synthetic',play+'#synthetic','https://apps.apple.com/app/id999','https://play.google.com/store/apps/details?id=another'])test(`invalid ${field} ${value} never auto navigates`,()=>{
 const e=environment();start(e.win,e.doc,field==='appStoreUrl'?iphone:devices.find(d=>d[0]==='Android')[1],{...config,[field]:value});e.tick();assert.deepEqual(e.calls,[]);assert.equal(e.writes.length,0);
});
test('legacy Play config key stays supported only for the exact URL',()=>assert.equal(destination(devices.find(d=>d[0]==='Android')[1],{playStoreUrl:play}),play));
test('waits for page load once, then 1200ms',()=>{
 const e=environment({ready:'loading'});start(e.win,e.doc,iphone,config);e.tick(10000);assert.deepEqual(e.calls,[]);e.doc.readyState='complete';e.win.emit('load');e.win.emit('load');assert.equal(e.timers.size,1);e.tick();assert.deepEqual(e.calls,[apple]);
});
for(const transition of ['hidden-before-load','hidden-during-delay','pagehide-before-load','pagehide-during-delay','bfcache','pointerdown','keydown'])test(transition+' cancels even a late callback and never restarts on return',()=>{
 const before=transition.endsWith('before-load'),e=environment({ready:before?'loading':'complete'});start(e.win,e.doc,iphone,config);
 if(transition.startsWith('hidden')){e.doc.visibilityState='hidden';e.doc.emit('visibilitychange');}
 else if(transition.startsWith('pagehide'))e.win.emit('pagehide');
 else if(transition==='bfcache')e.win.emit('pageshow',{persisted:true});
 else e.doc.emit(transition);
 e.doc.visibilityState='visible';e.doc.emit('visibilitychange');e.win.emit('pageshow',{persisted:true});e.win.emit('load');e.tick(10000);for(const fn of e.callbacks)fn();assert.deepEqual(e.calls,[]);
});
test('initial background page stays manual even after foregrounding',()=>{
 const e=environment({hidden:true});start(e.win,e.doc,iphone,config);e.doc.visibilityState='visible';e.doc.emit('visibilitychange');e.win.emit('load');e.tick();assert.deepEqual(e.calls,[]);
});
test('prerender stays manual',()=>{const e=environment();e.doc.prerendering=true;start(e.win,e.doc,iphone,config);e.tick();assert.deepEqual(e.calls,[]);});
test('history boolean prevents reload/back re-execution and preserves unrelated history state',()=>{
 const e=environment({state:{other:'retained'}});start(e.win,e.doc,iphone,config);e.tick();assert.deepEqual(e.win.history.state,{other:'retained',lemeraStoreAutoAttempted:true});
 const restored=environment({state:e.win.history.state});start(restored.win,restored.doc,iphone,config);restored.tick();assert.deepEqual(restored.calls,[]);assert.equal(restored.writes.length,0);
 const fresh=environment();start(fresh.win,fresh.doc,iphone,config);fresh.tick();assert.deepEqual(fresh.calls,[apple]);
});
for(const badState of ['foreign-state',42,true,false,0,'',[]])test('non-object existing history remains untouched: '+badState,()=>{const e=environment({state:badState});start(e.win,e.doc,iphone,config);e.tick();assert.deepEqual(e.calls,[]);assert.equal(e.win.history.state,badState);});
test('history write blocked: manual fallback without attempting navigation',()=>{const e=environment({badHistory:true});start(e.win,e.doc,iphone,config);e.tick();assert.deepEqual(e.calls,[]);});
test('navigation exception: one attempt, no retry on return or new execution',()=>{
 const e=environment({blockNavigation:true});start(e.win,e.doc,iphone,config);e.tick();e.win.emit('pageshow',{persisted:true});start(e.win,e.doc,iphone,config);e.tick(30000);assert.deepEqual(e.calls,[apple]);
});
for(const page of ['join','download'])for(const locale of ['ko','en','es','fr','pt','id','de','ja','hi','bn','mr','te','ta'])for(const [device,nav,target]of devices)test(`${page} ${locale} ${device}: actual page scripts keep buttons and auto route safely`,()=>{
 const html=fs.readFileSync(path.join(__dirname,'../public',page,'index.html'),'utf8');
 const nodes={};for(const [,id]of html.matchAll(/id="([^"]+)"/g)) nodes[id]={textContent:'',value:'',dataset:{},attrs:['apple','app-store-link'].includes(id)?{'aria-disabled':'true'}:{},classes:new Set(),setAttribute(k,v){this.attrs[k]=v;},removeAttribute(k){delete this.attrs[k];if(k==='href')delete this.href;},addEventListener(k,v){this[k]=v;},classList:{toggle(k,on){if(on)nodes[id].classes.add(k);else nodes[id].classes.delete(k);}}};
 const e=environment({blockNavigation:true});Object.assign(e.doc,{documentElement:{},getElementById(id){assert.ok(nodes[id],id);return nodes[id];}});e.win.document=e.doc;e.win.navigator={...nav,language:locale+'-XX'};
 const context=vm.createContext({window:e.win,document:e.doc,navigator:e.win.navigator,URL});
 const scripts=[...html.matchAll(/<script[^>]*src="([^"]+)"[^>]*>/g)].map(m=>m[1]);
 assert.equal(scripts.at(-1),'/download/store-navigation.js');assert.match(html,/name="referrer" content="no-referrer"/);
 for(const script of scripts)vm.runInContext(fs.readFileSync(path.join(__dirname,'../public',script),'utf8'),context);
 assert.equal(e.doc.documentElement.lang,locale);e.tick();assert.deepEqual(e.calls,target?[target]:[]);
 for(const [id,url]of [[page==='join'?'apple':'app-store-link',apple],[page==='join'?'play':'play-store-link',play]]){assert.equal(nodes[id].href,url);assert.equal(nodes[id].attrs['aria-disabled'],undefined);}
 const select=nodes[page==='join'?'language':'download-language'];select.value=locale==='en'?'ko':'en';select.onchange();e.tick(10000);assert.deepEqual(e.calls,target?[target]:[]);
});
test('navigation source does not read URL or use credential storage/network APIs',()=>{
 const script=fs.readFileSync(require.resolve('../public/download/store-navigation.js'),'utf8');
 assert.doesNotMatch(script,/location\.(?:hash|search|href|pathname|origin)|document\.URL|localStorage|sessionStorage|fetch\s*\(|sendBeacon|XMLHttpRequest|window\.open|console\./);
});

test('back without bfcache and without preserved history state stays manual',()=>{
 const e=environment();e.win.performance={getEntriesByType(){return [{type:'back_forward'}];}};start(e.win,e.doc,iphone,config);e.tick();assert.deepEqual(e.calls,[]);
});
