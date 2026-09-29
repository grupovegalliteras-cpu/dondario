// Genera preview/index.html = copia de la home actual + capa visual (mismo snippet que en WordPress)
const fs = require('fs'), path = require('path');
// En producción el fonts.css de GeneratePress (http://) lo bloquea el navegador por mixed content;
// en localhost (http) no, y fallaría por CORS. Se quita para reproducir fielmente la web publicada.
const src = fs.readFileSync(path.join(__dirname, 'original.html'), 'utf8')
  .replace(/<link rel='stylesheet' id='generatepress-fonts-css'[^>]*>/, '');
fs.writeFileSync(path.join(__dirname, 'antes.html'), src);
const head = `
<!-- mm-visual (head) -->
<link rel="preload" href="/wp-content/uploads/generatepress/fonts/albert-sans/i7dOIFdwYjGaAMFtZd_QA1ZbYFc.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/wp-content/uploads/generatepress/fonts/outfit/QGYyz_MVcBeNP4NjuGObqx1XmO1I4deyC4S-EiAou6Y.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/dist/media/mm-hero-poster.webp" as="image" media="(min-width: 768px)" fetchpriority="high">
<link rel="preload" href="/dist/media/mm-hero-poster-mobile.webp" as="image" media="(max-width: 767px)" fetchpriority="high">
<link rel="stylesheet" id="mm-visual-css" href="/dist/mm-visual.css?v=${Date.now()}">
</head>`;
const foot = `<script src="/dist/mm-visual.js?v=${Date.now()}" id="mm-visual-js" defer></script>\n</body>`;
let out = src.replace('</head>', head).replace(/<\/body>(?![\s\S]*<\/body>)/, foot);
fs.writeFileSync(path.join(__dirname, 'index.html'), out);

// Variante /movimiento: simula un equipo SIN 'reducir movimiento' (para enseñar vídeo y animaciones
// aunque el sistema operativo tenga activada esa preferencia). Solo para la demo, no se instala.
const css = fs.readFileSync(path.join(__dirname, '../dist/mm-visual.css'), 'utf8')
  .split('@media (prefers-reduced-motion: no-preference)').join('@media all')
  .split('url("media/').join('url("/dist/media/');
fs.writeFileSync(path.join(__dirname, 'movimiento.css'), css);
const shim = '<script>(function(){var m=window.matchMedia;window.matchMedia=function(q){return /prefers-reduced-motion/.test(q)?{matches:false,media:q,addEventListener:function(){},removeEventListener:function(){}}:m.call(window,q)}})();</script>';
let motion = out.replace(/<link rel="stylesheet" id="mm-visual-css"[^>]*>/, '<link rel="stylesheet" id="mm-visual-css" href="/preview/movimiento.css?v=' + Date.now() + '">' + shim);
fs.writeFileSync(path.join(__dirname, 'movimiento.html'), motion);
console.log('preview/index.html y preview/movimiento.html listos');
