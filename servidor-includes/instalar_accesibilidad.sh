#!/bin/bash
#
# Inserta la linea del widget de accesibilidad en todos los .php y .html
# de un sitio, justo antes de </head>. No duplica si ya existe (busca el
# marcador ACCESIBILIDAD:START). Hace backup de cada archivo tocado antes
# de modificarlo, para poder revertir con revertir_accesibilidad.sh.
#
# Uso:
#   ./instalar_accesibilidad.sh /var/www/html/2019          # aplica cambios
#   ./instalar_accesibilidad.sh /var/www/html/2019 --dry-run  # solo lista, no toca nada
#
# Requisito previo: que existan
#   /var/www/html/includes/accesibilidad.php
#   /var/www/html/includes/accesibilidad-loader.js
# (ver README.md de esta carpeta).

set -euo pipefail

ROOT="${1:-}"
DRY_RUN="${2:-}"
MARCADOR_INICIO="<!-- ACCESIBILIDAD:START -->"
MARCADOR_FIN="<!-- ACCESIBILIDAD:END -->"
STAMP=$(date +%Y%m%d%H%M%S)

if [ -z "$ROOT" ] || [ ! -d "$ROOT" ]; then
  echo "Uso: $0 /ruta/al/sitio [--dry-run]"
  exit 1
fi

SNIPPET_PHP="${MARCADOR_INICIO}
<?php include \$_SERVER['DOCUMENT_ROOT'] . '/includes/accesibilidad.php'; ?>
${MARCADOR_FIN}"

SNIPPET_HTML="${MARCADOR_INICIO}
<script src=\"/includes/accesibilidad-loader.js\" defer></script>
${MARCADOR_FIN}"

procesar_archivo () {
  local archivo="$1"
  local snippet="$2"

  if grep -qF "$MARCADOR_INICIO" "$archivo"; then
    echo "  ya tiene el widget, se omite: $archivo"
    return
  fi

  if ! grep -qi '</head>' "$archivo"; then
    echo "  sin </head>, se omite (revisar a mano): $archivo"
    return
  fi

  if [ "$DRY_RUN" = "--dry-run" ]; then
    echo "  [dry-run] se insertaria en: $archivo"
    return
  fi

  cp "$archivo" "${archivo}.bak.acc-${STAMP}"

  awk -v snippet="$snippet" '
    BEGIN { done = 0 }
    {
      if (!done && tolower($0) ~ /<\/head>/) {
        print snippet
        done = 1
      }
      print
    }
  ' "$archivo" > "${archivo}.tmp.acc" && mv "${archivo}.tmp.acc" "$archivo"

  echo "  actualizado: $archivo (backup: ${archivo}.bak.acc-${STAMP})"
}

echo "Buscando .php en $ROOT ..."
while IFS= read -r -d '' archivo; do
  procesar_archivo "$archivo" "$SNIPPET_PHP"
done < <(find "$ROOT" -type f -name '*.php' -print0)

echo "Buscando .html en $ROOT ..."
while IFS= read -r -d '' archivo; do
  procesar_archivo "$archivo" "$SNIPPET_HTML"
done < <(find "$ROOT" -type f -name '*.html' -print0)

echo "Listo."
