#!/usr/bin/env bash
# Fragt ElevenLabs-Key und Voice-ID ab und trägt sie in ~/.zshrc ein.
# Die Eingabe ist unsichtbar; die Werte landen nicht im Chat und nicht im Repo.
set -euo pipefail

ZSHRC="$HOME/.zshrc"
touch "$ZSHRC"

read -r -s -p "ElevenLabs API-Key (wird nicht angezeigt): " api_key
echo
read -r -p "ElevenLabs Voice-ID: " voice_id
read -r -s -p "Anthropic API-Key (wird nicht angezeigt, leer = nicht ändern): " anthropic_key
echo

if [ -z "$api_key" ] || [ -z "$voice_id" ]; then
  echo "Key oder Voice-ID ist leer. Nichts geändert." >&2
  exit 1
fi

# Alte Einträge entfernen, damit keine Duplikate entstehen
sed -i '' '/^export ELEVENLABS_API_KEY=/d; /^export ELEVENLABS_VOICE_ID=/d' "$ZSHRC"
if [ -n "$anthropic_key" ]; then
  sed -i '' '/^export ANTHROPIC_API_KEY=/d' "$ZSHRC"
fi

{
  echo ""
  echo "# Learntok-Pipeline"
  printf 'export ELEVENLABS_API_KEY="%s"\n' "$api_key"
  printf 'export ELEVENLABS_VOICE_ID="%s"\n' "$voice_id"
  if [ -n "$anthropic_key" ]; then
    printf 'export ANTHROPIC_API_KEY="%s"\n' "$anthropic_key"
  fi
} >> "$ZSHRC"

echo "Gespeichert in $ZSHRC. Öffne jetzt einen neuen Terminal-Tab."
