import js from "@eslint/js";
import pluginVue from "eslint-plugin-vue";
import configPrettier from "eslint-config-prettier";
import globals from "globals";

export default [
  {
    ignores: ["dist/**", "coverage/**", "node_modules/**", "playwright-report/**", "test-results/**", "*.html"]
  },
  js.configs.recommended,
  ...pluginVue.configs["flat/essential"],
  configPrettier,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      }
    },
    rules: {
      "no-console": "warn",
      "no-unused-vars": "warn"
    }
  }
];
