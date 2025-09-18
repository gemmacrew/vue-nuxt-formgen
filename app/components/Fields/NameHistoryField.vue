<template>

    <HistoryField v-model="value"
                  v-bind="{...$attrs}"
                  :form="form"
                  :error-message="errors && errors.length ? errors[0] : ''"
                  :name="name">

      <template #default="{ fieldValues, errorMessages }">
        <component
          v-for="([key, field]) in Object.entries(form.fields)" :key="key"
          :is="componentMap[field.component] || InputField"
          :name="`${key}`"
          class="mb-2"
          :field-id="`${key}`"
          v-model="fieldValues[key]"
          :error-message="errorMessages?.[key]"
          v-bind="field.props"
          />
      </template>

    </HistoryField>

</template>

<script setup>
import HistoryField from "~/components/Fields/HistoryField.vue";
import InputField from "~/components/Fields/InputField.vue";
import SelectField from "~/components/Fields/SelectField.vue";
import {useField} from "vee-validate";

const props = defineProps({
  name: String,
  modelValue: Array,
  form: Object
})

const componentMap = {
  InputField,
  SelectField
}

const {value, errors} = useField(() => props.name, undefined, {
  syncVModel: true,
});

value.value = props.modelValue


</script>