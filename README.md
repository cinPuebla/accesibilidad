# accesibilidad web

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
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/cinPuebla/accesibilidad@v1.0.0/accesibilidad.css">
<script src="https://cdn.jsdelivr.net/gh/cinPuebla/accesibilidad@v1.0.0/accesibilidad.js" defer></script>
```

Los archivos ya listos para copiar al servidor (`accesibilidad.php`,
`accesibilidad-loader.js` y su propio manual de consumo) están en
[servidor-includes/](servidor-includes/).

### Sitios PHP con muchos `index.php` en subcarpetas

Si el sitio tiene muchos `index.php` repartidos en varias subcarpetas (tipo
"árbol de navidad"), evita pegar el `<link>`/`<script>` a mano en cada
archivo — en su lugar, centraliza el include en un solo lugar:

1. Crear `includes/accesibilidad.php` en el servidor con:

   ```php
   <?php
   define('ACCESIBILIDAD_VERSION', 'v1.0.0');
   $accesibilidad_base = 'https://cdn.jsdelivr.net/gh/cinPuebla/accesibilidad@' . ACCESIBILIDAD_VERSION;
   ?>
   <link rel="stylesheet" href="<?php echo $accesibilidad_base; ?>/accesibilidad.css">
   <script src="<?php echo $accesibilidad_base; ?>/accesibilidad.js" defer></script>
   ```

2. En cada `index.php`, sin importar en qué subcarpeta esté, agregar una sola
   línea usando ruta absoluta desde `DOCUMENT_ROOT` (así no se rompe por la
   profundidad de la carpeta):

   ```php
   <!-- Widget de accesibilidad (cinPuebla/accesibilidad) -->
   <?php include $_SERVER['DOCUMENT_ROOT'] . '/includes/accesibilidad.php'; ?>
   ```

3. Ese archivo se sube a `/var/www/html/includes/accesibilidad.php` una sola
   vez (por FTP/SCP o como se suba el resto del sitio, tal como en la
   captura de `/var/www/html/includes/`). Ningún `index.php` se vuelve a
   tocar después de este paso.

No se recomienda apuntar a `@latest` en el CDN: un cambio breaking en el
widget se propagaría a todo el sitio sin aviso. Mejor versión fija y
actualizarla deliberadamente (ver [Mantenimiento del include con git (solo
desarrollador)](#mantenimiento-del-include-con-git-solo-desarrollador) más
abajo si se quiere manejar con git).

### Sitios HTML puro (sin PHP)

Si algunas páginas son `.html` estático (no `.php`), el `<?php include ?>`
del caso anterior no se ejecuta — Apache no procesa PHP dentro de un `.html`
a menos que se reconfigure el servidor para eso. Para estos casos, el mismo
patrón de "un solo archivo centralizado" se logra con un loader JS:

1. Crear `includes/accesibilidad-loader.js` en el servidor con:

   ```js
   (function () {
     var VERSION = 'v1.0.0';
     var base = 'https://cdn.jsdelivr.net/gh/cinPuebla/accesibilidad@' + VERSION;

     var link = document.createElement('link');
     link.rel = 'stylesheet';
     link.href = base + '/accesibilidad.css';
     document.head.appendChild(link);

     var script = document.createElement('script');
     script.src = base + '/accesibilidad.js';
     script.defer = true;
     document.head.appendChild(script);
   })();
   ```

2. En cada `.html`, dentro de `<head>`, agregar una sola línea (ruta absoluta,
   funciona sin importar la profundidad de la carpeta):

   ```html
   <!-- Widget de accesibilidad (cinPuebla/accesibilidad) -->
   <script src="/includes/accesibilidad-loader.js" defer></script>
   ```

3. Ese archivo se sube a `/var/www/html/includes/accesibilidad-loader.js` una
   sola vez, igual que `accesibilidad.php`. Ningún `.html` se vuelve a tocar
   después de este paso.

Si un sitio mezcla `.php` y `.html`, ambos loaders (`accesibilidad.php` y
`accesibilidad-loader.js`) pueden vivir juntos en `/var/www/html/includes/` —
cada página usa el que le corresponda según su extensión.

### Mantenimiento del include con git (solo desarrollador)

Lo anterior es todo lo que necesita quien solo **consume** el widget en su
sitio: crear los archivos una vez y listo, sin git de por medio. Esta
sección es solo para el desarrollador que **mantiene** el contenido de
`includes/accesibilidad.php` / `includes/accesibilidad-loader.js` (por
ejemplo, para subir de versión sin tener que entrar por FTP cada vez).

Se puede llevar `/var/www/html/includes/` como su propio repo git,
separado del código del sitio:

```bash
# primera vez
cd /var/www/html
git clone <url-del-repo-includes> includes

# para actualizar versión del widget
cd /var/www/html/includes
# editar ACCESIBILIDAD_VERSION / VERSION, commitear, git push
git pull
```

Con esto, para subir de versión solo se edita la constante correspondiente
en un archivo y se hace `git pull` en el servidor — ninguna página del
sitio se vuelve a tocar.

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
