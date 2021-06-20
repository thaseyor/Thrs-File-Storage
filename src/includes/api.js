import axios from 'axios'

export const api = axios.create({
  baseURL: process.env.SERVER_URI,
  withCredentials: true
})
export { axios }
