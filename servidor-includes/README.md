# includes/ — Widget de accesibilidad

Esta carpeta ya tiene los archivos `accesibilidad.php` y
`accesibilidad-loader.js` listos para usarse. No los edites ni los muevas —
solo agrega la línea correspondiente en tu página según su extensión.

## Páginas `.php`

En el `<head>` (o donde ya cargues otros `<link>`/`<script>`), agrega:

```php
<!-- Widget de accesibilidad (cinPuebla/accesibilidad) -->
<?php include $_SERVER['DOCUMENT_ROOT'] . '/includes/accesibilidad.php'; ?>
```

## Páginas `.html`

En el `<head>`, agrega:

```html
<!-- Widget de accesibilidad (cinPuebla/accesibilidad) -->
<script src="/includes/accesibilidad-loader.js" defer></script>
```

Eso es todo — el widget se auto-inicializa y agrega su botón flotante al
`<body>`. No hace falta descargar ni tocar nada más en esta carpeta.

## Agregar la línea a muchos archivos de golpe (opcional)

Si el sitio tiene muchos `.php`/`.html` regados en subcarpetas, en vez de
pegar la línea a mano en cada uno se pueden usar estos dos scripts (corridos
por SSH en el servidor):

```bash
# ver qué archivos se tocarían, sin cambiar nada todavía
./instalar_accesibilidad.sh /var/www/html --dry-run

# aplicar de verdad
./instalar_accesibilidad.sh /var/www/html
```

No duplica la línea si un archivo ya la tiene, y antes de tocar cada archivo
guarda una copia `archivo.bak.acc-<fecha>` junto al original.

Para deshacerlo (quita el bloque insertado de todos los archivos):

```bash
./revertir_accesibilidad.sh /var/www/html --dry-run   # ver qué se quitaría
./revertir_accesibilidad.sh /var/www/html              # aplicar
```

También se puede revertir restaurando a mano los `.bak.acc-<fecha>` que
dejó `instalar_accesibilidad.sh` (instrucción incluida como comentario
dentro de `revertir_accesibilidad.sh`).

## Actualizar la versión del widget

No hay que tocar ninguna página `.php`/`.html` del sitio, solo estos dos
archivos de esta misma carpeta:

1. Abrir `accesibilidad.php` y cambiar el valor de:
   ```php
   define('ACCESIBILIDAD_VERSION', 'v1.0.0');
   ```
2. Abrir `accesibilidad-loader.js` y cambiar el valor de:
   ```js
   var VERSION = 'v1.0.0';
   ```
3. Guardar ambos con el mismo número de versión (ej. `v1.1.0`) y listo — la
   próxima vez que se cargue cualquier página del sitio, ya toma la versión
   nueva del widget desde el CDN.
