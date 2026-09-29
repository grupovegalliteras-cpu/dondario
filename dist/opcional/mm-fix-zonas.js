/*!
 * OPCIONAL (requiere aprobación del cliente). No forma parte de la capa visual.
 *
 * Bloque "Zonas donde trabajamos en Mallorca": hoy en la web publicada
 *  - los apartados "Servicios principales" y "Contacto directo" no se pueden abrir, y
 *  - los botones "Abrir" llaman a mmGo(), que no existe → no llevan a ninguna parte.
 * Este script restaura el comportamiento previsto SIN cambiar el HTML: mismos destinos
 * (los que ya están codificados en data-u) y los enlaces siguen sin ser <a> (igual que ahora).
 * Si el script original del bloque se recupera, eliminar este archivo.
 */
(function () {
  'use strict';
  if (window.mmZonasFix) return;
  window.mmZonasFix = true;

  if (typeof window.mmGo !== 'function') {
    window.mmGo = function (el) {
      var u = el && el.getAttribute('data-u');
      if (!u) return;
      try { u = window.atob(u); } catch (e) { return; }
      // Solo destinos propios o WhatsApp
      if (/^https:\/\/wa\.me\//.test(u)) window.open(u, '_blank', 'noopener');
      else if (/^https:\/\/multiserviciosmallorca\.es\//.test(u)) window.location.href = u;
    };
  }

  function sync(item) {
    var h = item.querySelector('.mm-entorno-acc-header');
    if (h) h.setAttribute('aria-expanded', item.classList.contains('is-open') ? 'true' : 'false');
  }

  document.querySelectorAll('.mm-entorno-acc-item').forEach(sync);

  document.addEventListener('click', function (e) {
    var h = e.target.closest && e.target.closest('.mm-entorno-acc-header');
    if (!h) return;
    var item = h.closest('.mm-entorno-acc-item');
    if (!item) return;
    item.classList.toggle('is-open');
    sync(item);
  });

  // Los botones "Abrir" son <span>: se hacen accesibles con teclado
  document.querySelectorAll('.mm-entorno-btn[data-u]').forEach(function (b) {
    b.setAttribute('role', 'link');
    b.setAttribute('tabindex', '0');
    b.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); window.mmGo(b); }
    });
  });
})();
