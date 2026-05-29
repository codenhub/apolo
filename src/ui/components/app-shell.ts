import "./app-nav";
import "../pages/practice-page";
import "../pages/settings-page";
import "../pages/tools-page";
import { type AppRoute, getDefaultRoute, getRouteByPath } from "../scripts/router/routes";
import { getCurrentRoutePath, navigateToRoute } from "../scripts/router/url";

class AppShell extends HTMLElement {
  private readonly onRouteChange = (): void => this.renderRoute();

  connectedCallback(): void {
    this.innerHTML = `
      <div class="app-shell">
        <app-nav></app-nav>
        <main class="app-shell__main" tabindex="-1"></main>
      </div>
    `;

    window.addEventListener("hashchange", this.onRouteChange);
    this.renderRoute();
  }

  disconnectedCallback(): void {
    window.removeEventListener("hashchange", this.onRouteChange);
  }

  private renderRoute(): void {
    const route = this.resolveRoute();
    const outlet = this.querySelector<HTMLElement>(".app-shell__main");

    if (outlet === null) {
      return;
    }

    outlet.innerHTML = `<${route.pageTag}></${route.pageTag}>`;
  }

  private resolveRoute(): AppRoute {
    const route = getRouteByPath(getCurrentRoutePath());

    if (route !== undefined) {
      return route;
    }

    const defaultRoute = getDefaultRoute();
    navigateToRoute(defaultRoute.path);
    return defaultRoute;
  }
}

if (!customElements.get("app-shell")) {
  customElements.define("app-shell", AppShell);
}
