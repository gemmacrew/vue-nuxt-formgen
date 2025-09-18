<template>
  <div>
    <v-card
      flat
      style="border-width: 2px; border-color: #AAA;"
      :class="{ error: !!errorMessage }"
      class="mx-auto w-full"
    >
      <v-card-title class="d-flex !text-md text-gray-800/75">
        <div class="flex-1 text-base">
          <slot name="title">{{ computedLabel }}</slot>
        </div>
        <div>
          <v-btn color="primary" icon="mdi-plus" style="width: 24px; height: 24px"
                 @click="onClickAddHistoryItem"></v-btn>
        </div>
      </v-card-title>
      <v-list lines="one">
        <v-list-item
          v-for="(value, index) in localHistoryItems"
          :key="index"
          style="border-top: 1px solid #AAA;"
          class="mb-1"
        >
          <template #prepend>
            <v-icon class="opacity-30" size="36">mdi-account-outline</v-icon>
          </template>
          <slot name="list-item" :value="value" :index="index">
            <v-list-item-title>{{
                Object.entries(value).filter(([k, v]) => k !== 'fromDate' && k !== 'toDate').filter(([k, v]) => v).map(([k, v]) => v).join(' ')
              }}
            </v-list-item-title>
            <v-list-item-subtitle class="text-high-emphasis">Since:
              {{ value.fromDate ? new Date(value.fromDate).toLocaleDateString() : '' }}
            </v-list-item-subtitle>
          </slot>

          <template v-slot:append="{ }">
            <v-list-item-action class="flex align-end">
              <v-icon class="opacity-30 m-2" @click="onClickEditHistoryItem(index)">mdi-pencil</v-icon>
              <v-icon class="opacity-30 m-2" @click="onClickDeleteHistoryItem(index)">mdi-close</v-icon>
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

import {useSchema} from "~/composables/useSchema.js";

const emits = defineEmits(['update:model-value', 'save', 'cancel'])
const props = defineProps({
  name: String,
  label: String,
  modelValue: Array,
  value: Object,
  errorMessage: {
    type: Object,
    default: () => ({})
  },
  fieldId: String,
  form: Object,
})

const localHistoryItems = ref(props.modelValue || [])

const showHistoryItemCard = ref(false)
const editIndex = ref(-1)
const fieldValues = ref({})

const schema = useSchema()
const validationSchema = schema[props.form.schema] || {}

Object.keys(props.form.fields).forEach(key => {
  fieldValues.value[key] = null
})

const {meta, errors} = useForm({
  validationSchema
})

const computedLabel = computed(() => {
  return props.label || $t(`components.fields.${props.fieldId}.label`)
})

const computedErrorMessage = computed(() => {

  if (props.errorMessage[props.name]) {
    return $t(`errors.${props.errorMessage[props.name]}`, {key: computedLabel.value})
  }
  return ''
})

const onClickEditHistoryItem = (index) => {
  fieldValues.value = JSON.parse(JSON.stringify(localHistoryItems.value[index]))
  showHistoryItemCard.value = true
  editIndex.value = index
}
const onClickDeleteHistoryItem = (index) => {
  // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
  localHistoryItems.value.splice(index, 1)
}
const onClickAddHistoryItem = () => {
  showHistoryItemCard.value = true

}
const onClickSave = () => {
  if (editIndex.value === -1) {
    localHistoryItems.value.push(fieldValues.value)
  } else {
    localHistoryItems.value[editIndex.value] = fieldValues.value
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

watch(localHistoryItems, (localHistoryItems) => {
  emits('update:model-value', localHistoryItems)
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