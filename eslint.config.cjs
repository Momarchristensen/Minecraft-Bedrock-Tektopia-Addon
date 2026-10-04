const stylistic = require("@stylistic/eslint-plugin")
const tseslint = require("typescript-eslint")
const importNewlines = require("eslint-plugin-import-newlines")
const { createTypeScriptImportResolver } = require("eslint-import-resolver-typescript")
const importX = require("eslint-plugin-import-x")


module.exports = [
  { ignores: ["dist/**", "build/**", "node_modules/**", "**/*.d.ts"] },
  {
    files: ["**/*.ts"],
    linterOptions: { reportUnusedDisableDirectives: "warn" },
    plugins: {
      "@stylistic": stylistic,
      "@typescript-eslint": tseslint.plugin,
      "import-newlines": importNewlines,
      "import-x": importX,
    },
    settings: {
      "import-x/extensions": [".ts", ".js"],
      "import-x/parsers": {
        "@typescript-eslint/parser": [".ts"],
      },
      "import-x/resolver-next": [
        createTypeScriptImportResolver({ alwaysTryTypes: true }),
      ],
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
        projectService: true,
        tsconfigRootDir: __dirname
      },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": ["warn", {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
      }],
      "curly": "warn",
      "no-dupe-keys": "warn",
      "consistent-return": "warn",
      "no-else-return": "warn",
      "no-unneeded-ternary": "warn",
      "no-unmodified-loop-condition": "warn",
      "no-unsafe-negation": "warn",
      "prefer-spread": "warn",
      "no-new-func": "warn",
      "array-callback-return": "warn",
      "no-useless-call": "warn",
      "eqeqeq": ["warn", "always"],


      "import-newlines/enforce": ["warn", { items: 1, "max-len": Infinity }],

      // Formatting rules (core versions are deprecated in favor of @stylistic)
      "@stylistic/quotes": ["warn", "double"],
      "@stylistic/semi": ["warn", "never"],
      "@stylistic/comma-dangle": ["warn", "never"],
      "@stylistic/operator-linebreak": ["warn", "after"],

      "@stylistic/brace-style": [
        "warn",
        "stroustrup",
        { "allowSingleLine": false },
      ],

      "@stylistic/no-multiple-empty-lines": ["warn", { max: 1, maxBOF: 0, maxEOF: 0 }],
      "@stylistic/eol-last": ["warn", "always"],
      "@stylistic/no-trailing-spaces": "warn",
      "@stylistic/lines-between-class-members": ["warn", "always", { exceptAfterSingleLine: true }],

      "@stylistic/padding-line-between-statements": [
        "warn",
        { blankLine: "always", prev: "import", next: "*" },
        { blankLine: "always", prev: "import", next: "import" },

        { blankLine: "always", prev: "*", next: ["function", "class"] },
        { blankLine: "always", prev: ["function", "class"], next: "*" },

        { blankLine: "always", prev: "*", next: "export" },
        { blankLine: "any", prev: "export", next: "export" },
      ],

      "@stylistic/indent": ["warn", 4, { ImportDeclaration: 1 }],

      "import-x/no-cycle": ["warn", { maxDepth: Infinity, ignoreExternal: true }],


      "@typescript-eslint/no-floating-promises": "warn",
      "@typescript-eslint/no-misused-promises": "warn",
      "@typescript-eslint/await-thenable": "warn",
      "@typescript-eslint/switch-exhaustiveness-check": "warn",
      "@typescript-eslint/no-unnecessary-condition": ["warn", {
        allowConstantLoopConditions: "only-allowed-literals"
      }],
      "@typescript-eslint/no-unnecessary-type-assertion": "warn",

      "@typescript-eslint/prefer-nullish-coalescing": ["warn", {
        ignorePrimitives: { boolean: true }
      }],

      "@typescript-eslint/prefer-optional-chain": "warn",
      "@typescript-eslint/only-throw-error": ["warn", {
        allow: [
          {
            from: "package",
            package: "@bedrock-apis/env-types",
            name: ["Error", "TypeError", "RangeError"]
          }
        ]
      }],



      "@typescript-eslint/consistent-type-imports": ["warn", { fixStyle: "inline-type-imports" }],
      "@typescript-eslint/no-non-null-assertion": "warn",
      "@typescript-eslint/ban-ts-comment": "warn",
      "@typescript-eslint/no-shadow": "warn",
      "@typescript-eslint/no-use-before-define": ["warn", { functions: false }],
      "@typescript-eslint/no-import-type-side-effects": "warn",
      "@typescript-eslint/array-type": ["warn", { default: "array-simple" }],
      "@typescript-eslint/consistent-type-definitions": ["warn", "interface"],


      "prefer-const": "warn",
      "no-var": "warn",
      "object-shorthand": "warn",
      "prefer-template": "warn",
      "prefer-arrow-callback": "warn",
      "no-eval": "warn",
      "@typescript-eslint/no-implied-eval": "warn",
      "no-fallthrough": "warn",
      "default-case-last": "warn",
      "no-lonely-if": "warn",
      "no-useless-return": "warn",
      "no-useless-concat": "warn",
      "no-await-in-loop": "warn",
      "@typescript-eslint/no-loop-func": "warn",
      "no-self-compare": "warn",
      "no-template-curly-in-string": "warn",
      "no-implicit-coercion": "warn",
      "@typescript-eslint/dot-notation": "warn",
      "radix": "warn",
      "no-param-reassign": "warn",


      "@stylistic/object-curly-spacing": ["warn", "always"],
      "@stylistic/comma-spacing": "warn",
      "@stylistic/key-spacing": "warn",
      "@stylistic/keyword-spacing": "warn",
      "@stylistic/space-infix-ops": "warn",
      "@stylistic/space-before-blocks": "warn",
      "@stylistic/space-before-function-paren": ["warn", { anonymous: "always", named: "never", asyncArrow: "always" }],
      "@stylistic/arrow-parens": ["warn", "as-needed"],
      "@stylistic/quote-props": ["warn", "as-needed"],
      "@stylistic/type-annotation-spacing": "warn",
      "@stylistic/member-delimiter-style": ["warn", {
        multiline: { delimiter: "none" },
        singleline: { delimiter: "comma", requireLast: false }
      }],
      "@stylistic/no-multi-spaces": "warn",
      "@stylistic/no-whitespace-before-property": "warn",
      "@stylistic/block-spacing": "warn",
      "@stylistic/comma-style": "warn",


      "import-x/no-unresolved": "warn",
      "import-x/first": "warn",
      "import-x/no-self-import": "warn",
      "import-x/no-useless-path-segments": "warn",
      "import-x/no-duplicates": "warn",
      "import-x/order": ["warn", {
        groups: ["builtin", "external", "internal", "parent", "sibling", "index", "type"],
        alphabetize: { order: "asc", caseInsensitive: true }
      }],

      "@stylistic/no-extra-parens": ["warn", "all", {
        nestedBinaryExpressions: false,
        ignoredNodes: ["ArrowFunctionExpression[body.type=ConditionalExpression]"]
      }],

      "@stylistic/no-mixed-operators": "warn",


      "@typescript-eslint/strict-boolean-expressions": ["warn", {
        allowString: false,
        allowNumber: false,
        allowNullableObject: false,
        allowNullableBoolean: true,
        allowNullableString: false,
        allowNullableNumber: false,
        allowNullableEnum: false,
        allowAny: false
      }],

      "@typescript-eslint/prefer-for-of": "warn",

      "@stylistic/max-statements-per-line": ["warn", { max: 1 }],
    }
  },
]
//Install Command: npm install --save-dev eslint typescript @stylistic/eslint-plugin typescript-eslint eslint-plugin-import-newlines eslint-plugin-import-x eslint-import-resolver-typescript