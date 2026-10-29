# coding: utf-8

from pathlib import Path
import re,json
p=Path('public');d=Path('docs/hindi-preparation')
langs=[('ko','한국어'),('en','English'),('es','Español'),('fr','Français'),('pt','Português'),('de','Deutsch'),('ja','日本語'),('id','Bahasa Indonesia'),('hi','हिन्दी')]
nav='<nav><a href="/?lang=hi">Lemera जानकारी</a><a href="/privacy/hi/v1.4/">निजता</a><a href="/terms/hi/v1.2/">शर्तें</a><a href="/licenses/hi/">लाइसेंस</a></nav>'
def write(f,s):
 q=p/f;q.parent.mkdir(parents=True,exist_ok=True);q.write_text(s)
def page(title,body):return '<!doctype html><html lang="hi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+title+'</title><link rel="stylesheet" href="/assets/legal.css"><style>main{overflow-wrap:break-word}td,th,a{overflow-wrap:anywhere}</style></head><body><main>'+nav+body+'<footer><p><a href="/privacy/hi/v1.4/">निजता नीति</a> · <a href="/terms/hi/v1.2/">सेवा की शर्तें</a> · <a href="/licenses/hi/">ओपन-सोर्स लाइसेंस</a></p></footer></main></body></html>\n'
privacy=(d/'privacy.html').read_text()
for suf,extra in [('', ''),('-eea-uk',(d/'eea.html').read_text()),('-us-ca',(d/'ca.html').read_text())]:
 links='<nav>'+''.join(f'<a lang="{l}" href="/privacy/{l}/v1.4/{l}{suf}.html">{n}</a>' for l,n in langs)+'</nav><nav><a href="hi.html">सामान्य</a><a href="hi-eea-uk.html">EEA, यूके और स्विट्ज़रलैंड</a><a href="hi-us-ca.html">कैलिफ़ोर्निया</a></nav>'
 write(f'privacy/hi/v1.4/hi{suf}.html',page('Lemera निजता नीति'+{'':' — सामान्य','-eea-uk':' — EEA, यूके और स्विट्ज़रलैंड','-us-ca':' — कैलिफ़ोर्निया'}[suf],links+privacy+extra))
