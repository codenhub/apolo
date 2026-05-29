import { i18n } from "../scripts/i18n/config";
import { appRoutes, getCurrentRoutePath } from "../pages/router";

const NAV_LABEL_ID_PREFIX = "app-nav-label";

class AppNav extends HTMLElement {
  private readonly onRouteChange = (): void => this.render();
  private readonly onLocaleChange = (): void => this.render();

  connectedCallback(): void {
    window.addEventListener("hashchange", this.onRouteChange);
    this.addI18nListeners();
    this.render();
  }

  disconnectedCallback(): void {
    window.removeEventListener("hashchange", this.onRouteChange);
    this.removeI18nListeners();
  }

  private addI18nListeners(): void {
    i18n.addEventListener("ready", this.onLocaleChange);
    i18n.addEventListener("locale-change", this.onLocaleChange);
  }

  private removeI18nListeners(): void {
    i18n.removeEventListener("ready", this.onLocaleChange);
    i18n.removeEventListener("locale-change", this.onLocaleChange);
  }

  private getText(key: string, fallback: string): string {
    if (!i18n.ready) {
      return fallback;
    }

    return i18n.translate(key) ?? fallback;
  }

  private render(): void {
    const currentPath = getCurrentRoutePath();

    this.innerHTML = `
      <nav class="app-nav" aria-label="Primary">
        ${appRoutes
          .map((route) => {
            const isActive = route.path === currentPath;
            const labelId = `${NAV_LABEL_ID_PREFIX}-${route.id}`;
            const label = this.getText(route.titleKey, route.fallbackTitle);

            return `
              <a
                class="link tooltip${isActive ? " active" : ""}"
                href="#${route.path}"
                aria-current="${isActive ? "page" : "false"}"
                aria-labelledby="${labelId}"
                data-tooltip="${label}"
                data-tooltip-position="right"
              >
                ${route.navIconHtml}
                <span class="label">${label}</span>
              </a>
            `;
          })
          .join("")}
      </nav>
    `;
  }
}

if (!customElements.get("app-nav")) {
  customElements.define("app-nav", AppNav);
}
