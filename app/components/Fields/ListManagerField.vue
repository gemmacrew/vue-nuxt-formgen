<template>
  <div>
    <v-card
      flat
      style="border-width: 2px; border-color: #AAA;"
      :class="{ error: !!errorMessage?.[name]  }"
      class="mx-auto w-full"
    >
      <v-card-title class="d-flex !text-md text-gray-800/75">
        <div class="flex-1 text-base">
          <slot name="title">{{ computedLabel }}</slot>
        </div>
        <div>
          <v-btn v-bind="{... $attrs }" color="primary" icon="mdi-plus" style="width: 24px; height: 24px"
                 @click="onClickAddHistoryItem"></v-btn>
        </div>
      </v-card-title>

      <v-list lines="one">
        <v-list-item
          v-for="(field, index) in fields"
          :key="index"
          style="border-top: 1px solid #AAA;"
          class="mb-1"
        >
          <template #prepend>
            <v-icon class="opacity-30" size="36">mdi-account-outline</v-icon>
          </template>
          <slot name="list-item" :value="field.value" :index="index">
            <v-list-item-title>{{
                Object.entries(field.value).filter(([k, v]) => k !== 'fromDate' && k !== 'toDate').filter(([k, v]) => v).map(([k, v]) => v).join(' ')
              }}
            </v-list-item-title>
            <v-list-item-subtitle class="text-high-emphasis">
              <span class="text-base" v-if="field.value.fromDate">{{ $t('constants.fromDate')}}: {{ new Date(field.value.fromDate).toLocaleDateString() }}</span>
              <span class="text-base" v-if="field.value.toDate"> - {{ new Date(field.value.toDate).toLocaleDateString()}}</span>
            </v-list-item-subtitle>
          </slot>

          <template v-slot:append="{ }">
            <v-list-item-action class="flex align-end">
              <v-icon class="opacity-30 m-2" v-bind="{... $attrs }" @click="onClickEditHistoryItem(field.key)">mdi-pencil</v-icon>
              <v-icon class="opacity-30 m-2" v-bind="{... $attrs }" @click="onClickDeleteHistoryItem(field.key)">mdi-close</v-icon>
            </v-list-item-action>
          </template>

        </v-list-item>
      </v-list>
    </v-card>
    <v-card-subtitle class="error--text" v-if="errorMessage">{{ computedErrorMessage }}</v-card-subtitle>
    <v-bottom-sheet v-model="showHistoryItemCard" inset scrollable width="600">
      <v-form @submit.prevent="e => e.preventDefault()">
        <v-card>
          <v-card-title>{{ $t(`components.fields.${name}.sheet.label`) }}</v-card-title>

          <v-card-text>

            <slot :fieldValues="fieldValues" :errorMessages="errors"/>

          </v-card-text>
          <div class="flex justify-end mb-6 mr-6  ">
            <v-btn class="mr-1" @click="onClickCancel">Cancel</v-btn>
            <v-btn class="ml-2" color="primary" @click="onClickSave" :disabled="!meta.valid">Save</v-btn>
          </div>
        </v-card>
      </v-form>
    </v-bottom-sheet>
  </div>

</template>

<script setup>

import {useSchema} from "#shared/composables/useSchema.ts";
import {toTypedSchema} from "@vee-validate/zod";

const emits = defineEmits(['update:model-value', 'save', 'cancel'])
const props = defineProps({
  name: String,
  label: String,
  modelValue: {type: Array, default: () => []},
  value: Object,
  errorMessage: String,
  fieldId: String,
  form: Object,
})

const showHistoryItemCard = ref(false)
const editIndex = ref(-1)
const fieldValues = ref({})

const schema = useSchema()
const validationSchema = schema[props.form.schema] || {}

Object.entries(props.form.fields).forEach(([key, value]) => {
  fieldValues.value[key] = value.props?.default || null
})

const {push, remove, fields} = useFieldArray(props.name)
props.modelValue.forEach(item => {
  push(item)
})

const {meta, errors} = useForm({
  validationSchema: toTypedSchema(validationSchema),
})

const computedLabel = computed(() => {
  return props.label || $t(`components.fields.${props.fieldId}.label`)
})

const computedErrorMessage = computed(() => {
  if (props.errorMessage) {
    return $t(`errors.${props.errorMessage}`, {key: computedLabel.value})
  }
  return ''
})

const onClickEditHistoryItem = (index) => {
  fieldValues.value = JSON.parse(JSON.stringify(fields.value.find(field => field.key === index).value))
  showHistoryItemCard.value = true
  editIndex.value = index
}
const onClickDeleteHistoryItem = (index) => {
  // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
  remove(fields.value.findIndex(f => f.key === index))
}
const onClickAddHistoryItem = () => {
  showHistoryItemCard.value = true
}
const onClickSave = () => {
  if (editIndex.value === -1) {
    push(fieldValues.value)
  } else {
    fields.value.find(field => field.key === editIndex.value).value = fieldValues.value
  }

  showHistoryItemCard.value = false
  fieldValues.value = {}
  editIndex.value = -1
}

const onClickCancel = () => {
  showHistoryItemCard.value = false
  fieldValues.value = {}
  editIndex.value = -1
}

watch(() => fields, (fields) => {
  emits('update:model-value', fields.value.map(field => field.value))
}, {deep: true})

</script>


<style lang="scss">

.error {
  border-color: rgb(176, 0, 32) !important;

  &--text {
    opacity: 1 !important;
    color: rgb(176, 0, 32) !important;
  }
}

</style>