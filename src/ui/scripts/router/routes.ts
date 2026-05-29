export const DEFAULT_ROUTE_ID = "practice";

export type RouteId = "practice" | "tools" | "settings";

export interface AppRoute {
  id: RouteId;
  path: string;
  titleKey: string;
  fallbackTitle: string;
  navIconHtml: string;
  pageIconHtml: string;
  pageTag: string;
}

export const appRoutes: AppRoute[] = [
  {
    id: "practice",
    path: "/practice",
    titleKey: "nav.practice",
    fallbackTitle: "Practice",
    navIconHtml: `<i class="ic-music-2 app-nav__icon" aria-hidden="true"></i>`,
    pageIconHtml: `<i class="ic-music-2 size-10" aria-hidden="true"></i>`,
    pageTag: "practice-page",
  },
  {
    id: "tools",
    path: "/tools",
    titleKey: "nav.tools",
    fallbackTitle: "Tools",
    navIconHtml: `<i class="ic-wrench app-nav__icon" aria-hidden="true"></i>`,
    pageIconHtml: `<i class="ic-wrench size-10" aria-hidden="true"></i>`,
    pageTag: "tools-page",
  },
  {
    id: "settings",
    path: "/settings",
    titleKey: "nav.settings",
    fallbackTitle: "Settings",
    navIconHtml: `<i class="ic-settings app-nav__icon" aria-hidden="true"></i>`,
    pageIconHtml: `<i class="ic-settings size-10" aria-hidden="true"></i>`,
    pageTag: "settings-page",
  },
];

export const getDefaultRoute = (): AppRoute => {
  const defaultRoute = appRoutes.find((route) => route.id === DEFAULT_ROUTE_ID);

  if (defaultRoute === undefined) {
    throw new Error(`[Router] Missing default route "${DEFAULT_ROUTE_ID}".`);
  }

  return defaultRoute;
};

export const getRouteByPath = (path: string): AppRoute | undefined => appRoutes.find((route) => route.path === path);
