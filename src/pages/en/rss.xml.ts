import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getPublishedPosts, getSlugFromEntryId, getBlogPostUrl } from "../../utils/blog";
import { SITE } from "../../config";

export async function GET(context: APIContext) {
  const posts = await getPublishedPosts("en");

  return rss({
    title: `${SITE.name} — Blog`,
    description:
      "Thoughts on software engineering, leadership and telecommunications.",
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: getBlogPostUrl("en", getSlugFromEntryId(post.id)),
      categories: post.data.tags,
    })),
    customData: "<language>en-GB</language>",
  });
}
