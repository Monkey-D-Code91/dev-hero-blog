import { describe, it, expect, vi } from "vitest";
import { blogFixtures, authorFixtures, roadmapFixtures } from "./fixtures";

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

import { getResolvedRoadmap, getRoadmapStats } from "../src/utils/roadmap";

describe("getResolvedRoadmap (ereditarietà roadmap→blog)", () => {
  it("la tappa collegata a un post pubblicato eredita titolo, data e URL dal post", async () => {
    const [arc] = await getResolvedRoadmap("it");
    const linked = arc.items[0];
    // Titolo e data vengono dal post "manifesto", non dai campi inline della tappa.
    expect(linked.title).toBe("Titolo manifesto");
    expect(linked.isoDate).toBe("2026-07-04");
    expect(linked.href).toBe("/blog/manifesto/");
  });

  it("la tappa di pipeline usa i dati inline e non ha href", async () => {
    const [arc] = await getResolvedRoadmap("it");
    const pipeline = arc.items[1];
    expect(pipeline.title).toBe("Tappa imminente");
    expect(pipeline.href).toBeUndefined();
  });

  it("data esatta solo per pubblicati e prossima tappa; le altre degradano a mese", async () => {
    const [arc] = await getResolvedRoadmap("it");
    const [published, next, future] = arc.items;
    expect(published.dateLabel).toBe("4 luglio 2026");
    expect(next.dateLabel).toBe("3 agosto 2026");
    // La tappa futura mostra solo "mese anno", senza giorno.
    expect(future.dateLabel).toBe("settembre 2026");
  });

  it("ogni capitolo mostra la data esatta della PROPRIA prossima tappa", async () => {
    const [arcI, arcII] = await getResolvedRoadmap("it");
    // La prossima del capitolo II (20 agosto) e' piu' lontana della prossima
    // del capitolo I (3 agosto): con la regola globale sarebbe degradata a
    // mese. I capitoli corrono in parallelo, quindi deve restare esatta.
    expect(arcI.items[1].dateLabel).toBe("3 agosto 2026");
    expect(arcII.items[0].dateLabel).toBe("20 agosto 2026");
  });

  it("dopo la prossima tappa, le altre del capitolo degradano comunque a mese", async () => {
    const [, arcII] = await getResolvedRoadmap("it");
    expect(arcII.items[1].dateLabel).toBe("ottobre 2026");
  });

  it("un capitolo senza tappe non rompe la risoluzione e ha progresso 0 su 0", async () => {
    const arcs = await getResolvedRoadmap("it");
    const empty = arcs.find((a) => a.arcKey === "arco-3");
    expect(empty?.items).toEqual([]);
    expect(empty?.progress).toEqual({ done: 0, total: 0 });
    expect(empty?.upcomingTeaser?.label).toBe("In arrivo");
  });

  it("calcola il progresso dell'arco", async () => {
    const [arc] = await getResolvedRoadmap("it");
    expect(arc.progress).toEqual({ done: 1, total: 3 });
  });
});

describe("getRoadmapStats", () => {
  it("aggrega avanzamento, pipeline e firme distinte", async () => {
    const arcs = await getResolvedRoadmap("it");
    const stats = getRoadmapStats(arcs);
    expect(stats.firstArcDone).toBe(1);
    expect(stats.firstArcTotal).toBe(3);
    // Aggregato su TUTTI i capitoli: 2 del primo + 2 del secondo.
    expect(stats.pipelineCount).toBe(4);
    expect(stats.signatures).toBe(2);
  });
});
