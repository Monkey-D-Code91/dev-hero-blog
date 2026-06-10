import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';
import tailwindcss from '@tailwindcss/vite';

// `site` — usato per sitemap, canonical e tag Open Graph.
export default defineConfig({
  site: 'https://thefirstdraft.dev',
  i18n: {
    locales: ['it', 'en'],
    defaultLocale: 'it',
    routing: {
      prefixDefaultLocale: false,
    },
  },
  integrations: [react(), mdx(), icon(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
    ssr: {
      // @resvg/resvg-js usa un binario nativo .node; va esternalizzato per
      // evitare che Rollup tenti di bundlarlo (rompe la build Cloudflare Pages).
      external: ['@resvg/resvg-js'],
    },
  },
});
