/*!
 * Eyes Software cookie consent banner.
 *
 * Include on every page, together with analytics.js (order does not matter):
 *   <script src="/js/consent.js" defer></script>
 *   <script src="/js/analytics.js" defer></script>
 *
 * Texts come from window.__LOCALES__[lang].consent (public/locales/*.json, built into
 * /locales/bundle.js). Pages without bundle.js fall back to the English/Turkish texts below.
 * Language = <html lang>; the banner switches to RTL for Arabic and re-renders when <html lang> changes.
 *
 * The choice is stored in the first-party cookie "eyes_consent" (180 days).
 * Nothing in this file loads third-party code; analytics.js does that only after consent.
 *
 * API (window.eyesConsent):
 *   get()                     -> { decided, analytics, ads, ts } (decided=false until the visitor chooses)
 *   set({ analytics, ads })   -> save a choice
 *   acceptAll() / rejectAll()
 *   open()                    -> show the banner with the settings expanded (used by the footer link)
 *   onChange(fn)              -> fn(state) after every saved choice; returns an unsubscribe function
 * Any element with the attribute data-eyes-consent-open opens the settings when clicked.
 * Every saved choice (and the stored choice on page load) is also dispatched as
 * window event "eyes:consent" with event.detail = get().
 */
(function () {
  'use strict';
  if (window.eyesConsent) return;

  var COOKIE = 'eyes_consent';
  var VERSION = '1';
  var MAX_AGE = 180 * 24 * 60 * 60; // 180 days
  var POLICY_URL = '/cookies';

  var FALLBACK = {
    en: {
      title: 'Cookie preferences',
      text: 'We always use the cookies this website needs to work. With your permission, we also use Google Analytics to measure visits and the Meta Pixel to measure our ads. You can change your choice at any time with the “Cookie preferences” link at the bottom of the page.',
      policyLink: 'Cookie Policy',
      accept: 'Accept',
      reject: 'Reject',
      settings: 'Settings',
      save: 'Save choice',
      necessary: 'Necessary',
      necessaryDesc: 'Language, your cookie choice and website security. Always on.',
      analytics: 'Analytics',
      analyticsDesc: 'Google Analytics: how many people visit and which pages they view.',
      ads: 'Advertising',
      adsDesc: 'Meta Pixel: visits and enquiries that come from our ads, and showing our ads to people who visited the site.'
    },
    tr: {
      title: 'Çerez tercihleri',
      text: 'Sitenin çalışması için gereken çerezleri her zaman kullanıyoruz. İzin verirseniz ziyaretleri ölçmek için Google Analytics’i, reklamlarımızı ölçmek için Meta Pixel’i de kullanırız. Seçiminizi sayfanın altındaki “Çerez tercihleri” bağlantısından istediğiniz zaman değiştirebilirsiniz.',
      policyLink: 'Çerez Politikası',
      accept: 'Kabul et',
      reject: 'Reddet',
      settings: 'Ayarlar',
      save: 'Seçimi kaydet',
      necessary: 'Zorunlu',
      necessaryDesc: 'Dil seçimi, çerez tercihiniz ve site güvenliği. Her zaman açık.',
      analytics: 'Analitik',
      analyticsDesc: 'Google Analytics: siteyi kaç kişinin ziyaret ettiği ve hangi sayfaların görüntülendiği.',
      ads: 'Reklam',
      adsDesc: 'Meta Pixel: reklamlarımızdan gelen ziyaretler ve talepler, siteyi ziyaret edenlere reklamlarımızın gösterilmesi.'
    }
  };

  var CSS = [
    '.eyes-cc{position:fixed;inset-inline:0;bottom:0;z-index:2147483000;padding:0 12px calc(12px + env(safe-area-inset-bottom));pointer-events:none;font-family:inherit;}',
    '.eyes-cc[hidden]{display:none;}',
    '.eyes-cc__box{pointer-events:auto;box-sizing:border-box;max-width:720px;margin-inline:auto;background:var(--card,#fff);color:var(--ink,#0A0A0A);border:1px solid var(--line-strong,rgba(10,10,10,.22));border-radius:20px;box-shadow:0 12px 40px rgba(10,10,10,.18);padding:18px 20px;font-size:.92rem;line-height:1.5;max-height:calc(100vh - 24px);overflow:auto;}',
    '.eyes-cc__title{font-weight:700;font-size:1rem;margin:0 0 6px;}',
    '.eyes-cc__text{margin:0;color:var(--muted,#555);}',
    '.eyes-cc__text a{color:var(--ink,#0A0A0A);text-decoration:underline;}',
    '.eyes-cc__prefs{margin:14px 0 0;display:grid;gap:8px;}',
    '.eyes-cc__prefs[hidden]{display:none;}',
    '.eyes-cc__row{display:flex;gap:12px;align-items:flex-start;padding:10px 12px;border:1px solid var(--line,rgba(10,10,10,.1));border-radius:12px;cursor:pointer;}',
    '.eyes-cc__row input{margin:3px 0 0;width:18px;height:18px;flex:none;accent-color:var(--ink,#0A0A0A);}',
    '.eyes-cc__row b{display:block;font-weight:600;}',
    '.eyes-cc__row small{display:block;color:var(--muted,#555);font-size:.84rem;}',
    '.eyes-cc__actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:14px;align-items:center;}',
    '.eyes-cc__btn{flex:1 1 140px;min-height:46px;padding:0 20px;border-radius:100px;border:1px solid var(--ink,#0A0A0A);background:var(--ink,#0A0A0A);color:#fff;font:inherit;font-weight:600;cursor:pointer;}',
    '.eyes-cc__btn:hover{opacity:.88;}',
    '.eyes-cc__link{flex:0 0 auto;background:none;border:0;padding:8px 4px;font:inherit;font-weight:600;color:var(--ink,#0A0A0A);text-decoration:underline;cursor:pointer;}',
    '.eyes-cc :focus-visible{outline:2px solid var(--ink,#0A0A0A);outline-offset:3px;}',
    '@media (max-width:480px){.eyes-cc__box{padding:16px;border-radius:16px;font-size:.88rem;}.eyes-cc__link{flex-basis:100%;text-align:center;}}'
  ].join('');

  var state = readStored();
  var listeners = [];
  var el = null;
  var prefsOpen = false;

  /* ── Storage ── */
  function readCookie(name) {
    var m = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
    return m ? decodeURIComponent(m[1]) : null;
  }

  // Cookie value: "<version>.<analytics 0|1>.<ads 0|1>.<unix seconds>", e.g. "1.1.0.1732190000"
  function readStored() {
    var raw = readCookie(COOKIE);
    if (!raw) return null;
    var p = raw.split('.');
    if (p.length !== 4 || p[0] !== VERSION) return null;
    return { analytics: p[1] === '1', ads: p[2] === '1', ts: Number(p[3]) * 1000 || 0 };
  }

  function writeStored(s) {
    var val = [VERSION, s.analytics ? 1 : 0, s.ads ? 1 : 0, Math.floor(s.ts / 1000)].join('.');
    document.cookie = COOKIE + '=' + val + ';path=/;max-age=' + MAX_AGE + ';SameSite=Lax' +
      (location.protocol === 'https:' ? ';Secure' : '');
  }

  /* ── State ── */
  function get() {
    return state
      ? { decided: true, analytics: state.analytics, ads: state.ads, ts: state.ts }
      : { decided: false, analytics: false, ads: false, ts: 0 };
  }

  function emit() {
    var detail = get();
    listeners.slice().forEach(function (fn) { try { fn(detail); } catch (e) { /* ignore */ } });
    try { window.dispatchEvent(new CustomEvent('eyes:consent', { detail: detail })); } catch (e) { /* old browsers */ }
  }

  function set(choice) {
    choice = choice || {};
    state = { analytics: !!choice.analytics, ads: !!choice.ads, ts: Date.now() };
    writeStored(state);
    hide();
    emit();
  }

  function onChange(fn) {
    if (typeof fn !== 'function') return function () {};
    listeners.push(fn);
    return function () { listeners = listeners.filter(function (f) { return f !== fn; }); };
  }

  /* ── Texts ── */
  function lang() {
    var root = document.documentElement;
    return (root.getAttribute('lang') || root.dataset.lang || 'en').slice(0, 2).toLowerCase();
  }

  function texts() {
    var l = lang();
    var all = window.__LOCALES__;
    var fromBundle = all && all[l] && all[l].consent;
    var base = FALLBACK[l] || (all && all.en && all.en.consent) || FALLBACK.en;
    var out = {};
    Object.keys(FALLBACK.en).forEach(function (k) {
      out[k] = (fromBundle && fromBundle[k]) || base[k] || FALLBACK.en[k];
    });
    return out;
  }

  /* ── UI ── */
  function h(tag, attrs, children) {
    var node = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      if (k === 'text') node.textContent = attrs[k];
      else if (attrs[k] === true) node.setAttribute(k, '');
      else if (attrs[k] !== false && attrs[k] != null) node.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (c) { if (c) node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return node;
  }

  function ensureStyle() {
    if (document.getElementById('eyes-cc-style')) return;
    var s = document.createElement('style');
    s.id = 'eyes-cc-style';
    s.textContent = CSS;
    (document.head || document.documentElement).appendChild(s);
  }

  function prefRow(name, title, desc, checked, disabled) {
    return h('label', { 'class': 'eyes-cc__row' }, [
      h('input', { type: 'checkbox', name: name, checked: !!checked, disabled: !!disabled }),
      h('span', {}, [h('b', { text: title }), h('small', { text: desc })])
    ]);
  }

  function render() {
    var t = texts();
    var l = lang();
    var cur = get();
    var box = h('div', { 'class': 'eyes-cc__box', role: 'dialog', 'aria-labelledby': 'eyes-cc-title', 'aria-describedby': 'eyes-cc-text' }, [
      h('p', { 'class': 'eyes-cc__title', id: 'eyes-cc-title', text: t.title }),
      h('p', { 'class': 'eyes-cc__text', id: 'eyes-cc-text' }, [t.text + ' ', h('a', { href: POLICY_URL, text: t.policyLink })]),
      h('div', { 'class': 'eyes-cc__prefs', hidden: !prefsOpen }, [
        prefRow('necessary', t.necessary, t.necessaryDesc, true, true),
        prefRow('analytics', t.analytics, t.analyticsDesc, cur.analytics, false),
        prefRow('ads', t.ads, t.adsDesc, cur.ads, false)
      ]),
      h('div', { 'class': 'eyes-cc__actions' }, [
        h('button', { type: 'button', 'class': 'eyes-cc__btn', 'data-act': 'reject', text: t.reject }),
        h('button', { type: 'button', 'class': 'eyes-cc__btn', 'data-act': 'accept', text: t.accept }),
        prefsOpen
          ? h('button', { type: 'button', 'class': 'eyes-cc__link', 'data-act': 'save', text: t.save })
          : h('button', { type: 'button', 'class': 'eyes-cc__link', 'data-act': 'settings', 'aria-expanded': 'false', text: t.settings })
      ])
    ]);

    if (!el) {
      el = h('div', { 'class': 'eyes-cc', id: 'eyes-consent' });
      el.addEventListener('click', onBannerClick);
      document.body.appendChild(el);
    }
    el.setAttribute('lang', l);
    el.setAttribute('dir', l === 'ar' ? 'rtl' : 'ltr');
    el.textContent = '';
    el.appendChild(box);
    el.hidden = false;
  }

  function onBannerClick(e) {
    var btn = e.target.closest && e.target.closest('[data-act]');
    if (!btn) return;
    var act = btn.getAttribute('data-act');
    if (act === 'accept') set({ analytics: true, ads: true });
    else if (act === 'reject') set({ analytics: false, ads: false });
    else if (act === 'settings') { prefsOpen = true; render(); focusFirstToggle(); }
    else if (act === 'save') {
      set({
        analytics: el.querySelector('input[name="analytics"]').checked,
        ads: el.querySelector('input[name="ads"]').checked
      });
    }
  }

  function focusFirstToggle() {
    var first = el && el.querySelector('input[name="analytics"]');
    if (first) first.focus();
  }

  function show(withPrefs) {
    prefsOpen = !!withPrefs;
    ensureStyle();
    render();
  }

  function hide() {
    if (el) el.hidden = true;
    prefsOpen = false;
  }

  function open() {
    show(true);
    focusFirstToggle();
  }

  /* ── Wiring ── */
  document.addEventListener('click', function (e) {
    var trigger = e.target.closest && e.target.closest('[data-eyes-consent-open]');
    if (!trigger) return;
    e.preventDefault();
    open();
  });

  // Re-render in the new language when the site switches <html lang>.
  if ('MutationObserver' in window) {
    new MutationObserver(function () {
      if (el && !el.hidden) render();
    }).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  }

  window.eyesConsent = {
    get: get,
    set: set,
    acceptAll: function () { set({ analytics: true, ads: true }); },
    rejectAll: function () { set({ analytics: false, ads: false }); },
    open: open,
    onChange: onChange
  };

  function init() {
    if (!state) show(false);
    else emit(); // let analytics.js (if it is already loaded) apply the stored choice
  }

  if (document.body) init();
  else document.addEventListener('DOMContentLoaded', init);
})();
