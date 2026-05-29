import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import i18nValidatePlugin from "./index";

const originalCwd = process.cwd();

const LOCALE_MANIFEST = {
  "en-US": { file: "/data/locales/en-US.json" },
  "pt-BR": { file: "/data/locales/pt-BR.json" },
} as const;

interface MinimalConfig {
  build: {
    rollupOptions: {
      input: string;
    };
  };
}

const writeJson = (path: string, value: unknown): void => {
  writeFileSync(path, `${JSON.stringify(value)}\n`);
};

const setupProject = (): string => {
  const root = mkdtempSync(join(tmpdir(), "i18n-plugin-"));
  const localesDir = join(root, "src", "public", "data", "locales");

  mkdirSync(localesDir, { recursive: true });
  mkdirSync(join(root, "src"), { recursive: true });
  writeFileSync(join(root, "src", "index.html"), `<h1 data-i18n="home.hero.headline">Headline</h1>`);
  writeJson(join(localesDir, "en-US.json"), { "home.hero.headline": "Headline" });
  writeJson(join(localesDir, "pt-BR.json"), { "home.hero.headline": "Titulo" });
  process.chdir(root);

  return root;
};

const runBuildStart = (): void => {
  const plugin = i18nValidatePlugin({ localeManifest: LOCALE_MANIFEST });
  const config: MinimalConfig = { build: { rollupOptions: { input: "./src/index.html" } } };

  if (typeof plugin.configResolved !== "function" || typeof plugin.buildStart !== "function") {
    throw new Error("i18nValidatePlugin hooks are not available");
  }

  plugin.configResolved.call({}, config as Parameters<typeof plugin.configResolved>[0]);
  plugin.buildStart.call({} as Parameters<typeof plugin.buildStart>[0]);
};

describe("i18nValidatePlugin", () => {
  let root: string | undefined;

  afterEach(() => {
    process.chdir(originalCwd);

    if (root !== undefined) {
      rmSync(root, { force: true, recursive: true });
      root = undefined;
    }
  });

  it("should validate locale files declared in LOCALE_MANIFEST", () => {
    root = setupProject();

    expect(() => runBuildStart()).not.toThrow();
  });

  it("should reject non-string locale values", () => {
    root = setupProject();
    writeJson(join(root, "src", "public", "data", "locales", "pt-BR.json"), { "home.hero.headline": 123 });

    expect(() => runBuildStart()).toThrow(/non-string values: home\.hero\.headline/);
  });

  it("should reject locale files not declared in LOCALE_MANIFEST", () => {
    root = setupProject();
    writeJson(join(root, "src", "public", "data", "locales", "fr-FR.json"), { "home.hero.headline": "Titre" });

    expect(() => runBuildStart()).toThrow(
      /Unsupported locale files not declared in LOCALE_MANIFEST: data\/locales\/fr-FR\.json/,
    );
  });
});
