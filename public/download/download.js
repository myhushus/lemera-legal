(function () {
  "use strict";

  const config = window.LEMERA_DOWNLOAD_CONFIG || {};
  const nav = navigator;
  const ua = nav.userAgent || "";
  const isAndroid = /Android/i.test(ua);
  const isIOS = /iPhone|iPad|iPod/i.test(ua) ||
    (nav.platform === "MacIntel" && nav.maxTouchPoints > 1);
  const supported = ["en", "ko", "es", "fr", "pt", "de", "ja", "id", "hi", 'bn', 'mr', 'te'];
  const copy = {
    ko: {
      brand:"공카 정보", privacy:"개인정보처리방침", terms:"이용약관", licenses:"라이선스",
      privacyFull:"개인정보처리방침", termsFull:"이용약관", licensesFull:"오픈소스 라이선스",
      title: "Lemera 다운로드",
      subtitle: "사용 중인 기기에 맞는 스토어를 선택하세요.",
      playCaption: "Android 기기용", appCaption: "iPhone 및 iPad용",
      open: "열기", comingSoon: "출시 예정",
      androidNote: "Android 기기입니다. Google Play를 이용하세요.",
      iosNote: "iPhone 또는 iPad입니다. App Store 버전은 출시 준비 중입니다.",
      iosReadyNote: "iPhone 또는 iPad입니다. App Store를 이용하세요.",
      otherNote: "사용 중인 기기의 스토어를 선택하세요."
    },
    en: {
      brand:"Lemera Legal", privacy:"Privacy", terms:"Terms", licenses:"Licenses",
      privacyFull:"Privacy Policy", termsFull:"Terms of Service", licensesFull:"Open Source Licenses",
      title: "Get Lemera",
      subtitle: "Choose the store for your device.",
      playCaption: "For Android devices", appCaption: "For iPhone and iPad",
      open: "Open", comingSoon: "Coming Soon",
      androidNote: "You're on Android. Get Lemera from Google Play.",
      iosNote: "You're on iPhone or iPad. The App Store version is coming soon.",
      iosReadyNote: "You're on iPhone or iPad. Get Lemera from the App Store.",
      otherNote: "Choose the store for your device."
    },
    ja: {"brand": "Lemeraの情報", "privacy": "プライバシー", "terms": "規約", "licenses": "ライセンス", "privacyFull": "プライバシーポリシー", "termsFull": "利用規約", "licensesFull": "オープンソースライセンス", "title": "Lemeraをダウンロード", "subtitle": "お使いの端末に合ったストアを選んでください。", "playCaption": "Android端末向け", "appCaption": "iPhone・iPad向け", "open": "開く", "comingSoon": "近日公開", "androidNote": "Android端末です。Google PlayからLemeraをインストールできます。", "iosNote": "iPhoneまたはiPadです。App Store版は公開準備中です。", "iosReadyNote": "iPhoneまたはiPadです。App StoreからLemeraをインストールできます。", "otherNote": "お使いの端末に合ったストアを選んでください。"},
    mr: {"brand": "Lemera कायदेशीर माहिती", "privacy": "गोपनीयता", "terms": "अटी", "licenses": "परवाने", "privacyFull": "गोपनीयता धोरण", "termsFull": "सेवेच्या अटी", "licensesFull": "मुक्त स्रोत परवाने", "title": "सर्वकॅम डाउनलोड करा", "subtitle": "तुमच्या डिव्हाइससाठी स्टोअर निवडा.", "playCaption": "Android डिव्हाइससाठी", "appCaption": "iPhone आणि iPad साठी", "open": "उघडा", "comingSoon": "लवकरच येत आहे", "androidNote": "तुम्ही Android वापरत आहात. Google Play वरून सर्वकॅम डाउनलोड करा.", "iosNote": "तुम्ही iPhone किंवा iPad वापरत आहात. App Store आवृत्ती लवकरच उपलब्ध होईल.", "iosReadyNote": "तुम्ही iPhone किंवा iPad वापरत आहात. App Store वरून सर्वकॅम डाउनलोड करा.", "otherNote": "तुमच्या डिव्हाइससाठी स्टोअर निवडा."},
    te: {"brand": "Lemera చట్టపరమైన సమాచారం", "privacy": "గోప్యత", "terms": "నిబంధనలు", "licenses": "లైసెన్స్‌లు", "privacyFull": "గోప్యతా విధానం", "termsFull": "సేవా నిబంధనలు", "licensesFull": "ఓపెన్ సోర్స్ లైసెన్స్‌లు", "title": "మనక్యామ్ డౌన్‌లోడ్ చేయండి", "subtitle": "మీ పరికరానికి సరిపోయే స్టోర్‌ను ఎంచుకోండి.", "playCaption": "Android పరికరాల కోసం", "appCaption": "iPhone, iPad కోసం", "open": "తెరవండి", "comingSoon": "త్వరలో వస్తుంది", "androidNote": "మీరు Android ఉపయోగిస్తున్నారు. Google Play నుంచి మనక్యామ్ డౌన్‌లోడ్ చేయండి.", "iosNote": "మీరు iPhone లేదా iPad ఉపయోగిస్తున్నారు. App Store వెర్షన్ త్వరలో వస్తుంది.", "iosReadyNote": "మీరు iPhone లేదా iPad ఉపయోగిస్తున్నారు. App Store నుంచి మనక్యామ్ డౌన్‌లోడ్ చేయండి.", "otherNote": "మీ పరికరానికి సరిపోయే స్టోర్‌ను ఎంచుకోండి."},
    bn: {"brand": "Lemera-এর আইনি তথ্য", "privacy": "গোপনীয়তা", "terms": "শর্তাবলি", "licenses": "লাইসেন্স", "privacyFull": "গোপনীয়তা নীতি", "termsFull": "পরিষেবার শর্তাবলি", "licensesFull": "ওপেন সোর্স লাইসেন্স", "title": "সবক্যাম ডাউনলোড করুন", "subtitle": "আপনার ডিভাইসের স্টোর বেছে নিন।", "playCaption": "Android ডিভাইসের জন্য", "appCaption": "iPhone ও iPad-এর জন্য", "open": "খুলুন", "comingSoon": "শীঘ্রই আসছে", "androidNote": "আপনি Android ব্যবহার করছেন। Google Play থেকে সবক্যাম ডাউনলোড করুন।", "iosNote": "আপনি iPhone বা iPad ব্যবহার করছেন। App Store সংস্করণ শীঘ্রই আসছে।", "iosReadyNote": "আপনি iPhone বা iPad ব্যবহার করছেন। App Store থেকে সবক্যাম ডাউনলোড করুন।", "otherNote": "আপনার ডিভাইসের স্টোর বেছে নিন।"},
    hi: {"brand": "Lemera जानकारी", "privacy": "निजता", "terms": "शर्तें", "licenses": "लाइसेंस", "privacyFull": "निजता नीति", "termsFull": "सेवा की शर्तें", "licensesFull": "ओपन-सोर्स लाइसेंस", "title": "Lemera डाउनलोड करें", "subtitle": "अपने डिवाइस का स्टोर चुनें।", "playCaption": "Android डिवाइस के लिए", "appCaption": "iPhone और iPad के लिए", "open": "खोलें", "comingSoon": "जल्द आ रहा है", "androidNote": "आप Android इस्तेमाल कर रहे हैं। Google Play से Lemera डाउनलोड करें।", "iosNote": "आप iPhone या iPad इस्तेमाल कर रहे हैं। App Store संस्करण जल्द आ रहा है।", "iosReadyNote": "आप iPhone या iPad इस्तेमाल कर रहे हैं। App Store से Lemera डाउनलोड करें।", "otherNote": "अपने डिवाइस का स्टोर चुनें।"},
    id: {"brand": "Informasi Lemera", "privacy": "Privasi", "terms": "Ketentuan", "licenses": "Lisensi", "privacyFull": "Kebijakan Privasi", "termsFull": "Ketentuan Layanan", "licensesFull": "Lisensi sumber terbuka", "title": "Unduh Lemera", "subtitle": "Pilih toko untuk perangkat Anda.", "playCaption": "Untuk perangkat Android", "appCaption": "Untuk iPhone dan iPad", "open": "Buka", "comingSoon": "Segera hadir", "androidNote": "Anda menggunakan Android. Unduh Lemera dari Google Play.", "iosNote": "Anda menggunakan iPhone atau iPad. Versi App Store segera hadir.", "iosReadyNote": "Anda menggunakan iPhone atau iPad. Unduh Lemera dari App Store.", "otherNote": "Pilih toko untuk perangkat Anda."},
    de: {"brand": "Lemera-Informationen", "privacy": "Datenschutz", "terms": "Bedingungen", "licenses": "Lizenzen", "privacyFull": "Datenschutzerklärung", "termsFull": "Nutzungsbedingungen", "licensesFull": "Open-Source-Lizenzen", "title": "Lemera herunterladen", "subtitle": "Wähle den Store für dein Gerät.", "playCaption": "Für Android-Geräte", "appCaption": "Für iPhone und iPad", "open": "Öffnen", "comingSoon": "Bald verfügbar", "androidNote": "Du verwendest Android. Lade Lemera bei Google Play herunter.", "iosNote": "Du verwendest ein iPhone oder iPad. Die App-Store-Version ist bald verfügbar.", "iosReadyNote": "Du verwendest ein iPhone oder iPad. Lade Lemera im App Store herunter.", "otherNote": "Wähle den Store für dein Gerät."},
    pt: {"brand": "Informações do Lemera", "privacy": "Privacidade", "terms": "Termos", "licenses": "Licenças", "privacyFull": "Política de Privacidade", "termsFull": "Termos de Serviço", "licensesFull": "Licenças de código aberto", "title": "Instalar Lemera", "subtitle": "Escolha a loja para seu dispositivo.", "playCaption": "Para dispositivos Android", "appCaption": "Para iPhone e iPad", "open": "Abrir", "comingSoon": "Em breve", "androidNote": "Está usando Android. Instale o Lemera pelo Google Play.", "iosNote": "Está usando iPhone ou iPad. A versão da App Store estará disponível em breve.", "iosReadyNote": "Está usando iPhone ou iPad. Instale o Lemera pela App Store.", "otherNote": "Escolha a loja para seu dispositivo."},
    fr: {"brand": "Informations de Lemera", "privacy": "Confidentialité", "terms": "Conditions", "licenses": "Licences", "privacyFull": "Politique de confidentialité", "termsFull": "Conditions d’utilisation", "licensesFull": "Licences open source", "title": "Télécharger Lemera", "subtitle": "Choisissez la boutique de votre appareil.", "playCaption": "Pour les appareils Android", "appCaption": "Pour iPhone et iPad", "open": "Ouvrir", "comingSoon": "Bientôt disponible", "androidNote": "Vous utilisez Android. Téléchargez Lemera sur Google Play.", "iosNote": "Vous utilisez un iPhone ou un iPad. La version App Store sera bientôt disponible.", "iosReadyNote": "Vous utilisez un iPhone ou un iPad. Téléchargez Lemera sur l’App Store.", "otherNote": "Choisissez la boutique de votre appareil."},
    es: {
      brand:"Información de Lemera", privacy:"Privacidad", terms:"Términos", licenses:"Licencias",
      privacyFull:"Política de privacidad", termsFull:"Términos del servicio", licensesFull:"Licencias de código abierto",
      title: "Descargar Lemera",
      subtitle: "Elige la tienda correspondiente a tu dispositivo.",
      playCaption: "Para dispositivos Android", appCaption: "Para iPhone y iPad",
      open: "Abrir", comingSoon: "Próximamente",
      androidNote: "Estás usando Android. Descarga Lemera en Google Play.",
      iosNote: "Estás usando iPhone o iPad. La versión para App Store estará disponible próximamente.",
      iosReadyNote: "Estás usando iPhone o iPad. Descarga Lemera en App Store.",
      otherNote: "Elige la tienda de tu dispositivo."
    }
  };
  function resolveLocale(value) {
    const code = String(value || "en").toLowerCase().split(/[-_]/)[0];
    return supported.includes(code) ? code : "en";
  }

  const title = document.getElementById("download-title");
  const subtitle = document.getElementById("download-subtitle");
  const play = document.getElementById("play-store-link");
  const app = document.getElementById("app-store-link");
  const playCaption = document.getElementById("play-caption");
  const appCaption = document.getElementById("app-caption");
  const playBadge = document.getElementById("play-badge");
  const appBadge = document.getElementById("app-badge");
  const note = document.getElementById("platform-note");
  const language = document.getElementById("download-language");

  play.href = config.googlePlayUrl || "#";
  if (isAndroid) play.dataset.recommended = "true";
  if (isIOS) app.dataset.recommended = "true";
  if (config.appStoreUrl) {
    app.href = config.appStoreUrl;
    app.removeAttribute("aria-disabled");
  } else {
    app.addEventListener("click", function (event) { event.preventDefault(); });
  }

  function render(locale) {
    const selected = resolveLocale(locale);
    const text = copy[selected];
    if (document.documentElement) document.documentElement.lang = selected;
    document.title = text.title;
    const labels = {
      "download-brand":text.brand, "download-privacy":text.privacy,
      "download-terms":text.terms, "download-licenses":text.licenses,
      "download-foot-privacy":text.privacyFull,
      "download-foot-terms":text.termsFull,
      "download-foot-licenses":text.licensesFull
    };
    for (const [id,label] of Object.entries(labels)) document.getElementById(id).textContent = label;
    for (const [id,route] of Object.entries({'download-privacy':'privacy','download-terms':'terms','download-licenses':'licenses','download-foot-privacy':'privacy','download-foot-terms':'terms','download-foot-licenses':'licenses'})) {
      const french = {privacy:'/privacy/fr/v1.4/',terms:'/terms/fr/v1.2/',licenses:'/licenses/fr/'};
      document.getElementById(id).href = selected === 'ja' ? {privacy:'/privacy/ja/v1.4/',terms:'/terms/ja/v1.2/',licenses:'/licenses/ja/'}[route] : selected === 'mr' ? {privacy:'/privacy/mr/v1.4/',terms:'/terms/mr/v1.2/',licenses:'/licenses/mr/'}[route] : selected === 'te' ? {privacy:'/privacy/te/v1.4/',terms:'/terms/te/v1.2/',licenses:'/licenses/te/'}[route] : selected === 'bn' ? {privacy:'/privacy/bn/v1.4/',terms:'/terms/bn/v1.2/',licenses:'/licenses/bn/'}[route] : selected === 'hi' ? {privacy:'/privacy/hi/v1.4/',terms:'/terms/hi/v1.2/',licenses:'/licenses/hi/'}[route] : selected === 'id' ? {privacy:'/privacy/id/v1.4/',terms:'/terms/id/v1.2/',licenses:'/licenses/id/'}[route] : selected === 'de' ? {privacy:'/privacy/de/v1.4/',terms:'/terms/de/v1.2/',licenses:'/licenses/de/'}[route] : selected === 'pt' ? {privacy:'/privacy/pt/v1.4/',terms:'/terms/pt/v1.2/',licenses:'/licenses/pt/'}[route] : selected === 'fr' ? french[route] : '/'+route+'/';
    }
    document.querySelector?.('.store-list')?.setAttribute('aria-label', selected === 'ja' ? 'ダウンロード方法' : selected === 'mr' ? 'डाउनलोड पर्याय' : selected === 'te' ? 'డౌన్‌లోడ్ ఎంపికలు' : selected === 'bn' ? 'ডাউনলোডের বিকল্প' : selected === 'hi' ? 'डाउनलोड विकल्प' : selected === 'id' ? 'Pilihan unduhan' : selected === 'de' ? 'Downloadoptionen' : selected === 'pt' ? 'Opções de instalação' : selected === 'fr' ? 'Options de téléchargement' : 'Download options');
    title.textContent = text.title;
    subtitle.textContent = text.subtitle;
    playCaption.textContent = text.playCaption;
    appCaption.textContent = text.appCaption;
    playBadge.textContent = text.open;
    appBadge.textContent = config.appStoreUrl ? text.open : text.comingSoon;
    note.textContent = isAndroid ? text.androidNote :
      isIOS ? (config.appStoreUrl ? text.iosReadyNote : text.iosNote) :
      text.otherNote;
    language.value = selected;
    language.setAttribute?.('aria-label', selected === 'mr' ? 'भाषा' : selected === 'te' ? 'భాష' : selected === 'bn' ? 'ভাষা' : 'Language / 언어 / Idioma / Langue');
    document.getElementById('download-brand').href = selected === 'mr' ? '/?lang=mr' : selected === 'te' ? '/?lang=te' : selected === 'bn' ? '/?lang=bn' : '/';
  }
  language.onchange = function () { render(language.value); };
  render(nav.language);
})();
