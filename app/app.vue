<template>
  <template>
    <NuxtLayout>

        <NuxtPage/>

    </NuxtLayout>
  </template>
</template>
<script setup>

const runtimeConfig = useRuntimeConfig()
const googleMapsApiKey = runtimeConfig.public.googleMapsApiKey

useHead({
  script: [{
    src: `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&callback=initMap&v=weekly`
  }]
})

</script>

<style lang="scss">

.invalid {

  &.touched, &.dirty {
    .v-field {
      background-color: #F308082A !important;
    }
  }
}

.valid {
  &.dirty, &.touched {
    .v-field {
      background-color: #e8f0fe !important;
    }
  }
}


</style>
