import { i18n } from "../scripts/i18n/config";
import { LOCALE_MANIFEST, LOCALES, type Locale } from "../scripts/i18n/manifest";
import { clearThemePreference, getStoredTheme, setTheme, THEME_CHANGE_EVENT, type Theme } from "../scripts/theme";

const PAGE_TITLE_KEY = "nav.settings";
const PAGE_TITLE_FALLBACK = "Settings";
const LOCALE_MENU_ID = "settings-locale-menu";
const SYSTEM_THEME_VALUE = "system";

type ThemePreference = Theme | typeof SYSTEM_THEME_VALUE;

interface ThemeOption {
  value: ThemePreference;
  iconHtml: string;
  labelKey: string;
  fallback: string;
}

const THEME_OPTIONS: ThemeOption[] = [
  {
    value: SYSTEM_THEME_VALUE,
    iconHtml: `<i class="ic-monitor size-4" aria-hidden="true"></i>`,
    labelKey: "settings.theme.system",
    fallback: "System",
  },
  {
    value: "light",
    iconHtml: `<i class="ic-sun size-4" aria-hidden="true"></i>`,
    labelKey: "settings.theme.light",
    fallback: "Light",
  },
  {
    value: "dark",
    iconHtml: `<i class="ic-moon size-4" aria-hidden="true"></i>`,
    labelKey: "settings.theme.dark",
    fallback: "Dark",
  },
];

const isThemePreference = (value: string): value is ThemePreference => {
  return value === SYSTEM_THEME_VALUE || value === "light" || value === "dark";
};

class SettingsPage extends HTMLElement {
  private isLocaleMenuOpen = false;
  private readonly onLocaleChange = (): void => this.render();
  private readonly onThemeChange = (): void => this.render();
  private readonly onSettingClick = (event: MouseEvent): void => {
    const target = event.target;

    if (!(target instanceof Element)) {
      return;
    }

    const localeToggle = target.closest<HTMLButtonElement>("[data-locale-toggle]");

    if (localeToggle !== null) {
      this.isLocaleMenuOpen = !this.isLocaleMenuOpen;
      this.render();
      return;
    }

    const localeOption = target.closest<HTMLButtonElement>("[data-locale-value]");

    if (localeOption !== null) {
      this.isLocaleMenuOpen = false;
      void this.updateLocale(localeOption.dataset.localeValue ?? "");
      return;
    }

    const themeOption = target.closest<HTMLButtonElement>("[data-theme-value]");

    if (themeOption !== null) {
      this.updateTheme(themeOption.dataset.themeValue ?? "");
      return;
    }

    if (this.isLocaleMenuOpen) {
      this.isLocaleMenuOpen = false;
      this.render();
    }
  };

  connectedCallback(): void {
    i18n.addEventListener("ready", this.onLocaleChange);
    i18n.addEventListener("locale-change", this.onLocaleChange);
    window.addEventListener(THEME_CHANGE_EVENT, this.onThemeChange);
    this.addEventListener("click", this.onSettingClick);
    this.render();
  }

  disconnectedCallback(): void {
    i18n.removeEventListener("ready", this.onLocaleChange);
    i18n.removeEventListener("locale-change", this.onLocaleChange);
    window.removeEventListener(THEME_CHANGE_EVENT, this.onThemeChange);
    this.removeEventListener("click", this.onSettingClick);
  }

  private render(): void {
    const title = this.getText(PAGE_TITLE_KEY, PAGE_TITLE_FALLBACK);
    const localeLabel = this.getText("settings.locale.label", "Language");
    const themeLabel = this.getText("settings.theme.label", "Theme");
    const selectedTheme = getStoredTheme() ?? SYSTEM_THEME_VALUE;
    document.title = `${title} | Apolo`;
    this.innerHTML = `
      <section class="app-page" aria-labelledby="settings-page-title">
        <h1 id="settings-page-title" class="title">${title}</h1>
        <div class="content gap-6">
          ${this.renderLocaleControl(localeLabel)}
          ${this.renderThemeControl({
            label: themeLabel,
            selectedTheme,
          })}
        </div>
      </section>
    `;
  }

