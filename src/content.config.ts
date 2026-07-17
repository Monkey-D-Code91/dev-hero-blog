import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      /** Chiave condivisa tra IT ed EN dello stesso articolo — usata per lo switch lingua. */
      translationKey: z.string(),
      tags: z.array(z.string()).default([]),
      cover: image().optional(),
      coverAlt: z.string().optional(),
      /** I draft sono esclusi dalla build di produzione. */
      draft: z.boolean().default(false),
      /**
       * Se l'articolo è stato pubblicato originariamente altrove (Medium, dev.to,
       * blog personale), dichiara l'URL canonico esterno per consolidare il valore
       * SEO sulla fonte originale.
       */
      canonicalUrl: z.string().url().optional(),
      /**
       * Autori dell'articolo — uno o più authorKey condivisi con la
       * collection `authors`. Si accetta sia `authors: [..]` (forma canonica,
       * anche per co-autori) sia il legacy `author: ".."` (singolo);
       * il transform normalizza sempre a `authors` (array non vuoto).
       */
      author: z.string().optional(),
      authors: z.array(z.string()).optional(),
    })
    .transform((data, ctx) => {
      const authors = data.authors?.length
        ? data.authors
        : data.author
          ? [data.author]
          : [];
      if (authors.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Specificare almeno un autore nel campo 'authors'.",
        });
        return z.NEVER;
      }
      return { ...data, authors };
    }),
});

/**
 * Collection `authors` — un profilo per autore, bilingue.
 * Mirror del pattern dei post: cartella per lingua (it/ en/) + chiave
 * `authorKey` condivisa tra le due versioni per collegarle.
 * La bio lunga ("about") sta nel body markdown; i dati strutturati nel frontmatter.
 */
const authors = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/authors" }),
  schema: ({ image }) =>
    z.object({
      /** Chiave condivisa IT/EN dello stesso autore (es. "marco-mariotti"). */
      authorKey: z.string(),
      name: z.string(),
      role: z.string(),
      /** Hero del profilo. */
      badge: z.string(),
      headline: z.string(),
      subline: z.string(),
      /** Foto opzionale; se assente si usa il monogramma. */
      avatar: image().optional(),
      avatarAlt: z.string().optional(),
      monogram: z.string(),
      /** Link social/esterni. */
      links: z.object({
        linkedin: z.string().url().optional(),
        github: z.string().url().optional(),
        website: z.string().url().optional(),
      }),
      /** Numeri mostrati nella sezione About. */
      stats: z.object({
        years: z.string(),
        teamSize: z.string().optional(),
        countries: z.string().optional(),
      }),
      /** Frase guida della sezione About (i paragrafi stanno nel body). */
      aboutLead: z.string(),
      /** Timeline esperienze (dalla più recente). */
      experience: z.array(
        z.object({
          period: z.string(),
          role: z.string(),
          company: z.string(),
          description: z.string(),
        })
      ),
      /** Griglia competenze per categoria. */
      skills: z.array(
        z.object({
          title: z.string(),
          items: z.array(z.string()),
        })
      ),
    }),
});

/**
 * Collection `roadmap` — la roadmap editoriale pubblica, per ARCO narrativo.
 * Un file per arco per lingua (mirror del pattern bilingue di blog/authors:
 * cartella it/ ed en/ + `arcKey` condivisa tra le due versioni).
 *
 * Le tappe (`items`) pubblicate referenziano il `translationKey` del post
 * corrispondente: titolo, data e URL vengono ereditati dalla collection `blog`
 * a build-time (single source of truth, zero drift). Le tappe di pipeline
 * (non ancora pubblicate, e quindi senza pagina pubblica) portano i propri
 * campi inline.
 */
const roadmap = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/roadmap" }),
  schema: () =>
    z.object({
      /** Chiave condivisa IT/EN dello stesso arco (es. "arco-1"). */
      arcKey: z.string(),
      /** Ordine di visualizzazione degli archi (crescente). */
      order: z.number(),
      /** Etichetta visiva del capitolo (es. "I", "II"). */
      numeral: z.string(),
      title: z.string(),
      /** Occhiello narrativo dell'arco (1-2 frasi). */
      lead: z.string(),
      /** Periodo indicativo dell'arco (es. "Lug – Set 2026"). */
      period: z.string(),
      /** Firma dell'arco (es. "a firma Marco", "arco corale"). */
      signature: z.string(),
      items: z
        .array(
          z
            .object({
              /**
               * Se presente, la tappa è collegata a un post: titolo, data e URL
               * sono ereditati dalla collection `blog` tramite questo translationKey.
               */
              postTranslationKey: z.string().optional(),
              /** Titolo manuale — obbligatorio per le tappe non collegate a un post. */
              title: z.string().optional(),
              /** Data indicativa ISO (YYYY-MM-DD). La granularità di visualizzazione
               *  è decisa a runtime: esatta per i pubblicati e per la prossima tappa,
               *  altrimenti degradata a mese. */
              date: z.coerce.date(),
              status: z.enum(["published", "in-progress", "planned"]),
              /** Focus tematico (es. ["Tech", "AI"]). */
              focus: z.array(z.string()).default([]),
              /** Firma della tappa (es. "Marco Mariotti", "Fabio Ziliani"). */
              authorName: z.string(),
              /** true se firmato da un collaboratore (evidenziazione dedicata). */
              collaborator: z.boolean().default(false),
            })
            .refine((item) => Boolean(item.postTranslationKey || item.title), {
              message:
                "Ogni tappa deve avere 'postTranslationKey' (tappa collegata a un post) oppure 'title' (tappa di pipeline).",
            })
        )
        .default([]),
      /**
       * Teaser opzionale in coda all'arco: un filone ancora in definizione
       * (es. il track etica col collaboratore). Mostrato come invito, senza data.
       */
      upcomingTeaser: z
        .object({
          label: z.string(),
          text: z.string(),
        })
        .optional(),
    }),
});

export const collections = { blog, authors, roadmap };
