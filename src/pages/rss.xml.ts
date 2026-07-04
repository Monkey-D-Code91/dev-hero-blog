import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getPublishedPosts, getSlugFromEntryId, getBlogPostUrl, buildAuthorNameMap } from "../utils/blog";
import { BLOG } from "../config";

export async function GET(context: APIContext) {
  const posts = await getPublishedPosts("it");
  const authorMap = await buildAuthorNameMap("it");

  return rss({
    title: `${BLOG.name} — Blog`,
    description:
      "Pensiero critico in un mare di contenuti generati. Tech, human & AI.",
    site: context.site!,
    xmlns: { dc: "http://purl.org/dc/elements/1.1/" },
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: getBlogPostUrl("it", getSlugFromEntryId(post.id)),
      categories: post.data.tags,
      customData: post.data.authors
        .map((key) => `<dc:creator>${authorMap.get(key) ?? key}</dc:creator>`)
        .join(""),
    })),
    customData: "<language>it-IT</language>",
  });
}
