<template>

  <div class="select-field">
    <v-autocomplete
      v-if="type ==='autocomplete'"
      v-bind="$attrs"
      variant="outlined"
      v-model="value"
      :label="computedLabel"
      @blur="onBlur"
      autocomplete="off"
      :items="computedItems"
      item-title="name"
      item-value="code"
      :error-messages="computedErrorMessage"
      :class="{ required: meta.required, dirty: meta.dirty, valid: meta.valid, invalid: !meta.valid, touched: meta.touched }"
    >
      <template #selection="{ item }">
        {{ item ? item.raw.name : ''}}
      </template>
    </v-autocomplete>
    <v-select
      v-else
      v-bind="$attrs"
      variant="outlined"
      v-model="value"
      :label="computedLabel"
      @blur="onBlur"
      autocomplete="off"
      :items="computedItems"
      item-title="name"
      item-value="code"
      :error-messages="computedErrorMessage"
      :class="{ required: meta.required, dirty: meta.dirty, valid: meta.valid, invalid: !meta.valid, touched: meta.touched }"
    />
  </div>

</template>

<script setup>
import {useField} from 'vee-validate';


const props = defineProps({
  name: String,
  type: String,
  label: String,
  modelValue: String,
  itemsReference: [String, Array],
  fieldId: String,
  errorMessage: {
    type: Object,
    default: () => ({})
  },
});

const {tm, rt} = useI18n()
const {value, meta, handleBlur} = useField(() => props.name, undefined, {
  syncVModel: true,
});

const onBlur = () => {
  // handleChange()
  handleBlur()
}
const computedItems = computed(() => {
  if (props.itemsReference) {
    return []
      .concat(props.itemsReference)
      .map(itemsReference => tm(itemsReference))
      .filter(itemsReference => Array.isArray(itemsReference))
      .reduce((acc, itemsReference, index) => {
        const items = itemsReference.map(item => ({code: rt(item.code), name: rt(item.name)}))
        if (index > 0) {
          acc.push({type: 'subheader', code: '', name: ''})
        }
        return acc.concat(items)
      }, [])
  }
  return []
})
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

.v-list-subheader {
  border-bottom: 1px solid #ccc;
  min-height: 5px !important;
}
</style>


