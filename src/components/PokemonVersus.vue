<template>
  <div class="versus-container">
    <h1>Pokémon Versus</h1>
    <div class="pokemon-battle">
      <PokemonCard :pokemon="pokemonLeft" @vote="handleVote(pokemonLeft.id)" />
      <span class="vs">VS</span>
      <PokemonCard :pokemon="pokemonRight" @vote="handleVote(pokemonRight.id)" />
    </div>
    <button @click="fetchNewPair" :disabled="isLoading">
      {{ isLoading ? 'Cargando...' : 'Nuevo Duelo' }}
    </button>
    <div v-if="winner" class="winner">
      <h2>¡Ganador: {{ winner.name.toUpperCase() }}!</h2>
      <p>Votos: {{ votes[winner.id] || 0 }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import PokemonCard from './PokemonCard.vue'
import pokeApi from '@/api/axios'

const pokemonLeft = ref(null)
const pokemonRight = ref(null)
const winner = ref(null)
const votes = ref({})
const isLoading = ref(false)

const fecthRandomPokemons = async () => {
  isLoading.value = true
  try {
    const randomIds = [Math.floor(Math.random() * 151) + 1, Math.floor(Math.random() * 151) + 1]

    const responses = await Promise.all([
      pokeApi.get(`pokemon/${randomIds[0]}`),
      pokeApi.get(`pokemon/${randomIds[1]}`),
    ])

    pokemonLeft.value = responses[0].data
    pokemonRight.value = responses[1].data
    winner.value = null
  } catch (error) {
    console.error('Error fetching Pokémon:', error)
  } finally {
    isLoading.value = false
  }
}

const handleVote = (pokemonId) => {
  votes.value[pokemonId] = (votes.value[pokemonId] || 0) + 1
  winner.value = pokemonLeft.value.id === pokemonId ? pokemonLeft.value : pokemonRight.value
}

const fetchNewPair = () => {
  fecthRandomPokemons()
}

onMounted(() => {
  fecthRandomPokemons()
})
</script>

<style scoped>
.pokemon-battle {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  margin: 2rem 0;
}
.vs {
  font-size: 2rem;
  font-weight: bold;
}
.winner {
  margin-top: 2rem;
  text-align: center;
}
</style>
