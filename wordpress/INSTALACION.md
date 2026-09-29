# Instalación en WordPress (≈10 min, reversible en 1 paso)

La web es WordPress 6.9 + GeneratePress 3.6 + GP Premium + GenerateBlocks. La capa visual se instala **sin tocar páginas, bloques ni el tema**: son 1 CSS, 1 JS, 4 archivos multimedia y un loader PHP.

## 1. Subir archivos (SFTP o Administrador de archivos del hosting)

| Origen (este paquete) | Destino en el servidor |
|---|---|
| `dist/mm-visual.css` | `/wp-content/uploads/mm-visual/mm-visual.css` |
| `dist/mm-visual.js` | `/wp-content/uploads/mm-visual/mm-visual.js` |
| `dist/media/*` (4 archivos) | `/wp-content/uploads/mm-visual/media/` |
| `dist/opcional/mm-fix-zonas.js` | `/wp-content/uploads/mm-visual/opcional/` (solo si el cliente lo aprueba) |
| `wordpress/mm-visual-loader.php` | `/wp-content/mu-plugins/mm-visual-loader.php` (crear la carpeta `mu-plugins` si no existe) |

> No subir los vídeos por la Biblioteca de medios: renombra archivos y genera tamaños. Usar SFTP.

Los *must-use plugins* se activan solos y no aparecen en Plugins → no se pueden desactivar por error.

## 2. Vaciar cachés

Vaciar la caché del plugin de caché / CDN si lo hay. Si hay un optimizador con "Retrasar JS" (WP Rocket, LiteSpeed…), no pasa nada: el vídeo y las animaciones arrancarán tras la primera interacción, y el contenido se ve siempre.

## 3. Comprobar (2 min)

- Portada en escritorio: el vídeo aparece sobre el póster y hace loop; botón de pausa arriba a la derecha.
- Portada en móvil: imagen fija vertical (sin vídeo).
- Consola del navegador sin errores nuevos.
- PageSpeed Insights de la portada: CLS ≈ 0, LCP = póster del hero.

## Alternativa sin FTP: GP Premium → Elementos → Hook

Si no hay acceso SFTP para el mu-plugin (los archivos de `dist/` siguen necesitando subirse):

- **Hook `wp_head`, prioridad 99, Mostrar en: Todo el sitio**
  ```html
  <link rel="preload" href="/wp-content/uploads/generatepress/fonts/albert-sans/i7dOIFdwYjGaAMFtZd_QA1ZbYFc.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="/wp-content/uploads/generatepress/fonts/outfit/QGYyz_MVcBeNP4NjuGObqx1XmO1I4deyC4S-EiAou6Y.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" id="mm-visual-css" href="/wp-content/uploads/mm-visual/mm-visual.css?ver=1.0.0">
  <script>window.mmVisual={media:"/wp-content/uploads/mm-visual/media/"};</script>
  <script src="/wp-content/uploads/mm-visual/mm-visual.js?ver=1.0.0" defer></script>
  ```
- **Hook `wp_head`, prioridad 1, Mostrar en: Portada**
  ```html
  <link rel="preload" href="/wp-content/uploads/mm-visual/media/mm-hero-poster.webp" as="image" media="(min-width: 768px)" fetchpriority="high">
  <link rel="preload" href="/wp-content/uploads/mm-visual/media/mm-hero-poster-mobile.webp" as="image" media="(max-width: 767px)" fetchpriority="high">
  ```

## Marcha atrás

Borrar `/wp-content/mu-plugins/mm-visual-loader.php` (o los dos Hooks) y vaciar caché. La web vuelve exactamente a su estado actual.

## Cambiar el vídeo por material real del cliente

Sustituir `media/mm-hero.mp4`, `mm-hero.webm` y `mm-hero-poster.webp` (mismos nombres) y subir `MM_VISUAL_VERSION` en el loader. Especificaciones y comandos en `INFORME.md` → "Vídeo".
