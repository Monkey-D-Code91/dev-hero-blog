import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getPublishedPosts, getSlugFromEntryId, getBlogPostUrl, buildAuthorNameMap } from "../../utils/blog";
import { BLOG } from "../../config";

export async function GET(context: APIContext) {
  const posts = await getPublishedPosts("en");
  const authorMap = await buildAuthorNameMap("en");

  return rss({
    title: `${BLOG.name} — Blog`,
    description:
      "Critical thinking in a sea of generated content. Tech, human & AI.",
    site: context.site!,
    xmlns: { dc: "http://purl.org/dc/elements/1.1/" },
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: getBlogPostUrl("en", getSlugFromEntryId(post.id)),
      categories: post.data.tags,
      customData: post.data.authors
        .map((key) => `<dc:creator>${authorMap.get(key) ?? key}</dc:creator>`)
        .join(""),
    })),
    customData: "<language>en-GB</language>",
  });
}
