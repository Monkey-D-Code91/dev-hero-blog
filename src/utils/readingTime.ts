import readingTime from "reading-time";
import type { Lang } from "../i18n/ui";

/**
 * Calcola il tempo di lettura stimato da un corpo di testo (entry.body).
 * Restituisce una stringa localizzata, es. "5 min di lettura" / "5 min read".
 */
export function getReadingTime(body: string | undefined, lang: Lang): string {
  if (!body) return "";
  const { minutes } = readingTime(body);
  const rounded = Math.max(1, Math.round(minutes));
  return lang === "it" ? `${rounded} min di lettura` : `${rounded} min read`;
}
