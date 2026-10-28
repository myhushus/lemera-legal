from pathlib import Path
import re,json
root=Path(__file__).resolve().parents[2];p=root/'public';d=Path(__file__).parent
nav='<nav><a href="/?lang=pt">Informações do Lemera</a><a href="/privacy/pt/v1.4/">Privacidade</a><a href="/terms/pt/v1.2/">Termos</a><a href="/licenses/pt/">Licenças</a></nav>'
foot='<footer><a href="/privacy/pt/v1.4/">Política de Privacidade</a> · <a href="/terms/pt/v1.2/">Termos de Serviço</a> · <a href="/licenses/pt/">Licenças de código aberto</a></footer>'
def write(path,s):
 q=p/path;q.parent.mkdir(parents=True,exist_ok=True);q.write_text(s)
def page(title,body):return '<!doctype html><html lang="pt"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+title+'</title><link rel="stylesheet" href="/assets/legal.css"><style>td,th,a{overflow-wrap:anywhere}</style></head><body><main>'+nav+body+foot+'</main></body></html>\n'
privacy=(d/'privacy.html').read_text()
for suf,extra in [('', ''),('-eea-uk',(d/'eea.html').read_text()),('-us-ca',(d/'ca.html').read_text())]:
 links='<nav>'+''.join(f'<a lang="{l}" href="/privacy/{l}/v1.4/{l}{suf}.html">{n}</a>' for l,n in [('ko','한국어'),('en','English'),('es','Español'),('fr','Français'),('pt','Português')])+'</nav><nav><a href="pt.html">Geral</a><a href="pt-eea-uk.html">EEE, Reino Unido e Suíça</a><a href="pt-us-ca.html">Califórnia</a></nav>'
 write(f'privacy/pt/v1.4/pt{suf}.html',page('Política de Privacidade do Lemera'+{'':' — Geral','-eea-uk':' — EEE, Reino Unido e Suíça','-us-ca':' — Califórnia'}[suf],links+privacy+extra))
write('privacy/pt/v1.4/index.html',page('Privacidade do Lemera','<p><a href="pt.html">Ler a Política de Privacidade</a></p><script>window.location.replace("/privacy/pt/v1.4/pt.html");</script>'))
terms=(d/'terms.html').read_text()
for marker,fact in [('PHOTO_DELETION','photo-deletion'),('OS_BACKUP','os-backup'),('PROFILE_RETENTION','profile-retention')]:
 terms=terms.replace('<!--'+marker+'-->',re.search('<p data-policy-fact="'+fact+'">.*?</p>',privacy,re.S)[0])
links='<nav>'+''.join(f'<a lang="{l}" href="/terms/{l}/v1.2/">{n}</a>' for l,n in [('ko','한국어'),('en','English'),('es','Español'),('fr','Français'),('pt','Português')])+'</nav>'
write('terms/pt/v1.2/index.html',page('Termos de Serviço do Lemera',links+terms))
write('licenses/pt/index.html',page('Licenças do Lemera','<h1>Licenças de código aberto</h1><p><a href="/licenses/releases/android-1.1.0-13/pt/">Android 1.1.0 (13), ZXing — inventário verificado desta versão</a></p><p>Este inventário foi preparado para a transição para ZXing. Versões anteriores podem conter outros componentes, incluindo ML Kit. Seus avisos estão <a href="/licenses/history/pre-zxing-20261027/?lang=en">preservados no inventário histórico</a>. Os textos originais das licenças e o código-fonte correspondente permanecem inalterados.</p>'))
s=(p/'licenses/releases/android-1.1.0-13/fr/index.html').read_text()
s=s.replace('lang="fr"','lang="pt"');s=re.sub(r'<nav>.*?</nav>',nav,s,count=1)
replacements={'Licences open source':'Licenças de código aberto','Inventaire des dépendances du fichier AAB final avec ZXing. Les entrées de développement ou d’autres plateformes ne prouvent pas leur inclusion dans Android. iOS conserve Vision ; la vérification du fichier IPA final reste une étape distincte avant sa sortie. Les textes des licences conservent leur langue d’origine.':'Inventário das dependências do AAB final com ZXing. Entradas de desenvolvimento ou de outras plataformas não comprovam sua inclusão no Android. O iOS mantém Vision; a verificação do IPA final continua a ser uma etapa separada antes do lançamento. Os textos das licenças mantêm seu idioma original.','27 octobre 2026':'27 de outubro de 2026','Code source correspondant MPL-2.0':'Código-fonte correspondente MPL-2.0','Source des certificats racine de secours Dart':'Código-fonte dos certificados raiz de reserva do Dart','Manifeste SHA-256':'Manifesto SHA-256','Inventaire des licences — défilement horizontal':'Inventário de licenças — rolagem horizontal','Composant':'Componente','Portée':'Escopo','Licence</th>':'Licença</th>','Version</th>':'Versão</th>','Développement uniquement':'Apenas desenvolvimento','Directe':'Direta','Transitive':'Transitiva','Ressource incluse':'Recurso incluído'}
for a,b in replacements.items():s=s.replace(a,b)
s=s.replace('</nav><p>Code', '</nav><p>Code')
write('licenses/releases/android-1.1.0-13/pt/index.html',s)
# Add reciprocal language links only to current versions (never archived policy bodies).
for l in ['ko','en','es','fr']:
 for q in (p/f'privacy/{l}/v1.4').glob('*.html'):
  if q.name=='index.html':continue
  suf=q.stem[len(l):];t=q.read_text();t=t.replace('</nav>',f'<a lang="pt" href="/privacy/pt/v1.4/pt{suf}.html">Português</a></nav>',1);q.write_text(t)
 q=p/f'terms/{l}/v1.2/index.html';q.write_text(q.read_text().replace('</nav>','<a lang="pt" href="/terms/pt/v1.2/">Português</a></nav>',1))
