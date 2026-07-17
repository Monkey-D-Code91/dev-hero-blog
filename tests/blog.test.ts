import { describe, it, expect, vi, afterEach } from "vitest";
import {
  blogFixtures,
  authorFixtures,
  roadmapFixtures,
  makePost,
} from "./fixtures";

vi.mock("astro:content", () => ({
  getCollection: async (
    name: "blog" | "authors" | "roadmap",
    filter?: (entry: unknown) => boolean
  ) => {
    const all = {
      blog: blogFixtures,
      authors: authorFixtures,
      roadmap: roadmapFixtures,
    }[name] as unknown[];
    return filter ? all.filter(filter) : all;
  },
}));

import {
  getLangFromEntryId,
  getSlugFromEntryId,
  getBlogPostUrl,
  getAuthorUrl,
  getPublishedPosts,
  getAlternatePost,
  getRelatedPosts,
  processPosts,
  formatDate,
  formatAuthorList,
} from "../src/utils/blog";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("helpers su ID e URL", () => {
  it("estrae lingua e slug dall'id entry", () => {
    expect(getLangFromEntryId("it/mio-articolo")).toBe("it");
    expect(getLangFromEntryId("en/my-post")).toBe("en");
    expect(getSlugFromEntryId("it/mio-articolo")).toBe("mio-articolo");
  });

  it("costruisce gli URL localizzati di post e autori", () => {
    expect(getBlogPostUrl("it", "slug")).toBe("/blog/slug/");
    expect(getBlogPostUrl("en", "slug")).toBe("/en/blog/slug/");
    expect(getAuthorUrl("marco-mariotti", "it")).toBe("/autori/marco-mariotti/");
    expect(getAuthorUrl("marco-mariotti", "en")).toBe(
      "/en/authors/marco-mariotti/"
    );
  });
});

describe("getPublishedPosts", () => {
  it("filtra per lingua e ordina per pubDate decrescente", async () => {
    const posts = await getPublishedPosts("it");
    expect(posts.every((p) => p.id.startsWith("it/"))).toBe(true);
    const dates = posts.map((p) => p.data.pubDate.getTime());
    expect(dates).toEqual([...dates].sort((a, b) => b - a));
  });

  it("in dev include i draft, in produzione li esclude", async () => {
    const dev = await getPublishedPosts("it");
    expect(dev.map((p) => p.id)).toContain("it/bozza");

    vi.stubEnv("PROD", true);
    const prod = await getPublishedPosts("it");
    expect(prod.map((p) => p.id)).not.toContain("it/bozza");
  });
});

describe("getAlternatePost (accoppiamento IT/EN via translationKey)", () => {
  it("trova il gemello nell'altra lingua", async () => {
    const alt = await getAlternatePost("manifesto", "en");
    expect(alt?.id).toBe("en/manifesto-en");
  });

  it("ritorna null se il gemello non esiste", async () => {
    expect(await getAlternatePost("inesistente", "en")).toBeNull();
  });

  it("in produzione non espone un gemello ancora draft", async () => {
    vi.stubEnv("PROD", true);
    expect(await getAlternatePost("bozza", "it")).toBeNull();
  });
});

describe("getRelatedPosts", () => {
  it("ordina per tag in comune (+bonus autore) ed esclude il post corrente", async () => {
    const current = blogFixtures.find((p) => p.id === "it/manifesto")!;
    const related = await getRelatedPosts(current as never, "it");
    expect(related.map((r) => r.slug)).not.toContain("manifesto");
    // "lettura" condivide il tag "ai" e l'autore: deve venire prima di "bozza".
    expect(related[0]?.slug).toBe("lettura");
  });

  it("senza alcuna rilevanza fa fallback ai più recenti", async () => {
    const isolato = makePost("it/isolato", {
      translationKey: "isolato",
      tags: ["tema-unico"],
      authors: ["autore-esterno"],
    });
    const related = await getRelatedPosts(isolato as never, "it", 2);
    expect(related.length).toBe(2);
  });
});

describe("processPosts", () => {
  it("risolve nome e monogramma dell'autore dalla collection authors", async () => {
    const entry = blogFixtures.find((p) => p.id === "it/manifesto")!;
    const [post] = await processPosts([entry] as never, "it");
    expect(post.authors[0]).toMatchObject({
      key: "marco-mariotti",
      name: "Marco Mariotti",
    });
    expect(post.readingTime).toBeTruthy();
  });

  it("con authorKey sconosciuta usa la chiave come fallback", async () => {
    const entry = makePost("it/orfano", { authors: ["sconosciuto"] });
    const [post] = await processPosts([entry] as never, "it");
    expect(post.authors[0].name).toBe("sconosciuto");
    expect(post.authors[0].monogram).toBe("SC");
  });
});

describe("formatting", () => {
  it("formatta le date secondo la lingua", () => {
    const d = new Date("2026-07-04");
    expect(formatDate(d, "it")).toBe("4 luglio 2026");
    expect(formatDate(d, "en")).toBe("4 July 2026");
  });

  it("unisce gli autori con la congiunzione localizzata", () => {
    expect(formatAuthorList(["A"], "it")).toBe("A");
    expect(formatAuthorList(["A", "B"], "it")).toBe("A e B");
    expect(formatAuthorList(["A", "B", "C"], "en")).toBe("A, B and C");
  });
});
