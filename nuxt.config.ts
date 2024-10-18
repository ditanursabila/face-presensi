// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  app: {
    head: {
      meta: [{}],
      link: [{}],
      script: [
        {
          src: "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@latest/dist/tf.min.js",
        },
        {
          src: "https://cdn.jsdelivr.net/npm/@teachablemachine/image@latest/dist/teachablemachine-image.min.js",
        },
      ],
    },
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  runtimeConfig: {
    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_KEY,
    },
  },
  modules: ["@nuxtjs/supabase"],
  supabase: { redirect: false },
});
