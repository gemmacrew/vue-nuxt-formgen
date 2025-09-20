<template>
  <reveal-container :reveal="props?.reveal || true">
    <component
      v-for="([key, field]) in Object.entries(props.fields)" :key="key"
      :is="componentMap[field.component] || InputField"
      :name="`${key}`"
      class="mb-3 mt-3"
      :field-id="`${key}`"
      :model-value="fieldValues[key]"
      :error-message="errorMessage"
      @update:model-value="onUpdate($event, key)"
    />
  </reveal-container>
</template>

<script setup>

import InputField from "~/components/Fields/InputField.vue";
import SelectField from "~/components/Fields/SelectField.vue";
import NameHistoryField from "~/components/Fields/NameHistoryField.vue";
import RevealContainer from "~/components/Fields/RevealContainer.vue";

const componentMap = {
  InputField,
  SelectField,
  NameHistoryField,
}

const emits = defineEmits(['update:model-value'])
const props = defineProps({
  name: String,
  fields: {},
  modelValue: {},
  reveal: [Boolean, Function],
  errorMessage: {
    type: Object,
    default: () => ({})
  },
})


const fieldValues = ref({})
Object.keys(props.fields).forEach((key) => {
  fieldValues.value[key] = props.modelValue?.[key]
})
const onUpdate = (data, key) => {
  fieldValues.value[key] = data
}
watch(() => fieldValues, (fieldValues) => {
  emits('update:model-value', fieldValues.value)
}, {deep: true})


</script>