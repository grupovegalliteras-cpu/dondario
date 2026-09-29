// Servidor estático mínimo para la vista previa (sin dependencias)
const http = require('http'), fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..'), port = process.env.PORT || 5178;
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.mp4': 'video/mp4', '.webm': 'video/webm', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' };
http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p === '/') p = '/preview/index.html';
  if (p === '/antes') p = '/preview/antes.html';
  if (p === '/movimiento') p = '/preview/movimiento.html';
  if (p.startsWith('/wp-content/')) p = '/preview' + p; // espejo local de las fuentes
  const f = path.normalize(path.join(root, p));
  if (!f.startsWith(root) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end('404'); }
  const size = fs.statSync(f).size, type = types[path.extname(f)] || 'application/octet-stream';
  const range = req.headers.range;
  if (range) { // necesario para <video>
    const [s, e] = range.replace('bytes=', '').split('-'); const start = +s, end = e ? +e : size - 1;
    res.writeHead(206, { 'Content-Range': `bytes ${start}-${end}/${size}`, 'Accept-Ranges': 'bytes', 'Content-Length': end - start + 1, 'Content-Type': type });
    return fs.createReadStream(f, { start, end }).pipe(res);
  }
  res.writeHead(200, { 'Content-Type': type, 'Content-Length': size, 'Accept-Ranges': 'bytes', 'Cache-Control': 'no-cache' });
  fs.createReadStream(f).pipe(res);
}).listen(port, () => console.log(`Vista previa: http://localhost:${port}/  (original: /antes)`));
