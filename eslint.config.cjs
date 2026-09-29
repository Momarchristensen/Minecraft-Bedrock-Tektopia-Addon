const stylistic = require("@stylistic/eslint-plugin-js")
const tseslint = require("typescript-eslint")
const importNewlines = require("eslint-plugin-import-newlines")


module.exports = [
  {
    files: ["**/*.ts"],
    plugins: {
      "@stylistic": stylistic,
      "@typescript-eslint": tseslint.plugin,
      "import-newlines": importNewlines,
    },
    languageOptions: {
      globals: {
        console: "readonly",
        eval: "readonly",
      },
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
      },
    },
    rules: {
      "no-extra-parens": ["warn", "all"],
      "no-undef": "warn",
      "@typescript-eslint/no-unused-vars": ["warn", {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
      }],
      "curly": "warn",
      "quotes": ["warn", "double"],
      "no-dupe-keys": "warn",
      "consistent-return": "warn",
      "no-else-return": "warn",
      "no-unneeded-ternary": "warn",
      "no-duplicate-imports": "warn",
      "semi": ["warn", "never"],
      "no-throw-literal": "warn",
      "no-unmodified-loop-condition": "warn",
      "no-unsafe-negation": "warn",
      "prefer-spread": "warn",
      "no-new-func": "warn",
      "array-callback-return": "warn",
      "no-useless-call": "warn",
      "comma-dangle": ["warn", "never"],


      "@stylistic/brace-style": [
        "warn",
        "stroustrup",
        { "allowSingleLine": false },
      ],

      "eqeqeq": ["warn", "always"],
      "operator-linebreak": ["warn", "none"],

      "import-newlines/enforce": ["warn", { items: 1, "max-len": Infinity }],
    },
  },
]
//npm install --save-dev eslint @stylistic/eslint-plugin-js typescript-eslint eslint-plugin-import-newlines