/// <reference types="vitest" />
import { getViteConfig } from "astro/config";

/**
 * Config Vitest via `getViteConfig` di Astro (setup ufficiale per testare
 * moduli che vivono dentro un progetto Astro). Nei test la collection API
 * (`astro:content`) viene mockata con fixture: si testano le logiche pure
 * (accoppiamento IT/EN, ereditarietà roadmap→blog, ordinamenti e filtri),
 * non il loader dei contenuti reali.
 */
export default getViteConfig({
  test: {
    include: ["tests/**/*.test.ts"],
  },
});
