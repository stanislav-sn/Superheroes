import globals from "globals";
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import prettierRecommended from "eslint-config-prettier";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import("eslint").Linter.FlatConfig[]} */
export default [
  js.configs.recommended,

  ...tseslint.configs.recommended,

  {
    ignores: [
      "node_modules/",
      "dist/",
      "build/",
      ".next/",
      ".turbo/",
      "pnpm-lock.yaml",
      "apps/*/dist/",
      "apps/*/build/",
    ],
  },

  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: ["./tsconfig.json", "./apps/*/tsconfig.json"],
        tsconfigRootDir: __dirname,
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "no-console": ["warn", { allow: ["warn", "error"] }],
    },
  },

  prettierRecommended,

  {
    files: ["apps/backend/**/*.ts"],
    rules: {
      "no-console": "off",
    },
  },
];
