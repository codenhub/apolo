export const DEFAULT_LOCALE = "en-US";

export const LOCALE_MANIFEST = {
  "en-US": {
    code: "en-US",
    label: "English",
    dir: "ltr",
    icon: "/assets/icons/locales/en-US.webp",
    file: "/data/locales/en-US.json",
  },
  "pt-BR": {
    code: "pt-BR",
    label: "Portugues (Brasil)",
    dir: "ltr",
    icon: "/assets/icons/locales/pt-BR.webp",
    file: "/data/locales/pt-BR.json",
  },
} as const;

export type Locale = keyof typeof LOCALE_MANIFEST;

export const LOCALES = Object.keys(LOCALE_MANIFEST) as Locale[];
