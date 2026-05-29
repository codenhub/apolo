import { i18n } from "../scripts/i18n/config";

const PAGE_TITLE_KEY = "nav.tools";
const PAGE_TITLE_FALLBACK = "Tools";

class ToolsPage extends HTMLElement {
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
      <section class="app-page" aria-labelledby="tools-page-title">
        <h1 id="tools-page-title" class="title">${title}</h1>
        <div class="content"></div>
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

if (!customElements.get("tools-page")) {
  customElements.define("tools-page", ToolsPage);
}
