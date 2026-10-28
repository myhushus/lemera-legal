from pathlib import Path
import re,json
p=Path('public');d=Path('docs/german-preparation')
langs=[('ko','한국어'),('en','English'),('es','Español'),('fr','Français'),('pt','Português'),('de','Deutsch')]
nav='<nav><a href="/?lang=de">Lemera-Informationen</a><a href="/privacy/de/v1.4/">Datenschutz</a><a href="/terms/de/v1.2/">Bedingungen</a><a href="/licenses/de/">Lizenzen</a></nav>'
foot='<footer><p><a href="/privacy/de/v1.4/">Datenschutzerklärung</a> · <a href="/terms/de/v1.2/">Nutzungsbedingungen</a> · <a href="/licenses/de/">Open-Source-Lizenzen</a></p></footer>'
def write(path,s):
 q=p/path;q.parent.mkdir(parents=True,exist_ok=True);q.write_text(s)
def page(title,body):return '<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+title+'</title><link rel="stylesheet" href="/assets/legal.css"><style>main{overflow-wrap:anywhere}td,th,a{overflow-wrap:anywhere}</style></head><body><main>'+nav+body+foot+'</main></body></html>\n'
privacy=(d/'privacy.html').read_text()
for suf,extra in [('', ''),('-eea-uk',(d/'eea.html').read_text()),('-us-ca',(d/'ca.html').read_text())]:
 links='<nav>'+''.join(f'<a lang="{l}" href="/privacy/{l}/v1.4/{l}{suf}.html">{n}</a>' for l,n in langs)+'</nav><nav><a href="de.html">Allgemein</a><a href="de-eea-uk.html">EWR, Vereinigtes Königreich und Schweiz</a><a href="de-us-ca.html">Kalifornien</a></nav>'
 write(f'privacy/de/v1.4/de{suf}.html',page('Datenschutzerklärung für Lemera'+{'':' — Allgemein','-eea-uk':' — EWR, Vereinigtes Königreich und Schweiz','-us-ca':' — Kalifornien'}[suf],links+privacy+extra))
write('privacy/de/v1.4/index.html',page('Datenschutz bei Lemera','<p><a href="de.html">Datenschutzerklärung lesen</a></p><script>window.location.replace("/privacy/de/v1.4/de.html");</script>'))
terms=(d/'terms.html').read_text()
for marker,fact in [('PHOTO_DELETION','photo-deletion'),('OS_BACKUP','os-backup'),('PROFILE_RETENTION','profile-retention')]:terms=terms.replace('<!--'+marker+'-->',re.search('<p data-policy-fact="'+fact+'">.*?</p>',privacy,re.S)[0])
links='<nav>'+''.join(f'<a lang="{l}" href="/terms/{l}/v1.2/">{n}</a>' for l,n in langs)+'</nav>'
write('terms/de/v1.2/index.html',page('Nutzungsbedingungen für Lemera',links+terms))
write('licenses/de/index.html',page('Lemera-Lizenzen','<h1>Open-Source-Lizenzen</h1><p><a href="/licenses/releases/android-1.1.0-13/de/">Android 1.1.0 (13), ZXing — geprüftes Inventar dieser Version</a></p><p>Dieses Inventar wurde für den Wechsel zu ZXing vorbereitet. Frühere Versionen können andere Komponenten enthalten, darunter ML Kit. Ihre Hinweise bleiben <a href="/licenses/history/pre-zxing-20261027/?lang=en">im historischen Inventar erhalten</a>. Die ursprünglichen Lizenztexte und der zugehörige Quellcode bleiben unverändert.</p>'))
s=(p/'licenses/releases/android-1.1.0-13/fr/index.html').read_text().replace('lang="fr"','lang="de"');s=re.sub(r'<nav>.*?</nav>',nav,s,count=1)
rep={'Licences open source':'Open-Source-Lizenzen','Inventaire des dépendances du fichier AAB final avec ZXing. Les entrées de développement ou d’autres plateformes ne prouvent pas leur inclusion dans Android. iOS conserve Vision ; la vérification du fichier IPA final reste une étape distincte avant sa sortie. Les textes des licences conservent leur langue d’origine.':'Inventar der Abhängigkeiten des finalen AAB mit ZXing. Einträge für die Entwicklung oder andere Plattformen belegen nicht ihre Aufnahme in Android. iOS behält Vision bei; die Prüfung des finalen IPA bleibt ein separater Schritt vor der Veröffentlichung. Lizenztexte bleiben in ihrer Originalsprache.','27 octobre 2026':'27. Oktober 2026','Code source correspondant MPL-2.0':'Zugehöriger Quellcode gemäß MPL-2.0','Source des certificats racine de secours Dart':'Quellcode der Dart-Ersatzstammzertifikate','Manifeste SHA-256':'SHA-256-Manifest','Inventaire des licences — défilement horizontal':'Lizenzinventar — horizontal scrollbar','Composant':'Komponente','Portée':'Umfang','Licence</th>':'Lizenz</th>','Développement uniquement':'Nur Entwicklung','Directe':'Direkt','Transitive':'Transitiv','Ressource incluse':'Enthaltene Ressource'}
for a,b in rep.items():s=s.replace(a,b)
s=s.replace('<style>','<style>main{overflow-wrap:anywhere}')
write('licenses/releases/android-1.1.0-13/de/index.html',s)
for l,n in langs[:-1]:
 for q in (p/f'privacy/{l}/v1.4').glob('*.html'):
  if q.name=='index.html':continue
  suf=q.stem[len(l):];q.write_text(q.read_text().replace('</nav>',f'<a lang="de" href="/privacy/de/v1.4/de{suf}.html">Deutsch</a></nav>',1))
 q=p/f'terms/{l}/v1.2/index.html';q.write_text(q.read_text().replace('</nav>','<a lang="de" href="/terms/de/v1.2/">Deutsch</a></nav>',1))
