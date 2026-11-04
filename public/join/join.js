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
    mr: {"brand": "सर्वकॅम", "title": "सर्वकॅम ग्रुपमध्ये सहभागी व्हा", "privacy": "गोपनीयता", "terms": "अटी", "android": "या ग्रुपमध्ये सहभागी होण्यासाठी सर्वकॅम इन्स्टॉल करा.", "ios": "iPhone आणि iPad साठी सर्वकॅम लवकरच उपलब्ध होईल.", "iosReady": "या ग्रुपमध्ये सहभागी होण्यासाठी सर्वकॅम इन्स्टॉल करा.", "other": "iPhone किंवा Android डिव्हाइसवरून ग्रुपमध्ये सहभागी व्हा. Android साठी सर्वकॅम Google Play वर उपलब्ध आहे.", "soon": "लवकरच येत आहे", "note": "इन्स्टॉल केल्यानंतर ॲपमधून होस्टचा QR कोड पुन्हा स्कॅन करा. सर्वकॅम आधीच इन्स्टॉल केले असल्यास त्याचा स्कॅनर उघडा."},
    te: {"brand": "మనక్యామ్", "title": "మనక్యామ్ గ్రూప్‌లో చేరండి", "privacy": "గోప్యత", "terms": "నిబంధనలు", "android": "ఈ గ్రూప్‌లో చేరడానికి మనక్యామ్ ఇన్‌స్టాల్ చేయండి.", "ios": "iPhone, iPad కోసం మనక్యామ్ త్వరలో అందుబాటులోకి వస్తుంది.", "iosReady": "ఈ గ్రూప్‌లో చేరడానికి మనక్యామ్ ఇన్‌స్టాల్ చేయండి.", "other": "iPhone లేదా Android పరికరం నుంచి గ్రూప్‌లో చేరండి. Android కోసం మనక్యామ్ Google Playలో అందుబాటులో ఉంది.", "soon": "త్వరలో వస్తుంది", "note": "ఇన్‌స్టాల్ చేసిన తర్వాత యాప్‌లో హోస్ట్ QR కోడ్‌ను మళ్లీ స్కాన్ చేయండి. మనక్యామ్ ఇప్పటికే ఇన్‌స్టాల్ చేసి ఉంటే, దాని స్కానర్‌ను తెరవండి."},
    ta: {"brand": "நம்கேம்", "title": "நம்கேம் குழுவில் இணையுங்கள்", "privacy": "தனியுரிமை", "terms": "விதிமுறைகள்", "android": "இந்தக் குழுவில் இணைய நம்கேமை நிறுவுங்கள்.", "ios": "iPhone, iPad-க்கான நம்கேம் விரைவில் கிடைக்கும்.", "iosReady": "இந்தக் குழுவில் இணைய நம்கேமை நிறுவுங்கள்.", "other": "iPhone அல்லது Android சாதனத்திலிருந்து குழுவில் இணையுங்கள். Android-க்கான நம்கேம் Google Play-இல் கிடைக்கிறது.", "soon": "விரைவில்", "note": "நிறுவிய பிறகு செயலியில் ஹோஸ்டின் QR குறியீட்டை மீண்டும் ஸ்கேன் செய்யுங்கள். நம்கேம் ஏற்கெனவே நிறுவியிருந்தால், அதன் ஸ்கேனரைத் திறக்கவும்."},
    bn: {"brand": "সবক্যাম", "title": "সবক্যাম গ্রুপে যোগ দিন", "privacy": "গোপনীয়তা", "terms": "শর্তাবলি", "android": "এই গ্রুপে যোগ দিতে সবক্যাম ইনস্টল করুন।", "ios": "iPhone ও iPad-এর জন্য সবক্যাম শীঘ্রই আসছে।", "iosReady": "এই গ্রুপে যোগ দিতে সবক্যাম ইনস্টল করুন।", "other": "iPhone বা Android ডিভাইস থেকে গ্রুপে যোগ দিন। Android-এর জন্য সবক্যাম Google Play-তে পাওয়া যায়।", "soon": "শীঘ্রই আসছে", "note": "ইনস্টল করার পরে অ্যাপ থেকে হোস্টের QR কোড আবার স্ক্যান করুন। সবক্যাম আগে থেকেই ইনস্টল থাকলে এর স্ক্যানার খুলুন।"},
    hi: {"brand": "Lemera", "title": "Lemera ग्रुप से जुड़ें", "privacy": "निजता", "terms": "शर्तें", "android": "इस ग्रुप से जुड़ने के लिए Lemera इंस्टॉल करें।", "ios": "iPhone और iPad के लिए Lemera जल्द आ रहा है।", "iosReady": "इस ग्रुप से जुड़ने के लिए Lemera इंस्टॉल करें।", "other": "iPhone या Android से जुड़ें। Android के लिए Lemera, Google Play पर उपलब्ध है।", "soon": "जल्द आ रहा है", "note": "इंस्टॉल करने के बाद ऐप में होस्ट का QR दोबारा स्कैन करें। Lemera पहले से इंस्टॉल है तो उसका स्कैनर खोलें।"},
    id: {"brand": "Lemera", "title": "Gabung ke grup Lemera", "privacy": "Privasi", "terms": "Ketentuan", "android": "Instal Lemera untuk bergabung ke grup ini.", "ios": "Lemera untuk iPhone dan iPad akan segera hadir.", "iosReady": "Instal Lemera untuk bergabung ke grup ini.", "other": "Gabung melalui iPhone atau Android. Lemera untuk Android tersedia di Google Play.", "soon": "Segera hadir", "note": "Setelah menginstal, pindai kembali QR host di aplikasi. Jika Lemera sudah terinstal, buka pemindainya."},
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
  const supported = ['en', 'ko', 'es', 'fr', 'pt', 'de', 'ja', 'id', 'hi', 'bn', 'mr', 'te', 'ta'];

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
    doc.getElementById('privacy').href = selected === 'ja' ? '/privacy/ja/v1.4/' : selected === 'mr' ? '/privacy/mr/v1.4/' : selected === 'te' ? '/privacy/te/v1.4/' : selected === 'ta' ? '/privacy/ta/v1.4/' : selected === 'bn' ? '/privacy/bn/v1.4/' : selected === 'hi' ? '/privacy/hi/v1.4/' : selected === 'id' ? '/privacy/id/v1.4/' : selected === 'de' ? '/privacy/de/v1.4/' : selected === 'pt' ? '/privacy/pt/v1.4/' : selected === 'fr' ? '/privacy/fr/v1.4/' : '/privacy/';
    doc.getElementById('terms').href = selected === 'ja' ? '/terms/ja/v1.2/' : selected === 'mr' ? '/terms/mr/v1.2/' : selected === 'te' ? '/terms/te/v1.2/' : selected === 'ta' ? '/terms/ta/v1.2/' : selected === 'bn' ? '/terms/bn/v1.2/' : selected === 'hi' ? '/terms/hi/v1.2/' : selected === 'id' ? '/terms/id/v1.2/' : selected === 'de' ? '/terms/de/v1.2/' : selected === 'pt' ? '/terms/pt/v1.2/' : selected === 'fr' ? '/terms/fr/v1.2/' : '/terms/';
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
    language.setAttribute?.('aria-label', selected === 'mr' ? 'भाषा' : selected === 'te' ? 'భాష' : selected === 'ta' ? 'மொழி' : selected === 'bn' ? 'ভাষা' : 'Language / 언어 / Idioma / Langue');
    doc.getElementById('brand').href = selected === 'mr' ? '/?lang=mr' : selected === 'te' ? '/?lang=te' : selected === 'ta' ? '/?lang=ta' : selected === 'bn' ? '/?lang=bn' : '/';
    language.onchange = () => mount(doc, nav, config, helpers, language.value);
    // No fragment access, persistence, analytics, automatic navigation or
    // deferred-install promise. Only the app decodes group credentials.
  }
  if (typeof module !== 'undefined') module.exports = { mount, copy, platform, storeUrl, resolveLocale };
  if (root.document) mount(root.document, root.navigator, root.LEMERA_JOIN_CONFIG || {});
})(typeof window === 'undefined' ? globalThis : window);
