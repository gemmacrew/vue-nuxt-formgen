<template>
  <application-form :application="application" @update="Object.assign(application, $event)"
                    @pay-now="onPayNow"/>
</template>

<script setup>
import ApplicationForm from "~/components/Application/Form.vue";
import {useStorage} from "@vueuse/core";
import {useSchema} from "#shared/composables/useSchema.ts";

const application = useStorage('dbs-application', {})
const route = useRoute()
const type = route.query?.type || 'basic'

application.value = {
  id: null,
  type
}

const onPayNow = async () => {

  try {

    const {application: applicationSchema} = useSchema()
    const schema = applicationSchema[application.value.type]
    const parsed = schema.safeParse(application.value)

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
    } else {
      console.log(parsed.error.message)
    }

  } catch (ex) {
    console.log(ex)
  }

}

watch(() => route.query?.type, (type) => {
  application.value = {
    id: null,
    type
  }
})

</script>