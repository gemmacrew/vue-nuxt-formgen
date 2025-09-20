<template>
  <div>
    <v-card class="w-full rounded-lg border h-full">
      <v-card-title>
        <img src="~/assets/images/trust-hands.png" alt="DBS Checks" class="mx-auto w-20">
        <div style="font-size: 24px;" class="text-center">
          {{ $t('pages.apply.title') }}
        </div>
      </v-card-title>
      <v-card-subtitle>
        <div class="mt-1 text-base text-pretty text-muted text-center">
          {{ $t('pages.apply.subtitle') }}
        </div>
      </v-card-subtitle>
      <v-card-text>
        <v-stepper color="primary" alt-labels class="ring-0"
                   v-model="activeFormIndex"
                   style="box-shadow: none;">
          <template v-slot:default="{ prev, next }">
            <v-stepper-header>
              <template v-for="([formName, formConfig], index) in Object.entries(formsConfig)"
                        :key="`stepper-item-${formName}`">
                <v-stepper-item :value="index" :complete="formConfig.valid === true">
                  <template #title>
                    <div class="hidden md:block">{{ $t(`forms.${formName}.title`) }}</div>
                  </template>
                </v-stepper-item>
                <v-divider class="border-opacity-100" v-if="index < Object.entries(formsConfig).length - 1"/>
              </template>
            </v-stepper-header>
            <v-stepper-window class="mt-5 ml-2 mr-2">

              <template v-for="([formName, formConfig], index) in Object.entries(formsConfig)"
                        :key="`stepper-window-item-${formName}`">
                <v-stepper-window-item :value="index">
                  <FormBuilder :form-name="formName" :data="application" @update="onUpdateForm($event, formName)"
                               :fields="formConfig.fields"/>
                </v-stepper-window-item>
              </template>

            </v-stepper-window>
            <div>
              <v-btn color="primary" @click="prev" :disabled="activeFormIndex === 0">
                Previous
              </v-btn>
              <v-btn color="primary" class="float-end" @click="next"
                     v-if="activeFormIndex < Object.entries(formsConfig).length - 1"
                     :disabled="!(Object.values(formsConfig)[activeFormIndex]?.valid === true)">
                Next
              </v-btn>
              <v-btn v-else color="primary" class="float-end" @click="onClickPayNow"
                     :disabled="!(Object.values(formsConfig)[activeFormIndex]?.valid === true)">
                Pay Now
              </v-btn>
            </div>
          </template>
        </v-stepper>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>

import {useStorage} from '@vueuse/core'
import FormBuilder from "~/components/FormBuilder.vue";
import {deepmerge} from "deepmerge-ts";

definePageMeta({
  middleware: ['auth'],
})

const activeFormIndex = ref()
const formsConfig = ref({})
const appConfig = useAppConfig()
const application = useStorage('dbs-application', {})
const {applicationTypes, applicationForms} = appConfig
const route = useRoute()
const type = route.query?.type || 'basic'

await useUserSession().fetch()
const { user } = useUserSession()

// initialise the application
application.value.type = type
application.value.email = user.value.email

formsConfig.value = Object.entries(applicationTypes[type].forms).reduce((mergedFormsConfig, [key, value]) => {
  return deepmerge(mergedFormsConfig, {[key]: applicationForms[key]})
}, {})

const onUpdateForm = ({values, meta}, formName) => {
  Object.assign(application.value, values)
  formsConfig.value[formName].valid = meta.valid
}

const onClickPayNow = async () => {
  const res = await $fetch('/api/stripe/checkout', {
    method: 'POST',
    body: {
      application: application.value
    },
    headers: {
      'Content-Type': 'application/json'
    },
  })
  navigateTo(res.url, {external: true})
}

</script>


<style lang="scss">

.v-stepper-item {

  flex-basis: fit-content !important;

  .v-avatar {
    background-color: rgb(7, 47, 66) !important;
  }

  font-size: 16px;

  &--selected {

    background-color: #E2E2E250;

    .v-stepper-item__title {
      //text-decoration: underline;
    }
  }

  &--complete {

    .v-avatar {
      background-color: #8EC5A8 !important;
    }
  }
}

</style>
