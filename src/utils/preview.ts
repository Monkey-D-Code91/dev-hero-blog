/**
 * Anteprima di lavoro con bozze — per il gruppo di feedback.
 *
 * Le build di anteprima di Cloudflare Workers Builds (ogni branch diverso da
 * `main`, es. le PR) includono anche gli articoli con `draft: true`, con
 * `noindex` e un banner ben visibile. La produzione (`main`) resta identica:
 * draft esclusi, nessun banner.
 *
 * Rilevamento: Workers Builds valorizza `WORKERS_CI_BRANCH` con il branch in
 * build. In locale o in CI si può forzare con `PREVIEW_DRAFTS=1 npm run build`.
 */

/** true se questa build è un'anteprima di lavoro (bozze incluse, noindex). */
export function isDraftPreview(): boolean {
  const branch = process.env.WORKERS_CI_BRANCH;
  return (
    process.env.PREVIEW_DRAFTS === "1" || (Boolean(branch) && branch !== "main")
  );
}

/** true se i draft vanno inclusi: sempre in dev, in build solo se anteprima. */
export function includeDrafts(): boolean {
  return !import.meta.env.PROD || isDraftPreview();
}
