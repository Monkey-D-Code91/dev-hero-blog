import { ui, defaultLang, type Lang } from "./ui";

/** Ricava la lingua dal primo segmento dell'URL (es. /en/ → "en"). */
export function getLangFromUrl(url: URL): Lang {
  const [, segment] = url.pathname.split("/");
  if (segment in ui) return segment as Lang;
  return defaultLang;
}

/** Restituisce il dizionario completo della lingua richiesta. */
export function useTranslations(lang: Lang) {
  return ui[lang];
}

/**
 * Localizza un percorso interno.
 * La lingua di default (it) vive su "/", le altre hanno il prefisso ("/en").
 * localizePath("/", "en")      → "/en/"
 * localizePath("/#about", "en")→ "/en/#about"
 * localizePath("/#about", "it")→ "/#about"
 */
export function localizePath(path: string, lang: Lang): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  if (lang === defaultLang) return clean;
  // mantieni eventuale hash separato dal prefisso lingua
  const [base, hash] = clean.split("#");
  const prefixed = `/${lang}${base === "/" ? "/" : base}`;
  return hash ? `${prefixed}#${hash}` : prefixed;
}

/** URL per passare all'altra lingua mantenendo la sezione corrente (hash gestito lato client). */
export function getAlternateLangPath(currentLang: Lang): string {
  return currentLang === "it" ? "/en/" : "/";
}
