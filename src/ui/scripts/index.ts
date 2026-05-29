import { initI18n } from "./i18n/config";
import { initTheme } from "./theme";
import "../components/app-shell";

window.addEventListener("load", () => {
  const loader = document.getElementById("loader-container") as HTMLDivElement;
  loader.style.opacity = "0";
  setTimeout(() => {
    loader.remove();
  }, 400);
});

initTheme();
void initI18n().then(() => window.dispatchEvent(new CustomEvent("i18n-ready")));
