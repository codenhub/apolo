import { I18n, setI18nInstance, type I18nConfig, type LocaleDirection } from ".";
import { DEFAULT_LOCALE, LOCALES, LOCALE_MANIFEST, type Locale } from "./manifest";

const i18nConfig: I18nConfig<Locale> = {
  defaultLocale: DEFAULT_LOCALE,
  locales: LOCALES,
  getLocaleFile: (locale) => LOCALE_MANIFEST[locale].file,
  getLocaleDirection: (locale): LocaleDirection => LOCALE_MANIFEST[locale].dir,
  isLocale: (value: string): value is Locale => LOCALES.includes(value as Locale),
};

export const i18n = new I18n(i18nConfig);

export const initI18n = async (): Promise<void> => {
  setI18nInstance(i18n);
  await i18n.init();
};
