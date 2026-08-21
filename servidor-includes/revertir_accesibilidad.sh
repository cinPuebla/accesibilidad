#!/bin/bash
#
# Revierte lo que hizo instalar_accesibilidad.sh: quita el bloque
# ACCESIBILIDAD:START ... ACCESIBILIDAD:END de todos los .php/.html
# bajo la ruta indicada. No toca nada mas del archivo.
#
# Uso:
#   ./revertir_accesibilidad.sh /var/www/html/2019            # aplica cambios
#   ./revertir_accesibilidad.sh /var/www/html/2019 --dry-run   # solo lista, no toca nada
#
# Alternativa mas simple si los backups siguen ahi (archivo.bak.acc-*):
# en vez de este script, restaurar el .bak mas reciente de cada archivo:
#   for f in $(find /var/www/html -name '*.bak.acc-*'); do
#     original="${f%.bak.acc-*}"
#     cp "$f" "$original"
#   done

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

quitar_bloque () {
  local archivo="$1"

  if ! grep -qF "$MARCADOR_INICIO" "$archivo"; then
    return
  fi

  if [ "$DRY_RUN" = "--dry-run" ]; then
    echo "  [dry-run] se quitaria el bloque de: $archivo"
    return
  fi

  cp "$archivo" "${archivo}.bak.rev-${STAMP}"

  sed -i "/${MARCADOR_INICIO}/,/${MARCADOR_FIN}/d" "$archivo"

  echo "  revertido: $archivo (backup previo a revertir: ${archivo}.bak.rev-${STAMP})"
}

echo "Buscando .php/.html con el widget en $ROOT ..."
while IFS= read -r -d '' archivo; do
  quitar_bloque "$archivo"
done < <(find "$ROOT" -type f \( -name '*.php' -o -name '*.html' \) -print0)

echo "Listo."
