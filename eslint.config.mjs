import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    ignores: [".next/**", "node_modules/**", "dist/**", "tests/**", "out/**"],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  ...compat.config({
    plugins: ["boundaries"],
    settings: {
      "boundaries/elements": [
        { type: "ui", pattern: "src/domain/*/ui/**/*" },
        { type: "runtime", pattern: "src/domain/*/runtime/**/*" },
        { type: "service", pattern: "src/domain/*/service/**/*" },
        { type: "repo", pattern: "src/domain/*/repo/**/*" },
        { type: "config", pattern: "src/domain/*/config/**/*" },
        { type: "types", pattern: "src/domain/*/types/**/*" },
        { type: "providers", pattern: "src/providers/**/*" },
      ],
    },
    rules: {
      "boundaries/element-types": [
        2,
        {
          default: "disallow",
          rules: [
            { from: "ui", allow: ["runtime", "service", "repo", "config", "types", "providers"] },
            { from: "runtime", allow: ["service", "repo", "config", "types", "providers"] },
            { from: "service", allow: ["repo", "config", "types", "providers"] },
            { from: "repo", allow: ["config", "types", "providers"] },
            { from: "config", allow: ["types"] },
            { from: "types", allow: [] },
            { from: "providers", allow: ["types"] },
          ],
        },
      ],
    },
  }),
];

export default eslintConfig;