write('privacy/hi/v1.4/index.html',page('Lemera निजता','<p><a href="hi.html">निजता नीति पढ़ें</a></p><script>window.location.replace("/privacy/hi/v1.4/hi.html");</script>'))
terms=(d/'terms.html').read_text()
for marker,fact in [('PHOTO_DELETION','photo-deletion'),('OS_BACKUP','os-backup'),('PROFILE_RETENTION','profile-retention')]:terms=terms.replace('<!--'+marker+'-->',re.search('<p data-policy-fact="'+fact+'">.*?</p>',privacy,re.S)[0])
write('terms/hi/v1.2/index.html',page('Lemera सेवा की शर्तें','<nav>'+''.join(f'<a lang="{l}" href="/terms/{l}/v1.2/">{n}</a>' for l,n in langs)+'</nav>'+terms))
write('licenses/hi/index.html',page('Lemera लाइसेंस','<h1>ओपन-सोर्स लाइसेंस</h1><p><a href="/licenses/releases/android-1.1.0-13/hi/">Android 1.1.0 (13), ZXing — सत्यापित संस्करण सूची</a></p><p>यह सूची ZXing बदलाव के लिए तैयार की गई है। पुराने संस्करणों में ML Kit सहित अलग घटक हो सकते हैं। उनकी सूचनाएँ <a href="/licenses/history/pre-zxing-20261027/?lang=en">ऐतिहासिक सूची में सुरक्षित हैं</a>। मूल लाइसेंस पाठ और संबंधित स्रोत नहीं बदले हैं।</p>'))
s=(p/'licenses/releases/android-1.1.0-13/id/index.html').read_text().replace('lang="id"','lang="hi"');s=re.sub(r'<nav>.*?</nav>',nav,s,count=1)
rep={'Lisensi sumber terbuka':'ओपन-सोर्स लाइसेंस','Inventaris dependensi AAB final dengan ZXing. Entri pengembangan atau platform lain tidak membuktikan penyertaan di Android. iOS tetap menggunakan Vision; verifikasi IPA final merupakan tahap terpisah sebelum rilis. Teks lisensi tetap dalam bahasa aslinya.':'ZXing वाले अंतिम AAB की निर्भरता सूची। डेवलपमेंट या दूसरे प्लेटफ़ॉर्म की प्रविष्टियाँ Android में शामिल होने का प्रमाण नहीं हैं। iOS पर Vision जारी है; अंतिम IPA की जाँच रिलीज़ से पहले अलग चरण है। लाइसेंस पाठ मूल भाषा में हैं।','27 Oktober 2026':'27 अक्टूबर 2026','Kode sumber terkait MPL-2.0':'MPL-2.0 का संबंधित स्रोत कोड','Sumber sertifikat akar cadangan Dart':'Dart फ़ॉलबैक रूट प्रमाणपत्रों का स्रोत','Manifest SHA-256':'SHA-256 मैनिफ़ेस्ट','LisensiInventaris — dapat digulir horizontal':'लाइसेंस सूची — क्षैतिज स्क्रॉल उपलब्ध','Komponen':'घटक','Cakupan':'दायरा','Lisensi</th>':'लाइसेंस</th>','Versi</th>':'संस्करण</th>','Hanya pengembangan':'केवल डेवलपमेंट','Langsung':'प्रत्यक्ष','Transitif':'अप्रत्यक्ष','Aset disertakan':'शामिल एसेट'}
for a,b in rep.items():s=s.replace(a,b)
write('licenses/releases/android-1.1.0-13/hi/index.html',s)
for l,n in langs[:-1]:
 for q in (p/f'privacy/{l}/v1.4').glob('*.html'):
  if q.name=='index.html':continue
  suf=q.stem[len(l):];q.write_text(q.read_text().replace('</nav>',f'<a lang="hi" href="/privacy/hi/v1.4/hi{suf}.html">हिन्दी</a></nav>',1))
 q=p/f'terms/{l}/v1.2/index.html';q.write_text(q.read_text().replace('</nav>','<a lang="hi" href="/terms/hi/v1.2/">हिन्दी</a></nav>',1))
for l,n in langs:
 q=p/f'licenses/releases/android-1.1.0-13/{l}/index.html';q.write_text(q.read_text().replace('<a href="../id/">Bahasa Indonesia</a>','<a href="../id/">Bahasa Indonesia</a><a href="../hi/">हिन्दी</a>'))
for route,v in [('privacy','v1.4'),('terms','v1.2')]:
 q=p/f'{route}/index.html';s=q.read_text().replace("if(lang.startsWith('id'))",f"if(lang.startsWith('hi')){{window.location.replace('/{route}/hi/{v}/');}}else if(lang.startsWith('id'))")
 extra='<h2>हिन्दी</h2><ul><li><a href="/privacy/hi/v1.4/hi.html">सामान्य नीति</a></li><li><a href="/privacy/hi/v1.4/hi-eea-uk.html">EEA, यूके और स्विट्ज़रलैंड</a></li><li><a href="/privacy/hi/v1.4/hi-us-ca.html">कैलिफ़ोर्निया</a></li></ul>' if route=='privacy' else '<ul><li><a lang="hi" href="/terms/hi/v1.2/">हिन्दी</a></li></ul>'
 q.write_text(s.replace('</main>',extra+'</main>'))
