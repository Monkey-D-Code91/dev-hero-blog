import type { APIRoute, GetStaticPaths } from "astro";
import { renderOgImage } from "../../../utils/og";
import { ui, type Lang } from "../../../i18n/ui";

/**
 * OG image della pagina roadmap: /og/roadmap/<lang>.png (it | en).
 * Brandizzata (logo + titolo + dominio) ma SENZA firma autore: la roadmap è
 * una pagina del blog, non un articolo. Generata a build-time come per gli
 * articoli. `prerender = true` per compatibilità con l'adapter Cloudflare
 * (evita il bundling del binario nativo di resvg).
 */
export const prerender = true;

export const getStaticPaths: GetStaticPaths = async () => {
  return (["it", "en"] as const).map((lang) => ({
    params: { lang },
    props: {
      title: ui[lang].roadmap.heading,
      footerNote: ui[lang].roadmap.eyebrow,
      lang,
    },
  }));
};

export const GET: APIRoute = async ({ props }) => {
  const png = await renderOgImage(
    props as { title: string; footerNote: string; lang: Lang }
  );
  return new Response(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
