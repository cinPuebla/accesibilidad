<?php
/**
 * Widget de accesibilidad (cinPuebla/accesibilidad)
 *
 * Include unico para todo el sitio. Cualquier index.php, sin importar
 * en que subcarpeta este, lo llama con ruta absoluta desde DOCUMENT_ROOT
 * para no depender de cuantos niveles de carpeta tenga cada pagina:
 *
 *   <?php include $_SERVER['DOCUMENT_ROOT'] . '/includes/accesibilidad.php'; ?>
 *
 * Para actualizar version: cambiar la constante ACCESIBILIDAD_VERSION
 * de este archivo (ver README.md de esta carpeta). No hay que tocar
 * ningun index.php.
 */

define('ACCESIBILIDAD_VERSION', 'v1.0.0');
$accesibilidad_base = 'https://cdn.jsdelivr.net/gh/cinPuebla/accesibilidad@' . ACCESIBILIDAD_VERSION;
?>
<!-- Widget de accesibilidad (cinPuebla/accesibilidad) -->
<link rel="stylesheet" href="<?php echo $accesibilidad_base; ?>/accesibilidad.css">
<!-- Widget de accesibilidad (cinPuebla/accesibilidad) -->
<script src="<?php echo $accesibilidad_base; ?>/accesibilidad.js" defer></script>
