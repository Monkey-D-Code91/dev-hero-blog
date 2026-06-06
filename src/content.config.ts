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
    }),
});

export const collections = { blog };
