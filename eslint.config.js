import js from "@eslint/js"

export default [

  {
    ignores: [

      "node_modules/**",

      "client/dist/**",

      "extension/assets/**"

    ]
  },

  js.configs.recommended,

  {

    files: ["**/*.js", "**/*.jsx"],

    languageOptions: {

      ecmaVersion: "latest",

      sourceType: "module",

      parserOptions: {

        ecmaFeatures: {

          jsx: true

        }

      },

      globals: {

        chrome: "readonly",

        window: "readonly",

        document: "readonly",

        navigator: "readonly",

        MutationObserver: "readonly",

        fetch: "readonly",

        URL: "readonly",

        console: "readonly",

        setTimeout: "readonly",

        clearTimeout: "readonly",

        setInterval: "readonly",

        clearInterval: "readonly",

        Navigator: "readonly",

        HTMLCanvasElement: "readonly",

        AudioBuffer: "readonly",

        WebGLRenderingContext: "readonly",

        WebGL2RenderingContext: "readonly",

        Intl: "readonly",

        Object: "readonly",

        Infinity: "readonly"

      }

    },

    rules: {

      "no-unused-vars": "warn",

      "no-console": "off"

    }

  }

]