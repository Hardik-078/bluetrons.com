import { defineConfig, globalIgnores } from "eslint/config";
import { fixupConfigRules } from "@eslint/compat";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// typescript-eslint loads TypeScript's JavaScript API, which TypeScript 7 does
// not ship. package.json therefore aliases `typescript` to
// @typescript/typescript6 (the API, and the `tsc6` that `next build` runs) and
// keeps TypeScript 7 as @typescript/native, which still provides `tsc`.
const eslintConfig = defineConfig([
  // eslint-config-next bundles plugins (react, import, jsx-a11y) that still
  // call rule-context methods ESLint 10 removed, such as getFilename(). The
  // fixup restores them until those plugins support ESLint 10.
  ...fixupConfigRules([...nextVitals, ...nextTs]),
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
