<template>
  <form @submit.prevent="submitForm" enctype="multipart/form-data">
    <input type="text" v-model="name" placeholder="Nombre del producto" required />
    <input type="number" v-model="quantity" placeholder="Cantidad" required />
    <input type="number" v-model="price" placeholder="Precio" step="0.01" required />
    <input type="file" @change="handleFile" required />
    <button type="submit">Guardar</button>
  </form>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      name: '',
      quantity: '',
      price: '',
      image: null,
    }
  },
  methods: {
    handleFile(e) {
      this.image = e.target.files[0]
    },
    async submitForm() {
      const formData = new FormData()
      formData.append('name', this.name)
      formData.append('quantity', this.quantity)
      formData.append('price', this.price)
      formData.append('image', this.image)

      try {
        const response = await axios.post('/products', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        alert('Producto creado correctamente')
      } catch (err) {
        alert('Error al crear producto')
      }
    },
  },
}
</script>
