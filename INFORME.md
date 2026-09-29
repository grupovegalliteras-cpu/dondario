# Multiservicios Mallorca: informe de mejora visual

**Web:** https://multiserviciosmallorca.es/ · **Versión de la capa:** 1.0.0 · **Fecha:** 29/09/2026

## Resumen

Hemos añadido una **capa visual independiente** (1 CSS de 7,6 KB gzip + 1 JS de 2,6 KB gzip, sin librerías) que se instala sin editar páginas, bloques ni tema, y se retira borrando un archivo.

**Se mantiene intacto, verificado automáticamente** (comparando el DOM de antes y después, con el JS ya ejecutado):

| Elemento | Resultado |
|---|---|
| `<title>`, metadatos, canonical | Idénticos |
| Schema (JSON-LD) | Idéntico |
| 74 enlaces (destino y texto) | Idénticos |
| 14 encabezados H1–H4 | Idénticos |
| Textos de la página | Idénticos (solo "Empresa de" se *muestra* en mayúsculas mediante CSS; el HTML no cambia) |
| Formularios, WhatsApp, teléfonos, `onclick` | Idénticos |
| Paleta y logo | Sin cambios: negro `#12141a`, amarillo `#F8E101` y los acentos existentes |

## 1. Hero de la portada (referencia: Suvicar)

- **Vídeo a pantalla completa** en loop de 15 s, en MP4 H.264 (1,7 MB) y WebM VP9 (1,5 MB), con `autoplay muted loop playsinline`.
- **Montado con fotos propias de la web del cliente** (electricista, fachada SATE en Mallorca, fontanero, acabados, villa al atardecer, equipo y vistas al mar), con zoom lento y fundidos. No se ha usado material de stock. El loop no tiene salto.
- **Overlay en degradado**, oscuro a la izquierda y abajo y más transparente arriba a la derecha, para que el texto sea legible sobre cualquier fotograma.
- **Mismo H1, subtítulo y CTA de WhatsApp.** Solo cambia la presentación: H1 más grande (hasta 100 px) en Outfit, "Empresa de" como antetítulo con línea amarilla, y el CTA dentro de una cápsula translúcida.
- **Microanimaciones de entrada:** aparición con desplazamiento, escalonada entre elementos.
- **Indicador de scroll** animado y **botón de pausa** del vídeo (accesibilidad, WCAG 2.2.2).
- **Transición curva** hacia la siguiente sección.
- **Rendimiento:**
  - El póster (51 KB) se precarga y es el LCP.
  - El vídeo solo se descarga en escritorio, después de que la página termine de cargar, y se pausa fuera de pantalla.
  - No se carga en móvil, con "ahorro de datos", en conexiones 2G ni con "reducir movimiento" activado.
- **Móvil:** se usa un póster vertical propio de 30 KB en lugar del vídeo. Las 2 fotos decorativas del hero se ocultan por debajo de 1024 px: tienen `alt` vacío, así que no afecta al SEO, y el fondo ya enseña los trabajos. Para mostrarlas, borrar una regla en la sección 3 del CSS.

## 2. Animaciones y dinamización

- **Aparición progresiva al hacer scroll** (Intersection Observer) en etiquetas, títulos H2, tarjetas de servicios, testimonios, artículos, CTA final, zonas y columnas del footer. Es sutil (28 px y fundido) y escalonada.
- Lo que ya se ve al cargar nunca se oculta, así que no hay parpadeos.
- Con "reducir movimiento" activado no hay animaciones ni vídeo.
- **Hover:**
  - Tarjetas de servicios: elevación, sombra, línea amarilla inferior e icono que pasa a amarillo.
  - Testimonios y artículos: elevación. En los artículos, además, zoom de la imagen.
  - Filas de zonas: elevación y botón amarillo.
  - Fotos del bloque "Hola !!": zoom suave.

## 3. Refinamiento visual general

- **Tipografía corporativa restaurada.** Albert Sans y Outfit **no se estaban cargando** porque el CSS de fuentes se pide por `http://` y el navegador lo bloquea. La web se veía con la fuente del sistema. La capa las declara por `https` con precarga.
- **Jerarquía de títulos:**
  - H2 fluidos de 28 a 44 px, con interlineado ajustado.
  - Etiquetas de sección como "píldora" con punto amarillo.
  - Párrafos con interlineado de 1,7.
- **Espaciado:** secciones de 80 a 144 px según pantalla, con esquinas redondeadas y sombras suaves en capas.
- **Iconos:**
  - Los 4 iconos de servicios, que antes tenían 4 colores distintos, ahora comparten color, tamaño y fondo.
  - Los caracteres ▦ ▾ del bloque de zonas se sustituyen visualmente por iconos SVG de trazo uniforme.
  - Los iconos del footer estaban vacíos (Font Awesome no está cargado) y ahora se dibujan en SVG.
