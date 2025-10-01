<template>

  <reveal-container :reveal="props?.reveal || true">
    <ListManagerField v-model="value"
                  v-bind="{...$attrs}"
                  :form="form"
                  :error-message="errorMessage?.[name]"
                  :name="name">

      <template #list-item="{ value, index }">
        <v-list-item-title>{{ rt(titles.find(title => rt(title.code) === 'mr').name) }} {{ value.firstName }} {{ value.lastName }}</v-list-item-title>
        <v-list-item-subtitle class="text-high-emphasis">
          <span class="text-base" v-if="value.fromDate">{{ $t('constants.fromDate')}}: {{ new Date(value.fromDate).toLocaleDateString() }}</span>
          <span class="text-base" v-if="value.toDate"> - {{ new Date(value.toDate).toLocaleDateString()}}</span>
        </v-list-item-subtitle>
      </template>

      <template #default="{ fieldValues, errorMessages }">
        <component
          v-for="([key, field]) in Object.entries(form.fields)" :key="key"
          :is="componentMap[field.component] || InputField"
          :name="`${key}`"
          clearable
          class="mt-[5px]"
          :field-id="`${key}`"
          v-model="fieldValues[key]"
          :error-message="errorMessages || {}"
          v-bind="field.props"
        />
      </template>

    </ListManagerField>
  </reveal-container>
</template>

<script setup>
import ListManagerField from "~/components/Fields/ListManagerField.vue";
import InputField from "~/components/Fields/InputField.vue";
import SelectField from "~/components/Fields/SelectField.vue";
import RevealContainer from "~/components/Fields/RevealContainer.vue";

const props = defineProps({
  name: String,
  modelValue: {
    type: Array,
    default: () => []
  },
  form: Object,
  reveal: [Boolean, Function],
  errorMessage: {
    type: Object,
    default: () => ({})
  },
})

const {tm, rt} = useI18n()
const titles = tm('lists.titles')

const componentMap = {
  InputField,
  SelectField
}

const value = ref([])
value.value = props.modelValue.slice()


</script>