import { getI18nInstance } from "../scripts/i18n";
import { translateOrFallback } from "../scripts/i18n/translate";

interface RenderPageOptions {
  element: HTMLElement;
  titleKey: string;
  fallbackTitle: string;
  iconHtml: string;
}

export const renderPage = ({ element, titleKey, fallbackTitle, iconHtml }: RenderPageOptions): void => {
  const title = translateOrFallback(titleKey, fallbackTitle);
  document.title = `${title} | Apolo`;
  element.innerHTML = `
    <section class="app-page" aria-labelledby="app-page-title">
      <p class="app-page__eyebrow">Apolo</p>
      <h1 id="app-page-title" class="app-page__title">${title}</h1>
      <div class="app-page__placeholder" aria-hidden="true">
        ${iconHtml}
      </div>
    </section>
  `;
};

export const addPageI18nListeners = (onLocaleChange: EventListener): void => {
  try {
    const i18n = getI18nInstance();
    i18n.addEventListener("ready", onLocaleChange);
    i18n.addEventListener("locale-change", onLocaleChange);
  } catch {
    window.addEventListener("i18n-ready", onLocaleChange, { once: true });
  }
};

export const removePageI18nListeners = (onLocaleChange: EventListener): void => {
  try {
    const i18n = getI18nInstance();
    i18n.removeEventListener("ready", onLocaleChange);
    i18n.removeEventListener("locale-change", onLocaleChange);
  } catch {
    window.removeEventListener("i18n-ready", onLocaleChange);
  }
};
