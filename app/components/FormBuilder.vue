<template>
  <v-card flat class="pt-5">
    <v-row>
      <v-col cols="12" sm="12" md="6" xl="4">
        <v-form @submit.prevent="e => e.preventDefault()">
          <template v-for="([key, field]) in Object.entries(props.fields)" :key="key">
            <component
              :is="componentMap[field.component] || InputField"
              :name="`${key}`"
              :field-id="key"
              :model-value="fieldValues[key]"
              v-bind="field.props"
              :error-message="errors"
              :readonly="readonly"
              :clearable="!readonly"
              class="mt-[5px]"
              @update:model-value="onUpdate($event, key)"/>
          </template>

        </v-form>
      </v-col>
      <v-col cols="12" sm="12" md="6" xl="8">
        <div
          style="height: 100%;
          border: 1px solid #E2E2E2;
          background-color: rgba(253,241,220,0.44);">

        </div>
      </v-col>
    </v-row>

  </v-card>

</template>
<script setup>

import InputField from "~/components/Fields/InputField.vue";
import NameListManager from "~/components/Fields/NameListManager.vue";
import AddressListManager from "~/components/Fields/AddressListManager.vue";
import SelectField from "~/components/Fields/SelectField.vue";
import RadioField from "~/components/Fields/RadioField.vue";
import CheckboxField from "~/components/Fields/CheckboxField.vue";
import {useForm} from "vee-validate";
import {toTypedSchema} from "@vee-validate/zod";
import {useSchema} from '#shared/composables/useSchema.ts'

const {t, tm, rt, te} = useI18n()
const emits = defineEmits(['update'])
const props = defineProps({
  formName: String,
  data: {
    type: Object,
    required: true,
  },
  fields: {
    type: Object,
    default: () => ({}),
  }
})

const componentMap = {
  InputField,
  SelectField,
  NameListManager,
  AddressListManager,
  RadioField,
  CheckboxField
}

const readonly = ref(false)
const schema = useSchema()
const {errors, meta} = useForm({
  validationSchema: toTypedSchema(schema[props.formName] || {}),
})

const notes = ref(tm(`forms.${props.formName}.notes`))
const fieldValues = ref({})

Object.keys(props.fields).forEach((key) => {
  if (Object.prototype.hasOwnProperty.call(props.data, key)) {
    fieldValues.value[key] = props.data[key]
  }
})

watch(() => props.data, (data) => {
  Object.keys(props.fields).forEach((key) => {
    if (data[key]) {
      fieldValues.value[key] = data[key]
    }
  })

}, {deep: true})

watch(() => meta, (meta) => {
  emits('update', {values: fieldValues.value, meta: meta.value})
}, {deep: true})

const onUpdate = (data, key) => {
  fieldValues.value[key] = data
}
watch(() => fieldValues, (fieldValues) => {
  emits('update', {values: fieldValues.value, meta: meta.value})
}, {deep: true})


</script>