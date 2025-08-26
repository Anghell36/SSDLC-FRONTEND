<template>
  <div class="incidence-form">
    <h1>Generar Incidencia</h1>

    <div class="selectors">
      <label>Lugar:</label>
      <select v-model="placeSelected">
        <option disabled value="">Selecciona lugar</option>
        <option v-for="(items, place) in data" :key="place" :value="place">{{ place }}</option>
      </select>

      <div v-if="availableItems.length">
        <label v-if="placeSelected">Item:</label>
        <select v-if="placeSelected" v-model="itemSelected">
          <option disabled value="">Selecciona item</option>
          <option v-for="(details, item) in data[placeSelected]" :key="item" :value="item">
            {{ item }}
          </option>
        </select>
      </div>
      <div v-if="availableDetails.length">
        <label v-if="itemSelected">Detalle:</label>
        <select v-if="itemSelected" v-model="detailSelected">
          <option disabled value="">Selecciona detalle</option>
          <option
            v-for="(problems, detail) in data[placeSelected][itemSelected]"
            :key="detail"
            :value="detail"
          >
            {{ detail }}
          </option>
        </select>
      </div>
      <div v-if="availableProblems.length">
        <label v-if="detailSelected">Problema:</label>
        <select v-if="detailSelected" v-model="problemSelected">
          <option disabled value="">Selecciona problema</option>
          <option
            v-for="problem in data[placeSelected][itemSelected][detailSelected]"
            :key="problem"
            :value="problem"
          >
            {{ problem }}
          </option>
        </select>
      </div>

      <label>Observación:</label>
      <textarea
        v-model="observation"
        rows="4"
        cols="50"
        placeholder="Escribe una observación..."
      ></textarea>

      <button @click="send">Enviar</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { incidenceData as data } from '@/data/incidences'
import Swal from 'sweetalert2'

const placeSelected = ref('')
const itemSelected = ref('')
const detailSelected = ref('')
const problemSelected = ref('')
const observation = ref('')

watch(placeSelected, () => {
  itemSelected.value = ''
  detailSelected.value = ''
  problemSelected.value = ''
})

watch(itemSelected, () => {
  detailSelected.value = ''
  problemSelected.value = ''
})

watch(detailSelected, () => {
  problemSelected.value = ''
})

const availableItems = computed(() => {
  return placeSelected.value ? Object.keys(data[placeSelected.value]) : []
})
const availableDetails = computed(() => {
  return placeSelected.value && itemSelected.value
    ? Object.keys(data[placeSelected.value][itemSelected.value])
    : []
})
const availableProblems = computed(() => {
  return placeSelected.value && itemSelected.value && detailSelected.value
    ? data[placeSelected.value][itemSelected.value][detailSelected.value]
    : []
})

const resetForm = () => {
  placeSelected.value = ''
  itemSelected.value = ''
  detailSelected.value = ''
  problemSelected.value = ''
  observation.value = ''
}

const send = () => {
  if (
    !placeSelected.value ||
    !itemSelected.value ||
    !detailSelected.value ||
    !problemSelected.value
  ) {
    Swal.fire({
      title: 'Error',
      text: 'Por favor complete todos los campos obligatorios',
      icon: 'error',
    })
    return
  }

  console.log({
    lugar: placeSelected.value,
    item: itemSelected.value,
    detalle: detailSelected.value,
    problema: problemSelected.value,
    observacion: observation.value,
  })

  Swal.fire({
    title: '¡Éxito!',
    text: 'La incidencia se ha generado correctamente',
    icon: 'success',
    confirmButtonText: 'Aceptar',
  }).then(() => {
    resetForm()
  })
}
</script>

<style scoped>
.incidence-form {
  max-width: 600px;
  margin: auto;
  padding: 1rem;
  font-family: sans-serif;
}
label {
  display: block;
  margin-top: 10px;
  font-weight: bold;
}
select,
textarea {
  width: 100%;
  padding: 0.5rem;
  margin-top: 5px;
}
button {
  margin-top: 1rem;
  padding: 0.7rem 1.5rem;
  background-color: #1d4ed8;
  color: white;
  border: none;
  border-radius: 4px;
}
</style>
