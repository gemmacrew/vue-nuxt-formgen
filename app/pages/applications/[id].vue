<template>
  <application-form v-if="ready" :application="application" @update="Object.assign(application, $event)" @pay-now="onPayNow"/>
  <v-skeleton-loader v-else type="card" />
</template>
<script setup>

import ApplicationForm from "~/components/Application/Form.vue";
import {useStorage} from "@vueuse/core";

definePageMeta({
  middleware: ['auth'],
  layout: 'simple',
})

const ready = ref(false)
const application = useStorage('dbs-application', {})
const route = useRoute()
const id = route.params.id

try {

  const {data} = await $fetch(`/api/applications/${id}`)
  application.value = data
  ready.value = true

} catch (ex) {
  console.log(ex)
}

const onPayNow = async () => {

  try {

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

  } catch (ex) {
    console.log(ex)
  }

}


</script>
