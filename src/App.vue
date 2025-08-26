<template>
  <div>
    <router-view />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import axios from './api/axios'

//onMounted(() => {
  //getCSRFToken()
//})

onMounted(() => {
  if (localStorage.getItem('token')) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`
    getUser()
  }
})

//const getCSRFToken = async () => {
 // try {
    //await axios.get('/sanctum/csrf-cookie')
   // await getUser()
  //} catch (error) {
    //console.error('Error al obtener CSRF Token:', error)
  //}
//}

const getUser = async () => {
  try {
    //const response = await axios.get('/api/user')
    const response = await axios.get('/user')
    console.log('Usuario autenticado:', response.data)
  } catch (error) {
    if (error.response?.status === 401) {
      console.log('Usuario no autenticado')
    } else {
      console.error('Error al obtener usuario:', error.response)
    }
  }
}
</script>
