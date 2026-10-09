/*!
 * Multiservicios Mallorca · Capa visual v1.0 (sin dependencias, ~3 KB)
 * - Vídeo de fondo del hero (solo escritorio, sin "ahorro de datos" ni movimiento reducido)
 * - Indicador de scroll + botón de pausa del vídeo
 * - Aparición progresiva de secciones al hacer scroll
 * No modifica textos, enlaces ni formularios: solo añade capas decorativas y clases.
 */
(function () {
  'use strict';

  var d = document;
  var w = window;
  var script = d.currentScript;
  var reduceMotion = w.matchMedia && w.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Ruta de /media: la fija el loader de WordPress (window.mmVisual) para que funcione
  // aunque un plugin de optimización combine este JS; si no, se deduce de este archivo.
  var mediaBase = (w.mmVisual && w.mmVisual.media) ||
    (script && script.getAttribute('data-media')) ||
    (script && script.src ? script.src.replace(/[^\/]*$/, '') + 'media/' : 'media/');

  d.documentElement.classList.add('mm-js');

  function onIdle(fn) {
    if ('requestIdleCallback' in w) w.requestIdleCallback(fn, { timeout: 2000 });
    else w.setTimeout(fn, 250);
  }

  /* ---------------------------------------------------------------- Hero */
  var hero = d.querySelector('.home .entry-content > .gb-element-84a45700');

  if (hero) {
    var header = d.getElementById('masthead');
    if (header) d.documentElement.style.setProperty('--mm-header-h', header.offsetHeight + 'px');

    var cue = d.createElement('button');
    cue.type = 'button';
    cue.className = 'mm-scroll';
    cue.setAttribute('aria-label', 'Ir a la siguiente sección');
    cue.innerHTML = '<span class="mm-scroll__mouse" aria-hidden="true"><span class="mm-scroll__dot"></span></span>';
    cue.addEventListener('click', function () {
      var next = hero.nextElementSibling;
      if (next) next.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    });
    hero.appendChild(cue);

    var conn = navigator.connection || {};
    var slowNet = conn.saveData || /(^|-)2g$/.test(conn.effectiveType || '');
    var desktop = w.matchMedia('(min-width: 768px)').matches;
    // Vídeo vertical en móvil: desactivado por defecto; se activa con window.mmVisual.mobileVideo = true
    var mobileVideo = !desktop && w.mmVisual && w.mmVisual.mobileVideo;

    if (!reduceMotion && !slowNet && (desktop || mobileVideo)) {
      var start = function () { onIdle(function () { mountVideo(hero); }); };
      if (d.readyState === 'complete') start();
      else w.addEventListener('load', start, { once: true });
    }
  }

  function mountVideo(hero) {
    var sfx = mobileVideo ? '-mobile' : '';
    var wrap = d.createElement('div');
    wrap.className = 'mm-hero-media' + (mobileVideo ? ' mm-hero-media--mobile' : '');
    wrap.setAttribute('aria-hidden', 'true');

    var v = d.createElement('video');
    v.muted = true;
    v.defaultMuted = true;
    v.loop = true;
    v.autoplay = true;
    v.playsInline = true;
    v.preload = 'auto';
    v.tabIndex = -1;
    v.setAttribute('muted', '');
    v.setAttribute('playsinline', '');
    v.setAttribute('disablepictureinpicture', '');
    v.setAttribute('poster', mediaBase + (mobileVideo ? 'mm-hero-poster-mobile.webp' : 'mm-hero-poster.webp'));

    // MP4 (H.264) primero: decodificación por hardware en todos los navegadores, incluido Safari,
    // que a veces anuncia WebM y luego no lo reproduce
    [['mm-hero' + sfx + '.mp4', 'video/mp4'], ['mm-hero' + sfx + '.webm', 'video/webm']].forEach(function (s) {
      var src = d.createElement('source');
      src.src = mediaBase + s[0];
      src.type = s[1];
      v.appendChild(src);
    });

    v.addEventListener('playing', function () { wrap.classList.add('is-playing'); }, { once: true });
    wrap.appendChild(v);
    hero.insertBefore(wrap, hero.firstChild);

    var userPaused = false;
    var play = function () { var p = v.play(); if (p && p.catch) p.catch(function () {}); };
    play();

    // Botón de pausa (contenido en movimiento > 5 s debe poder detenerse)
    var toggle = d.createElement('button');
    toggle.type = 'button';
    toggle.className = 'mm-hero-toggle';
    toggle.setAttribute('aria-label', 'Pausar el vídeo de fondo');
    toggle.setAttribute('aria-pressed', 'false');
    toggle.innerHTML =
      '<svg class="mm-i-pause" viewBox="0 0 16 16" aria-hidden="true"><rect x="3" y="2" width="3.5" height="12" rx="1"/><rect x="9.5" y="2" width="3.5" height="12" rx="1"/></svg>' +
      '<svg class="mm-i-play" viewBox="0 0 16 16" aria-hidden="true"><path d="M4 2.5v11a.5.5 0 0 0 .76.43l9-5.5a.5.5 0 0 0 0-.86l-9-5.5A.5.5 0 0 0 4 2.5z"/></svg>';
    toggle.addEventListener('click', function () {
      userPaused = !userPaused;
      if (userPaused) v.pause(); else play();
      toggle.setAttribute('aria-pressed', String(userPaused));
      toggle.setAttribute('aria-label', userPaused ? 'Reproducir el vídeo de fondo' : 'Pausar el vídeo de fondo');
    });
    hero.appendChild(toggle);

    // Pausar fuera de pantalla para ahorrar CPU y batería
    var inView = true;
    if ('IntersectionObserver' in w) {
      new IntersectionObserver(function (entries) {
        inView = entries[0].isIntersecting;
        if (userPaused) return;
        if (inView) play(); else v.pause();
      }).observe(hero);
    }
    // Pestaña abierta en segundo plano: arrancar al volver a ella
    d.addEventListener('visibilitychange', function () {
      if (!d.hidden && inView && !userPaused && v.paused) play();
    });
  }

  /* ------------------------------------------------ Aparición al scroll */
  if (reduceMotion || !('IntersectionObserver' in w)) return;

  var targets = [
    '.entry-content .gbp-section__tagline',
    '.entry-content h2.gb-text',
    '.entry-content .gbp--margin-after > p',
    '.home .gb-element-79253f80 .gb-element-5cb801a0 > div:last-child > *',
    '.home .gb-element-7ee6ee70 img',
    '.home .gb-element-2a2826e4 > *',
    '.gbp-card',
    '.mm-tcard',
    '.eli-home-blog-header',
    '.eli-home-blog-card',
    '.mm-cta',
    '.mm-entorno-head',
    '.mm-entorno-acc-item',
    '.site-footer .gb-element-95cc6b71 > *'
  ].join(',');

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      var el = e.target;
      io.unobserve(el);
      el.classList.add('is-in');
      // al terminar se quitan las clases para devolver a cada tarjeta sus transiciones de hover
      w.setTimeout(function () { el.classList.remove('mm-reveal', 'is-in'); el.style.removeProperty('--mm-i'); }, 1600);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.1 });

  var fold = w.innerHeight * 0.9;
  var seen = [];

  Array.prototype.forEach.call(d.querySelectorAll(targets), function (el) {
    if (el.closest('.gb-element-84a45700')) return;       // el hero tiene su propia entrada
    if (el.getBoundingClientRect().top < fold) return;    // lo visible al cargar no se oculta
    var parent = el.parentElement;
    var i = 0;
    for (var k = seen.length - 1; k >= 0; k--) {
      if (seen[k].parentElement === parent) { i = Math.min((seen[k]._mmI || 0) + 1, 5); break; }
    }
    el._mmI = i;
    seen.push(el);
    el.style.setProperty('--mm-i', i);
    el.classList.add('mm-reveal');
    io.observe(el);
  });
})();
