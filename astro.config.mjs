import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';
import tailwindcss from '@tailwindcss/vite';

// NOTE: aggiorna `site` con il dominio reale quando sarà disponibile.
// Serve per sitemap, canonical e tag Open Graph.
export default defineConfig({
  site: 'https://www.marcomariotti.dev',
  i18n: {
    locales: ['it', 'en'],
    defaultLocale: 'it',
    routing: {
      prefixDefaultLocale: false,
    },
  },
  integrations: [react(), icon(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
