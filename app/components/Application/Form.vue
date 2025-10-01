<template>
  <div class="mt-20 mx-3">
    <v-card class="w-full rounded-lg border h-full">
      <v-card-title>
        <img src="../../assets/images/trust-hands.png" alt="DBS Checks" class="mx-auto w-20">
        <div style="font-size: 24px;" class="text-center">
          {{ $t(`pages.application.${application.type}.title`) }}
        </div>
      </v-card-title>
      <v-card-subtitle>
        <div class="mt-1 text-base text-pretty text-muted text-center">
          {{ $t(`pages.application.${application.type}.subtitle`) }}
        </div>
      </v-card-subtitle>
      <v-card-text>
        <v-stepper color="primary" alt-labels class="ring-0"
                   v-model="activeFormIndex"
                   style="box-shadow: none;">
          <template v-slot:default="{ prev, next }">
            <v-stepper-header>
              <template v-for="([formName, formConfig], index) in Object.entries(formsConfig)"
                        :key="`stepper-item-${application.type}-${formName}`">
                <v-stepper-item :value="index" :complete="formConfig?.valid === true">
                  <template #title>
                    <div class="hidden md:block">{{ $t(`forms.${formName}.title`) }}</div>
                  </template>
                </v-stepper-item>
                <v-divider class="border-opacity-100" v-if="index < Object.entries(formsConfig).length - 1"/>
              </template>
            </v-stepper-header>
            <v-stepper-window class="mt-5 ml-2 mr-2">
              <template v-for="([formName, formConfig], index) in Object.entries(formsConfig)"
                        :key="`window-item-${application.type}-${formName}`">
                <v-stepper-window-item :value="index">
                  <FormBuilder :form-name="formName" :data="application" @update="onUpdateForm($event, formName)"
                               :fields="formConfig?.fields"/>
                </v-stepper-window-item>
              </template>
            </v-stepper-window>
            <div>
              <v-btn color="primary" @click="prev" :disabled="activeFormIndex === 0">
                {{ $t('constants.previous') }}
              </v-btn>
              <v-btn color="primary" class="float-end" @click="next"
                     v-if="activeFormIndex < Object.entries(formsConfig).length - 1"
                     :disabled="!(Object.values(formsConfig)[activeFormIndex]?.valid === true)">
                {{ $t('constants.next') }}
              </v-btn>
              <v-btn v-if="activeFormIndex === Object.entries(formsConfig).length - 1" color="primary" class="float-end"
                     @click="emits('pay-now', application)"
                     :disabled="!applicationValid">
                {{ $t('constants.payNow') }}
              </v-btn>
              <!--v-btn color="secondary" class="mr-2 float-end" @click="emits('save', application)">
                {{ $t('constants.saveForLater') }}
              </v-btn -->
            </div>
          </template>
        </v-stepper>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>

import FormBuilder from "~/components/FormBuilder.vue";
import {deepmerge} from "deepmerge-ts";
import {useSchema} from '#shared/composables/useSchema.ts'

const activeFormIndex = ref(0)
const appConfig = useAppConfig()
const {applicationTypes} = appConfig

const emits = defineEmits(['update', 'pay-now'])
const props = defineProps({
  application: {}
})
const {application: ApplicationSchema} = useSchema()

const formsConfig = ref({})
const init = (application) => {
  formsConfig.value = Object.entries(applicationTypes[application.type].forms).reduce((mergedFormsConfig, [key, value]) => {
    return deepmerge(mergedFormsConfig, {[key]: value})
  }, {})
}

init(props.application)

const onUpdateForm = ({values, meta}, formName) => {
  emits('update', values)
  formsConfig.value[formName].valid = meta.valid
}

const schema = computed(() => {
  return ApplicationSchema[props.application.type]
})
const applicationValid = computed(() => {
  if (schema.value) {
    return schema.value.safeParse(props.application).success
  }
  return false
})

watch(() => props.application.type, (_) => {
  Object.entries(formsConfig.value).forEach(([_, formConfig]) => {
    formConfig.valid = false
  })

  formsConfig.value = {}
  init(props.application)

  setTimeout(() => {
    activeFormIndex.value = 0
  }, 100)
})

</script>


<style lang="scss">

.v-stepper-item {

  flex-basis: fit-content !important;

  .v-avatar {
    background-color: rgb(243, 241, 241) !important;
    border: 1px solid #646464;
  }

  font-size: 16px;

  &--selected {

    background-color: #E2E2E250;

    .v-stepper-item__title {
      //text-decoration: underline;
    }
  }

  &--complete {

    .v-avatar {
      background-color: #00703c !important;
    }
  }
}

</style>
