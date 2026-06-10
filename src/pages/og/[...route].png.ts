import type { APIRoute, GetStaticPaths } from "astro";
import { getCollection } from "astro:content";
import { getLangFromEntryId, buildAuthorNameMap } from "../../utils/blog";
import { renderOgImage } from "../../utils/og";

/**
 * Route immagine OG per ogni articolo: /og/<id>.png (es. /og/it/slug.png).
 * Genera i PNG a build-time (sito statico), uno per post in ogni lingua.
 */
export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getCollection("blog", (entry) =>
    import.meta.env.PROD ? !entry.data.draft : true
  );
  const names = {
    it: await buildAuthorNameMap("it"),
    en: await buildAuthorNameMap("en"),
  };

  return posts.map((post) => {
    const lang = getLangFromEntryId(post.id);
    return {
      params: { route: post.id },
      props: {
        title: post.data.title,
        authorName: names[lang].get(post.data.author) ?? post.data.author,
        lang,
      },
    };
  });
};

export const GET: APIRoute = async ({ props }) => {
  const png = await renderOgImage(
    props as { title: string; authorName: string; lang: "it" | "en" }
  );
  return new Response(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
