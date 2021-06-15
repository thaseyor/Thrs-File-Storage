import axios, { AxiosInstance } from 'axios';
import { boot } from 'quasar/wrappers';

declare module 'vue/types/vue' {
  interface Vue {
    $axios: AxiosInstance;
  }
}

const api = axios.create({ baseURL: process.env.VUE_APP_SERVER_URI });

export { api };
