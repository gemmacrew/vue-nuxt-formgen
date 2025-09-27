<template>
  <VApp>
    <AppHeader>
      <v-btn
        class="text-none m-2"
        color="primary"
        min-width="92"
        variant="tonal"
        rounded
        @click="onApply"
      >
        Apply Now
      </v-btn>

      <AuthState>
        <template #default="{ loggedIn }">
          <v-btn
            class="text-none m-2"
            color="medium-emphasis"
            min-width="92"
            variant="outlined"
            rounded
            v-if="loggedIn"
            @click="onLogout"
          >
            Logout
          </v-btn>
          <template v-else>
            <NuxtLink
              class="m-5"
              to="/auth/login"
            >Login
            </NuxtLink>
            <v-btn class="text-none m-5 "
                   color="medium-emphasis"
                   min-width="92"
                   variant="outlined"
                   rounded>
              <NuxtLink
                to="/auth/register"
              >Register for Free
              </NuxtLink>
            </v-btn>
          </template>
        </template>
      </AuthState>
    </AppHeader>
    <slot/>
    <Snackbar/>
  </VApp>
</template>

<script setup lang="ts">
import Snackbar from "~/components/Snackbar.vue";

const session = useUserSession()
async function onLogout() {
  session.clear()
  await navigateTo(localePath('/'))
}

async function onApply() {
  await navigateTo(localePath('application'))
}

</script>
