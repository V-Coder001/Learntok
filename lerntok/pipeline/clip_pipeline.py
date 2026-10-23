#!/usr/bin/env python3
"""Lernstoff (Textdatei) -> Hochformat-Video (1080x1920, Reels/TikTok-Stil).

Ablauf:
  1. Text einlesen
  2. Claude (claude-sonnet-5-5) teilt den Text in Segmente:
     Sprechtext, Stichpunkte, Quizfrage mit 4 Antworten (JSON)
  3. ElevenLabs erzeugt je Segment eine MP3 plus Wort-Zeitstempel
  4. Pillow rendert je Segment ein Bild, FFmpeg setzt Bild, Audio und
     Untertitel zusammen; danach folgt die Quizkarte
  5. Ausgabe: Ordner mit script.json, audio/ und clip.mp4

API-Schlüssel kommen nur aus Umgebungsvariablen:
  ANTHROPIC_API_KEY, ELEVENLABS_API_KEY, ELEVENLABS_VOICE_ID

Aufruf:
  python clip_pipeline.py beispiel.txt
  python clip_pipeline.py beispiel.txt --script output/alt/script.json  # Schritt 2 überspringen
"""
import argparse
import base64
import json
import os
import shutil
import subprocess
import sys
from datetime import datetime
from pathlib import Path

import anthropic
import requests
from PIL import Image, ImageDraw, ImageFont

WIDTH, HEIGHT = 1080, 1920
CLAUDE_MODEL = "claude-sonnet-5-5"
ELEVEN_MODEL = "eleven_multilingual_v2"
QUIZ_SECONDS = 8
SEGMENT_MIN_S, SEGMENT_MAX_S = 30, 60
SUB_FONT_SIZE = 76
SUB_BOTTOM_MARGIN = 420

FONT = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"
BG = (16, 24, 40)
ACCENT = (255, 196, 0)
TEXT = (255, 255, 255)
MUTED = (160, 172, 196)

VIDEO_ARGS = [
    "-c:v", "libx264", "-tune", "stillimage", "-pix_fmt", "yuv420p", "-r", "30",
    "-c:a", "aac", "-ar", "44100", "-ac", "2",
]

SCRIPT_PROMPT = """Du erstellst Lernvideos auf Deutsch. Teile den folgenden Lernstoff in Segmente.
Jedes Segment wird später vorgelesen und braucht 30 bis 60 Sekunden Sprechzeit,
also etwa 80 bis 150 Wörter Sprechtext.

Gib NUR JSON aus, ohne Erklärung, in genau dieser Form:
{"segmente": [
  {"titel": "kurzer Titel",
   "sprechtext": "zusammenhängender Text zum Vorlesen",
   "stichpunkte": ["3 bis 4 kurze Stichpunkte"],
   "quiz": {"frage": "...", "antworten": ["A", "B", "C", "D"], "loesung": 0}}
]}
"loesung" ist der Index (0 bis 3) der richtigen Antwort.

LERNSTOFF:
STOFF_PLATZHALTER
"""


# ---------- Schritt 2: Skript mit Claude erzeugen ----------

def parse_json(raw):
    """Holt das JSON-Objekt aus der Antwort, auch wenn Text drumherum steht."""
    start, end = raw.find("{"), raw.rfind("}")
    if start == -1 or end == -1:
        raise ValueError(f"Kein JSON in der Antwort gefunden:\n{raw[:500]}")
    return json.loads(raw[start:end + 1])


def validate_segments(segs):
    for i, seg in enumerate(segs, 1):
        for key in ("titel", "sprechtext", "stichpunkte", "quiz"):
            if key not in seg:
                raise ValueError(f"Segment {i}: Feld '{key}' fehlt")
        quiz = seg["quiz"]
        if len(quiz.get("antworten", [])) != 4:
            raise ValueError(f"Segment {i}: Quiz braucht genau 4 Antworten")
        if quiz.get("loesung") not in range(4):
            raise ValueError(f"Segment {i}: 'loesung' muss 0 bis 3 sein")
    return segs


