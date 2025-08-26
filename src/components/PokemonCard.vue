<template>
  <div v-if="pokemon" class="pokemon-card" @click="$emit('vote')">
    <img :src="pokemon.sprites.other.home.front_shiny" :alt="pokemon.name" class="pokemon-image" />
    <h3>{{ pokemon.name.toUpperCase() }}</h3>
    <div class="stats">
      <p>HP: {{ pokemon.stats[0].base_stat }}</p>
      <p>Ataque: {{ pokemon.stats[1].base_stat }}</p>
      <p>Tipo: {{ pokemonTypes }}</p>
    </div>
  </div>
  <div v-else class="pokemon-placeholder">Cargando Pokémon...</div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  pokemon: {
    type: Object,
    default: null,
  },
})

const pokemonTypes = computed(() => {
  return props.pokemon?.types?.map((t) => t.type.name).join(',') || 'Desconocido'
})
</script>

<style scoped>
.pokemon-card {
  border: 2px solid #ccc;
  border-radius: 10px;
  padding: 1rem;
  cursor: pointer;
  transition: transform 0.2s;
  text-align: center;
  min-width: 200px;
}
.pokemon-card:hover {
  transform: scale(1.05);
  border-color: #fc0;
}
.pokemon-image {
  width: 120px;
  height: 120px;
}
.stats {
  margin-top: 1rem;
}
.pokemon-placeholder {
  border: 2px dashed #ccc;
  padding: 1rem;
  text-align: center;
  min-width: 200px;
}
</style>
