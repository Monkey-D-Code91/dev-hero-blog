import { describe, it, expect } from "vitest";
import { renderPostContent } from "../src/utils/rss";

describe("renderPostContent (feed a contenuto completo)", () => {
  it("rende il markdown in HTML", () => {
    const html = renderPostContent("Un paragrafo con *enfasi* e **forza**.");
    expect(html).toContain("<p>");
    expect(html).toContain("<em>enfasi</em>");
    expect(html).toContain("<strong>forza</strong>");
  });

  it("rende titoli e liste", () => {
    const html = renderPostContent("## Titolo\n\n- uno\n- due\n");
    expect(html).toContain("<h2>Titolo</h2>");
    expect(html).toContain("<li>uno</li>");
  });

  it("non produce trattini lunghi dai doppi trattini (typographer off)", () => {
    const html = renderPostContent("Due trattini -- non diventano un em dash.");
    expect(html).not.toContain("—");
  });

  it("rimuove i tag non consentiti (sanitizzazione)", () => {
    const html = renderPostContent(
      'Testo <script>alert(1)</script> e <img src=x> fine.'
    );
    expect(html).not.toContain("<script>");
    expect(html).not.toContain("<img");
  });
});
