<template>

  <v-card class="w-[500px] mt-40 mx-auto p-10 rounded-lg border text-center">
    <template #title>
      <v-icon
        class="mb-2"
        color="green-darken-2"
        icon="mdi-check-circle-outline"
        size="48"
      ></v-icon>
      <div style="font-size: 24px;">
        {{ context.title }}
      </div>
    </template>
    <template #subtitle>
      <div class="mt-1 text-base text-pretty text-muted">
        {{ context.subtitle }}.
      </div>
    </template>
    <template #text v-if="session">
      <v-card variant="flat" class="text-left mt-5" style="border-top: 1px solid #E2E2E2;padding-top: 20px;">
        <v-row class="text-base" cols="12" dense>
          <v-col cols="6">{{ $t('constants.applicationNumber') }}:</v-col>
          <v-col cols="6" class="font-light">{{ applicationId }}</v-col>
          <v-col cols="6">{{ $t('constants.transactionDate') }}:</v-col>
          <v-col cols="6" class="font-light">{{ new Date(session.created).toLocaleDateString() }}</v-col>
          <v-col cols="6">{{ $t('constants.amountPaid') }}:</v-col>
          <v-col cols="6" class="font-light">£{{ session.amount_total / 100 }}</v-col>
          <v-col cols="6">{{ $t('constants.customerEmail') }}:</v-col>
          <v-col cols="6" class="font-light">{{ session.customer_details?.email }}</v-col>
        </v-row>

        <div class="mt-10">
          <v-btn
            class="w-full justify-center"
            color="primary"
          >
            Return to DBS Checks Online
          </v-btn>
        </div>

      </v-card>
    </template>


  </v-card>
</template>


<script setup lang="ts">

import {useStorage} from "@vueuse/core";


const props = defineProps({
  isCancelled: {
    type: Boolean,
    default: false
  }
})

const session = ref(null)
const route = useRoute()
const storedApplication = useStorage('dbs-application', {})
const {session_id: sessionId, application_id: applicationId} = route.query


const context = computed(() => {

  if (props.isCancelled) {
    return {
      title: $t('pages.cancelled.title'),
      subtitle: $t('pages.cancelled.subtitle'),
    }
  }

  return {
    title: $t('pages.success.title'),
    subtitle: $t('pages.success.subtitle')
  }
})

if (props.isCancelled) {
  //not to late to revisit the application
  if (sessionId) {
    const {data, success} = await $fetch(`/api/stripe/checkout/sessions/${sessionId}`)
    if (success) {
      session.value = data
      if (data && applicationId) {
        const {data: application, success} = await $fetch(`/api/applications/${applicationId}`)
        application.paymentStatus = 'cancelled'
        application.checkoutSessionId = sessionId
        await $fetch(`/api/applications/${applicationId}`, {
          method: 'PUT',
          body: application
        })
      }
    }
  }

} else {
  storedApplication.value = {}

  if (sessionId) {
    const {data, success} = await $fetch(`/api/stripe/checkout/sessions/${sessionId}`)
    session.value = data
    if (data && applicationId) {
      const {data: application, success} = await $fetch(`/api/applications/${applicationId}`)
      application.paymentStatus = 'paid'
      application.checkoutSessionId = sessionId
      const response = await $fetch(`/api/applications/${applicationId}`, {
        method: 'PUT',
        body: application
      })

      console.log(response)
    }
  }
}


</script>