<template>

  <v-card class="w-[400px] mt-20 mx-auto p-10 rounded-lg border text-center">
    <template #title>
      <v-icon
        class="mb-2"
        color="green-darken-2"
        icon="mdi-account-outline"
        size="48"
      ></v-icon>
      <div style="font-size: 24px;">
        {{ context.title }}
      </div>
    </template>
    <template #subtitle>
      <div class="mt-1 text-base text-pretty text-muted">
        {{ context.subtitle }}.
      </div>
    </template>
    <template #text>
      <v-form
        class="mt-2 space-y-1"
        @submit.prevent="onSubmit"
      >
        <v-text-field
          name="email"
          :label="$t('pages.auth.fields.email.label')"
          v-model="email"
          v-bind="emailProps"
          variant="outlined"
          type="email"
          required
          autocomplete="email"
          class="w-full">
        </v-text-field>
        <v-text-field
          name="password"
          :label="$t('pages.auth.fields.password.label')"
          variant="outlined"
          v-model="password"
          v-bind="passwordProps"
          :type="showPassword ? 'text' : 'password'"
          required
          class="w-full"
        >
          <template #append-inner>
            <v-btn
              variant="plain"
              size="sm"
              icon="mdi-eye-outline"
              aria-label="Toggle password visibility"
              @click="showPassword = !showPassword"
            />
          </template>
        </v-text-field>
        <v-text-field
          v-if="isRegistration"
          name="passwordConfirm"
          :label="$t('pages.auth.fields.confirmPassword.label')"
          variant="outlined"
          v-model="passwordConfirm"
          v-bind="confirmProps"
          :type="showPasswordConfirm ? 'text' : 'password'"
          :required="isRegistration"
          class="w-full"
        >
          <template #append-inner>
            <v-btn
              variant="plain"
              size="sm"
              icon="mdi-eye-outline"
              aria-label="Toggle password visibility"
              @click="showPasswordConfirm = !showPasswordConfirm"
            />
          </template>
        </v-text-field>

        <div class="mt-10">
          <v-btn
            class="w-full justify-center"
            type="submit"
            :disabled="!isValid"
            color="primary"
          >
            {{ context.title }}
          </v-btn>
        </div>
        <div class="mt-10">
          <NuxtLink
            v-if="!isRegistration"
            class="mt-1 text-base text-pretty text-muted hover:underline"
            :to="$localePath('auth-register')"
          >{{ $t('pages.auth.messages.registerLink') }}
          </NuxtLink>
          <NuxtLink
            v-else
            class="mt-1 text-base text-pretty text-muted hover:underline"
            :to="$localePath('auth-login')"
          >{{ $t('pages.auth.messages.loginLink') }}
          </NuxtLink>
        </div>
      </v-form>
    </template>
  </v-card>
</template>

<script setup lang="ts">

import {useForm} from 'vee-validate';
import * as zod from 'zod/v4';
import {toTypedSchema} from '@vee-validate/zod';
import {useSnackbarStore} from "~~/stores/snackbar";
const localePath = useLocalePath()

const {isRegistration = false} = defineProps<{
  isRegistration?: boolean
}>()

const Schema = isRegistration ?
  zod.object({
    email: zod.email().nullish().nonoptional('Email is required'),
    password: zod.string().min(8, 'Password must be at least 8 characters').nullish().nonoptional('Password is required'),
    passwordConfirm: zod.string().min(8, 'Password must be at least 8 characters').nullish().nonoptional('Confirm password is required'),
  }).check((data) => {
    if (data.value.password !== data.value.passwordConfirm) {
      data.issues.push({
        code: 'custom',
        path: ['passwordConfirm'],
        message: $t('pages.auth.messages.passwordMismatch'),
        input: data.value.passwordConfirm,
      })
    }
  }) : zod.object({
    email: zod.email().nullish().nonoptional('Email is required'),
    password: zod.string().nullish().nonoptional('Password is required')
  })

const {defineField, handleSubmit} = useForm({
  validationSchema: toTypedSchema(Schema),
});
const vuetifyConfig = (state: { errors: string | string[] }) => ({
  props: {
    'error-messages': state.errors,
  },
});

// setup fields
const [email, emailProps] = defineField('email', vuetifyConfig);
const [password, passwordProps] = defineField('password', vuetifyConfig);
const [passwordConfirm, confirmProps] = defineField(
  'passwordConfirm',
  vuetifyConfig
);

const showPassword = ref(false)
const showPasswordConfirm = ref(false)
const context = computed(() => {
  if (isRegistration) {
    return {
      subtitle: $t('pages.auth.register.subtitle'),
      title: $t('pages.auth.register.title'),
      submitUrl: '/api/auth/register',
    }
  } else {
    return {
      subtitle: $t('pages.auth.login.subtitle'),
      title: $t('pages.auth.login.title'),
      submitUrl: '/api/auth/login',
    }
  }
})
const session = useUserSession()
session.clear()

const isValid = computed(() => {
  try {
    const data = {email: email.value, password: password.value};
    if (isRegistration) {
      data.passwordConfirm = passwordConfirm.value;
    }
    Schema.parse(data);
    return true
  } catch (error) {
    return false
  }
})

const onSubmit = handleSubmit(async values => {
  try {

    const response = await $fetch(context.value.submitUrl, {
      method: 'POST',
      body: {
        email: values.email,
        password: values.password,
      },
    }) as { success?: boolean, message?: string }

    if (!response.success) {
      throw new Error(`${context.value.title} failed.  Please try again.`)
    }

    const route = useRoute()
    const to = route.query?.redirectTo as string
    await navigateTo(localePath(to || '/'))

  }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  catch (e) {
    const snackbarStore = useSnackbarStore()
    snackbarStore.showSnackbar({
      color: 'error',
      text: `${context.value.title} failed.  Please try again`
    })
  }
})

</script>
