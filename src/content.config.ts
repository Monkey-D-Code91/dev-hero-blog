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
      /** authorKey dell'autore — chiave condivisa con la collection `authors`. */
      author: z.string(),
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

export const collections = { blog, authors };