  private renderLocaleControl(label: string): string {
    const activeLocale = LOCALE_MANIFEST[i18n.locale];

    return `
      <section class="grid gap-3 md:grid-cols-[1fr_16rem] md:items-center" aria-labelledby="settings-locale-label">
        <h2 id="settings-locale-label" class="text-title-sm">${label}</h2>
        <div class="relative">
          <button class="bg-surface focus:ring-primary flex w-full items-center gap-3 rounded-full p-3 text-left transition duration-200 focus:ring-2 focus:outline-none" type="button" aria-haspopup="listbox" aria-expanded="${this.isLocaleMenuOpen}" aria-controls="${LOCALE_MENU_ID}" data-locale-toggle>
            <img class="size-7 rounded-full object-cover" src="${activeLocale.icon}" alt="" aria-hidden="true" />
            <span class="flex-1 text-sm font-semibold tracking-wide">${activeLocale.label}</span>
            <i class="ic-chevronDown text-text-secondary size-4 transition-transform duration-200 ${this.isLocaleMenuOpen ? "rotate-180" : ""}" aria-hidden="true"></i>
          </button>
          ${this.isLocaleMenuOpen ? this.renderLocaleMenu() : ""}
        </div>
      </section>
    `;
  }

  private renderLocaleMenu(): string {
    return `
      <div id="${LOCALE_MENU_ID}" class="bg-surface absolute right-0 z-10 mt-2 grid w-full gap-3 rounded-3xl p-3" role="listbox">
        ${LOCALES.map((locale) => this.renderLocaleOption(locale)).join("")}
      </div>
    `;
  }

  private renderLocaleOption(locale: Locale): string {
    const { icon, label } = LOCALE_MANIFEST[locale];
    const isSelected = locale === i18n.locale;

    return `
      <button class="focus:ring-primary flex items-center gap-3 rounded-full text-left transition duration-200 hover:translate-x-1 focus:ring-2 focus:outline-none ${isSelected ? "text-primary" : "text-text-secondary hover:text-text"}" type="button" role="option" aria-selected="${isSelected}" data-locale-value="${locale}">
        <img class="size-7 rounded-full object-cover" src="${icon}" alt="" aria-hidden="true" />
        <span class="flex-1 text-sm font-semibold tracking-wide">${label}</span>
      </button>
    `;
  }

  private renderThemeControl(config: { label: string; selectedTheme: ThemePreference }): string {
    return `
      <section class="grid gap-3 md:grid-cols-[1fr_auto] md:items-center" aria-labelledby="settings-theme-label">
        <h2 id="settings-theme-label" class="text-title-sm">${config.label}</h2>
        <div class="bg-surface flex w-fit flex-wrap gap-1 rounded-lg p-1" role="group" aria-label="${config.label}">
          ${this.renderThemeButtons(config.selectedTheme)}
        </div>
      </section>
    `;
  }

  private renderThemeButtons(selectedTheme: ThemePreference): string {
    return THEME_OPTIONS.map((option) => {
      const label = this.getText(option.labelKey, option.fallback);
      const isSelected = option.value === selectedTheme;

      return `
        <button class="focus:ring-primary flex items-center gap-2 rounded-md px-2 py-1 text-sm font-semibold tracking-wide transition duration-200 focus:ring-2 focus:outline-none ${isSelected ? "bg-background text-text" : "text-text-secondary hover:text-text"}" type="button" aria-pressed="${isSelected}" data-theme-value="${option.value}">
          ${option.iconHtml}
          ${label}
        </button>
      `;
    }).join("");
  }

  private updateTheme(value: string): void {
    if (!isThemePreference(value)) {
      this.render();
      return;
    }

    if (value === SYSTEM_THEME_VALUE) {
      clearThemePreference();
      return;
    }

    setTheme(value);
  }

  private async updateLocale(value: string): Promise<void> {
    const isLocale = LOCALES.includes(value as Locale);

    if (!isLocale || !(await i18n.setLocale(value))) {
      this.render();
    }
  }

  private getText(key: string, fallback: string): string {
    if (!i18n.ready) {
      return fallback;
    }

    return i18n.translate(key) ?? fallback;
  }
}

if (!customElements.get("settings-page")) {
  customElements.define("settings-page", SettingsPage);
}
