import { CF_BEACON_TOKEN } from "../config";
import { isDraftPreview } from "./preview";

/**
 * Token del beacon Cloudflare Web Analytics: la env di build `CF_BEACON_TOKEN`
 * (impostabile da Workers Builds) vince sul valore in src/config.ts.
 */
function beaconToken(): string {
  return process.env.CF_BEACON_TOKEN || CF_BEACON_TOKEN;
}

/**
 * true se emettere il beacon: solo sul deploy di produzione reale e con un
 * token configurato. Escluso in dev e nelle anteprime Workers, che
 * altrimenti sporcherebbero le statistiche con traffico di lavorazione.
 */
export function analyticsToken(): string | null {
  if (!import.meta.env.PROD || isDraftPreview()) return null;
  const token = beaconToken().trim();
  return token || null;
}
