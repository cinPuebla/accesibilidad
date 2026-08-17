# accesibilidad

Widget de accesibilidad web (lector de voz, alto contraste, escala de grises, fuente para dislexia, tamaño de texto y guía de lectura). Vanilla JS + CSS, sin dependencias, sin build.

## Uso

Incluir los dos archivos en cualquier página HTML:

```html
<link rel="stylesheet" href="accesibilidad.css">
<script src="accesibilidad.js" defer></script>
```

El widget se auto-inicializa: agrega un botón flotante y su panel al `<body>`.

### Vía CDN (apuntando a una versión fija)

Una vez publicado el repo en GitHub, se puede consumir sin descargar nada, apuntando siempre a un tag de versión (nunca a `main`, para no romper producción si se actualiza la librería):

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/<usuario>/accesibilidad@v1.0.0/accesibilidad.css">
<script src="https://cdn.jsdelivr.net/gh/<usuario>/accesibilidad@v1.0.0/accesibilidad.js" defer></script>
```

## Versionado

Este proyecto usa [Versionado Semántico](https://semver.org/lang/es/) (`MAJOR.MINOR.PATCH`):

- **MAJOR**: cambios que rompen compatibilidad (ej. se renombra un ID/clase que otros proyectos ya usan).
- **MINOR**: nueva funcionalidad compatible con lo anterior.
- **PATCH**: corrección de bugs, sin cambios de comportamiento.

Cada versión publicada queda marcada con un tag de git (`v1.0.0`, `v1.1.0`, ...) y documentada en [CHANGELOG.md](CHANGELOG.md).

## Cómo publicar una nueva versión

1. Hacer los cambios y commitear normalmente.
2. Actualizar [CHANGELOG.md](CHANGELOG.md) con lo que cambió.
3. Crear el tag correspondiente:
   ```bash
   git tag -a v1.1.0 -m "v1.1.0"
   git push origin main --tags
   ```
4. Los proyectos que consumen la librería actualizan la versión en su URL de CDN cuando quieran adoptar los cambios.

## Licencia

MIT — ver [LICENSE](LICENSE).
