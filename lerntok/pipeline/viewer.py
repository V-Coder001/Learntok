#!/usr/bin/env python3
"""Erzeugt eine HTML-Ansicht zu einem Pipeline-Ausgabeordner.

Aufruf:
  python viewer.py output/beispiel_20261023_135001

Legt index.html im Ordner an. Das Video (clip.mp4) liegt daneben.
Die Daten aus script.json stehen direkt im HTML, damit die Datei auch per
Doppelklick ohne Server funktioniert.

Design nach den LernTok-Mockups: dunkles Theme, Neon-Grün als einziger Akzent,
Space Grotesk für Überschriften, Inter für Fließtext.
"""
import html
import json
import sys
from pathlib import Path

PAGE = """<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>LernTok Vorschau</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@600;700&display=swap" rel="stylesheet">
<style>
  :root {
    --bg: #0b0c10;
    --surface: #16181f;
    --surface-alt: #111318;
    --border: #2a2e39;
    --accent: #c8f560;
    --accent-ink: #0b0c10;
    --accent-soft: #1d2312;
    --text: #f4f5f7;
    --muted: #a3a8b5;
    --danger: #ff6b4a;
  }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    background: var(--bg);
    color: var(--text);
    font: 15px/22px Inter, system-ui, -apple-system, "Segoe UI", sans-serif;
    -webkit-font-smoothing: antialiased;
  }
  h1, h2, .display { font-family: "Space Grotesk", Inter, sans-serif; font-weight: 700; margin: 0; }

  header {
    max-width: 1100px; margin: 0 auto; padding: 24px 16px 8px;
    display: flex; align-items: center; gap: 12px;
  }
  .logo {
    width: 40px; height: 40px; border-radius: 12px; background: var(--accent);
    color: var(--accent-ink); display: grid; place-items: center;
    font: 700 20px "Space Grotesk", Inter, sans-serif;
  }
  header h1 { font-size: 22px; line-height: 28px; }
  header p { margin: 0; color: var(--muted); font-size: 13px; }

  main {
    max-width: 1100px; margin: 0 auto; padding: 16px;
    display: grid; gap: 24px; grid-template-columns: minmax(260px, 360px) 1fr; align-items: start;
  }
  @media (max-width: 760px) { main { grid-template-columns: 1fr; } .phone { position: static !important; } }

  .phone {
    position: sticky; top: 16px; background: #000; border: 1px solid var(--border);
    border-radius: 28px; padding: 10px;
  }
  .phone video { width: 100%; aspect-ratio: 9 / 16; border-radius: 20px; background: #000; display: block; }
  .phone small { display: block; color: var(--muted); text-align: center; margin-top: 8px; font-size: 12px; }

  .chip {
    display: inline-block; font-size: 12px; line-height: 16px; font-weight: 500;
    color: var(--text); border: 1px solid var(--border); border-radius: 999px; padding: 4px 12px;
  }
  .chip.accent { background: var(--accent); border-color: var(--accent); color: var(--accent-ink); font-weight: 600; }

  .seg {
    background: var(--surface); border: 1px solid var(--border); border-radius: 16px;
    padding: 18px 20px; margin-bottom: 16px;
  }
  .seg-head { display: flex; gap: 8px; align-items: center; margin-bottom: 12px; flex-wrap: wrap; }
  .seg h2 { font-size: 24px; line-height: 30px; margin-bottom: 12px; }
  .seg ul { margin: 0 0 12px; padding: 0; list-style: none; display: grid; gap: 8px; }
  .seg li { display: flex; gap: 10px; color: var(--text); }
  .seg li::before {
    content: ""; flex: 0 0 8px; height: 8px; margin-top: 7px; border-radius: 50%; background: var(--accent);
  }
  .script { color: var(--muted); margin: 0; }
  .script summary { cursor: pointer; color: var(--text); font-weight: 500; }
  .script p { margin: 8px 0 0; }

  .quiz {
    margin-top: 16px; border-top: 1px solid var(--border); padding-top: 16px;
  }
  .quiz-label { color: var(--muted); font-size: 12px; margin-bottom: 6px; }
  .quiz-q { font: 600 20px/26px "Space Grotesk", Inter, sans-serif; margin-bottom: 12px; }
  .answers { display: grid; gap: 10px; }
  .answer {
    display: flex; align-items: center; gap: 12px; width: 100%; min-height: 52px;
    background: var(--surface-alt); border: 1px solid var(--border); border-radius: 14px;
    padding: 12px 14px; color: var(--text); font: 500 15px/22px Inter, sans-serif;
    text-align: left; cursor: pointer;
  }
  .answer:hover { border-color: var(--muted); }
  .answer .letter {
    flex: 0 0 28px; height: 28px; border-radius: 50%; border: 1px solid var(--border);
    display: grid; place-items: center; font-size: 13px; font-weight: 600; color: var(--muted);
  }
  .answer.right { border-color: var(--accent); background: var(--accent-soft); }
  .answer.right .letter { background: var(--accent); border-color: var(--accent); color: var(--accent-ink); }
  .answer.wrong { border-color: var(--danger); }
  .answer.wrong .letter { border-color: var(--danger); color: var(--danger); }
  .answer:disabled { cursor: default; }

  .feedback {
    margin-top: 12px; background: var(--surface-alt); border: 1px solid var(--border);
    border-radius: 14px; padding: 12px 14px; color: var(--muted); display: none;
  }
  .feedback.show { display: block; }
  .feedback strong { display: block; color: var(--accent); margin-bottom: 4px; }
  .feedback.wrong strong { color: var(--danger); }

  .actions { display: flex; gap: 10px; margin-top: 14px; flex-wrap: wrap; }
  .btn {
    height: 48px; border-radius: 999px; padding: 0 20px; font: 600 15px Inter, sans-serif;
    border: 1px solid var(--border); background: transparent; color: var(--text); cursor: pointer;
  }
  .btn.primary { background: var(--accent); border-color: var(--accent); color: var(--accent-ink); flex: 1; }
  .btn:disabled { opacity: .4; cursor: default; }
</style>
</head>
<body>
<header>
  <div class="logo">L</div>
  <div>
    <h1>LernTok Vorschau</h1>
    <p>__TITLE__</p>
  </div>
</header>
<main>
  <aside class="phone">
    <video controls playsinline src="clip.mp4"></video>
    <small>clip.mp4 · 1080 × 1920</small>
  </aside>
  <section id="segments"></section>
</main>
<script>
const SEGMENTS = __DATA__;
const LETTERS = ["A", "B", "C", "D"];
const root = document.getElementById("segments");
const cards = [];

function el(tag, cls, text) {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  if (text !== undefined) node.textContent = text;
  return node;
}

SEGMENTS.forEach((seg, i) => {
  const card = el("article", "seg");

  const head = el("div", "seg-head");
  head.append(el("span", "chip accent", `Teil ${i + 1} von ${SEGMENTS.length}`));
  head.append(el("span", "chip", "Erklärer"));
  card.append(head);

  card.append(el("h2", "", seg.titel));

  const ul = el("ul");
  seg.stichpunkte.forEach(s => ul.append(el("li", "", s)));
  card.append(ul);

  const details = el("details");
  details.className = "script";
  details.append(el("summary", "", "Sprechtext anzeigen"));
  details.append(el("p", "", seg.sprechtext));
  card.append(details);

  const quiz = el("div", "quiz");
  quiz.append(el("div", "quiz-label", "Quiz zu diesem Teil"));
  quiz.append(el("div", "quiz-q", seg.quiz.frage));

  const answers = el("div", "answers");
  const feedback = el("div", "feedback");
  const buttons = [];

  seg.quiz.antworten.forEach((a, idx) => {
    const btn = el("button", "answer");
    btn.append(el("span", "letter", LETTERS[idx]));
    btn.append(el("span", "", a));
    btn.addEventListener("click", () => {
      buttons.forEach(b => (b.disabled = true));
      const correct = idx === seg.quiz.loesung;
      btn.classList.add(correct ? "right" : "wrong");
      if (!correct) buttons[seg.quiz.loesung].classList.add("right");
      feedback.className = correct ? "feedback show" : "feedback show wrong";
      feedback.replaceChildren(
        el("strong", "", correct ? "Richtig!" : "Leider falsch"),
        el("span", "", correct
          ? "Gut gemacht, weiter zum nächsten Teil."
          : "Die richtige Antwort ist markiert.")
      );
      next.disabled = false;
    });
    buttons.push(btn);
    answers.append(btn);
  });
  quiz.append(answers, feedback);

  const actions = el("div", "actions");
  const again = el("button", "btn", "Nochmal");
  again.addEventListener("click", () => {
    buttons.forEach(b => { b.disabled = false; b.classList.remove("right", "wrong"); });
    feedback.className = "feedback";
    next.disabled = true;
  });
  const next = el("button", "btn primary", i + 1 < SEGMENTS.length ? "Nächste Frage" : "Fertig");
  next.disabled = true;
  next.addEventListener("click", () => {
    if (i + 1 < SEGMENTS.length) cards[i + 1].scrollIntoView({ behavior: "smooth", block: "start" });
  });
  actions.append(again, next);
  quiz.append(actions);

  card.append(quiz);
  cards.push(card);
  root.append(card);
});
</script>
</body>
</html>
"""


def build(out_dir):
    out_dir = Path(out_dir)
    data = json.loads((out_dir / "script.json").read_text(encoding="utf-8"))
    segments = data["segmente"]
    title = f"{len(segments)} Teile · {out_dir.name}"
    # </ im JSON würde das Script-Tag beenden, daher maskieren
    payload = json.dumps(segments, ensure_ascii=False).replace("</", "<\\/")
    page = PAGE.replace("__TITLE__", html.escape(title)).replace("__DATA__", payload)
    target = out_dir / "index.html"
    target.write_text(page, encoding="utf-8")
    return target


if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit("Aufruf: python viewer.py <ausgabeordner>")
    print(build(sys.argv[1]))
