import { getI18nInstance } from "../scripts/i18n";
import { translateOrFallback } from "../scripts/i18n/translate";
import { appRoutes } from "../scripts/router/routes";
import { getCurrentRoutePath } from "../scripts/router/url";

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
    try {
      const i18n = getI18nInstance();
      i18n.addEventListener("ready", this.onLocaleChange);
      i18n.addEventListener("locale-change", this.onLocaleChange);
    } catch {
      window.addEventListener("i18n-ready", this.onLocaleChange, { once: true });
    }
  }

  private removeI18nListeners(): void {
    try {
      const i18n = getI18nInstance();
      i18n.removeEventListener("ready", this.onLocaleChange);
      i18n.removeEventListener("locale-change", this.onLocaleChange);
    } catch {
      window.removeEventListener("i18n-ready", this.onLocaleChange);
    }
  }

  private render(): void {
    const currentPath = getCurrentRoutePath();

    this.innerHTML = `
      <nav class="app-nav" aria-label="Primary">
        <a class="app-nav__brand" href="#${appRoutes[0].path}" aria-label="Apolo">
          <i class="ic-music size-7" aria-hidden="true"></i>
          <span>Apolo</span>
        </a>
        <div class="app-nav__links">
          ${appRoutes
            .map((route) => {
              const isActive = route.path === currentPath;
              const labelId = `${NAV_LABEL_ID_PREFIX}-${route.id}`;
              const label = translateOrFallback(route.titleKey, route.fallbackTitle);

              return `
                <a
                  class="app-nav__link${isActive ? " active" : ""}"
                  href="#${route.path}"
                  aria-current="${isActive ? "page" : "false"}"
                  aria-labelledby="${labelId}"
                >
                  ${route.navIconHtml}
                  <span id="${labelId}" class="app-nav__label">${label}</span>
                </a>
              `;
            })
            .join("")}
        </div>
      </nav>
    `;
  }
}

if (!customElements.get("app-nav")) {
  customElements.define("app-nav", AppNav);
}
