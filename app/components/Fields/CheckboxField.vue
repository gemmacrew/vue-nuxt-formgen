<template>
  <div class="checkbox-field">
    <v-checkbox
      v-model="value"
      color="secondary"
      :name="name"
      inline
      v-bind="$attrs"
      @blur="onBlur"
      :label="computedLabel"
      :error-messages="computedErrorMessage" />
  </div>

</template>

<script setup>
import {useField} from "vee-validate";

const props = defineProps({
  name: String,
  type: String,
  label: String,
  modelValue: [String, Date],
  errorMessage: {
    type: Object,
    default: () => ({})
  },
  fieldId: String,
});

const {value, meta, handleBlur} = useField(() => props.name, undefined, {
  syncVModel: true,
});

value.value = props.modelValue

const onBlur = () => {
  handleBlur()
}

const computedLabel = computed(() => {
  return props.label || $t(`components.fields.${props.fieldId}.label`)
})


const computedErrorMessage = computed(() => {
  if ((meta.touched || meta.dirty) && props.errorMessage[props.name]) {
    return $t(`errors.${props.errorMessage[props.name]}`, {key: computedLabel.value})
  }
  return ''
})


</script>


<style lang="scss">


</style>