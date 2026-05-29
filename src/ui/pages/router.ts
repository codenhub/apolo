const DEFAULT_ROUTE_ID = "practice";

type RouteId = "practice" | "tools" | "settings";

interface AppRoute {
  id: RouteId;
  path: string;
  titleKey: string;
  fallbackTitle: string;
  navIconHtml: string;
  pageTag: string;
}

export const appRoutes: AppRoute[] = [
  {
    id: "practice",
    path: "/practice",
    titleKey: "nav.practice",
    fallbackTitle: "Practice",
    navIconHtml: `<i class="ic-music-2 app-nav__icon" aria-hidden="true"></i>`,
    pageTag: "practice-page",
  },
  {
    id: "tools",
    path: "/tools",
    titleKey: "nav.tools",
    fallbackTitle: "Tools",
    navIconHtml: `<i class="ic-wrench app-nav__icon" aria-hidden="true"></i>`,
    pageTag: "tools-page",
  },
  {
    id: "settings",
    path: "/settings",
    titleKey: "nav.settings",
    fallbackTitle: "Settings",
    navIconHtml: `<i class="ic-settings app-nav__icon" aria-hidden="true"></i>`,
    pageTag: "settings-page",
  },
];

export const getCurrentRoutePath = (): string => {
  const hashPath = window.location.hash.slice(1);

  return hashPath.startsWith("/") ? hashPath : getDefaultRoute().path;
};

export const startRouter = (root: HTMLElement): void => {
  root.className = "app-shell";
  root.innerHTML = `
    <app-nav></app-nav>
    <div class="app-shell__main" tabindex="-1"></div>
  `;

  const renderRoute = (): void => {
    const route = resolveRoute();
    const outlet = root.querySelector<HTMLElement>(".app-shell__main");

    if (outlet === null) {
      return;
    }

    outlet.innerHTML = `<${route.pageTag}></${route.pageTag}>`;
  };

  window.addEventListener("hashchange", renderRoute);
  renderRoute();
};

const resolveRoute = (): AppRoute => {
  const route = appRoutes.find((routeItem) => routeItem.path === getCurrentRoutePath());

  if (route !== undefined) {
    return route;
  }

  const defaultRoute = getDefaultRoute();
  window.location.hash = defaultRoute.path;
  return defaultRoute;
};

const getDefaultRoute = (): AppRoute => {
  const defaultRoute = appRoutes.find((route) => route.id === DEFAULT_ROUTE_ID);

  if (defaultRoute === undefined) {
    throw new Error(`[Router] Missing default route "${DEFAULT_ROUTE_ID}".`);
  }

  return defaultRoute;
};