q=p/'licenses/index.html';q.write_text(q.read_text().replace("['ko','en','es','fr','pt','de','ja','id']","['ko','en','es','fr','pt','de','ja','id','hi']").replace('</ul>','<li><a lang="hi" href="/licenses/releases/android-1.1.0-13/hi/">हिन्दी</a></li></ul>',1))
for f in ['index.html','join/index.html','download/index.html']:
 q=p/f;q.write_text(q.read_text().replace('<option value="id">Bahasa Indonesia</option>','<option value="id">Bahasa Indonesia</option><option value="hi">हिन्दी</option>'))
common=dict(brand='Lemera जानकारी',privacy='निजता',terms='शर्तें',licenses='लाइसेंस')
home=dict(common,policy='निजता नीति',service='सेवा की शर्तें',notice='ओपन-सोर्स लाइसेंस',intro='Meroviq के Lemera के कानूनी दस्तावेज़।',contact='संपर्क',links=['/privacy/hi/v1.4/hi.html','/terms/hi/v1.2/','/licenses/hi/'])
join=dict(brand='Lemera',title='Lemera ग्रुप से जुड़ें',privacy='निजता',terms='शर्तें',android='इस ग्रुप से जुड़ने के लिए Lemera इंस्टॉल करें।',ios='iPhone और iPad के लिए Lemera जल्द आ रहा है।',iosReady='इस ग्रुप से जुड़ने के लिए Lemera इंस्टॉल करें।',other='iPhone या Android से जुड़ें। Android के लिए Lemera, Google Play पर उपलब्ध है।',soon='जल्द आ रहा है',note='इंस्टॉल करने के बाद ऐप में होस्ट का QR दोबारा स्कैन करें। Lemera पहले से इंस्टॉल है तो उसका स्कैनर खोलें।')
download=dict(common,privacyFull='निजता नीति',termsFull='सेवा की शर्तें',licensesFull='ओपन-सोर्स लाइसेंस',title='Lemera डाउनलोड करें',subtitle='अपने डिवाइस का स्टोर चुनें।',playCaption='Android डिवाइस के लिए',appCaption='iPhone और iPad के लिए',open='खोलें',comingSoon='जल्द आ रहा है',androidNote='आप Android इस्तेमाल कर रहे हैं। Google Play से Lemera डाउनलोड करें।',iosNote='आप iPhone या iPad इस्तेमाल कर रहे हैं। App Store संस्करण जल्द आ रहा है।',iosReadyNote='आप iPhone या iPad इस्तेमाल कर रहे हैं। App Store से Lemera डाउनलोड करें।',otherNote='अपने डिवाइस का स्टोर चुनें।')
for f,c in [('index.html',home),('join/join.js',join),('download/download.js',download)]:
 q=p/f;s=q.read_text().replace('    id:','    hi: '+json.dumps(c,ensure_ascii=False)+',\n    id:',1)
 for quote,space in [("'",''),("'",' '),('"',' ')]:
  a='['+(','+space).join(quote+l+quote for l in ['en','ko','es','fr','pt','de','ja','id'])+']';s=s.replace(a,a[:-1]+','+space+quote+'hi'+quote+']')
 if f=='join/join.js':
  s=s.replace("selected === 'id' ? '/privacy/id/v1.4/'", "selected === 'hi' ? '/privacy/hi/v1.4/' : selected === 'id' ? '/privacy/id/v1.4/'").replace("selected === 'id' ? '/terms/id/v1.2/'","selected === 'hi' ? '/terms/hi/v1.2/' : selected === 'id' ? '/terms/id/v1.2/'")
 if f=='download/download.js':s=s.replace("selected === 'id' ? {privacy:","selected === 'hi' ? {privacy:'/privacy/hi/v1.4/',terms:'/terms/hi/v1.2/',licenses:'/licenses/hi/'}[route] : selected === 'id' ? {privacy:").replace("selected === 'id' ? 'Pilihan unduhan'","selected === 'hi' ? 'डाउनलोड विकल्प' : selected === 'id' ? 'Pilihan unduhan'")
 q.write_text(s)
