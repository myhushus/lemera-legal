(function (root) {
  'use strict';

  const apple = 'https://apps.apple.com/app/id6815128720';
  const play = 'https://play.google.com/store/apps/details?id=com.meroviq.lemera';
  const marker = 'lemeraStoreAutoAttempted';

  function destination(nav, config) {
    const ua = nav.userAgent || '';
    const ios = /iPhone|iPad|iPod/i.test(ua) ||
      ((/Macintosh/i.test(ua) || nav.platform === 'MacIntel') && nav.maxTouchPoints > 1);
    if (ios) return config.appStoreUrl === apple ? apple : null;
    if (/Android/i.test(ua)) return (config.googlePlayUrl || config.playStoreUrl) === play ? play : null;
    return null;
  }

  function start(win, doc, nav, config) {
    const target = destination(nav, config);
    // OS association decides whether an installed app receives /join. A web
    // visit is NOT proof that the app is absent. Never inspect the invite URL.
    if (!target || doc.visibilityState !== 'visible' || doc.prerendering) return;
    if (win.performance?.getEntriesByType('navigation')[0]?.type === 'back_forward') return;
    let stopped = false;
    let timer = null;
    let scheduled = false;
    function stop() {
      stopped = true;
      if (timer !== null) win.clearTimeout(timer);
      timer = null;
    }
    function schedule() {
      if (scheduled || stopped || doc.visibilityState !== 'visible') return;
      scheduled = true;
      try {
        const state = win.history.state;
        if (state != null && (typeof state !== 'object' || Array.isArray(state) || state[marker])) return;
        // Boolean only, scoped to this history entry. No URL argument: retain
        // the invite untouched without reading, copying or persisting it.
        win.history.replaceState(Object.assign({}, state, {[marker]: true}), '');
      } catch (_) {
        // If back/reload protection cannot be recorded, keep manual buttons.
        return;
      }
      timer = win.setTimeout(function () {
        timer = null;
        if (stopped || doc.visibilityState !== 'visible') return;
        stopped = true;
        try { win.location.assign(target); } catch (_) {
          // Navigation may be blocked; existing localized links remain usable.
        }
      }, 1200);
    }
    doc.addEventListener('visibilitychange', function () {
      if (doc.visibilityState !== 'visible') stop();
    });
    win.addEventListener('pagehide', stop);
    win.addEventListener('pageshow', function (event) {
      if (event.persisted) stop();
    });
    // Do not interrupt someone using the language selector, links or keyboard.
    doc.addEventListener('pointerdown', stop, {once: true, capture: true});
    doc.addEventListener('keydown', stop, {once: true, capture: true});
    if (doc.readyState === 'complete') schedule();
    else win.addEventListener('load', schedule, {once: true});
  }

  if (typeof module !== 'undefined') module.exports = {destination, start};
  if (root.document) start(root, root.document, root.navigator, root.LEMERA_DOWNLOAD_CONFIG || {});
})(typeof window === 'undefined' ? globalThis : window);
