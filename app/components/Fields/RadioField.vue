<template>
  <reveal-container :reveal="props?.reveal || true" class="radio-field">
    <v-radio-group
      v-model="value"
      color="secondary"
      :name="name"
      inline
      hide-details="auto"
      v-bind="$attrs"
      @blur="onBlur"
      :label="computedLabel"
      :error-messages="computedErrorMessage">
      <v-radio v-for="option in options" @blur="onBlur" :name="name" :label="$t(`constants.${option.label}`)" :value="option.value" :key="option.value"/>
    </v-radio-group>
  </reveal-container>

</template>

<script setup>
import {useField} from "vee-validate";
import RevealContainer from "~/components/Fields/RevealContainer.vue";

const props = defineProps({
  name: String,
  type: String,
  label: String,
  modelValue: [Boolean, String],
  options: {
    type: Array,
    default: () => [{
      label: 'yes',
      value: true
    }, {
      label: 'no',
      value: false
    }]
  },
  errorMessage: {
    type: Object,
    default: () => ({})
  },
  fieldId: String,
  reveal: [Boolean, Function],
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