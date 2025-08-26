import { defineStore } from 'pinia'
import axios from '@/api/axios'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    token: null,
  }),
  actions: {
    async login(credentials) {
      //await axios.get('/sanctum/csrf-cookie')
      const response = await axios.post('/api/login', credentials)
      this.token = response.data.access_token
      axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
    },
    async fetchUser() {
      try {
        const response = await axios.get('/api/user')
        this.user = response.data
      } catch (error) {
        console.error('Error al obtoner usuario:', error)
      }
    },
    async logout() {
      await axios.post('/api/logout')
      this.user = null
      this.token = null
      delete axios.defaults.headers.common['Authorization']
    },
  },
})
