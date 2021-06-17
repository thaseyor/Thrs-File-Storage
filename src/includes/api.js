import axios from 'axios'

export const api = axios.create({ baseURL: process.env.QENV_SERVER_URI })
