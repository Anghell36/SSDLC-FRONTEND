<template>
  <div>
    <h5 class="mb-3">Mis asistencias</h5>

    <div v-if="loading" class="text-center py-4">
      <div class="spinner-border" role="status"></div>
    </div>

    <div v-else>
      <div v-if="attendances.length === 0" class="alert alert-secondary">
        No tienes asistencias registradas.
      </div>

      <div v-else class="row g-3">
        <div class="col-12 col-md-6" v-for="att in attendances" :key="att.id">
          <div class="card h-100">
            <img
              :src="att.photo_url"
              class="card-img-top"
              style="object-fit: cover; max-height: 220px"
              alt="evidencia"
            />
            <div class="card-body">
              <p class="mb-1"><strong>Fecha:</strong> {{ formatDate(att.created_at) }}</p>
              <p class="mb-1">
                <strong>Lat:</strong> {{ att.latitude ?? '—' }} <strong>Lng:</strong>
                {{ att.longitude ?? '—' }}
              </p>
              <button class="btn btn-outline-primary btn-sm" @click="view(att)">Ver</button>
            </div>
          </div>
        </div>
      </div>

      <nav v-if="meta && meta.last_page > 1" aria-label="Paginación" class="mt-3">
        <ul class="pagination">
          <li class="page-item" :class="{ disabled: meta.current_page === 1 }">
            <button
              class="page-link"
              @click="fetch(meta.current_page - 1)"
              :disabled="meta.current_page === 1"
            >
              Anterior
            </button>
          </li>
          <li class="page-item" :class="{ disabled: meta.current_page === meta.last_page }">
            <button
              class="page-link"
              @click="fetch(meta.current_page + 1)"
              :disabled="meta.current_page === meta.last_page"
            >
              Siguiente
            </button>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script>
import api from '@/api/axios'
import Swal from 'sweetalert2'

export default {
  name: 'AttendanceList',
  data() {
    return {
      attendances: [],
      loading: false,
      meta: null,
    }
  },
  created() {
    this.fetch()
    // si usas event bus global en tu app, puedes adaptar; aquí refresca al emitir 'saved'
    this.$root && this.$root.$on && this.$root.$on('attendance:saved', () => this.fetch())
  },
  methods: {
    async fetch(page = 1) {
      this.loading = true
      try {
        const res = await api.get('/Attendance?page=' + page)
        this.attendances = res.data.data.map((item) => ({
          ...item,
          photo_url: item.photo_url ?? (item.photo_path ? '/storage/' + item.photo_path : null),
        }))
        this.meta = {
          current_page: res.data.current_page,
          last_page: res.data.last_page,
        }
      } catch (err) {
        Swal.fire('Error', 'No se pudieron cargar las asistencias.', 'error')
      } finally {
        this.loading = false
      }
    },
    formatDate(dt) {
      return new Date(dt).toLocaleString()
    },
    view(att) {
      Swal.fire({
        title: this.formatDate(att.created_at),
        html: `<img src="${att.photo_url}" style="max-width:100%; height:auto;" /><p class="mt-2">Lat: ${att.latitude ?? '—'} Lng: ${att.longitude ?? '—'}</p>`,
        width: '600px',
      })
    },
  },
}
</script>

<style scoped>
.card-img-top {
  height: 220px;
}
</style>
