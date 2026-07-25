import { describe, it, expect } from "vitest";

import {
  shape,
  structuralDiff,
  findSyncPoint,
} from "../scripts/check-translation-sync.mjs";

/**
 * Test delle funzioni pure di scripts/check-translation-sync.mjs: l'impronta
 * strutturale di un file e la ricerca del punto di sync. La parte che parla con
 * git non è testata qui (richiederebbe un repo finto): quello che conta è che
 * le regole di confronto non cambino per sbaglio, perché sono l'unico segnale
 * disponibile quando la storia git non è interrogabile.
 */

type FakeFile = { fm: Record<string, string>; rawFm: string; body: string };

function file(body: string, fm: Record<string, string> = {}, rawFm = ""): FakeFile {
  return { fm, rawFm, body };
}

describe("shape (impronta strutturale)", () => {
  it("conta heading, blocchi, liste e citazioni del corpo", () => {
    const s = shape(
      file(
        [
          "## Primo",
          "",
          "Un blocco di testo.",
          "",
          "- voce uno",
          "- voce due",
          "",
          "> una citazione",
          "",
          "### Secondo",
          "",
          "Altro blocco.",
        ].join("\n")
      )
    );

    expect(s.headings).toBe(2);
    expect(s.listItems).toBe(2);
    expect(s.blockquotes).toBe(1);
    expect(s.paragraphs).toBeGreaterThan(0);
  });

  it("distingue le immagini dai link", () => {
    const s = shape(file("Vedi [il pezzo](/it/blog/x) e ![una cover](/cover.png)."));

    expect(s.links).toBe(1);
    expect(s.images).toBe(1);
  });

  it("conta i blocchi di codice a coppie di fence", () => {
    const s = shape(file(["```js", "const a = 1;", "```", "", "Testo."].join("\n")));

    expect(s.codeFences).toBe(1);
  });

  it("legge chiavi e voci di lista dal frontmatter", () => {
    const rawFm = ['title: "Titolo"', "openQuestions:", "  - question: prima", "  - question: seconda"].join(
      "\n"
    );
    const s = shape(file("Corpo.", { title: "Titolo", openQuestions: "" }, rawFm));

    expect(s.fmKeys).toBe("openQuestions,title");
    expect(s.fmListItems).toBe(2);
  });
});

describe("structuralDiff (confronto IT/EN)", () => {
  it("non segnala nulla su due file con la stessa forma", () => {
    const body = ["## Titolo", "", "Un blocco.", "", "Un altro blocco."].join("\n");
    const bodyEn = ["## Heading", "", "A block.", "", "Another block."].join("\n");

    expect(structuralDiff(file(body), file(bodyEn))).toEqual([]);
  });

  it("tollera uno scarto di un blocco: la traduzione idiomatica può unire o dividere", () => {
    const it = file(["Uno.", "", "Due.", "", "Tre."].join("\n"));
    const en = file(["One.", "", "Two and three."].join("\n"));

    expect(structuralDiff(it, en)).toEqual([]);
  });

  it("segnala un heading presente in una lingua sola", () => {
    const it = file(["## Uno", "", "Testo.", "", "## Due", "", "Testo."].join("\n"));
    const en = file(["## One", "", "Text.", "", "Text."].join("\n"));

    const diff = structuralDiff(it, en);
    expect(diff.map((d: { field: string }) => d.field)).toContain("headings");
  });

  it("segnala un campo di frontmatter presente in una lingua sola", () => {
    const it = file("Testo.", { title: "T", openQuestions: "" }, "  - question: una");
    const en = file("Text.", { title: "T" }, "");

    const fields = structuralDiff(it, en).map((d: { field: string }) => d.field);
    expect(fields).toContain("fmKeys");
    expect(fields).toContain("fmListItems");
  });
});

describe("findSyncPoint (ultimo commit comune)", () => {
  const c = (hash: string) => ({ hash, date: "2026-07-01T00:00:00Z", subject: hash });

  it("restituisce il commit comune più recente", () => {
    const itCommits = [c("d"), c("c"), c("b"), c("a")];
    const enCommits = [c("b"), c("a")];

    expect(findSyncPoint(itCommits, enCommits)?.hash).toBe("b");
  });

  it("restituisce null se le due storie non si incrociano mai", () => {
    expect(findSyncPoint([c("d"), c("c")], [c("b"), c("a")])).toBeNull();
  });

  it("restituisce null se una delle due storie è vuota", () => {
    expect(findSyncPoint([c("a")], [])).toBeNull();
    expect(findSyncPoint([], [c("a")])).toBeNull();
  });
});
