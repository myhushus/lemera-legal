# coding: utf-8
from pathlib import Path
import re,json
p=Path('public');d=Path('docs/japanese-preparation');langs=[('ko','한국어'),('en','English'),('es','Español'),('fr','Français'),('pt','Português'),('de','Deutsch'),('ja','日本語')]
nav='<nav><a href="/?lang=ja">Lemeraの情報</a><a href="/privacy/ja/v1.4/">プライバシー</a><a href="/terms/ja/v1.2/">規約</a><a href="/licenses/ja/">ライセンス</a></nav>'
foot='<footer><p><a href="/privacy/ja/v1.4/">プライバシーポリシー</a> · <a href="/terms/ja/v1.2/">利用規約</a> · <a href="/licenses/ja/">オープンソースライセンス</a></p></footer>'
def write(f,s):
 q=p/f;q.parent.mkdir(parents=True,exist_ok=True);q.write_text(s)
def page(title,body):return '<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+title+'</title><link rel="stylesheet" href="/assets/legal.css"><style>main{overflow-wrap:break-word;line-break:strict}td,th,a{overflow-wrap:anywhere}</style></head><body><main>'+nav+body+foot+'</main></body></html>\n'
privacy=(d/'privacy.html').read_text()
for suf,extra in [('', ''),('-eea-uk',(d/'eea.html').read_text()),('-us-ca',(d/'ca.html').read_text())]:
 links='<nav>'+''.join(f'<a lang="{l}" href="/privacy/{l}/v1.4/{l}{suf}.html">{n}</a>' for l,n in langs)+'</nav><nav><a href="ja.html">一般</a><a href="ja-eea-uk.html">EEA・英国・スイス</a><a href="ja-us-ca.html">カリフォルニア州</a></nav>'
 write(f'privacy/ja/v1.4/ja{suf}.html',page('Lemeraプライバシーポリシー'+{'':' — 一般','-eea-uk':' — EEA・英国・スイス','-us-ca':' — カリフォルニア州'}[suf],links+privacy+extra))
write('privacy/ja/v1.4/index.html',page('Lemeraのプライバシー','<p><a href="ja.html">プライバシーポリシーを読む</a></p><script>window.location.replace("/privacy/ja/v1.4/ja.html");</script>'))
terms=(d/'terms.html').read_text()
for marker,fact in [('PHOTO_DELETION','photo-deletion'),('OS_BACKUP','os-backup'),('PROFILE_RETENTION','profile-retention')]:terms=terms.replace('<!--'+marker+'-->',re.search('<p data-policy-fact="'+fact+'">.*?</p>',privacy,re.S)[0])
links='<nav>'+''.join(f'<a lang="{l}" href="/terms/{l}/v1.2/">{n}</a>' for l,n in langs)+'</nav>'
write('terms/ja/v1.2/index.html',page('Lemera利用規約',links+terms))
write('licenses/ja/index.html',page('Lemeraのライセンス','<h1>オープンソースライセンス</h1><p><a href="/licenses/releases/android-1.1.0-13/ja/">Android 1.1.0 (13)、ZXing — このバージョンの検証済み一覧</a></p><p>この一覧はZXingへの移行に向けて作成したものです。以前のバージョンにはML Kitなど別のコンポーネントが含まれる場合があります。その告知は<a href="/licenses/history/pre-zxing-20261027/?lang=en">過去の一覧に保存されています</a>。ライセンス原文と対応ソースコードは変更していません。</p>'))
s=(p/'licenses/releases/android-1.1.0-13/fr/index.html').read_text().replace('lang="fr"','lang="ja"');s=re.sub(r'<nav>.*?</nav>',nav,s,count=1)
rep={'Licences open source':'オープンソースライセンス','Inventaire des dépendances du fichier AAB final avec ZXing. Les entrées de développement ou d’autres plateformes ne prouvent pas leur inclusion dans Android. iOS conserve Vision ; la vérification du fichier IPA final reste une étape distincte avant sa sortie. Les textes des licences conservent leur langue d’origine.':'ZXingを使用する最終AABの依存関係一覧です。開発用・他プラットフォーム用の項目は、Androidへの収録を証明するものではありません。iOSはVisionを維持し、最終IPAの検証はiOS公開前の別項目です。ライセンス本文は原文の言語を保持しています。','27 octobre 2026':'2026年10月27日','Code source correspondant MPL-2.0':'MPL-2.0の対応ソースコード','Source des certificats racine de secours Dart':'Dartフォールバックルート証明書のソースコード','Manifeste SHA-256':'SHA-256マニフェスト','Inventaire des licences — défilement horizontal':'ライセンス一覧 — 横にスクロールできます','Composant':'コンポーネント','Portée':'範囲','Licence</th>':'ライセンス</th>','Version</th>':'バージョン</th>','Développement uniquement':'開発用のみ','Directe':'直接','Transitive':'間接','Ressource incluse':'同梱リソース'}
for a,b in rep.items():s=s.replace(a,b)
write('licenses/releases/android-1.1.0-13/ja/index.html',s)
for l,n in langs[:-1]:
 for q in (p/f'privacy/{l}/v1.4').glob('*.html'):
  if q.name=='index.html':continue
  suf=q.stem[len(l):];q.write_text(q.read_text().replace('</nav>',f'<a lang="ja" href="/privacy/ja/v1.4/ja{suf}.html">日本語</a></nav>',1))
 q=p/f'terms/{l}/v1.2/index.html';q.write_text(q.read_text().replace('</nav>','<a lang="ja" href="/terms/ja/v1.2/">日本語</a></nav>',1))
