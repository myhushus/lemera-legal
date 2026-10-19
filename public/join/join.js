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
  };
  // The deployed /download script owns a different DOM. Reuse its store
  // config without executing that page script on the join page.
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
    const ko = locale ? locale === 'ko' : /^ko\b/i.test(nav.language || '');
    const text = copy[ko ? 'ko' : 'en'];
    const device = helpers.platform(nav);
    const playUrl = helpers.storeUrl(config.googlePlayUrl, 'play.google.com');
    const appleUrl = helpers.storeUrl(config.appStoreUrl, 'apps.apple.com');
    doc.documentElement.lang = ko ? 'ko' : 'en';
    doc.title = text.title;
    for (const id of ['brand', 'privacy', 'terms']) doc.getElementById(id).textContent = text[id];
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
    language.textContent = ko ? 'English' : '한국어';
    language.onclick = () => mount(doc, nav, config, helpers, ko ? 'en' : 'ko');
    // No fragment access, persistence, analytics, automatic navigation or
    // deferred-install promise. Only the app decodes group credentials.
  }
  if (typeof module !== 'undefined') module.exports = { mount, copy, platform, storeUrl };
  if (root.document) mount(root.document, root.navigator, root.LEMERA_JOIN_CONFIG || {});
})(typeof window === 'undefined' ? globalThis : window);