def script_from_text(text):
    client = anthropic.Anthropic()  # liest ANTHROPIC_API_KEY aus der Umgebung
    msg = client.messages.create(
        model=CLAUDE_MODEL,
        max_tokens=8000,
        messages=[{"role": "user", "content": SCRIPT_PROMPT.replace("STOFF_PLATZHALTER", text)}],
    )
    raw = "".join(block.text for block in msg.content if block.type == "text")
    return validate_segments(parse_json(raw)["segmente"])


# ---------- Schritt 3: Stimme mit ElevenLabs ----------

def chars_to_words(alignment):
    """Fasst die Zeichen-Zeitstempel von ElevenLabs zu Wörtern zusammen."""
    words, current, start, end = [], "", None, None
    chars = alignment["characters"]
    starts = alignment["character_start_times_seconds"]
    ends = alignment["character_end_times_seconds"]
    for ch, s, e in zip(chars, starts, ends):
        if ch.isspace():
            if current:
                words.append({"wort": current, "start": start, "ende": end})
                current = ""
            continue
        if not current:
            start = s
        current += ch
        end = e
    if current:
        words.append({"wort": current, "start": start, "ende": end})
    return words


def tts_with_timestamps(text, voice_id, api_key):
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}/with-timestamps"
    resp = requests.post(
        url,
        params={"output_format": "mp3_44100_128"},
        headers={"xi-api-key": api_key},
        json={"text": text, "model_id": ELEVEN_MODEL},
        timeout=300,
    )
    if not resp.ok:
        # Die Fehlermeldung von ElevenLabs erklärt meist, was nicht passt
        raise RuntimeError(f"ElevenLabs {resp.status_code}: {resp.text}")
    data = resp.json()
    audio = base64.b64decode(data["audio_base64"])
    return audio, chars_to_words(data["alignment"])


# ---------- Schritt 4a: Bilder mit Pillow ----------

def font(size):
    return ImageFont.truetype(FONT, size)


def wrap(draw, text, fnt, max_width):
    lines, line = [], ""
    for word in text.split():
        candidate = f"{line} {word}".strip()
        if not line or draw.textlength(candidate, font=fnt) <= max_width:
            line = candidate
        else:
            lines.append(line)
            line = word
    if line:
        lines.append(line)
    return lines


def render_segment_frame(seg, index, total, path):
    """Titel plus Stichpunkte. Untertitel kommen als Overlay dazu."""
    img = Image.new("RGB", (WIDTH, HEIGHT), BG)
    draw = ImageDraw.Draw(img)
    margin = 90
    max_w = WIDTH - 2 * margin

    draw.text((margin, 140), f"Teil {index}/{total}", font=font(48), fill=ACCENT)
    y = 200
    for line in wrap(draw, seg["titel"], font(92), max_w):
        draw.text((margin, y), line, font=font(92), fill=TEXT)
        y += 110

    y += 60
    draw.rectangle((margin, y, margin + 120, y + 8), fill=ACCENT)
    y += 70

    bullet_font = font(64)
    for bullet in seg["stichpunkte"]:
        lines = wrap(draw, bullet, bullet_font, max_w - 70)
        draw.ellipse((margin, y + 22, margin + 28, y + 50), fill=ACCENT)
        for i, line in enumerate(lines):
            draw.text((margin + 70, y + i * 80), line, font=bullet_font, fill=TEXT)
        y += len(lines) * 80 + 50

    img.save(path)


