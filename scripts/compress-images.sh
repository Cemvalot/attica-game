#!/usr/bin/env bash
# Συμπίεση εικόνων για kiosk (macOS sips). Τρέξε: npm run compress:images
set -euo pipefail

DIR="$(cd "$(dirname "$0")/../src/assets/images" && pwd)"
MAX_EDGE="${MAX_EDGE:-1400}"
QUALITY="${QUALITY:-78}"

echo "Compressing JPGs in $DIR (max ${MAX_EDGE}px, quality ${QUALITY})…"

for f in "$DIR"/*.jpg "$DIR"/*.jpeg "$DIR"/*.JPG; do
  [ -f "$f" ] || continue
  before=$(stat -f%z "$f")
  tmp="${f}.tmp.jpg"
  sips -Z "$MAX_EDGE" -s format jpeg -s formatOptions "$QUALITY" "$f" --out "$tmp" >/dev/null
  mv "$tmp" "$f"
  after=$(stat -f%z "$f")
  printf '%s  %s → %s\n' "$(basename "$f")" "$(numfmt --to=iec-i --suffix=B "$before" 2>/dev/null || echo "${before}B")" "$(numfmt --to=iec-i --suffix=B "$after" 2>/dev/null || echo "${after}B")"
done

echo "Done. Total: $(du -sh "$DIR" | cut -f1)"
