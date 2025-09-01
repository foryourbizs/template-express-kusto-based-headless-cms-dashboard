import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
  {
    rules: {
      // TypeScript 관련 규칙 완화
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
      
      // React 관련 규칙 완화
      "react-hooks/exhaustive-deps": "off",
      "react/no-unescaped-entities": "off",
      
      // Next.js 관련 규칙 완화
      "@next/next/no-img-element": "off",
      
      // 접근성 관련 규칙 완화
      "jsx-a11y/alt-text": "off",
      
      // 일반 JavaScript 규칙 완화
      "no-unused-vars": "off",
      "no-console": "off",
      "prefer-const": "off",
      
      // Import 관련 규칙 완화
      "import/no-anonymous-default-export": "off",
      
      // 기타 유용한 규칙들만 warning으로 설정
      "no-debugger": "warn",
      "no-duplicate-case": "error",
      "no-empty": "warn",
      "no-unreachable": "warn",
    },
  },
];

export default eslintConfig;
