import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getCollection } from "astro:content";
import { getPublishedPosts, buildAuthorNameMap } from "../../../../utils/blog";
import { toRssItem, atomSelfLink, ATOM_XMLNS } from "../../../../utils/rss";
import { BLOG } from "../../../../config";

export async function getStaticPaths() {
  const authors = await getCollection("authors", (entry) =>
    entry.id.startsWith("en/")
  );
  return authors.map((entry) => ({
    params: { slug: entry.data.authorKey },
  }));
}

export async function GET(context: APIContext) {
  const slug = context.params.slug as string;

  const allAuthors = await getCollection("authors", (entry) =>
    entry.id.startsWith("en/")
  );
  const authorEntry = allAuthors.find((a) => a.data.authorKey === slug);
  const authorName = authorEntry?.data.name ?? slug;

  const allPosts = await getPublishedPosts("en");
  const posts = allPosts.filter((p) => p.data.authors.includes(slug));
  const authorMap = await buildAuthorNameMap("en");

  return rss({
    title: `${BLOG.name} — ${authorName}`,
    description: `Articles published by ${authorName} on ${BLOG.name}.`,
    site: context.site!,
    xmlns: { dc: "http://purl.org/dc/elements/1.1/", ...ATOM_XMLNS },
    items: posts.map((post) => toRssItem(post, "en", authorMap)),
    customData:
      atomSelfLink(context.site, `/en/authors/${slug}/rss.xml`) +
      "<language>en-GB</language>",
  });
}
