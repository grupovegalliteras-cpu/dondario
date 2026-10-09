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

// Variante /villa: prueba con el timelapse de reforma (dist/media-villa/). Solo cambia el material del hero.
// La villa está centrada en el clip: en escritorio panorámico se amplía el vídeo (122 %) anclado a la izquierda
// para llevar la casa a la mitad derecha, se ocultan las 2 fotos decorativas (la taparían) y se aclara el overlay a la derecha.
const H = '.home .entry-content>.gb-element-84a45700';
const villaFix = '<script>window.mmVisual={media:"/dist/media-villa/",mobileVideo:true};</script><style>' +
  H + '{background-image:url("/dist/media-villa/mm-hero-poster.webp");background-position:center}' +
  '.mm-hero-media video{object-position:center}' +
  H + ' .gb-element-0c29e940{display:none}' +
  H + '::before{background:linear-gradient(90deg,rgba(18,20,26,.84) 0%,rgba(18,20,26,.55) 38%,rgba(18,20,26,.06) 100%),' +
  'linear-gradient(180deg,rgba(18,20,26,.34) 0%,rgba(18,20,26,0) 30%,rgba(18,20,26,.7) 100%)}' +
  '@media (min-width:1025px) and (min-aspect-ratio:3/2){' + H + '{background-size:122% auto;background-position:left center}' +
  '.mm-hero-media video{width:122%;max-width:none;object-position:left center}}' +
  '@media (max-width:767px){' + H + '{background-image:url("/dist/media-villa/mm-hero-poster-mobile.webp")}' +
  H + '::before{background:linear-gradient(180deg,rgba(18,20,26,.3) 0%,rgba(18,20,26,.4) 35%,rgba(18,20,26,.82) 75%,rgba(18,20,26,.94) 100%)}}</style>';
const villa = motion.split('/dist/media/').join('/dist/media-villa/').replace('</head>', villaFix + '\n</head>');
fs.writeFileSync(path.join(__dirname, 'villa.html'), villa);
console.log('preview/index.html, movimiento.html y villa.html listos');
