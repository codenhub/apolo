import "../components/app-nav";
import "./practice-page";
import "./settings-page";
import "./tools-page";
import { startRouter } from "./router";

const root = document.getElementById("app");

if (!(root instanceof HTMLElement)) {
  throw new Error('[Pages] Missing root element "#app".');
}

startRouter(root);
