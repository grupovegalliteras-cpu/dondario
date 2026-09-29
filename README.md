# Multiservicios Mallorca · Capa visual

Mejora visual de https://multiserviciosmallorca.es/ sin tocar contenido, enlaces ni SEO.

- `INFORME.md`: informe de cambios para el cliente (incluye incidencias detectadas en la web actual).
- `dist/`: lo que se sube al servidor (CSS, JS, vídeo y pósters). `dist/opcional/` solo con aprobación del cliente.
- `wordpress/`: loader (mu-plugin) e instrucciones de instalación y de marcha atrás.
- `preview/`: vista previa local sobre una copia de la home actual.

## Vista previa

```bash
node preview/build.js && node preview/serve.js
```

- http://localhost:5178/ → home con la capa (respeta la preferencia "reducir movimiento" del sistema)
- http://localhost:5178/movimiento → igual, pero simulando un equipo sin "reducir movimiento" (vídeo y animaciones siempre)
- http://localhost:5178/antes → home actual sin cambios
