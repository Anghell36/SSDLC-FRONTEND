<template>
  <div class="incidence-list">
    <h2>Mis Incidencias</h2>
    <button @click="logout">Cerrar Sesión</button>

    <div v-if="incidences.length">
      <div v-for="i in incidences" :key="i.id" class="incidence-item">
        <h3>
          {{ i.type }}
          <span class="status" :class="i.status">{{ i.status }}</span>
        </h3>
        <p><strong>Ubicación:</strong> {{ i.location }}</p>
        <p>{{ i.description }}</p>
        <p v-if="i.attachment">
          <a :href="getFileUrl(i.attachment)" target="_blank" rel="noopener">Ver adjunto</a>
        </p>
        <small>Registrado el: {{ formatDate(i.created_at) }}</small>
      </div>
    </div>

    <p v-else>No hay incidencias registradas.</p>

    <AttendanceForm @saved="onSaved" />
    <hr />
    <AttendanceList ref="listRef" />
  </div>
</template>

<script setup>
import { ref, onMounted, getCurrentInstance } from 'vue'
import axios from '@/api/axios'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'
import AttendanceForm from '@/components/AttendanceForm.vue'
import AttendanceList from '@/components/AttendanceList.vue'

const incidences = ref([])
const listRef = ref(null)

const userStore = useUserStore()
const router = useRouter()
const { proxy } = getCurrentInstance() || { proxy: null }

/**
 * Se ejecuta cuando el formulario emite 'saved'.
 * Fuerza recarga del componente AttendanceList si existe.
 */
function onSaved(att) {
  if (listRef.value && typeof listRef.value.fetch === 'function') {
    listRef.value.fetch()
  }
  // Emitir evento global si la app usa $root event bus (opcional)
  if (proxy && proxy.$root && typeof proxy.$root.$emit === 'function') {
    proxy.$root.$emit('attendance:saved', att)
  }
}

/**
 * Obtener reportes/Incidencias desde la API
 */
async function fetchReports() {
  try {
    const res = await axios.get('/api/reports')
    // Asumo que la API devuelve un array en res.data; ajústalo si viene paginado
    incidences.value = Array.isArray(res.data) ? res.data : res.data.data || []
  } catch (error) {
    console.error('Error al obtener reportes:', error)
    // Si fallo por auth, redirigir a login
    router.push('/login')
  }
}

onMounted(() => {
  fetchReports()
})

/**
 * Logout usando tu store (asumiendo que useUserStore.logout existe)
 */
const logout = async () => {
  try {
    await userStore.logout()
  } catch (e) {
    console.warn('Logout falló:', e)
  } finally {
    router.push('/login')
  }
}

/**
 * Construir URL pública para archivos (usa la baseURL de axios)
 */
const getFileUrl = (path) => {
  // Si path ya contiene '/storage' puedes adaptar esta línea.
  const base = axios.defaults.baseURL ? axios.defaults.baseURL.replace(/\/$/, '') : ''
  return `${base}/storage/${path}`
}

/**
 * Formatear fecha para mostrar
 */
const formatDate = (datetime) => {
  return datetime ? new Date(datetime).toLocaleString() : ''
}
</script>

<style scoped>
.incidence-list {
  max-width: 800px;
  margin: auto;
  padding: 1rem;
  font-family: sans-serif;
}
.logout-button {
  background-color: #e11d48;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  margin-bottom: 1rem;
  border-radius: 5px;
  cursor: pointer;
}
.incidence-item {
  background: #f9f9f9;
  padding: 1rem;
  margin-bottom: 1rem;
  border-left: 5px solid #1d4ed8;
}
.status {
  font-size: 0.9rem;
  margin-left: 1rem;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  text-transform: uppercase;
}
.status.pending {
  background: #fde68a;
}
.status.in_review {
  background: #bfdbfe;
}
.status.resolved {
  background: #bbf7d0;
}
</style>
