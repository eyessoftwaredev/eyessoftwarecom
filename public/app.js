(function () {
  /* ── i18n ── */
  var ACTIVE_LANGS = ['en', 'tr', 'ar', 'de', 'fr'];
  var LANG_FLAGS = { en: 'gb', tr: 'tr', ar: 'ae', de: 'de', fr: 'fr' };
  var translations = {};

  function getNestedValue(obj, path) {
    return path.split('.').reduce(function (o, k) { return o && o[k] !== undefined ? o[k] : null; }, obj);
  }

  // English lives at the bare path; other languages under /tr/, /ar/, /de/, /fr/ so a link opens in its language.
  var LANG_PREFIX = /^\/(tr|ar|de|fr)(?=\/|$)/;
  function localizePath(path, lang) {
    var bare = path.replace(LANG_PREFIX, '') || '/';
    if (lang === 'en') return bare;
    return '/' + lang + (bare.charAt(0) === '/' ? bare : '/' + bare);
  }

  function saveLanguage(lang) {
    try { localStorage.setItem('lang', lang); } catch (e) {}
    document.cookie = 'lang=' + encodeURIComponent(lang) + ';path=/;max-age=31536000;SameSite=Lax';
  }

  function applyTranslations(lang) {
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var val = getNestedValue(translations, el.getAttribute('data-i18n'));
      if (val) el.textContent = val + (el.getAttribute('data-i18n-suffix') || '');
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      var val = getNestedValue(translations, el.getAttribute('data-i18n-placeholder'));
      if (val) el.placeholder = val;
    });
    document.querySelectorAll('[data-i18n-content]').forEach(function (el) {
      var val = getNestedValue(translations, el.getAttribute('data-i18n-content'));
      if (val) el.setAttribute('content', val);
    });
    document.querySelectorAll('[data-i18n-aria-label]').forEach(function (el) {
      var val = getNestedValue(translations, el.getAttribute('data-i18n-aria-label'));
      if (val) el.setAttribute('aria-label', val);
    });
    document.querySelectorAll('time[datetime]').forEach(function (el) {
      try {
        el.textContent = new Intl.DateTimeFormat(lang, { day: 'numeric', month: 'long', year: 'numeric' })
          .format(new Date(el.getAttribute('datetime') + 'T12:00:00'));
      } catch (e) {}
    });
    document.querySelectorAll('a[href^="/"]:not([href^="//"])').forEach(function (a) {
      if (!a.dataset.baseHref) a.dataset.baseHref = a.getAttribute('href');
      a.setAttribute('href', localizePath(a.dataset.baseHref, lang));
    });
    var code = LANG_FLAGS[lang] || 'gb';
    var root = document.documentElement;
    root.lang = lang;
    root.dir = lang === 'ar' ? 'rtl' : 'ltr';
    root.dataset.lang = lang;
    root.dataset.flag = code;
    document.getElementById('langCurrentFlag').className = 'fi fi-' + code + ' fis';
    var codeEl = document.getElementById('langCurrentCode');
    if (codeEl) codeEl.textContent = lang.toUpperCase();
    document.querySelectorAll('.lang-option').forEach(function (opt) {
      opt.classList.toggle('active', opt.dataset.lang === lang);
    });
  }

  async function loadLocale(lang) {
    if (window.__LOCALES__ && window.__LOCALES__[lang]) return window.__LOCALES__[lang];
    try {
      var res = await fetch('/locales/' + lang + '.json');
      if (!res.ok) throw new Error('Failed');
      return await res.json();
    } catch (e) { return null; }
  }

  async function setLanguage(lang) {
    if (ACTIVE_LANGS.indexOf(lang) === -1) return;
    var data = await loadLocale(lang);
    if (!data || Object.keys(data).length === 0) return;
    translations = data;
    applyTranslations(lang);
    saveLanguage(lang);
    if (window.history && history.replaceState) {
      history.replaceState(null, '', localizePath(location.pathname, lang) + location.search + location.hash);
    }
  }

  (function initI18n() {
    var saved = document.documentElement.dataset.lang || 'en';
    var lang = ACTIVE_LANGS.indexOf(saved) !== -1 ? saved : 'en';
    var data = window.__LOCALES__ && (window.__LOCALES__[lang] || window.__LOCALES__.en);
    if (data) {
      translations = data;
      applyTranslations(lang);
    }
    // Opening a /tr/ link keeps Turkish on the next visit too.
    if (LANG_PREFIX.test(location.pathname)) saveLanguage(lang);
    document.documentElement.classList.add('i18n-ready');
  })();

  function t(key, fallback) { return getNestedValue(translations, key) || fallback; }

  /* ── Toast ── */
  var toastTimer;
  function showToast(msg) {
    var el = document.getElementById('toast');
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove('show'); }, 3600);
  }

  /* ── Scroll reveal ── */
  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('visible'); revealObserver.unobserve(e.target); }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.reveal').forEach(function (el) { revealObserver.observe(el); });
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('visible'); });
  }

  /* ── In-page links ── */
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  function revealNow(target) {
    var items = Array.prototype.slice.call(target.querySelectorAll('.reveal'));
    if (target.classList.contains('reveal')) items.push(target);
    items.forEach(function (el) { el.classList.add('instant', 'visible'); });
  }
  function scrollToSection(target) {
    revealNow(target);
    var y = target.getBoundingClientRect().top + window.scrollY - (navbar.offsetHeight + 12);
    if (reduceMotion.matches) { window.scrollTo(0, y); return; }
    var distance = y - window.scrollY;
    var stretch = window.innerHeight * 0.6;
    if (Math.abs(distance) > stretch) window.scrollTo(0, y - (distance > 0 ? stretch : -stretch));
    window.scrollTo({ top: y, behavior: 'smooth' });
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href*="#"]');
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var url = new URL(a.href, location.href);
    if (url.origin !== location.origin || url.pathname !== location.pathname || !url.hash) return;
    var target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
    if (!target) return;
    e.preventDefault();
    if (history.pushState && location.hash !== url.hash) history.pushState(null, '', url.hash);
    scrollToSection(target);
  });
  if (location.hash) {
    var initialTarget = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (initialTarget) revealNow(initialTarget);
  }

  /* ── Nav ── */
  var navbar = document.getElementById('navbar');
  window.addEventListener('scroll', function () { navbar.classList.toggle('scrolled', window.scrollY > 8); }, { passive: true });

  var langBtn = document.getElementById('langBtn');
  var langDropdown = document.getElementById('langDropdown');
  function setLangOpen(open) {
    langDropdown.classList.toggle('open', open);
    langBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
  }
  langBtn.addEventListener('click', function () { setLangOpen(!langDropdown.classList.contains('open')); });
  document.querySelectorAll('.lang-option').forEach(function (opt) {
    opt.addEventListener('click', function () {
      setLanguage(opt.dataset.lang);
      setLangOpen(false);
    });
  });

  var navLinks = document.getElementById('navLinks');
  var menuToggle = document.getElementById('menuToggle');
  function setMenuOpen(open) {
    navLinks.classList.toggle('open', open);
    menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.classList.toggle('menu-open', open);
  }
  menuToggle.addEventListener('click', function () { setMenuOpen(!navLinks.classList.contains('open')); });
  navLinks.querySelectorAll('a').forEach(function (link) { link.addEventListener('click', function () { setMenuOpen(false); }); });

  document.addEventListener('click', function (e) {
    if (!e.target.closest('.lang-switch')) setLangOpen(false);
    if (!e.target.closest('#navbar')) setMenuOpen(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { setLangOpen(false); setMenuOpen(false); }
  });
  window.matchMedia('(min-width: 901px)').addEventListener('change', function (mq) { if (mq.matches) setMenuOpen(false); });

  /* ── Contact form ── */
  var form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      var submitBtn = document.getElementById('contactSubmit');
      var name = form.elements.name.value.trim();
      var email = form.elements.email.value.trim();
      var message = form.elements.message.value.trim();
      var website = form.elements.website.value;

      if (!name || !email || !message) {
        showToast(t('contact.form.errorRequired', 'All fields are required.'));
        return;
      }
      if (!form.elements.email.checkValidity()) {
        form.elements.email.focus();
        showToast(t('contact.form.errorEmail', 'Please enter a valid email address.'));
        return;
      }

      var label = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = t('contact.form.sending', 'Sending…');
      try {
        var res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: name, email: email, message: message, website: website }),
        });
        var data = await res.json().catch(function () { return {}; });
        if (!res.ok) throw new Error(data.error || 'Failed to send message.');
        // Conversion event: no form contents are sent. Skipped when the honeypot is filled (bots).
        if (!website && typeof window.eyesTrack === 'function') {
          var eventID = (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : undefined;
          try { window.eyesTrack('Lead', { eventID: eventID }); } catch (trackErr) { /* never block the form */ }
        }
        showToast(t('contact.form.successMessage', 'Message sent successfully!'));
        form.reset();
      } catch (err) {
        showToast(t('contact.form.errorSend', err instanceof Error ? err.message : 'Failed to send message.'));
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = label;
      }
    });
  }

  lucide.createIcons();
})();
