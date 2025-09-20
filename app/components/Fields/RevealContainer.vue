<template>

  <template v-if="isDynamic">
    <div ref="outerContainer" :style="outerStyle"
         class="relative overflow-hidden transition-all duration-500 reveal-container">
      <div ref="innerContainer" @resize="onResize" :style="innerStyle"
           class="relative overflow-hidden transition-all duration-500">
        <slot/>
      </div>
    </div>
  </template>
  <template v-else>
    <div ref="outerContainer"
         class="relative overflow-hidden transition-all duration-250 reveal-container">
      <div ref="innerContainer" @resize="onResize"
           class="relative overflow-hidden transition-all duration-250">
        <slot/>
      </div>
    </div>

  </template>

</template>

<script setup>

import {useStorage} from "@vueuse/core";

const props = defineProps({
  reveal: {
    type: [Boolean, Function],
    default: () => true,
  },
})

const innerContainer = ref()
const outerHeight = ref(0)
const application = useStorage('dbs-application', {})
const isDynamic = computed(() => typeof props.reveal === 'function')
const computedReveal = ref(isDynamic.value ? props.reveal(application.value) : props.reveal)

if (typeof props.reveal === 'function') {
  watch(() => application.value, (application) => {
    computedReveal.value = props.reveal(application)
  }, {deep: true})
}

const outerStyle = computed(() => {
  if (computedReveal.value) {
    return `height: ${outerHeight.value}px;`
  } else {
    return `height: 0px;`
  }
})
const innerStyle = computed(() => {
  if (computedReveal.value) {
    return `top: 0px;`
  } else {
    return `top: -${outerHeight.value}px`
  }
})

watch(innerContainer, (innerContainer) => {
  if (innerContainer) {
    const ro = new ResizeObserver(onResize)
    ro.observe(innerContainer)
    outerHeight.value = innerContainer.getClientRects()[0]?.height
  }
}, {deep: true})

const onResize = () => {
  outerHeight.value = innerContainer.value?.getClientRects()[0]?.height || 0
}


</script>