<template>
  <v-app>
    <v-app-bar :elevation="2" scroll-behavior="hide">
      <div class="block lg:hidden">
        <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"/>
      </div>
      <img src="~/assets/images/trust-hands.png" alt="DBS Checks" class="ml-4 w-8">
      <v-app-bar-title>
        <nuxt-link class="text-blue-darken-4" to="/">{{ $t('components.header.title') }}</nuxt-link>
      </v-app-bar-title>
      <div class="hidden lg:inline-flex flex-1 justify-between">
        <NuxtLink class="pl-1 hover:border-red-500 border-white border-l-2 text-center text-blue-darken-4 my-auto"
                  :to="$localePath('which-dbs-check')">Which DBS
          Check?
        </NuxtLink>
        <v-menu transition="slide-y-transition" location="center">
          <template v-slot:activator="{ props }">
            <div v-bind="props" class="pl-1 hover:border-red-500 border-white border-l-2 text-center text-blue-darken-4 my-auto">Apply</div>
          </template>
          <v-list class="mt-[54px]">
            <v-list-item
              v-for="([title, subtitle, type], i) in applications"
              :key="i"
              class="w-[500px]"
              :title="title"
              :subtitle="subtitle"
              :value="title"
              @click="navigateTo( `/apply?type=${type}`)"
            />
          </v-list>
        </v-menu>
        <NuxtLink class="pl-1 hover:border-red-500 border-white border-l-2 text-center text-blue-darken-4 my-auto"
                  :to="$localePath('faq')">FAQ
        </NuxtLink>
        <NuxtLink class="pl-1 hover:border-red-500 border-white border-l-2 text-center text-blue-darken-4 my-auto"
                  :to="$localePath('tracking')">Tracking
        </NuxtLink>
        <div class="ml-10"/>
      </div>
      <template v-slot:append>
        <v-select
          v-if="mounted"
          variant="plain"
          v-model="selectedLocale"
          return-object
          class="m-auto w-auto text-blue-darken-4 "
          :items="locales"
        >
          <template #selection="{item, index}">
            <div class="hidden lg:block">
              <span :class="`fi fi-${item.raw.flagCode} mr-1`"></span>
              {{ item.title }}
            </div>
            <div class="block lg:hidden">
              <span :class="`fi fi-${item.raw.flagCode} mr-1`"></span>
            </div>
          </template>
          <template v-slot:item="{ props: itemProps, item }">
            <v-list-item v-bind="itemProps">
              <template #prepend>
                <span :class="`fi fi-${item.raw.flagCode} mx  -2`"></span>
              </template>
            </v-list-item>
          </template>
        </v-select>
      </template>
    </v-app-bar>

    <slot/>

    <v-navigation-drawer
      v-if="mounted"
      v-model="drawer"
      width="350"
      :location="$vuetify.display.xs ? 'bottom' : undefined"
      temporary
    >
      <v-list lines="two" v-model:opened="open">
        <v-list-item prepend-icon="mdi-home" title="Home" @click="navigateTo( `/`)"></v-list-item>
        <v-list-item prepend-icon="mdi-information-outline" color="primary"
                     title="Which DBS Check?"
                     subtitle="Get help choosing the right DBS check for your requirements"></v-list-item>
        <v-list-group value="Applications">
          <template v-slot:activator="{ props }">
            <v-list-item
              v-bind="props"
              prepend-icon="mdi-account-circle"
              title="Apply"
              subtitle="Make a new application for a DBS Check"
            ></v-list-item>
          </template>

          <v-list-item
            v-for="([title, subtitle, type], i) in applications"
            :key="i"
            :title="title"
            :subtitle="subtitle"
            :value="title"
            @click="navigateTo( `/apply?type=${type}`)"
          />
        </v-list-group>
        <v-list-item prepend-icon="mdi-information-outline" color="primary"
                     title="FAQ" subtitle="Get help with frequently asked questions"></v-list-item>
        <v-list-item prepend-icon="mdi-information-outline" color="primary"
                     title="Tracking" subtitle="Track the progress of your application"></v-list-item>
      </v-list>
    </v-navigation-drawer>
    <Snackbar/>
  </v-app>
</template>

<script setup lang="ts">
import Snackbar from "~/components/Snackbar.vue";
import "flag-icons/css/flag-icons.min.css";

const {locales, setLocale, locale} = useI18n()
const selectedLocale = ref(locales.value.filter(l => l.code === locale.value))
const drawer = ref(false)
const mounted = ref(false)

onMounted(() => {
  mounted.value = true
})
watch(selectedLocale, (newLocale) => {
  setLocale(newLocale.code)
})

const open = ref(['Users'])

const applications = [
  ['Basic DBS Check', 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis', 'basic'],
  ['Standard DBS Check', 'Et harum quidem rerum facilis est et expedita distinctio', 'standard'],
  ['Enhanced DBS Check', 'Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat', 'enhanced'],
]


</script>
