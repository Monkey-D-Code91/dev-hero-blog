import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getPublishedPosts, buildAuthorNameMap } from "../../utils/blog";
import { toRssItem, atomSelfLink, ATOM_XMLNS } from "../../utils/rss";
import { BLOG } from "../../config";

export async function GET(context: APIContext) {
  const posts = await getPublishedPosts("en");
  const authorMap = await buildAuthorNameMap("en");

  return rss({
    title: `${BLOG.name} · Blog`,
    description:
      "Critical thinking in a sea of generated content. Tech, human & AI.",
    site: context.site!,
    xmlns: { dc: "http://purl.org/dc/elements/1.1/", ...ATOM_XMLNS },
    items: posts.map((post) => toRssItem(post, "en", authorMap)),
    customData: atomSelfLink(context.site, "/en/rss.xml") + "<language>en-GB</language>",
  });
}
