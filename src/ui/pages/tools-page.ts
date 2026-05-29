import { addPageI18nListeners, removePageI18nListeners, renderPage } from "./page-renderer";
import { appRoutes } from "../scripts/router/routes";

const route = appRoutes[1];

class ToolsPage extends HTMLElement {
  private readonly onLocaleChange = (): void => this.render();

  connectedCallback(): void {
    addPageI18nListeners(this.onLocaleChange);
    this.render();
  }

  disconnectedCallback(): void {
    removePageI18nListeners(this.onLocaleChange);
  }

  private render(): void {
    renderPage({ element: this, titleKey: route.titleKey, fallbackTitle: route.fallbackTitle, iconHtml: route.pageIconHtml });
  }
}

if (!customElements.get("tools-page")) {
  customElements.define("tools-page", ToolsPage);
}
