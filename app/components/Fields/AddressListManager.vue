<template>

  <ListManagerField v-model="value"
                v-bind="{...$attrs}"
                :form="form"
                :error-message="errorMessage?.[name]"
                :name="name">

    <template #list-item="{ value, index }">
      <v-list-item-title>{{ value.streetNumber }} {{ value.route }}, {{ value.locality }}</v-list-item-title>
      <v-list-item-title>{{ value.postalTown }}, {{ value.administrativeAreaLevel2 }}</v-list-item-title>
      <v-list-item-title>{{ value.postalCode }}</v-list-item-title>
      <v-list-item-subtitle class="text-high-emphasis">
        <span class="text-base" v-if="value.fromDate">{{ $t('constants.fromDate')}}: {{ new Date(value.fromDate).toLocaleDateString() }}</span>
        <span class="text-base" v-if="value.toDate"> - {{ new Date(value.toDate).toLocaleDateString()}}</span>
      </v-list-item-subtitle>
    </template>
    <template v-slot:default="{ fieldValues, errorMessages }">

      <v-autocomplete
        return-object
        :model-value="selectedAddress"
        :placeholder="$t('components.fields.searchAddress.placeholder')"
        :search="search"
        :custom-filter="() => true"
        hide-no-data
        class="mt-[5px]"
        autocomplete="off"
        @update:search="search = $event"
        @update:model-value="onUpdateValue($event, fieldValues)"
        variant="outlined"
        :items="items">
      </v-autocomplete>

      <component
        v-for="([key, field], index) in Object.entries(form.fields)" :key="key"
        :is="componentMap[field.component] || InputField"
        :name="`${key}`"
        clearable
        class="mt-[5px]"
        hide-details="auto"
        :field-id="`${key}`"
        v-model="fieldValues[key]"
        :error-message="errorMessages || {}"
        v-bind="field.props"
      />

    </template>

  </ListManagerField>

</template>

<script setup>

import InputField from "~/components/Fields/InputField.vue";
import ListManagerField from "~/components/Fields/ListManagerField.vue";
import SelectField from "~/components/Fields/SelectField.vue";

const props = defineProps({
  name: String,
  modelValue: {
    type: Array,
    default: () => []
  },
  form: Object,
  errorMessage: {
    type: Object,
    default: () => ({})
  },
})

const componentMap = {
  InputField,
  SelectField
}

const selectedAddress = ref()
const search = ref('')
const items = ref([])
const value = ref([])
value.value = props.modelValue.slice()

let geocoder
let token
let autocompleteSuggestion

onMounted(async () => {
  const {AutocompleteSessionToken, AutocompleteSuggestion} =
    await google.maps.importLibrary("places");

  geocoder = new google.maps.Geocoder();
  token = new AutocompleteSessionToken();
  autocompleteSuggestion = AutocompleteSuggestion
})

async function doLookup(search) {

  const includeTypes = ['street_address', 'premise', 'subpremise', 'route']
  const includeFn = result => includeTypes.some(type => result.types.includes(type))

  geocoder.geocode({address: search}, async (results, status) => {
      //if its a postcode lookup get the closest addresses based on location
      if (results && results[0]?.types.find(t => t.startsWith('postal_code'))) {
        const latlng = results[0].geometry.location
        geocoder.geocode({location: latlng}, (results, status) => {

          if (status === 'OK') {
            items.value = results.filter(includeFn).map(result => ({
              title: result.formatted_address,
              value: result.place_id,
            }))
          }
        })
      } else {
        let request = {
          input: search,
          language: "en-GB",
          region: "gb",
          sessionToken: token
        };

        // Fetch autocomplete suggestions.
        const {suggestions} =
          await autocompleteSuggestion.fetchAutocompleteSuggestions(request);

        items.value = suggestions.map(suggestion => suggestion.placePrediction).map(placePrediction => ({
          title: placePrediction.text.toString(),
          value: placePrediction.placeId
        }))
      }
    }
  )
}

const onUpdateValue = async (selectedAddress, fieldValues) => {
  if (selectedAddress) {
    const {value: placeId} = selectedAddress
    geocoder.geocode({placeId}, async (results, status) => {
      if (status === 'OK') {
        Object.keys(props.form.fields).forEach(key => {
          fieldValues[key] = results[0].address_components.find(c => c.types.includes(toSnakeCase(key)))?.long_name
        })
      }
    })
  }
}
const toSnakeCase = (e) => {
  return e.match(/([A-Z])/g) ? e.match(/([A-Z])/g).reduce(
    (str, c) => str.replace(new RegExp(c), '_' + c.toLowerCase()),
    e
  )
    .substring((e.slice(0, 1).match(/([A-Z])/g)) ? 1 : 0) : e;
};

watch(search, async (newSearch) => {
  if (newSearch.length > 2) {
    await doLookup(newSearch)
  } else {
    items.value = []
  }

}, {debounce: 500, deep: true})

</script>