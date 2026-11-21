/*!
 * Eyes Software analytics: Meta Pixel + Google Analytics 4, gated by consent.js.
 *
 * Include on every page, together with consent.js (order does not matter):
 *   <script src="/js/consent.js" defer></script>
 *   <script src="/js/analytics.js" defer></script>
 * IDs live in /js/analytics-config.js (loaded automatically from the same folder as this file).
 *
 * Rules
 * - Nothing from connect.facebook.net or googletagmanager.com loads until the visitor has given
 *   consent: Meta Pixel needs "ads" consent, GA4 needs "analytics" consent and a gaMeasurementId.
 * - Google Consent Mode v2 defaults are set to "denied" on load and updated from the visitor's choice.
 * - QA visits: open any page with ?qa=1 to set localStorage qa=1; while it is set nothing is ever
 *   loaded or sent. ?qa=0 removes the flag.
 * - No advanced matching: the pixel is initialised without customer data and with autoConfig off.
 *   Parameters that look like personal data (email, name, phone, message, ...) are dropped.
 * - Withdrawing consent stops sending and deletes the _fbp/_fbc/_ga cookies of this site.
 *
 * API: window.eyesTrack(eventName, params)
 *   eyesTrack('Lead', { eventID: crypto.randomUUID() })  // after a successful form submit; returns the eventID
 *   eyesTrack('Contact', { method: 'whatsapp' })         // method: email | whatsapp | instagram | phone
 *   eyesTrack('PageView')                                // already sent automatically once per page load
 * Safe to call at any time: before a consent decision events are queued (max 50, this page only)
 * and sent if consent is granted on this page; with consent refused or in QA mode they are dropped.
 * Meta receives the standard event name; GA4 receives Lead -> generate_lead, Contact -> contact_click.
 * Other names go to Meta as custom events and to GA4 under the same name.
 *
 * Contact clicks are tracked automatically for links to mailto:, tel:, WhatsApp (wa.me,
 * api.whatsapp.com, whatsapp:) and Instagram (instagram.com, ig.me). Add data-eyes-track="off" to a
 * link to skip it. Identical Contact events within 1.5 s are merged, so a page that also calls
 * eyesTrack('Contact', ...) in its own click handler does not double count.
 * Debug: window.eyesTrack.state()
 */
