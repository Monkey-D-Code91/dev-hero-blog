/**
 * Fixture condivise dai test: un mini-universo di contenuti coerente
 * (2 coppie IT/EN di post, 1 draft, 2 autori, 1 arco roadmap) che riproduce
 * le convenzioni reali del repo (id "lingua/slug", translationKey condiviso).
 */

export function makePost(
  id: string,
  data: Partial<{
    title: string;
    description: string;
    pubDate: Date;
    translationKey: string;
    tags: string[];
    focus: string[];
    draft: boolean;
    authors: string[];
  }> = {}
) {
  const slug = id.split("/").slice(1).join("/");
  return {
    id,
    body: "Testo di prova. ".repeat(50),
    data: {
      title: data.title ?? `Titolo ${slug}`,
      description: data.description ?? `Descrizione ${slug}`,
      pubDate: data.pubDate ?? new Date("2026-07-04"),
      translationKey: data.translationKey ?? slug,
      tags: data.tags ?? [],
      focus: data.focus ?? [],
      draft: data.draft ?? false,
      authors: data.authors ?? ["marco-mariotti"],
    },
  };
}

export function makeAuthor(id: string, authorKey: string, name: string) {
  return {
    id,
    data: { authorKey, name, monogram: name.slice(0, 2).toUpperCase() },
  };
}

export const blogFixtures = [
  // Coppia #1 (pubblicata) — il "manifesto".
  makePost("it/manifesto", {
    translationKey: "manifesto",
    pubDate: new Date("2026-07-04"),
    tags: ["manifesto", "ai"],
  }),
  makePost("en/manifesto-en", {
    translationKey: "manifesto",
    pubDate: new Date("2026-07-04"),
    tags: ["manifesto", "ai"],
  }),
  // Coppia #2 (pubblicata) — condivide il tag "ai" col manifesto.
  makePost("it/lettura", {
    translationKey: "lettura",
    pubDate: new Date("2026-07-14"),
    tags: ["ai", "code-review"],
  }),
  makePost("en/reading", {
    translationKey: "lettura",
    pubDate: new Date("2026-07-14"),
    tags: ["ai", "code-review"],
  }),
  // Draft IT (senza gemello EN pubblicato), altro autore, nessun tag in comune.
  makePost("it/bozza", {
    translationKey: "bozza",
    pubDate: new Date("2026-08-03"),
    tags: ["musica"],
    draft: true,
    authors: ["fabio-ziliani"],
  }),
];

export const authorFixtures = [
  makeAuthor("it/marco-mariotti", "marco-mariotti", "Marco Mariotti"),
  makeAuthor("en/marco-mariotti", "marco-mariotti", "Marco Mariotti"),
  makeAuthor("it/fabio-ziliani", "fabio-ziliani", "Fabio Ziliani"),
  makeAuthor("en/fabio-ziliani", "fabio-ziliani", "Fabio Ziliani"),
];

export const roadmapFixtures = [
  {
    id: "it/arco-1",
    data: {
      arcKey: "arco-1",
      order: 1,
      numeral: "I",
      title: "Primo arco",
      lead: "Occhiello di prova.",
      period: "Lug – Set 2026",
      signature: "a firma Marco",
      items: [
        {
          // Tappa collegata a un post pubblicato: eredita titolo/data/URL.
          postTranslationKey: "manifesto",
          title: undefined,
          date: new Date("2026-01-01"), // volutamente sbagliata: deve vincere il post
          status: "published",
          focus: ["Tech"],
          authorName: "Marco Mariotti",
          collaborator: false,
        },
        {
          // Prossima tappa in uscita: data esatta.
          title: "Tappa imminente",
          date: new Date("2026-08-03"),
          status: "in-progress",
          focus: ["Human", "AI"],
          authorName: "Marco Mariotti",
          collaborator: false,
        },
        {
          // Tappa futura: data degradata a "mese anno".
          title: "Tappa futura",
          date: new Date("2026-09-12"),
          status: "planned",
          focus: ["Human"],
          authorName: "Fabio Ziliani",
          collaborator: true,
        },
      ],
      upcomingTeaser: undefined,
    },
  },
  {
    // Secondo capitolo: corre in PARALLELO al primo, con cadenza propria.
    // Serve a verificare che la data esatta sia calcolata per capitolo:
    // la sua prossima tappa (2026-08-20) e' piu' lontana di quella del
    // capitolo I (2026-08-03), ma deve comunque mostrare il giorno.
    id: "it/arco-2",
    data: {
      arcKey: "arco-2",
      order: 2,
      numeral: "II",
      title: "Secondo arco",
      lead: "Occhiello del secondo capitolo.",
      period: "Set – Nov 2026",
      signature: "a firma Fabio",
      items: [
        {
          title: "Prossima del secondo capitolo",
          date: new Date("2026-08-20"),
          status: "planned",
          focus: ["Human"],
          authorName: "Fabio Ziliani",
          collaborator: true,
        },
        {
          title: "Futura del secondo capitolo",
          date: new Date("2026-10-10"),
          status: "planned",
          focus: ["Human"],
          authorName: "Fabio Ziliani",
          collaborator: true,
        },
      ],
      upcomingTeaser: undefined,
    },
  },
  {
    // Capitolo annunciato ma ancora senza tappe: non deve rompere nulla.
    id: "it/arco-3",
    data: {
      arcKey: "arco-3",
      order: 3,
      numeral: "III",
      title: "Capitolo vuoto",
      lead: "Filone deciso, pezzi non ancora definiti.",
      period: "In definizione",
      signature: "arco corale",
      items: [],
      upcomingTeaser: { label: "In arrivo", text: "Presto." },
    },
  },
];
