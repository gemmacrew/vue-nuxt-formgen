<template>

  <reveal-container :reveal="props?.reveal || true">
    <HistoryField v-model="value"
                  v-bind="{...$attrs}"
                  :form="form"
                  :error-message="errorMessage?.[name]"
                  :name="name">

      <template #default="{ fieldValues, errorMessages }">
        <component
          v-for="([key, field]) in Object.entries(form.fields)" :key="key"
          :is="componentMap[field.component] || InputField"
          :name="`${key}`"
          class="mt-2"
          hide-details="auto"
          clearable
          :field-id="`${key}`"
          v-model="fieldValues[key]"
          :error-message="errorMessages || {}"
          v-bind="field.props"
        />
      </template>

    </HistoryField>
  </reveal-container>
</template>

<script setup>
import HistoryField from "~/components/Fields/HistoryField.vue";
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

const componentMap = {
  InputField,
  SelectField
}

const value = ref([])
value.value = props.modelValue.slice()


</script>