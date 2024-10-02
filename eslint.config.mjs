import withNuxt from "./.nuxt/eslint.config.mjs";
import pluginVue from "eslint-plugin-vue";

export default withNuxt([
  ...pluginVue.configs["flat/strongly-recommended"],
  {
    rules: {
      "vue/max-attributes-per-line": [
        "error",
        {
          singleline: {
            max: 1,
          },
          multiline: {
            max: 1,
          },
        },
      ],
      "semi": ["error", "always"],
      "vue/require-v-for-key": "off",
      "vue/multi-word-component-names": "off",
      "vue/html-self-closing":"off",
      "@typescript-eslint/no-unused-vars":"warn",
      "@typescript-eslint/no-explicit-any":"warn",
      quotes: ["error", "double"],
    },
  },
]);
