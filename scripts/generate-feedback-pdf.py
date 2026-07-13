#!/usr/bin/env python3
"""
Genera il PDF "bozza per revisione" di un articolo per il gruppo di feedback.
Layout brand: pill, titolo, sommario in corsivo, byline, capolettera, testo
giustificato serif, numero pagina.

Non e' nella toolchain node del sito: per i PDF impaginati weasyprint (Python)
e' lo strumento piu' adatto e leggero. Dipendenza isolata in scripts/requirements-pdf.txt.

Uso:
    python3 scripts/generate-feedback-pdf.py src/content/blog/it/<slug>.md [output.pdf]

Se l'output non e' indicato, scrive in feedback/<Slug-con-iniziale-maiuscola>.pdf.
Legge dal frontmatter title, description, pubDate. Pensato per la versione IT.
"""
import re, html, sys, os

MESI = ["gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno",
        "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre"]

def field(fm, name):
    m = re.search(rf'^{name}:\s*"?(.*?)"?\s*$', fm, re.M)
    return m.group(1) if m else ""

def data_it(pubdate):
    m = re.match(r"(\d{4})-(\d{2})-(\d{2})", pubdate or "")
    if not m:
        return ""
    y, mo, d = int(m.group(1)), int(m.group(2)), int(m.group(3))
    return f"{d} {MESI[mo-1]} {y}"

def build_html(title, desc, byline_date, body_html):
    return f"""<!DOCTYPE html><html lang="it"><head><meta charset="utf-8"><style>
@page {{ size: A4; margin: 2.2cm 2.4cm 2cm 2.4cm;
  @bottom-center {{ content: counter(page) " / " counter(pages); font-family:'Liberation Sans',sans-serif; font-size:9pt; color:#9a9a9a; }} }}
body {{ font-family:'Liberation Serif',serif; color:#1a1a1a; font-size:11.5pt; line-height:1.62; }}
.pill {{ display:inline-block; background:#f6f1cf; border:1px solid #e4d98f; color:#8a7a2e;
  font-family:'Liberation Sans',sans-serif; font-size:8.5pt; font-weight:700; letter-spacing:1.6pt;
  text-transform:uppercase; padding:4px 10px; border-radius:5px; }}
h1 {{ font-weight:700; font-size:27pt; line-height:1.12; margin:14px 0 12px; letter-spacing:-0.3pt; }}
.desc {{ font-style:italic; font-size:13pt; line-height:1.5; color:#3a3a3a; margin:0 0 14px; }}
.byline {{ font-family:'Liberation Sans',sans-serif; font-size:10pt; color:#6a6a6a; margin-bottom:10px; }}
hr.rule {{ border:none; border-top:2px solid #111; margin:8px 0 18px; }}
p {{ margin:0 0 11px; text-align:justify; hyphens:auto; }}
p.lead::first-letter {{ float:left; font-size:3.5em; line-height:0.72; font-weight:700; padding:2px 8px 0 0; }}
hr.sep {{ border:none; border-top:1px solid #cccccc; width:38%; margin:20px auto 20px 0; }}
p.disclaimer {{ font-style:italic; font-size:9.5pt; color:#777777; text-align:left; }}
</style></head><body>
<span class="pill">Bozza per revisione</span>
<h1>{html.escape(title)}</h1>
<div class="desc">{html.escape(desc)}</div>
<div class="byline">Marco Mariotti &#183; The First Draft &#183; {html.escape(byline_date)}</div>
<hr class="rule"/>
{body_html}
</body></html>"""

def md_to_body(body):
    blocks = [b.strip() for b in re.split(r"\n\s*\n", body) if b.strip()]
    parts, lead_done = [], False
    for b in blocks:
        if b == "---":
            parts.append('<hr class="sep"/>'); continue
        if b.startswith("*") and b.endswith("*"):
            parts.append(f'<p class="disclaimer">{html.escape(b.strip("*").strip())}</p>'); continue
        cls = "" if lead_done else ' class="lead"'
        lead_done = True
        parts.append(f"<p{cls}>{html.escape(b)}</p>")
    return "\n".join(parts)

def main():
    if len(sys.argv) < 2:
        print("Uso: python3 scripts/generate-feedback-pdf.py <path-articolo.md> [output.pdf]")
        sys.exit(1)
    from weasyprint import HTML
    article = sys.argv[1]
    md = open(article, encoding="utf-8").read()
    m = re.match(r"^---\n(.*?)\n---\n(.*)$", md, re.S)
    fm, body = m.group(1), m.group(2).strip()
    title = field(fm, "title")
    desc = field(fm, "description")
    byline_date = data_it(field(fm, "pubDate"))

    if len(sys.argv) >= 3:
        out = sys.argv[2]
    else:
        slug = os.path.splitext(os.path.basename(article))[0]
        name = slug[:1].upper() + slug[1:]
        out = os.path.join("feedback", name + ".pdf")
    os.makedirs(os.path.dirname(out) or ".", exist_ok=True)

    doc = build_html(title, desc, byline_date, md_to_body(body))
    HTML(string=doc, base_url=".").write_pdf(out)
    print("PDF generato:", out, os.path.getsize(out), "bytes")

if __name__ == "__main__":
    main()
