import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getPublishedPosts, getSlugFromEntryId, getBlogPostUrl } from "../utils/blog";
import { BLOG } from "../config";

export async function GET(context: APIContext) {
  const posts = await getPublishedPosts("it");

  return rss({
    title: `${BLOG.name} — Blog`,
    description:
      "Riflessioni su ingegneria del software, leadership e telecomunicazioni.",
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: getBlogPostUrl("it", getSlugFromEntryId(post.id)),
      categories: post.data.tags,
    })),
    customData: "<language>it-IT</language>",
  });
}
