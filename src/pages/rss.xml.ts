import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getPublishedPosts, buildAuthorNameMap } from "../utils/blog";
import { toRssItem } from "../utils/rss";
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
    items: posts.map((post) => toRssItem(post, "it", authorMap)),
    customData: "<language>it-IT</language>",
  });
}
