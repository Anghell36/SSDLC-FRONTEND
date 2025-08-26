<template>
  <div>
    <h1>Lista de Pokémon</h1>
    <button @click="fetchPokemons" :disabled="isLoading">
      {{ isLoading ? 'Cargando...' : 'Cargar Pokémon' }}
    </button>

    <p v-if="error" class="error">¡Error al cargar Pokémon: {{ error }}</p>

    <ul v-if="pokemons.length && !isLoading">
      <li v-for="pokemon in pokemons" :key="pokemon.name">
        {{ pokemon.name.toUpperCase() }}
        <button @click="showPokemonDetails(pokemon.url)">Ver detalles</button>
      </li>
    </ul>

    <p v-else-if="!isLoading && !pokemons.length">No hay Pokémon cargados...</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import pokeApi from '@/api/axios'

const pokemons = ref([])
const isLoading = ref(false)
const error = ref(null)

const fetchPokemons = async () => {
  isLoading.value = true
  error.value = null
  try {
    const response = await pokeApi.get('pokemon?limit=10')
    pokemons.value = response.data.results
  } catch (err) {
    error.value = err.message
    console.error('Error: ', err)
  } finally {
    isLoading.value = false
  }
}

const showPokemonDetails = (url) => {
  console.log('URL del Pokémon:', url)
}
</script>

<style scoped>
.error {
  color: red;
}
button {
  margin: 5px;
  padding: 8px 12px;
  cursor: pointer;
}
</style>
