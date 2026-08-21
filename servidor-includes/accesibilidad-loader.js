/**
 * Loader del widget de accesibilidad (cinPuebla/accesibilidad) para
 * paginas HTML puras (sin PHP). Un solo <script> en cada .html apunta
 * a este archivo; para cambiar de version solo se edita VERSION aqui
 * (ver README.md de esta carpeta), nunca los .html.
 *
 * Uso en cada pagina, dentro de <head>:
 *   <script src="/includes/accesibilidad-loader.js" defer></script>
 */
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
