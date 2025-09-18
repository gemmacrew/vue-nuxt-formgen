<template>
  <VApp>
    <AppHeader/>
    <slot/>
    <Snackbar/>
  </VApp>
</template>

<script setup lang="ts">
import Snackbar from "~/components/Snackbar.vue";
</script>