for l,n in langs:
 q=p/f'licenses/releases/android-1.1.0-13/{l}/index.html';q.write_text(q.read_text().replace('<a href="../pt/">Português</a>','<a href="../pt/">Português</a><a href="../de/">Deutsch</a>'))
for route,v in [('privacy','v1.4'),('terms','v1.2')]:
 q=p/f'{route}/index.html';s=q.read_text().replace("if(lang.startsWith('pt'))",f"if(lang.startsWith('de')){{window.location.replace('/{route}/de/{v}/');}}else if(lang.startsWith('pt'))")
 extra='<h2>Deutsch</h2><ul><li><a href="/privacy/de/v1.4/de.html">Allgemeine Erklärung</a></li><li><a href="/privacy/de/v1.4/de-eea-uk.html">EWR, Vereinigtes Königreich und Schweiz</a></li><li><a href="/privacy/de/v1.4/de-us-ca.html">Kalifornien</a></li></ul>' if route=='privacy' else '<ul><li><a lang="de" href="/terms/de/v1.2/">Deutsch</a></li></ul>'
 q.write_text(s.replace('</main>',extra+'</main>'))
q=p/'licenses/index.html';q.write_text(q.read_text().replace("['ko','en','es','fr','pt']","['ko','en','es','fr','pt','de']").replace('</ul>','<li><a lang="de" href="/licenses/releases/android-1.1.0-13/de/">Deutsch</a></li></ul>',1))
for f in ['index.html','join/index.html','download/index.html']:
 q=p/f;q.write_text(q.read_text().replace('<option value="pt">Português</option>','<option value="pt">Português</option><option value="de">Deutsch</option>'))
common=dict(brand='Lemera-Informationen',privacy='Datenschutz',terms='Bedingungen',licenses='Lizenzen')
home=dict(common,policy='Datenschutzerklärung',service='Nutzungsbedingungen',notice='Open-Source-Lizenzen',intro='Rechtliche Dokumente für Lemera von Meroviq.',contact='Kontakt',links=['/privacy/de/v1.4/de.html','/terms/de/v1.2/','/licenses/de/'])
join=dict(brand='Lemera',title='Einer Lemera-Gruppe beitreten',privacy='Datenschutz',terms='Bedingungen',android='Installiere Lemera, um dieser Gruppe beizutreten.',ios='Lemera für iPhone und iPad ist bald verfügbar.',iosReady='Installiere Lemera, um dieser Gruppe beizutreten.',other='Tritt Gruppen auf einem iPhone oder Android-Gerät bei. Lemera für Android ist bei Google Play verfügbar.',soon='Bald verfügbar',note='Scanne nach der Installation den QR-Code des Hosts erneut in der App. Wenn Lemera bereits installiert ist, öffne den Scanner der App.')
download=dict(common,privacyFull='Datenschutzerklärung',termsFull='Nutzungsbedingungen',licensesFull='Open-Source-Lizenzen',title='Lemera herunterladen',subtitle='Wähle den Store für dein Gerät.',playCaption='Für Android-Geräte',appCaption='Für iPhone und iPad',open='Öffnen',comingSoon='Bald verfügbar',androidNote='Du verwendest Android. Lade Lemera bei Google Play herunter.',iosNote='Du verwendest ein iPhone oder iPad. Die App-Store-Version ist bald verfügbar.',iosReadyNote='Du verwendest ein iPhone oder iPad. Lade Lemera im App Store herunter.',otherNote='Wähle den Store für dein Gerät.')
for f,c in [('index.html',home),('join/join.js',join),('download/download.js',download)]:
 q=p/f;s=q.read_text().replace('    pt:','    de: '+json.dumps(c,ensure_ascii=False)+',\n    pt:',1).replace("['en', 'ko', 'es', 'fr', 'pt']","['en', 'ko', 'es', 'fr', 'pt', 'de']").replace('["en", "ko", "es", "fr", "pt"]','["en", "ko", "es", "fr", "pt", "de"]')
 if f=='join/join.js':
  s=s.replace("selected === 'pt' ? '/privacy/pt/v1.4/'", "selected === 'de' ? '/privacy/de/v1.4/' : selected === 'pt' ? '/privacy/pt/v1.4/'").replace("selected === 'pt' ? '/terms/pt/v1.2/'","selected === 'de' ? '/terms/de/v1.2/' : selected === 'pt' ? '/terms/pt/v1.2/'")
 if f=='download/download.js':
  s=s.replace("selected === 'pt' ? {privacy:", "selected === 'de' ? {privacy:'/privacy/de/v1.4/',terms:'/terms/de/v1.2/',licenses:'/licenses/de/'}[route] : selected === 'pt' ? {privacy:")
  s=s.replace("selected === 'pt' ? 'Opções de instalação'", "selected === 'de' ? 'Downloadoptionen' : selected === 'pt' ? 'Opções de instalação'")
 q.write_text(s)
