#!/usr/bin/env bash
# Συμπίεση εικόνων για kiosk (macOS sips).
#   npm run compress:images       — όλα τα JPG (max 1400px)
#   npm run compress:images:menu  — menu cards + logo (πιο επιθετικό)
#   npm run compress:images:eco   — νέες eco κάρτες (max 1200px, quality 72)
set -euo pipefail

DIR="$(cd "$(dirname "$0")/../src/assets/images" && pwd)"
TARGET="${1:-all}"

compress_jpg() {
  local f="$1"
  local max_edge="$2"
  local quality="$3"
  local before after tmp
  before=$(stat -f%z "$f")
  tmp="${f}.tmp.jpg"
  sips -Z "$max_edge" -s format jpeg -s formatOptions "$quality" "$f" --out "$tmp" >/dev/null
  mv "$tmp" "$f"
  after=$(stat -f%z "$f")
  printf '%s  %s → %s\n' "$(basename "$f")" "$(numfmt --to=iec-i --suffix=B "$before" 2>/dev/null || echo "${before}B")" "$(numfmt --to=iec-i --suffix=B "$after" 2>/dev/null || echo "${after}B")"
}

if [ "$TARGET" = "eco" ]; then
  echo "Compressing Eco Speed images in $DIR (max 1200px, quality 72)…"
  for name in eco-forest-trash.jpg eco-reusable-bags.jpg eco-solar-energy.jpg eco-rechargeable-batteries.jpg; do
    [ -f "$DIR/$name" ] && compress_jpg "$DIR/$name" 1200 72
  done
elif [ "$TARGET" = "menu" ]; then
  echo "Compressing menu images in $DIR (max 1024px, quality 72)…"
  for name in menu-connect.jpg menu-match.jpg menu-eco-speed.jpg; do
    compress_jpg "$DIR/$name" 1024 72
  done
  if [ -f "$DIR/break-even-logo.png" ]; then
    before=$(stat -f%z "$DIR/break-even-logo.png")
    sips -Z 480 -s format png "$DIR/break-even-logo.png" --out "$DIR/break-even-logo.tmp.png" >/dev/null
    mv "$DIR/break-even-logo.tmp.png" "$DIR/break-even-logo.png"
    after=$(stat -f%z "$DIR/break-even-logo.png")
    printf '%s  %s → %s\n' "break-even-logo.png" "$(numfmt --to=iec-i --suffix=B "$before" 2>/dev/null || echo "${before}B")" "$(numfmt --to=iec-i --suffix=B "$after" 2>/dev/null || echo "${after}B")"
  fi
else
  MAX_EDGE="${MAX_EDGE:-1400}"
  QUALITY="${QUALITY:-78}"
  echo "Compressing JPGs in $DIR (max ${MAX_EDGE}px, quality ${QUALITY})…"
  for f in "$DIR"/*.jpg "$DIR"/*.jpeg "$DIR"/*.JPG; do
    [ -f "$f" ] || continue
    compress_jpg "$f" "$MAX_EDGE" "$QUALITY"
  done
fi

echo "Done. Total: $(du -sh "$DIR" | cut -f1)"
