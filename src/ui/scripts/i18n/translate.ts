import { getI18nInstance } from ".";

export const translateOrFallback = (key: string, fallback: string): string => {
  try {
    const i18n = getI18nInstance();

    if (!i18n.ready) {
      return fallback;
    }

    return i18n.translate(key) ?? fallback;
  } catch {
    return fallback;
  }
};
