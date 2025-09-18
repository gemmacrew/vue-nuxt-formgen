// Utilities
import {defineStore} from 'pinia'

export interface ISnackbar {
  text: string | null,
  visible?: boolean,
  color?: string | null,
  timeout?: number,
  multiline?: boolean,
  action?: any,
  elevation?: number,
  location?: string
}

export const useSnackbarStore = defineStore('snackbar', {
  state: () => ({
    snackbar: {
      visible: false,
      text: null,
      color: 'pink',
      timeout: -1,
      multiline: false,
      action: null,
      elevation: 5,
      location: 'bottom center'
    } as ISnackbar
  }),

  actions: {
    async showSnackbar(payload: ISnackbar) {
      Object.assign(this.snackbar, payload)
      this.snackbar.visible = true;
    },

    async closeSnackbar() {
      this.snackbar.visible = false;
      this.snackbar.color = '';
      this.snackbar.timeout = -1;
      this.snackbar.text = null;
    }
  }
})

