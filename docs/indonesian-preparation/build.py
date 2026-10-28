# coding: utf-8
from pathlib import Path
import re,json
p=Path('public');d=Path('docs/indonesian-preparation');langs=[('ko','한국어'),('en','English'),('es','Español'),('fr','Français'),('pt','Português'),('de','Deutsch'),('ja','日本語'),('id','Bahasa Indonesia')]
nav='<nav><a href="/?lang=id">Informasi Lemera</a><a href="/privacy/id/v1.4/">Privasi</a><a href="/terms/id/v1.2/">Ketentuan</a><a href="/licenses/id/">Lisensi</a></nav>'
foot='<footer><p><a href="/privacy/id/v1.4/">Kebijakan Privasi</a> · <a href="/terms/id/v1.2/">Ketentuan Layanan</a> · <a href="/licenses/id/">Lisensi sumber terbuka</a></p></footer>'
def write(f,s):
 q=p/f;q.parent.mkdir(parents=True,exist_ok=True);q.write_text(s)
def page(title,body):return '<!doctype html><html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+title+'</title><link rel="stylesheet" href="/assets/legal.css"><style>main{overflow-wrap:break-word;line-break:strict}td,th,a{overflow-wrap:anywhere}</style></head><body><main>'+nav+body+foot+'</main></body></html>\n'
privacy=(d/'privacy.html').read_text()
for suf,extra in [('', ''),('-eea-uk',(d/'eea.html').read_text()),('-us-ca',(d/'ca.html').read_text())]:
 links='<nav>'+''.join(f'<a lang="{l}" href="/privacy/{l}/v1.4/{l}{suf}.html">{n}</a>' for l,n in langs)+'</nav><nav><a href="id.html">Umum</a><a href="id-eea-uk.html">EEA, Inggris Raya, dan Swiss</a><a href="id-us-ca.html">California</a></nav>'
 write(f'privacy/id/v1.4/id{suf}.html',page('LemeraKebijakan Privasi'+{'':' — Umum','-eea-uk':' — EEA, Inggris Raya, dan Swiss','-us-ca':' — California'}[suf],links+privacy+extra))
write('privacy/id/v1.4/index.html',page('LemeraのPrivasi','<p><a href="id.html">Kebijakan Privasi — baca</a></p><script>window.location.replace("/privacy/id/v1.4/id.html");</script>'))
terms=(d/'terms.html').read_text()
for marker,fact in [('PHOTO_DELETION','photo-deletion'),('OS_BACKUP','os-backup'),('PROFILE_RETENTION','profile-retention')]:terms=terms.replace('<!--'+marker+'-->',re.search('<p data-policy-fact="'+fact+'">.*?</p>',privacy,re.S)[0])
links='<nav>'+''.join(f'<a lang="{l}" href="/terms/{l}/v1.2/">{n}</a>' for l,n in langs)+'</nav>'
write('terms/id/v1.2/index.html',page('LemeraKetentuan Layanan',links+terms))
write('licenses/id/index.html',page('LemeraのLisensi','<h1>Lisensi sumber terbuka</h1><p><a href="/licenses/releases/android-1.1.0-13/id/">Android 1.1.0 (13), ZXing — inventaris versi terverifikasi</a></p><p>Inventaris ini disiapkan untuk transisi ZXing. Versi terdahulu dapat memuat komponen lain termasuk ML Kit. Pemberitahuannya <a href="/licenses/history/pre-zxing-20261027/?lang=en">disimpan dalam inventaris historis</a>. Teks lisensi asli dan sumber terkait tidak berubah.</p>'))
s=(p/'licenses/releases/android-1.1.0-13/fr/index.html').read_text().replace('lang="fr"','lang="id"');s=re.sub(r'<nav>.*?</nav>',nav,s,count=1)
rep={'Licences open source':'Lisensi sumber terbuka','Inventaire des dépendances du fichier AAB final avec ZXing. Les entrées de développement ou d’autres plateformes ne prouvent pas leur inclusion dans Android. iOS conserve Vision ; la vérification du fichier IPA final reste une étape distincte avant sa sortie. Les textes des licences conservent leur langue d’origine.':'Inventaris dependensi AAB final dengan ZXing. Entri pengembangan atau platform lain tidak membuktikan penyertaan di Android. iOS tetap menggunakan Vision; verifikasi IPA final merupakan tahap terpisah sebelum rilis. Teks lisensi tetap dalam bahasa aslinya.','27 octobre 2026':'27 Oktober 2026','Code source correspondant MPL-2.0':'Kode sumber terkait MPL-2.0','Source des certificats racine de secours Dart':'Sumber sertifikat akar cadangan Dart','Manifeste SHA-256':'Manifest SHA-256','Inventaire des licences — défilement horizontal':'LisensiInventaris — dapat digulir horizontal','Composant':'Komponen','Portée':'Cakupan','Licence</th>':'Lisensi</th>','Version</th>':'Versi</th>','Développement uniquement':'Hanya pengembangan','Directe':'Langsung','Transitive':'Transitif','Ressource incluse':'Aset disertakan'}
for a,b in rep.items():s=s.replace(a,b)
write('licenses/releases/android-1.1.0-13/id/index.html',s)
for l,n in langs[:-1]:
 for q in (p/f'privacy/{l}/v1.4').glob('*.html'):
  if q.name=='index.html':continue
  suf=q.stem[len(l):];q.write_text(q.read_text().replace('</nav>',f'<a lang="id" href="/privacy/id/v1.4/id{suf}.html">Bahasa Indonesia</a></nav>',1))
 q=p/f'terms/{l}/v1.2/index.html';q.write_text(q.read_text().replace('</nav>','<a lang="id" href="/terms/id/v1.2/">Bahasa Indonesia</a></nav>',1))