- **Testimonios:** tarjetas con acento amarillo, comilla corporativa y avatar negro y amarillo. En móvil pasan a **carrusel deslizable** con la siguiente tarjeta asomando. Los textos no cambian.
- **Zonas de trabajo:**
  - Cabecera oscura de marca.
  - Acordeón con iconos por apartado.
  - Filas en rejilla en escritorio y compactas en móvil.
- **Blog:** el bloque arrastraba el azul y la fuente de otra plantilla, ajena a la paleta. Se ha alineado con la paleta y la tipografía de la marca.
- **CTA final y footer:**
  - Tarjeta con halo amarillo y título más grande. Mismos botones, enlaces y colores de botón.
  - Enlaces del footer con subrayado animado y filete amarillo superior.
- Se corrige el **scroll horizontal** que hoy provoca la caja del CTA en escritorio.

## 4. Incidencias detectadas en la web actual (NO corregidas: fuera del alcance visual)

Recomendamos revisarlas con el cliente. Algunas afectan directamente a la captación.

| Prioridad | Incidencia | Dónde |
|---|---|---|
| 🔴 Alta | El botón **"Solicitar por WhatsApp" del CTA final apunta a `wa.me/34607688660`**, mientras que el teléfono real es 607 88 66 60. Los dígitos están cambiados, así que **esos leads se pierden**. | CTA antes de "Zonas" |
| 🔴 Alta | **"Zonas donde trabajamos":** "Servicios principales" y "Contacto directo" no se abren, y **todos los botones "Abrir" no hacen nada** porque `mmGo()` no existe. Afecta a los enlaces a Palma, Calvià, Marratxí, Llucmajor, Inca y Manacor, a los servicios y a WhatsApp. Incluimos una **corrección opcional** (`dist/opcional/mm-fix-zonas.js`), desactivada por defecto. | Home |
| 🟠 Media | "Ver servicios" enlaza a `/servicios`, que da **404**. | CTA final |
| 🟠 Media | Enlaces vacíos (`href=""`) que recargan la página: el icono de WhatsApp del hero y el botón "Ver cómo trabajamos". El botón "Contacto" del menú móvil apunta a `#`. | Hero, bloque "Hola !!", menú móvil |
| 🟠 Media | El CSS de fuentes de GeneratePress se sirve por `http://` (mixed content). La capa lo compensa, pero la causa raíz es la URL del sitio o de la caché de fuentes. Revisar Ajustes → Generales y regenerar el CSS de GeneratePress. | Todo el sitio |
| 🟡 Baja | Footer: "© 2026 sea visible en todas partes" (texto de plantilla). | Footer |
| 🟡 Baja | Bloque del blog con `aria-label="Artículos del blog de Clínica Dental Angela Pla"` (heredado de otro proyecto). | Home |
| 🟡 Baja | El logo es JPG con un recuadro de fondo visible sobre la cabecera. Recomendamos PNG o SVG con transparencia. | Cabecera |
| 🟡 Baja | Imágenes por debajo de 800 px mostradas grandes en páginas de servicio (p. ej. `SATE-para-la-rehabilitacion-de-fachadas.jpg` de 697 px, `instaladores-*.jpg` de unos 700 px, `cortinas.jpg` e `interiorista.jpg` de 640 px). La foto del hero de la home es una versión de 768 px. Si existen los originales, sustituirlos con el mismo nombre y encuadre. | Varias |

## 5. Vídeo: sustitución por material real (recomendado)

El vídeo actual es un montaje de fotos. Cuando el cliente tenga clips propios:

- **Qué grabar:** 6–8 planos de unos 3 s. Manos trabajando, equipo en obra o en fachada, antes y después, furgoneta o equipo llegando. Luz natural y cámara estable. Formato horizontal 16:9, sujeto principal en la mitad derecha, porque el texto va a la izquierda.
- **Codificación** (≤ 3 MB), manteniendo los mismos nombres:
  ```bash
  ffmpeg -i montaje.mp4 -an -vf "scale=1280:-2,fps=30" -c:v libx264 -profile:v high -crf 27 -maxrate 1600k -bufsize 3200k -preset veryslow -movflags +faststart mm-hero.mp4
  ffmpeg -i montaje.mp4 -an -vf "scale=1280:-2,fps=30" -c:v libvpx-vp9 -b:v 0 -crf 40 -row-mt 1 mm-hero.webm
  ffmpeg -i mm-hero.mp4 -frames:v 1 -c:v libwebp -quality 72 mm-hero-poster.webp
  ```

## 6. Verificación realizada

- Probado a 1440, 820 y 390 px, con y sin "reducir movimiento".
- Sin scroll horizontal y sin errores de consola nuevos.
- **CLS ≈ 0,001** (umbral "bueno" < 0,1). LCP = póster precargado del hero.
- Acordeón, enlaces y CTAs: mismo comportamiento que la web publicada.
