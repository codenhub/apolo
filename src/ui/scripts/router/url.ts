import { getDefaultRoute } from "./routes";

export const getCurrentRoutePath = (): string => {
  const hashPath = window.location.hash.slice(1);

  return hashPath.startsWith("/") ? hashPath : getDefaultRoute().path;
};

export const navigateToRoute = (path: string): void => {
  window.location.hash = path;
};