for l,n in langs:
 q=p/f'licenses/releases/android-1.1.0-13/{l}/index.html';q.write_text(q.read_text().replace('<a href="../de/">Deutsch</a>','<a href="../de/">Deutsch</a><a href="../ja/">日本語</a>'))
for route,v in [('privacy','v1.4'),('terms','v1.2')]:
 q=p/f'{route}/index.html';s=q.read_text().replace("if(lang.startsWith('de'))",f"if(lang.startsWith('ja')){{window.location.replace('/{route}/ja/{v}/');}}else if(lang.startsWith('de'))")
 extra='<h2>日本語</h2><ul><li><a href="/privacy/ja/v1.4/ja.html">一般ポリシー</a></li><li><a href="/privacy/ja/v1.4/ja-eea-uk.html">EEA・英国・スイス</a></li><li><a href="/privacy/ja/v1.4/ja-us-ca.html">カリフォルニア州</a></li></ul>' if route=='privacy' else '<ul><li><a lang="ja" href="/terms/ja/v1.2/">日本語</a></li></ul>'
 q.write_text(s.replace('</main>',extra+'</main>'))
q=p/'licenses/index.html';q.write_text(q.read_text().replace("['ko','en','es','fr','pt','de']","['ko','en','es','fr','pt','de','ja']").replace('</ul>','<li><a lang="ja" href="/licenses/releases/android-1.1.0-13/ja/">日本語</a></li></ul>',1))
for f in ['index.html','join/index.html','download/index.html']:
 q=p/f;q.write_text(q.read_text().replace('<option value="de">Deutsch</option>','<option value="de">Deutsch</option><option value="ja">日本語</option>'))
common=dict(brand='Lemeraの情報',privacy='プライバシー',terms='規約',licenses='ライセンス')
home=dict(common,policy='プライバシーポリシー',service='利用規約',notice='オープンソースライセンス',intro='Meroviqが提供するLemeraの法的文書です。',contact='お問い合わせ',links=['/privacy/ja/v1.4/ja.html','/terms/ja/v1.2/','/licenses/ja/'])
join=dict(brand='Lemera',title='Lemeraのグループに参加',privacy='プライバシー',terms='規約',android='このグループに参加するには、Lemeraをインストールしてください。',ios='iPhone・iPad版Lemeraは公開準備中です。',iosReady='このグループに参加するには、Lemeraをインストールしてください。',other='グループにはiPhoneまたはAndroid端末で参加できます。Android版LemeraはGoogle Playからインストールできます。',soon='近日公開',note='インストール後、アプリ内でホストのQRコードをもう一度読み取ってください。インストール済みの場合は、Lemeraのスキャナーを開いてください。')
download=dict(common,privacyFull='プライバシーポリシー',termsFull='利用規約',licensesFull='オープンソースライセンス',title='Lemeraをダウンロード',subtitle='お使いの端末に合ったストアを選んでください。',playCaption='Android端末向け',appCaption='iPhone・iPad向け',open='開く',comingSoon='近日公開',androidNote='Android端末です。Google PlayからLemeraをインストールできます。',iosNote='iPhoneまたはiPadです。App Store版は公開準備中です。',iosReadyNote='iPhoneまたはiPadです。App StoreからLemeraをインストールできます。',otherNote='お使いの端末に合ったストアを選んでください。')
for f,c in [('index.html',home),('join/join.js',join),('download/download.js',download)]:
 q=p/f;s=q.read_text().replace('    de:','    ja: '+json.dumps(c,ensure_ascii=False)+',\n    de:',1).replace("['en', 'ko', 'es', 'fr', 'pt', 'de']","['en', 'ko', 'es', 'fr', 'pt', 'de', 'ja']").replace('["en", "ko", "es", "fr", "pt", "de"]','["en", "ko", "es", "fr", "pt", "de", "ja"]')
 if f=='join/join.js':
  s=s.replace("selected === 'de' ? '/privacy/de/v1.4/'", "selected === 'ja' ? '/privacy/ja/v1.4/' : selected === 'de' ? '/privacy/de/v1.4/'").replace("selected === 'de' ? '/terms/de/v1.2/'","selected === 'ja' ? '/terms/ja/v1.2/' : selected === 'de' ? '/terms/de/v1.2/'")
 if f=='download/download.js':
  s=s.replace("selected === 'de' ? {privacy:", "selected === 'ja' ? {privacy:'/privacy/ja/v1.4/',terms:'/terms/ja/v1.2/',licenses:'/licenses/ja/'}[route] : selected === 'de' ? {privacy:").replace("selected === 'de' ? 'Downloadoptionen'", "selected === 'ja' ? 'ダウンロード方法' : selected === 'de' ? 'Downloadoptionen'")
 q.write_text(s)
