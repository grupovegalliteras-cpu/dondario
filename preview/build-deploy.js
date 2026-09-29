// Genera ../deploy/: vista previa estática para Vercel (antes / después) sin afectar a la web real.
// - noindex (meta + cabecera + robots.txt) para no crear contenido duplicado en Google
// - sin Google Analytics del cliente (las visitas de la demo no ensucian sus datos)
// - enlaces relativos del sitio → web real (en Vercel darían 404)
const fs = require('fs'), path = require('path');
require('./build.js');

const root = path.join(__dirname, '..');
const out = path.join(root, 'deploy');
fs.rmSync(out, { recursive: true, force: true });

const copy = (from, to) => fs.cpSync(path.join(root, from), path.join(out, to), { recursive: true });
copy('dist/mm-visual.css', 'dist/mm-visual.css');
copy('dist/mm-visual.js', 'dist/mm-visual.js');
copy('dist/media', 'dist/media');
copy('preview/wp-content', 'wp-content');
copy('preview/movimiento.css', 'preview/movimiento.css');

const LIVE = 'https://multiserviciosmallorca.es';
function clean(html, label) {
  return html
    // Google Analytics / gtag del cliente
    .replace(/<script[^>]*googletagmanager\.com\/gtag[^>]*><\/script>/g, '')
    .replace(/<script[^>]*>[^<]*gtag\([\s\S]*?<\/script>/g, '')
    // robots: noindex (se sustituye el meta existente si lo hay)
    .replace(/<meta name=['"]robots['"][^>]*>/g, '')
    .replace('<head>', `<head>\n<meta name="robots" content="noindex, nofollow">`)
    // enlaces relativos del sitio → web real
    .replace(/href="\/(?!dist\/|wp-content\/|preview\/)([^"]*)"/g, `href="${LIVE}/$1"`)
    .replace(/<title>/, `<title>[${label}] `);
}

const pages = { 'index.html': 'Nueva', 'movimiento.html': 'Nueva · con movimiento', 'antes.html': 'Actual' };
for (const [f, label] of Object.entries(pages)) {
  fs.writeFileSync(path.join(out, f), clean(fs.readFileSync(path.join(__dirname, f), 'utf8'), label));
}

fs.writeFileSync(path.join(out, 'robots.txt'), 'User-agent: *\nDisallow: /\n');
fs.writeFileSync(path.join(out, 'vercel.json'), JSON.stringify({
  cleanUrls: true,
  headers: [{ source: '/(.*)', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] }]
}, null, 2));

console.log('deploy/ listo');
