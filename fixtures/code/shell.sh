#!/usr/bin/env bash
# Install the Fovea Ghostty themes and enable light/dark switching.
set -euo pipefail

readonly CONFIG_DIR="${XDG_CONFIG_HOME:-$HOME/.config}/ghostty"
readonly THEMES_DIR="$CONFIG_DIR/themes"
source_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/themes"

log() {
  printf '\033[1m==>\033[0m %s\n' "$*"
}

install_themes() {
  local count=0
  mkdir -p "$THEMES_DIR"
  for theme in "$source_dir"/Fovea*; do
    [[ -f "$theme" ]] || continue
    cp "$theme" "$THEMES_DIR/"
    count=$((count + 1))
  done
  log "Copied $count themes to $THEMES_DIR"
}

if [[ ! -d "$source_dir" ]]; then
  echo "error: no themes found in $source_dir" >&2
  exit 1
fi

install_themes

if ! grep -q '^theme *=' "$CONFIG_DIR/config" 2>/dev/null; then
  cat >> "$CONFIG_DIR/config" <<'EOF'
theme = light:Fovea Day,dark:Fovea Dusk
EOF
  log "Enabled automatic light/dark switching"
else
  log "Config already sets a theme; leaving it unchanged"
fi
