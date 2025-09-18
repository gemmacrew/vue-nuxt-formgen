// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: {enabled: true},

  css: ['./assets/css/global.scss'],

  modules: [
    '@nuxt/content',
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    'vuetify-nuxt-module',
    'nuxt-auth-utils',
    '@nuxtjs/tailwindcss',
    '@vee-validate/nuxt',
    '@pinia/nuxt',
    '@nuxtjs/i18n'
  ],

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
        fallback: 'en'
      },

      theme: {
        defaultTheme: 'dbsTheme', // 'light' | 'dark' | 'system',
        themes: {
          dbsTheme: {
            colors: {
              primary: '#52247f',
              'primary-light': '#9E247B',
              secondary: '#8EC5A8',
              'accent-primary': '#D7D2CB',
              'accent-secondary': '#E0C6AD'
            }
          },
          light: {
            colors: {
              primary: '#184e72'
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