for l,n in langs:
 q=p/f'licenses/releases/android-1.1.0-13/{l}/index.html';q.write_text(q.read_text().replace('<a href="../de/">Deutsch</a>','<a href="../de/">Deutsch</a><a href="../id/">Bahasa Indonesia</a>'))
for route,v in [('privacy','v1.4'),('terms','v1.2')]:
 q=p/f'{route}/index.html';s=q.read_text().replace("if(lang.startsWith('de'))",f"if(lang.startsWith('id')){{window.location.replace('/{route}/id/{v}/');}}else if(lang.startsWith('de'))")
 extra='<h2>日本語</h2><ul><li><a href="/privacy/id/v1.4/id.html">Kebijakan umum</a></li><li><a href="/privacy/id/v1.4/id-eea-uk.html">EEA, Inggris Raya, dan Swiss</a></li><li><a href="/privacy/id/v1.4/id-us-ca.html">California</a></li></ul>' if route=='privacy' else '<ul><li><a lang="id" href="/terms/id/v1.2/">Bahasa Indonesia</a></li></ul>'
 q.write_text(s.replace('</main>',extra+'</main>'))
q=p/'licenses/index.html';q.write_text(q.read_text().replace("['ko','en','es','fr','pt','de','ja']","['ko','en','es','fr','pt','de','ja','id']").replace('</ul>','<li><a lang="id" href="/licenses/releases/android-1.1.0-13/id/">Bahasa Indonesia</a></li></ul>',1))
for f in ['index.html','join/index.html','download/index.html']:
 q=p/f;q.write_text(q.read_text().replace('<option value="de">Deutsch</option>','<option value="de">Deutsch</option><option value="id">Bahasa Indonesia</option>'))
common=dict(brand='Informasi Lemera',privacy='Privasi',terms='Ketentuan',licenses='Lisensi')
home=dict(common,policy='Kebijakan Privasi',service='Ketentuan Layanan',notice='Lisensi sumber terbuka',intro='Dokumen hukum Lemera dari Meroviq.',contact='Kontak',links=['/privacy/id/v1.4/id.html','/terms/id/v1.2/','/licenses/id/'])
join=dict(brand='Lemera',title='Gabung ke grup Lemera',privacy='Privasi',terms='Ketentuan',android='Instal Lemera untuk bergabung ke grup ini.',ios='Lemera untuk iPhone dan iPad akan segera hadir.',iosReady='Instal Lemera untuk bergabung ke grup ini.',other='Gabung melalui iPhone atau Android. Lemera untuk Android tersedia di Google Play.',soon='Segera hadir',note='Setelah menginstal, pindai kembali QR host di aplikasi. Jika Lemera sudah terinstal, buka pemindainya.')
download=dict(common,privacyFull='Kebijakan Privasi',termsFull='Ketentuan Layanan',licensesFull='Lisensi sumber terbuka',title='Unduh Lemera',subtitle='Pilih toko untuk perangkat Anda.',playCaption='Untuk perangkat Android',appCaption='Untuk iPhone dan iPad',open='Buka',comingSoon='Segera hadir',androidNote='Anda menggunakan Android. Unduh Lemera dari Google Play.',iosNote='Anda menggunakan iPhone atau iPad. Versi App Store segera hadir.',iosReadyNote='Anda menggunakan iPhone atau iPad. Unduh Lemera dari App Store.',otherNote='Pilih toko untuk perangkat Anda.')
for f,c in [('index.html',home),('join/join.js',join),('download/download.js',download)]:
 q=p/f;s=q.read_text().replace('    de:','    id: '+json.dumps(c,ensure_ascii=False)+',\n    de:',1).replace("['en', 'ko', 'es', 'fr', 'pt', 'de', 'ja']","['en', 'ko', 'es', 'fr', 'pt', 'de', 'ja', 'id']").replace('["en", "ko", "es", "fr", "pt", "de", "ja"]','["en", "ko", "es", "fr", "pt", "de", "ja", "id"]')
 if f=='join/join.js':
  s=s.replace("selected === 'de' ? '/privacy/de/v1.4/'", "selected === 'id' ? '/privacy/id/v1.4/' : selected === 'de' ? '/privacy/de/v1.4/'").replace("selected === 'de' ? '/terms/de/v1.2/'","selected === 'id' ? '/terms/id/v1.2/' : selected === 'de' ? '/terms/de/v1.2/'")
 if f=='download/download.js':
  s=s.replace("selected === 'de' ? {privacy:", "selected === 'id' ? {privacy:'/privacy/id/v1.4/',terms:'/terms/id/v1.2/',licenses:'/licenses/id/'}[route] : selected === 'de' ? {privacy:").replace("selected === 'de' ? 'Downloadoptionen'", "selected === 'id' ? 'Pilihan unduhan' : selected === 'de' ? 'Downloadoptionen'")
 q.write_text(s)
