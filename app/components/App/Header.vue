<template>
  <v-app-bar :elevation="2">
    <template v-slot:prepend>
      <v-app-bar-nav-icon></v-app-bar-nav-icon>
    </template>

    <v-app-bar-title>DBS Checks Online</v-app-bar-title>

    <template v-slot:append>
      <v-select
        variant="plain"
        hide-details
        v-model="selectedLocale"
        return-object
        style="width: 150px"
        class="mb-4"
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

      <AuthState>
        <template #default="{ loggedIn }">
          <v-btn
            class="text-none m-5 "
            color="medium-emphasis"
            min-width="92"
            variant="outlined"
            rounded
            v-if="loggedIn"
            @click="onLogout"
          >
            Logout
          </v-btn>
          <template v-else>
            <NuxtLink
              class="m-5"
              to="/auth/login"
            >Login</NuxtLink>
            <v-btn class="text-none m-5 "
                   color="medium-emphasis"
                   min-width="92"
                   variant="outlined"
                   rounded>
              <NuxtLink
                to="/auth/register"
              >Register for Free</NuxtLink>
            </v-btn>
          </template>
        </template>
      </AuthState>

    </template>
  </v-app-bar>
</template>


<script setup lang="ts">
import "flag-icons/css/flag-icons.min.css";

const session = useUserSession()
const localePath = useLocalePath()
const {locales, setLocale, locale} = useI18n()
const selectedLocale = ref(locales.value.filter(l => l.code === locale.value))
watch(selectedLocale, (newLocale) => {
  setLocale(newLocale.code)
})

const items = [
  {text: 'Real-Time', icon: 'mdi-clock'},
  {text: 'Audience', icon: 'mdi-account'},
  {text: 'Conversions', icon: 'mdi-flag'},
]

async function onLogout() {
  session.clear()
  await navigateTo(localePath('/'))
}

async function onApply() {
  await navigateTo(localePath('apply'))
}
</script>

<script setup lang="ts">
</script>