(function () {
  'use strict';
  if (window.eyesTrack && window.eyesTrack.__eyes) return;

  var DEFAULTS = { gaMeasurementId: '', metaPixelId: '1156502723519409' };
  var META_STANDARD = {
    PageView: 1, Lead: 1, Contact: 1, ViewContent: 1, Search: 1, CompleteRegistration: 1,
    Schedule: 1, SubmitApplication: 1, FindLocation: 1, CustomizeProduct: 1
  };
  var GA_NAMES = { Lead: 'generate_lead', Contact: 'contact_click', PageView: 'page_view' };
  var BLOCKED_KEYS = /^(em|email|e-?mail|ph|phone|tel|fn|ln|name|first_?name|last_?name|full_?name|message|msg|ct|st|zp|zip|db|dob|ge|address|external_id)$/i;
  var QUEUE_MAX = 50;

  var thisScript = document.currentScript;
  var qa = readQaFlag();
  var cfg = null;          // config once loaded
  var consent = null;      // { analytics, ads } once decided
  var queue = [];
  var meta = { loaded: false, pageViewSent: false };
  var ga = { loaded: false };
  var sent = [];           // log of dispatched events (debug only)
  var lastContact = { key: '', at: 0 };

  /* ── Google Consent Mode v2 defaults (before any Google tag) ── */
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  if (typeof window.gtag !== 'function') window.gtag = gtag;
  gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
    wait_for_update: 500
  });
  gtag('set', 'ads_data_redaction', true);

  /* ── QA flag ── */
  function readQaFlag() {
    var param = null;
    try { param = new URLSearchParams(location.search).get('qa'); } catch (e) { /* ignore */ }
    try {
      if (param === '1') localStorage.setItem('qa', '1');
      else if (param === '0') localStorage.removeItem('qa');
      return localStorage.getItem('qa') === '1';
    } catch (e) {
      return param === '1';
    }
  }

  /* ── Helpers ── */
  function uuid() {
    try { if (window.crypto && crypto.randomUUID) return crypto.randomUUID(); } catch (e) { /* ignore */ }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0;
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  }

  function cleanParams(params) {
    var out = {};
    if (!params || typeof params !== 'object') return out;
    Object.keys(params).forEach(function (k) {
      if (k === 'eventID' || BLOCKED_KEYS.test(k)) return;
      var v = params[k];
      if (v === undefined || v === null || typeof v === 'object' || typeof v === 'function') return;
      out[k] = v;
    });
    return out;
  }

  function rootDomain() {
    var host = location.hostname;
    if (/^[\d.]+$/.test(host) || host.indexOf('.') === -1) return null;
    return host.split('.').slice(-2).join('.');
  }

  function deleteCookies(test) {
    var names = document.cookie.split(';').map(function (c) { return c.split('=')[0].trim(); }).filter(test);
    var domain = rootDomain();
    names.forEach(function (n) {
      document.cookie = n + '=; Max-Age=0; path=/';
      if (domain) document.cookie = n + '=; Max-Age=0; path=/; domain=.' + domain;
    });
  }

  /* ── Config ── */
  function loadConfig(done) {
    function finish() {
      var c = window.EYES_ANALYTICS_CONFIG || {};
      cfg = {
        gaMeasurementId: String(c.gaMeasurementId != null ? c.gaMeasurementId : DEFAULTS.gaMeasurementId).trim(),
        metaPixelId: String(c.metaPixelId != null ? c.metaPixelId : DEFAULTS.metaPixelId).trim()
      };
      done();
    }
    if (window.EYES_ANALYTICS_CONFIG) return finish();
    var base = thisScript && thisScript.src ? thisScript.src.replace(/[^/]*(\?.*)?$/, '') : '/js/';
    var s = document.createElement('script');
    s.src = base + 'analytics-config.js';
    s.onload = finish;
    s.onerror = finish; // fall back to DEFAULTS
    (document.head || document.documentElement).appendChild(s);
  }

  /* ── Meta Pixel ── */
  function loadMeta() {
    if (!meta.loaded) {
      meta.loaded = true;
      /* eslint-disable */
      !function (f, b, e, v, n, t, s) {
        if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
        if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = [];
        t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
      }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
      /* eslint-enable */
      window.fbq('consent', 'grant');
      window.fbq('set', 'autoConfig', false, cfg.metaPixelId);
      window.fbq('init', cfg.metaPixelId); // no customer data: advanced matching stays off
    } else {
      window.fbq('consent', 'grant');
    }
    if (!meta.pageViewSent) {
      meta.pageViewSent = true;
      window.fbq('track', 'PageView');
      sent.push(['meta', 'PageView']);
    }
  }

  function stopMeta() {
    if (meta.loaded && window.fbq) window.fbq('consent', 'revoke');
    deleteCookies(function (n) { return n === '_fbp' || n === '_fbc'; });
  }

  /* ── Google Analytics 4 ── */
  function loadGA() {
    var id = cfg.gaMeasurementId;
    window['ga-disable-' + id] = false;
    if (ga.loaded) return;
    ga.loaded = true;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(id);
    (document.head || document.documentElement).appendChild(s);
    gtag('js', new Date());
    gtag('config', id, {
      cookie_expires: 395 * 24 * 60 * 60, // about 13 months
      allow_google_signals: false,
      allow_ad_personalization_signals: false
    }); // sends the automatic page_view, including utm_* from the current URL
    sent.push(['ga', 'page_view']);
  }

  function stopGA() {
    if (cfg && cfg.gaMeasurementId) window['ga-disable-' + cfg.gaMeasurementId] = true;
    deleteCookies(function (n) { return n === '_ga' || n.indexOf('_ga_') === 0 || n === '_gid'; });
  }

  /* ── Consent ── */
  function updateGoogleConsent() {
    var a = consent && consent.analytics ? 'granted' : 'denied';
    var m = consent && consent.ads ? 'granted' : 'denied';
    gtag('consent', 'update', { analytics_storage: a, ad_storage: m, ad_user_data: m, ad_personalization: m });
  }

  function applyConsent(detail) {
    if (!detail || !detail.decided) return;
    consent = { analytics: !!detail.analytics, ads: !!detail.ads };
    updateGoogleConsent();
    if (!cfg) return; // run() applies it once the config is in
    if (qa) {
      queue = [];
      if (window.console) console.info('[eyesTrack] QA mode (localStorage qa=1): Meta Pixel and GA are disabled.');
      return;
    }
    if (consent.ads && cfg.metaPixelId) loadMeta(); else stopMeta();
    if (consent.analytics && cfg.gaMeasurementId) loadGA(); else stopGA();
    flush();
  }

  function flush() {
    var pending = queue;
    queue = [];
    pending.forEach(function (ev) { dispatch(ev[0], ev[1]); });
  }

  /* ── Events ── */
  function dispatch(name, params) {
    if (qa || !consent) return;
    var data = cleanParams(params);
    var eventID = params && params.eventID;

    if (consent.ads && meta.loaded && window.fbq) {
      if (name === 'PageView' && meta.pageViewSent && !eventID) {
        // already sent automatically for this page
      } else {
        var method = META_STANDARD[name] ? 'track' : 'trackCustom';
        if (eventID) window.fbq(method, name, data, { eventID: String(eventID) });
        else window.fbq(method, name, data);
        sent.push(['meta', name, eventID || null]);
      }
    }

    if (consent.analytics && ga.loaded && cfg.gaMeasurementId) {
      if (name !== 'PageView') {
        var gaName = GA_NAMES[name] || name;
        gtag('event', gaName, data);
        sent.push(['ga', gaName]);
      }
    }
  }

  function eyesTrack(name, params) {
    if (!name || typeof name !== 'string') return undefined;
    params = params && typeof params === 'object' ? Object.assign({}, params) : {};
    if (name === 'Lead' && !params.eventID) params.eventID = uuid();

    if (name === 'Contact') {
      var key = String(params.method || '');
      var now = Date.now();
      if (key === lastContact.key && now - lastContact.at < 1500) return params.eventID;
      lastContact = { key: key, at: now };
    }

    if (qa) return params.eventID;
    if (!cfg || !consent) {
      if (queue.length < QUEUE_MAX) queue.push([name, params]);
    } else {
      dispatch(name, params);
    }
    return params.eventID;
  }

  eyesTrack.__eyes = true;
  eyesTrack.state = function () {
    return {
      qa: qa,
      config: cfg,
      consent: consent,
      metaLoaded: meta.loaded,
      gaLoaded: ga.loaded,
      queued: queue.length,
      sent: sent.slice()
    };
  };
  window.eyesTrack = eyesTrack;

  /* ── Automatic Contact clicks ── */
  function contactMethod(href) {
    if (!href) return null;
    if (/^mailto:/i.test(href)) return 'email';
    if (/^tel:/i.test(href)) return 'phone';
    if (/^whatsapp:/i.test(href)) return 'whatsapp';
    var u;
    try { u = new URL(href, location.href); } catch (e) { return null; }
    var host = u.hostname.toLowerCase().replace(/^www\./, '');
    if (host === 'wa.me' || host === 'whatsapp.com' || /\.whatsapp\.com$/.test(host)) return 'whatsapp';
    if (host === 'instagram.com' || host === 'ig.me' || host === 'instagr.am' || /\.instagram\.com$/.test(host)) return 'instagram';
    return null;
  }

  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest && e.target.closest('a[href]');
    if (!a || a.getAttribute('data-eyes-track') === 'off') return;
    var method = contactMethod(a.getAttribute('href'));
    if (method) eyesTrack('Contact', { method: method });
  }, true);

  /* ── Start ── */
  window.addEventListener('eyes:consent', function (e) { applyConsent(e.detail); });
  loadConfig(function () {
    var current = window.eyesConsent && window.eyesConsent.get();
    if (current && current.decided) applyConsent(current);
    else if (consent) applyConsent({ decided: true, analytics: consent.analytics, ads: consent.ads });
  });
})();
