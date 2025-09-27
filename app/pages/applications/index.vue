<template>
  <application-form v-if="ready" :application="application" @update="Object.assign(application, $event)"
                    @pay-now="onPayNow"/>
  <v-skeleton-loader v-else type="card"/>
</template>

<script setup>
import ApplicationForm from "~/components/Application/Form.vue";
import {useStorage} from "@vueuse/core";
import {useSchema} from "#shared/composables/useSchema.js";


definePageMeta({
  middleware: ['auth'],
  layout: 'simple',
})

await useUserSession().fetch()

const {user} = useUserSession()
const ready = ref(false)
const application = useStorage('dbs-application', {})
const route = useRoute()
const type = route.query?.type || 'basic'

if (user) {

  if (application.value.type !== type || application.value.email !== user.value.email) {
    // initialise the application
    application.value = {
      id: null,
      type,
      email: user.value.email
    }
  }

  ready.value = true
}

const onPayNow = async () => {

  try {

    const { application: applicationSchema} = useSchema()
    const parsed = applicationSchema.safeParse(application.value)

    if (parsed.success) {
      // application.value.type = 'invalid'
      const response = await $fetch('/api/stripe/checkout/sessions', {
        method: 'POST',
        body: {
          ...application.value,
        },
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
      })

      const {url} = response
      navigateTo(url, {external: true})
    }else {
      console.log(parsed.error.message)
    }

  } catch (ex) {
    console.log(ex)
  }

}


</script>