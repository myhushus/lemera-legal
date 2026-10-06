(function () {
  "use strict";

  var config = window.LEMERA_DOWNLOAD_CONFIG || {};
  var ua = navigator.userAgent || "";
  var language = (navigator.language || "en").toLowerCase();
  var isKorean = language.indexOf("ko") === 0;
  var isAndroid = /Android/i.test(ua);
  var isIOS = /iPhone|iPad|iPod/i.test(ua) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

  var copy = isKorean ? {
    title: "Lemera 다운로드",
    subtitle: "사용 중인 기기에 맞는 스토어를 선택하세요.",
    playCaption: "Android 기기용",
    appCaption: "iPhone 및 iPad용",
    open: "열기",
    comingSoon: "출시 예정",
    androidNote: "Android 기기입니다. Google Play를 이용하세요.",
    iosNote: "iPhone 또는 iPad입니다. App Store 버전은 출시 준비 중입니다.",
    otherNote: "사용 중인 기기의 스토어를 선택하세요."
  } : {
    title: "Get Lemera",
    subtitle: "Choose the store for your device.",
    playCaption: "For Android devices",
    appCaption: "For iPhone and iPad",
    open: "Open",
    comingSoon: "Coming Soon",
    androidNote: "You're on Android. Get Lemera from Google Play.",
    iosNote: "You're on iPhone or iPad. The App Store version is coming soon.",
    otherNote: "Choose the store for your device."
  };

  var title = document.getElementById("download-title");
  var subtitle = document.getElementById("download-subtitle");
  var play = document.getElementById("play-store-link");
  var app = document.getElementById("app-store-link");
  var playCaption = document.getElementById("play-caption");
  var appCaption = document.getElementById("app-caption");
  var playBadge = document.getElementById("play-badge");
  var appBadge = document.getElementById("app-badge");
  var note = document.getElementById("platform-note");

  title.textContent = copy.title;
  subtitle.textContent = copy.subtitle;
  playCaption.textContent = copy.playCaption;
  appCaption.textContent = copy.appCaption;
  playBadge.textContent = copy.open;

  play.href = config.googlePlayUrl || "#";
  if (isAndroid) {
    play.dataset.recommended = "true";
    note.textContent = copy.androidNote;
  }

  if (config.appStoreUrl) {
    app.href = config.appStoreUrl;
    app.removeAttribute("aria-disabled");
    appBadge.textContent = copy.open;
    if (isIOS) {
      app.dataset.recommended = "true";
      note.textContent = isKorean
        ? "iPhone 또는 iPad입니다. App Store를 이용하세요."
        : "You're on iPhone or iPad. Get Lemera from the App Store.";
    }
  } else {
    appBadge.textContent = copy.comingSoon;
    app.addEventListener("click", function (event) {
      event.preventDefault();
    });
    if (isIOS) {
      app.dataset.recommended = "true";
      note.textContent = copy.iosNote;
    }
  }

  if (!isAndroid && !isIOS) {
    note.textContent = copy.otherNote;
  }
})();
