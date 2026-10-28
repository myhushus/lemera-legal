(function (root) {
  'use strict';

  const copy = {
    ko: {
      brand: '공카', title: '공카 그룹에 참가하기', privacy: '개인정보처리방침', terms: '이용약관',
      android: '이 그룹에 참가하려면 공카 앱을 설치해 주세요.',
      ios: 'iPhone·iPad용 공카는 출시 준비 중이에요.',
      iosReady: '이 그룹에 참가하려면 공카 앱을 설치해 주세요.',
      other: '그룹 참가는 iPhone 또는 Android 기기에서 지원해요. Android에서는 Google Play에서 공카를 설치할 수 있어요.',
      soon: '출시 준비 중',
      note: '설치 후 앱에서 호스트의 QR 코드를 다시 스캔해 주세요. 이미 설치했다면 공카의 스캐너를 열어 주세요.',
    },
    en: {
      brand: 'Lemera', title: 'Join a Lemera group', privacy: 'Privacy', terms: 'Terms',
      android: 'Install Lemera to join this group.',
      ios: 'Lemera for iPhone and iPad is coming soon.',
      iosReady: 'Install Lemera to join this group.',
      other: 'Join groups on an iPhone or Android device. Lemera for Android is available on Google Play.',
      soon: 'Coming Soon',
      note: 'After installing, scan the Host’s QR code again in the app. If Lemera is already installed, open its scanner.',
    },
    ja: {"brand": "Lemera", "title": "Lemeraのグループに参加", "privacy": "プライバシー", "terms": "規約", "android": "このグループに参加するには、Lemeraをインストールしてください。", "ios": "iPhone・iPad版Lemeraは公開準備中です。", "iosReady": "このグループに参加するには、Lemeraをインストールしてください。", "other": "グループにはiPhoneまたはAndroid端末で参加できます。Android版LemeraはGoogle Playからインストールできます。", "soon": "近日公開", "note": "インストール後、アプリ内でホストのQRコードをもう一度読み取ってください。インストール済みの場合は、Lemeraのスキャナーを開いてください。"},
    de: {"brand": "Lemera", "title": "Einer Lemera-Gruppe beitreten", "privacy": "Datenschutz", "terms": "Bedingungen", "android": "Installiere Lemera, um dieser Gruppe beizutreten.", "ios": "Lemera für iPhone und iPad ist bald verfügbar.", "iosReady": "Installiere Lemera, um dieser Gruppe beizutreten.", "other": "Tritt Gruppen auf einem iPhone oder Android-Gerät bei. Lemera für Android ist bei Google Play verfügbar.", "soon": "Bald verfügbar", "note": "Scanne nach der Installation den QR-Code des Hosts erneut in der App. Wenn Lemera bereits installiert ist, öffne den Scanner der App."},
    pt: {"brand": "Lemera", "title": "Entrar num grupo Lemera", "privacy": "Privacidade", "terms": "Termos", "android": "Instale o Lemera para entrar neste grupo.", "ios": "O Lemera para iPhone e iPad estará disponível em breve.", "iosReady": "Instale o Lemera para entrar neste grupo.", "other": "Entre em grupos num iPhone ou dispositivo Android. O Lemera para Android está disponível no Google Play.", "soon": "Em breve", "note": "Após a instalação, leia novamente o código QR do anfitrião no aplicativo. Se o Lemera já estiver instalado, abra seu leitor de QR."},
    fr: {"brand": "Lemera", "title": "Rejoindre un groupe Lemera", "privacy": "Confidentialité", "terms": "Conditions", "android": "Installez Lemera pour rejoindre ce groupe.", "ios": "Lemera pour iPhone et iPad sera bientôt disponible.", "iosReady": "Installez Lemera pour rejoindre ce groupe.", "other": "Rejoignez les groupes sur iPhone ou Android. Lemera pour Android est disponible sur Google Play.", "soon": "Bientôt disponible", "note": "Après l’installation, scannez à nouveau le code QR de l’hôte dans Lemera. Si l’application est déjà installée, ouvrez son scanner."},
    es: {
      brand: 'Lemera', title: 'Únete a un grupo de Lemera', privacy: 'Privacidad', terms: 'Términos',
      android: 'Instala Lemera para unirte a este grupo.',
      ios: 'Lemera para iPhone y iPad estará disponible próximamente.',
      iosReady: 'Instala Lemera para unirte a este grupo.',
      other: 'Puedes unirte desde un iPhone o un dispositivo Android. Lemera para Android está disponible en Google Play.',
      soon: 'Próximamente',
      note: 'Después de instalar la aplicación, vuelve a escanear el código QR del anfitrión desde Lemera. Si ya la tienes instalada, abre su escáner.',
    },
  };
  const supported = ['en', 'ko', 'es', 'fr', 'pt', 'de', 'ja'];

  function resolveLocale(language) {
    const code = String(language || 'en').toLowerCase().split(/[-_]/)[0];
    return supported.includes(code) ? code : 'en';
  }
  // The deployed /download script owns a different DOM. Reuse only its
  // store config without executing that page's script on the join page.
  function platform(nav) {
    var ua = nav.userAgent || '';
    if (/iPhone|iPad|iPod/i.test(ua) || (/Macintosh/i.test(ua) && nav.maxTouchPoints > 1) ||
        (nav.platform === 'MacIntel' && nav.maxTouchPoints > 1)) return 'ios';
    if (/Android/i.test(ua)) return 'android';
    return 'other';
  }
  function storeUrl(value, host) {
    try {
      var url = new URL(value);
      return url.protocol === 'https:' && url.hostname === host ? url.href : '';
    } catch (_) { return ''; }
  }
  function mount(doc, nav, config, helpers = { platform, storeUrl }, locale) {
    const selected = resolveLocale(locale || nav.language);
    const text = copy[selected];
    const device = helpers.platform(nav);
    const playUrl = helpers.storeUrl(config.googlePlayUrl, 'play.google.com');
    const appleUrl = helpers.storeUrl(config.appStoreUrl, 'apps.apple.com');
    doc.documentElement.lang = selected;
    doc.title = text.title;
    for (const id of ['brand', 'privacy', 'terms']) doc.getElementById(id).textContent = text[id];
    doc.getElementById('privacy').href = selected === 'ja' ? '/privacy/ja/v1.4/' : selected === 'de' ? '/privacy/de/v1.4/' : selected === 'pt' ? '/privacy/pt/v1.4/' : selected === 'fr' ? '/privacy/fr/v1.4/' : '/privacy/';
    doc.getElementById('terms').href = selected === 'ja' ? '/terms/ja/v1.2/' : selected === 'de' ? '/terms/de/v1.2/' : selected === 'pt' ? '/terms/pt/v1.2/' : selected === 'fr' ? '/terms/fr/v1.2/' : '/terms/';
    doc.getElementById('join-title').textContent = text.title;
    doc.getElementById('join-lead').textContent = text[device === 'ios' && appleUrl ? 'iosReady' : device];
    doc.getElementById('join-note').textContent = text.note;
    const play = doc.getElementById('play'), apple = doc.getElementById('apple');
    play.classList.toggle('recommended', device === 'android');
    apple.classList.toggle('recommended', device === 'ios');
    if (playUrl) play.href = playUrl;
    else play.removeAttribute('href');
    if (appleUrl) {
      apple.href = appleUrl;
      apple.removeAttribute('aria-disabled');
      doc.getElementById('soon').textContent = '';
    } else {
      apple.removeAttribute('href');
      apple.setAttribute('aria-disabled', 'true');
      doc.getElementById('soon').textContent = text.soon;
    }
    const language = doc.getElementById('language');
    language.value = selected;
    language.onchange = () => mount(doc, nav, config, helpers, language.value);
    // No fragment access, persistence, analytics, automatic navigation or
    // deferred-install promise. Only the app decodes group credentials.
  }
  if (typeof module !== 'undefined') module.exports = { mount, copy, platform, storeUrl, resolveLocale };
  if (root.document) mount(root.document, root.navigator, root.LEMERA_JOIN_CONFIG || {});
})(typeof window === 'undefined' ? globalThis : window);
