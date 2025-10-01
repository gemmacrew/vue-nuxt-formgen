<template>
  List All Applications
</template>

<script setup lang="ts">

definePageMeta({
  middleware: ['auth'],
})

const ready = ref(false)
await useUserSession().fetch()

const {user} = useUserSession()
if (user) {
  ready.value = true
}


</script>