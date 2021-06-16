import Vue from 'vue'
import axios from 'axios'

Vue.prototype.$axios = axios.create({ baseURL: process.env.QENV_SERVER_URI })

export const api = axios.create({ baseURL: process.env.QENV_SERVER_URI })
