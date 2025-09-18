<template>
  <v-snackbar
    v-model="snackbar.visible"
    v-bind="snackbar"
    location="bottom right"
  >
    <template v-slot:actions>
      <v-btn
        v-if="snackbar.action"
        text="true"
        @click="snackbar.action.handler"
      >
        {{ snackbar.action.text }}
      </v-btn>
      <v-icon
        variant="text"
        @click="close">
        mdi-close
      </v-icon>
    </template>

  </v-snackbar>
</template>

<script lang="ts" setup>

import {useSnackbarStore} from "~~/stores/snackbar";

const snackbarStore = useSnackbarStore()
const snackbar = snackbarStore.snackbar

function close() {
  snackbarStore.closeSnackbar()
}

</script>