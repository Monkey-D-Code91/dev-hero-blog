import { describe, it, expect } from "vitest";

import {
  checkCopy,
  findViolations,
  stripComments,
  FORBIDDEN,
} from "../scripts/check-copy.mjs";

/**
 * Guardia anti-regressione sul copy del sito (`CLAUDE.md` §4: niente trattini
 * lunghi in nessun testo del brand).
 *
 * Il primo test è quello che conta: gira su TUTTI i sorgenti reali del progetto e
 * fallisce se qualcuno reintroduce un em dash in un title, in una description o in
 * un aria-label. Vive qui e non in `preflight-article.mjs` perché quello è
 * article-scoped, e non su `dist/` perché in CI `npm test` gira prima della build.
 *
 * Gli altri test proteggono il rilevatore stesso: se un giorno lo stripping dei
 * commenti smettesse di funzionare, il primo test diventerebbe verde per il motivo
 * sbagliato (nessuna violazione trovata perché non si guarda più niente).
 */

describe("copy del sito", () => {
  it("non contiene trattini lunghi nei sorgenti", () => {
    const violations = checkCopy();
    const dettaglio = violations
      .map((v) => `${v.file}:${v.line}:${v.column}  ${v.context}`)
      .join("\n");

    expect(violations, `Trattini lunghi nel copy:\n${dettaglio}`).toEqual([]);
  });

  it("guarda davvero dei file (il controllo non è vuoto)", () => {
    // Se questo fallisce, il test sopra passa perché non sta leggendo niente.
    expect(FORBIDDEN.length).toBeGreaterThan(0);
    expect(findViolations("finto.astro", "<h1>Titolo — sbagliato</h1>")).toHaveLength(1);
  });
});

describe("stripComments (dove la regola non si applica)", () => {
  it("ignora i commenti di blocco e JSDoc", () => {
    const src = ["/** Chiave condivisa — usata per lo switch. */", 'const a = "ok";'].join("\n");

    expect(findViolations("f.ts", src)).toEqual([]);
  });

  it("ignora i commenti HTML", () => {
    expect(findViolations("f.astro", "<!-- Titolo — link principale -->\n<h1>ok</h1>")).toEqual([]);
  });

  it("ignora i commenti di riga a inizio riga", () => {
    expect(findViolations("f.ts", "// JSON-LD — stessa immagine\nconst a = 1;")).toEqual([]);
  });

  it("NON tronca la riga su un // dentro una stringa", () => {
    // Se lo stripping fosse ingenuo, l'URL nasconderebbe la violazione che segue.
    const src = 'const x = "https://esempio.dev";\nconst t = "First Draft — Blog";';

    expect(findViolations("f.ts", src)).toHaveLength(1);
  });

  it("conserva la numerazione delle righe", () => {
    const src = ["/* commento\n   su due righe */", 'const t = "A — B";'].join("\n");
    const [v] = findViolations("f.ts", src);

    expect(v.line).toBe(3);
  });

  it("sostituisce i commenti con spazi, non li elimina", () => {
    const stripped = stripComments("/* xy */const a = 1;");

    expect(stripped).toBe("        const a = 1;");
  });
});

describe("findViolations", () => {
  it("segnala più occorrenze sulla stessa riga", () => {
    expect(findViolations("f.ts", "const t = `#tag — Blog — First Draft`;")).toHaveLength(2);
  });

  it("riporta file, riga, colonna e contesto", () => {
    const [v] = findViolations("src/pages/x.astro", '\nconst t = "A — B";');

    expect(v.file).toBe("src/pages/x.astro");
    expect(v.line).toBe(2);
    expect(v.column).toBeGreaterThan(0);
    expect(v.context).toBe('const t = "A — B";');
  });

  it("non segnala nulla su un file pulito", () => {
    expect(findViolations("f.ts", 'const t = "First Draft · Blog";')).toEqual([]);
  });
});
