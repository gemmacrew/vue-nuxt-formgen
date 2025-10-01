<template>
  <v-app-bar :elevation="2" scroll-behavior="hide"  >
    <template v-slot:prepend>
      <v-app-bar-nav-icon @click="showNavBar = !showNavBar" />
    </template>

    <v-app-bar-title><nuxt-link href="/">{{ $t('components.header.title') }}</nuxt-link></v-app-bar-title>

    <template v-slot:append>
      <v-select
        variant="plain"
        v-model="selectedLocale"
        return-object
        style="width: 150px; margin: auto"
        :items="locales"
      >
        <template #selection="{item, index}">
          <div>
            <span :class="`fi fi-${item.raw.flagCode} mr-1`"></span>
            {{ item.title }}
          </div>
        </template>
        <template v-slot:item="{ props: itemProps, item }">
          <v-list-item v-bind="itemProps" :title="item.raw.title">
            <template #prepend>
              <span :class="`fi fi-${item.raw.flagCode} mr-2`"></span>
            </template>
          </v-list-item>
        </template>
      </v-select>
      <slot/>
    </template>
  </v-app-bar>
</template>


<script setup lang="ts">
import "flag-icons/css/flag-icons.min.css";

const showNavBar = ref(false)
const {locales, setLocale, locale} = useI18n()
const selectedLocale = ref(locales.value.filter(l => l.code === locale.value))
watch(selectedLocale, (newLocale) => {
  setLocale(newLocale.code)
})

watch(showNavBar, (showNavBar) => {
  console.log(showNavBar)
})
</script>

<script setup lang="ts">
</script>