def render_quiz_frame(quiz, index, total, path):
    img = Image.new("RGB", (WIDTH, HEIGHT), BG)
    draw = ImageDraw.Draw(img)
    margin = 90
    max_w = WIDTH - 2 * margin

    draw.text((margin, 140), f"Quiz zu Teil {index}/{total}", font=font(48), fill=ACCENT)
    y = 240
    for line in wrap(draw, quiz["frage"], font(72), max_w):
        draw.text((margin, y), line, font=font(72), fill=TEXT)
        y += 92

    y += 80
    answer_font = font(56)
    for i, answer in enumerate(quiz["antworten"]):
        box = (margin, y, WIDTH - margin, y + 150)
        draw.rounded_rectangle(box, radius=30, fill=(30, 42, 66), outline=ACCENT, width=4)
        draw.text((margin + 40, y + 45), chr(65 + i), font=font(60), fill=ACCENT)
        for j, line in enumerate(wrap(draw, answer, answer_font, max_w - 200)[:2]):
            draw.text((margin + 150, y + 30 + j * 62), line, font=answer_font, fill=TEXT)
        y += 150 + 36

    img.save(path)


# ---------- Schritt 4b: Untertitel als transparente Overlays ----------
# Pillow rendert jede Wortgruppe als PNG. FFmpeg blendet sie zur passenden
# Zeit ein. So brauchen wir kein libass (die Homebrew-Standardversion hat es nicht).

def render_subtitles(words, build, prefix, group_size=4):
    """Gibt je Wortgruppe (Dateiname, Start, Ende) zurück."""
    sub_font = font(SUB_FONT_SIZE)
    line_height = 96
    overlays = []
    for n, i in enumerate(range(0, len(words), group_size)):
        group = words[i:i + group_size]
        text = " ".join(w["wort"] for w in group)
        img = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
        draw = ImageDraw.Draw(img)
        lines = wrap(draw, text, sub_font, WIDTH - 180)
        y = HEIGHT - SUB_BOTTOM_MARGIN - line_height * len(lines)
        for j, line in enumerate(lines):
            x = (WIDTH - draw.textlength(line, font=sub_font)) / 2
            draw.text((x, y + j * line_height), line, font=sub_font, fill=TEXT,
                      stroke_width=6, stroke_fill=(0, 0, 0))
        name = f"{prefix}_{n:03d}.png"
        img.save(build / name)
        overlays.append((name, group[0]["start"], group[-1]["ende"]))
    return overlays


# ---------- Schritt 4c: FFmpeg ----------

def ffmpeg(args, cwd):
    cmd = ["ffmpeg", "-y", "-hide_banner", "-loglevel", "error", *args]
    res = subprocess.run(cmd, cwd=cwd, capture_output=True, text=True)
    if res.returncode:
        raise RuntimeError(f"ffmpeg-Fehler:\n{res.stderr}")


def make_narration_part(frame, audio, overlays, out_name, build):
    """Bild plus Sprechaudio plus eingeblendete Untertitel-Overlays."""
    args = ["-loop", "1", "-i", frame, "-i", audio]
    chain, last = [], "0:v"
    for k, (png, start, end) in enumerate(overlays):
        args += ["-loop", "1", "-i", png]
        label = f"v{k}"
        chain.append(
            f"[{last}][{k + 2}:v]overlay=0:0:enable='between(t,{start:.3f},{end:.3f})'[{label}]"
        )
        last = label
    if chain:
        args += ["-filter_complex", ";".join(chain), "-map", f"[{last}]", "-map", "1:a"]
    else:
        args += ["-map", "0:v", "-map", "1:a"]
    ffmpeg([*args, *VIDEO_ARGS, "-shortest", out_name], cwd=build)


def make_quiz_part(frame, out_name, build):
    """Quizkarte mit stiller Tonspur."""
    ffmpeg(
        ["-loop", "1", "-i", frame,
         "-f", "lavfi", "-i", "anullsrc=r=44100:cl=stereo",
         *VIDEO_ARGS, "-t", str(QUIZ_SECONDS), out_name],
        cwd=build,
    )


def concat(parts, out_file, build):
    listing = build / "concat.txt"
    listing.write_text("".join(f"file '{p}'\n" for p in parts), encoding="utf-8")
    ffmpeg(["-f", "concat", "-safe", "0", "-i", listing.name, "-c", "copy", str(out_file)],
           cwd=build)


# ---------- Hauptablauf ----------

