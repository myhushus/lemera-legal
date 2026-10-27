(function () {
  "use strict";

  const config = window.LEMERA_DOWNLOAD_CONFIG || {};
  const nav = navigator;
  const ua = nav.userAgent || "";
  const isAndroid = /Android/i.test(ua);
  const isIOS = /iPhone|iPad|iPod/i.test(ua) ||
    (nav.platform === "MacIntel" && nav.maxTouchPoints > 1);
  const supported = ["en", "ko", "es", "fr"];
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
      document.getElementById(id).href = selected === 'fr' ? french[route] : '/'+route+'/';
    }
    document.querySelector?.('.store-list')?.setAttribute('aria-label', selected === 'fr' ? 'Options de téléchargement' : 'Download options');
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
  }
  language.onchange = function () { render(language.value); };
  render(nav.language);
})();
