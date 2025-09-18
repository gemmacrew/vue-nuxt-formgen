<template>
  <template>
    <NuxtLayout>
      <div class="mt-20 mx-2 h-full mb-2">
        <NuxtPage/>
      </div>
    </NuxtLayout>
  </template>
</template>
<script setup>

const appConfig = useAppConfig()
const googleMapsApiKey = appConfig.googleMapsApiKey
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