for l in ['ko','en','es','fr','pt']:
 q=p/f'licenses/releases/android-1.1.0-13/{l}/index.html';q.write_text(q.read_text().replace('<a href="../fr/">Français</a>','<a href="../fr/">Français</a><a href="../pt/">Português</a>'))
for route,version in [('privacy','v1.4'),('terms','v1.2')]:
 q=p/f'{route}/index.html';s=q.read_text().replace("if(lang.startsWith('fr'))",f"if(lang.startsWith('pt')){{window.location.replace('/{route}/pt/{version}/');}}else if(lang.startsWith('fr'))")
 extra='<h2>Português</h2><ul><li><a href="/privacy/pt/v1.4/pt.html">Política geral</a></li><li><a href="/privacy/pt/v1.4/pt-eea-uk.html">EEE, Reino Unido e Suíça</a></li><li><a href="/privacy/pt/v1.4/pt-us-ca.html">Califórnia</a></li></ul>' if route=='privacy' else '<ul><li><a lang="pt" href="/terms/pt/v1.2/">Português</a></li></ul>'
 q.write_text(s.replace('</main>',extra+'</main>'))
q=p/'licenses/index.html';q.write_text(q.read_text().replace("['ko','en','es','fr']","['ko','en','es','fr','pt']").replace('</ul>','<li><a lang="pt" href="/licenses/releases/android-1.1.0-13/pt/">Português</a></li></ul>',1))
for f in ['index.html','join/index.html','download/index.html']:
 q=p/f;q.write_text(q.read_text().replace('<option value="fr">Français</option>','<option value="fr">Français</option><option value="pt">Português</option>'))
common=dict(brand='Informações do Lemera',privacy='Privacidade',terms='Termos',licenses='Licenças')
home=dict(common,policy='Política de Privacidade',service='Termos de Serviço',notice='Licenças de código aberto',intro='Documentos legais do Lemera, da Meroviq.',contact='Contato',links=['/privacy/pt/v1.4/pt.html','/terms/pt/v1.2/','/licenses/pt/'])
join=dict(brand='Lemera',title='Entrar num grupo Lemera',privacy='Privacidade',terms='Termos',android='Instale o Lemera para entrar neste grupo.',ios='O Lemera para iPhone e iPad estará disponível em breve.',iosReady='Instale o Lemera para entrar neste grupo.',other='Entre em grupos num iPhone ou dispositivo Android. O Lemera para Android está disponível no Google Play.',soon='Em breve',note='Após a instalação, leia novamente o código QR do anfitrião no aplicativo. Se o Lemera já estiver instalado, abra seu leitor de QR.')
download=dict(common,privacyFull='Política de Privacidade',termsFull='Termos de Serviço',licensesFull='Licenças de código aberto',title='Instalar Lemera',subtitle='Escolha a loja para seu dispositivo.',playCaption='Para dispositivos Android',appCaption='Para iPhone e iPad',open='Abrir',comingSoon='Em breve',androidNote='Está usando Android. Instale o Lemera pelo Google Play.',iosNote='Está usando iPhone ou iPad. A versão da App Store estará disponível em breve.',iosReadyNote='Está usando iPhone ou iPad. Instale o Lemera pela App Store.',otherNote='Escolha a loja para seu dispositivo.')
for f,c in [('index.html',home),('join/join.js',join),('download/download.js',download)]:
 q=p/f;s=q.read_text().replace('    fr:','    pt: '+json.dumps(c,ensure_ascii=False)+',\n    fr:',1).replace("['en', 'ko', 'es', 'fr']","['en', 'ko', 'es', 'fr', 'pt']").replace('["en", "ko", "es", "fr"]','["en", "ko", "es", "fr", "pt"]')
 if f=='join/join.js':
  s=s.replace("selected === 'fr' ? '/privacy/fr/v1.4/'", "selected === 'pt' ? '/privacy/pt/v1.4/' : selected === 'fr' ? '/privacy/fr/v1.4/'").replace("selected === 'fr' ? '/terms/fr/v1.2/'","selected === 'pt' ? '/terms/pt/v1.2/' : selected === 'fr' ? '/terms/fr/v1.2/'")
 if f=='download/download.js':
  s=s.replace("selected === 'fr' ? french[route]", "selected === 'pt' ? {privacy:'/privacy/pt/v1.4/',terms:'/terms/pt/v1.2/',licenses:'/licenses/pt/'}[route] : selected === 'fr' ? french[route]")
  s=s.replace("selected === 'fr' ? 'Options de téléchargement'", "selected === 'pt' ? 'Opções de instalação' : selected === 'fr' ? 'Options de téléchargement'")
 q.write_text(s)
print('Portuguese pages and routing generated')