def require_env(names):
    missing = [n for n in names if not os.environ.get(n)]
    if missing:
        sys.exit(f"Fehlende Umgebungsvariablen: {', '.join(missing)}")


def main():
    ap = argparse.ArgumentParser(description="Lernstoff in Hochformat-Video umwandeln")
    ap.add_argument("eingabe", help="Textdatei mit Lernstoff (UTF-8)")
    ap.add_argument("--out", default="output", help="Basisordner für die Ausgabe")
    ap.add_argument("--script", help="vorhandene script.json verwenden, Claude-Schritt überspringen")
    args = ap.parse_args()

    if not shutil.which("ffmpeg"):
        sys.exit("ffmpeg nicht gefunden. Installation: brew install ffmpeg")
    require_env(["ELEVENLABS_API_KEY", "ELEVENLABS_VOICE_ID"])
    if not args.script:
        require_env(["ANTHROPIC_API_KEY"])

    text = Path(args.eingabe).read_text(encoding="utf-8")
    stamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    # resolve(): FFmpeg läuft im Build-Ordner, relative Pfade würden dort nicht stimmen
    out = (Path(args.out) / f"{Path(args.eingabe).stem}_{stamp}").resolve()
    audio_dir, build = out / "audio", out / "build"
    audio_dir.mkdir(parents=True)
    build.mkdir()

    # Schritt 2: Skript
    if args.script:
        segs = validate_segments(json.loads(Path(args.script).read_text(encoding="utf-8"))["segmente"])
        print(f"Schritt 2: Skript aus {args.script} geladen ({len(segs)} Segmente)")
    else:
        print("Schritt 2: Claude teilt den Lernstoff in Segmente ...")
        segs = script_from_text(text)
        print(f"  {len(segs)} Segmente")

    # Schritt 3: Stimme und Zeitstempel
    api_key = os.environ["ELEVENLABS_API_KEY"]
    voice_id = os.environ["ELEVENLABS_VOICE_ID"]
    for i, seg in enumerate(segs, 1):
        print(f"Schritt 3: ElevenLabs Segment {i}/{len(segs)} ...")
        audio, words = tts_with_timestamps(seg["sprechtext"], voice_id, api_key)
        (audio_dir / f"seg_{i:02d}.mp3").write_bytes(audio)
        seg["audio"] = f"audio/seg_{i:02d}.mp3"
        seg["woerter"] = words
        duration = words[-1]["ende"] if words else 0
        if not SEGMENT_MIN_S <= duration <= SEGMENT_MAX_S:
            print(f"  Hinweis: Sprechzeit {duration:.1f} s liegt außerhalb von {SEGMENT_MIN_S}-{SEGMENT_MAX_S} s")

    (out / "script.json").write_text(
        json.dumps({"segmente": segs}, ensure_ascii=False, indent=2), encoding="utf-8"
    )

    # Schritt 4: Bilder, Untertitel, FFmpeg
    total = len(segs)
    parts = []
    for i, seg in enumerate(segs, 1):
        print(f"Schritt 4: Video Segment {i}/{total} ...")
        frame = build / f"frame_{i:02d}.png"
        quiz_frame = build / f"quiz_{i:02d}.png"
        render_segment_frame(seg, i, total, frame)
        overlays = render_subtitles(seg["woerter"], build, f"sub_{i:02d}")
        render_quiz_frame(seg["quiz"], i, total, quiz_frame)

        part_a, part_b = f"part_{i:02d}a.mp4", f"part_{i:02d}b.mp4"
        # FFmpeg läuft im Build-Ordner, daher absoluter Pfad zum Audio
        make_narration_part(frame.name, str((out / seg["audio"]).resolve()), overlays, part_a, build)
        make_quiz_part(quiz_frame.name, part_b, build)
        parts += [part_a, part_b]

    print("Schritt 5: Zusammenfügen ...")
    concat(parts, out / "clip.mp4", build)
    print(f"Fertig: {out}")


if __name__ == "__main__":
    main()
