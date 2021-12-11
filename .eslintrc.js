module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  parserOptions: {
    parser: "babel-eslint",
  },
  extends: [
    "@nuxtjs",
    "prettier",
    "plugin:prettier/recommended",
    "plugin:nuxt/recommended",
    "eslint:recommended",
  ],
  plugins: ["prettier"],
  // add your custom rules here
  rules: {
    "prettier/prettier": [
      "error",
      // 아래 규칙들은 개인 선호에 따라 prettier 문법 적용
      // https://prettier.io/docs/en/options.html
      {
        singleQuote: true,
        semi: true,
        useTabs: false,
        tabWidth: 2,
        endOfLine: "auto",
        trailingComma: "all",
        printWidth: 80,
        bracketSpacing: true,
        arrowParens: "avoid",
      },
    ],
  },
};
