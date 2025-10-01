<template>
  <reveal-container :reveal="props?.reveal || true" class="input-field">
    <v-date-input
      v-if="props.type === 'date'"
      :label="computedLabel"
      v-bind="$attrs"
      input-format="dd/mm/yyyy"
      :display-format="data => data.toLocaleDateString()"
      prepend-icon=""
      append-inner-icon="$calendar"
      variant="outlined"
      v-model="value"
      @blur="handleBlur"
      :error-messages="computedErrorMessage"
      :class="{ dirty: meta.dirty, valid: meta.valid, invalid: !meta.valid, touched: meta.touched }"
    />
    <v-textarea
      v-else-if="props.type === 'textarea'"
      :label="computedLabel"
      v-bind="$attrs"
      variant="outlined"
      v-model="value"
      @blur="handleBlur"
      :error-messages="computedErrorMessage"
      :class="{ dirty: meta.dirty, valid: meta.valid, invalid: !meta.valid, touched: meta.touched }"
    />
    <v-text-field
      v-else-if="props.type === 'number'"
      :label="computedLabel"
      variant="outlined"
      type="number"
      v-model="value"
      v-bind="$attrs"
      @blur="handleBlur"
      :class="{ dirty: meta.dirty, valid: meta.valid, invalid: !meta.valid, touched: meta.touched }"
      :error-messages="computedErrorMessage"
      />
    <v-text-field
      v-else
      :label="computedLabel"
      variant="outlined"
      v-model="value"
      v-bind="$attrs"
      @blur="handleBlur"
      :class="{ dirty: meta.dirty, valid: meta.valid, invalid: !meta.valid, touched: meta.touched }"
      :error-messages="computedErrorMessage"
    />
  </reveal-container>

</template>

<script setup>
import {useField} from 'vee-validate';
import RevealContainer from "~/components/Fields/RevealContainer.vue";

const props = defineProps({
  name: String,
  type: String,
  label: String,
  modelValue: [String, Date],
  fieldId: String,
  reveal: [Boolean, Function],
  errorMessage: {
    type: Object,
    default: () => ({})
  },
});


// const errorMessage = ref('')
const {value, meta, handleBlur, errors} = useField(() => props.name, undefined, {
  syncVModel: true,
});

value.value = props.modelValue

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


