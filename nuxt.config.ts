// https://nuxt.com/docs/api/configuration/nuxt-config
import { Noir } from "./primevue";
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  css: ["@unocss/reset/tailwind-compat.css"],
  primevue: {
    options: {
      theme: {
        preset: Noir,
      },
    },
  },
  modules: [
    "@nuxt/devtools",
    "@nuxt/eslint",
    "@nuxt/content",
    "@nuxt/icon",
    "@nuxt/fonts",
    "@pinia/nuxt",
    "pinia-plugin-persistedstate",
    "@unocss/nuxt",
    "@primevue/nuxt-module",
    "@vueuse/motion/nuxt",
    "@vueuse/motion/nuxt",
  ],
});
