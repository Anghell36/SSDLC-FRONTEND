<template>
  <form @submit.prevent="calcular">
    <input v-model.number="num1" type="number" />
    <input v-model.number="num2" type="number" />
    <button type="submit">Sumar</button>
  </form>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['resultado'])
const num1 = ref(0)
const num2 = ref(0)

const calcular = () => {
  emit('resultado', num1.value + num2.value)
}
</script>
