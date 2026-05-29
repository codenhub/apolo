import { i18n } from "../scripts/i18n/config";

const PAGE_TITLE_KEY = "nav.practice";
const PAGE_TITLE_FALLBACK = "Practice";

class PracticePage extends HTMLElement {
  private readonly onLocaleChange = (): void => this.render();

  connectedCallback(): void {
    i18n.addEventListener("ready", this.onLocaleChange);
    i18n.addEventListener("locale-change", this.onLocaleChange);
    this.render();
  }

  disconnectedCallback(): void {
    i18n.removeEventListener("ready", this.onLocaleChange);
    i18n.removeEventListener("locale-change", this.onLocaleChange);
  }

  private render(): void {
    const title = this.getText(PAGE_TITLE_KEY, PAGE_TITLE_FALLBACK);
    document.title = `${title} | Apolo`;
    this.innerHTML = `
      <section class="app-page" aria-labelledby="practice-page-title">
        <p class="app-page__eyebrow">Apolo</p>
        <h1 id="practice-page-title" class="app-page__title">${title}</h1>
        <div class="app-page__content"></div>
      </section>
    `;
  }

  private getText(key: string, fallback: string): string {
    if (!i18n.ready) {
      return fallback;
    }

    return i18n.translate(key) ?? fallback;
  }
}

if (!customElements.get("practice-page")) {
  customElements.define("practice-page", PracticePage);
}
