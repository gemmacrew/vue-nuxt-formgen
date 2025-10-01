// https://nuxt.com/docs/api/configuration/nuxt-config
import {en as vuetifyEn} from "vuetify/locale"

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: {enabled: true},

  css: ['./assets/css/global.scss'],

  runtimeConfig: {
    public: {
      googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY
    }
  },

  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    'vuetify-nuxt-module',
    'nuxt-auth-utils',
    '@nuxtjs/tailwindcss',
    '@vee-validate/nuxt',
    '@pinia/nuxt',
    '@nuxtjs/i18n',
    '@unlok-co/nuxt-stripe'
  ],

  stripe: {
    // Server
    server: {
      key: process.env.STRIPE_SECRET_KEY,
      options: {
        // your api options override for stripe server side
        // https://github.com/stripe/stripe-node?tab=readme-ov-file#configuration
      },
      // CLIENT
    },
    client: {
      key: process.env.STRIPE_PUBLIC_KEY,
      // manualClientLoad: true, // if you want to have control where you are going to load the client
      // your api options override for stripe client side https://stripe.com/docs/js/initializing#init_stripe_js-options
      options: {},
    },
  },

  i18n: {
    locales: [
      {code: 'cy', flagCode: 'gb-wls', file: 'cy-GB.json', title: 'Welsh'},
      {code: 'en', flagCode: 'gb', file: 'en-GB.json', title: 'English'},
      {code: 'fr', flagCode: 'fr', file: 'fr-FR.json', title: 'French'}
    ],
    defaultLocale: 'en',
  },

  pinia: {
    storesDirs: ['./stores/**'],
  },

  veeValidate: {
    // disable or enable auto imports
    autoImports: true,
    // Use different names for components
  },

  vuetify: {
    moduleOptions: {
      /* module specific options */
      // disableVuetifyStyles: true,
      styles: {
        configFile: './assets/css/components.scss'
      },
    },
    vuetifyOptions: {
      /* vuetify options */
      locale: {
        locale: 'en',
        fallback: 'en',
        messages: {
          en: {
            // we add the vuetify locales to our locale to prevent warnings in the console
            $vuetify: vuetifyEn,
          }
        }
      },

      theme: {
        defaultTheme: 'dbsTheme', // 'light' | 'dark' | 'system',
        themes: {
          dbsTheme: {
            colors: {
              primary: '#184d72',
              'primary-light': '#9E247B',
              secondary: '#8EC5A8',
              'accent-primary': '#D7D2CB',
              'accent-secondary': '#E0C6AD'
            }
          },
          light: {
            colors: {
              primary: '#00703c'
            }
          },
          dark: {},
        }
      },
    }
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "~/assets/css/_colors.scss" as *;'
        }
      }
    }
  }

})