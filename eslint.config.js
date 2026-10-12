import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

export default [
  { ignores: ["dist"] },
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: "latest",
        ecmaFeatures: { jsx: true },
        sourceType: "module",
      },
    },
    plugins: {
      react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      // Marks variables used as JSX components (e.g. a prop destructured as
      // `icon: Icon` and rendered as <Icon />) as used, so no-unused-vars stops
      // reporting false positives for them.
      "react/jsx-uses-vars": "error",
      // Vite-template default: tolerate unused UPPER-CASE names. Note that
      // genuine dead imports are still tolerated by this pattern - see the
      // offer in the summary to prune the ~30 of them now that
      // react/jsx-uses-vars stops the JSX false positives.
      "no-unused-vars": ["error", { varsIgnorePattern: "^[A-Z_]" }],
      "react-refresh/only-export-components": [
        "warn",
        {
          allowConstantExport: true,
          // shadcn/ui files intentionally export helpers next to their
          // component (variant maps, context hooks) - not a fast-refresh issue.
          allowExportNames: [
            "badgeVariants",
            "buttonVariants",
            "useAuth",
            "useCart",
          ],
        },
      ],
    },
  },
];
