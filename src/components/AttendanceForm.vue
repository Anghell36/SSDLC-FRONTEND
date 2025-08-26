<template>
  <div class="card p-3">
    <h5 class="mb-3">Registrar asistencia</h5>

    <form @submit.prevent="submit">
      <div class="mb-3">
        <label class="form-label">Foto de evidencia</label>
        <input type="file" accept="image/*" @change="onFileChange" class="form-control" />
        <div v-if="preview" class="mt-2">
          <p class="small mb-1">Vista previa:</p>
          <img :src="preview" alt="preview" class="img-fluid rounded" style="max-height:250px;" />
        </div>
      </div>

      <div class="mb-3">
        <label class="form-label">Latitud</label>
        <input type="text" v-model="latitude" class="form-control" readonly />
      </div>

      <div class="mb-3">
        <label class="form-label">Longitud</label>
        <input type="text" v-model="longitude" class="form-control" readonly />
      </div>

      <div class="d-flex gap-2">
        <button type="button" class="btn btn-outline-secondary" @click="getLocation">
          Obtener ubicación
        </button>
        <button type="submit" class="btn btn-primary" :disabled="loading">
          <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          Guardar asistencia
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import api from '@/api/axios';
import Swal from 'sweetalert2';

export default {
  name: 'AttendanceForm',
  data() {
    return {
      file: null,
      preview: null,
      latitude: '',
      longitude: '',
      loading: false,
    };
  },
  methods: {
    onFileChange(e) {
      const file = e.target.files[0];
      if (!file) return;
      if (!file.type.startsWith('image/')) {
        Swal.fire('Error', 'El archivo debe ser una imagen.', 'error');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire('Error', 'La imagen no puede exceder 5 MB.', 'error');
        return;
      }
      this.file = file;
      this.preview = URL.createObjectURL(file);
    },

    getLocation() {
      if (!navigator.geolocation) {
        Swal.fire('Error', 'Geolocalización no soportada por el navegador.', 'error');
        return;
      }
      Swal.fire({ title: 'Obteniendo ubicación...', didOpen: () => { Swal.showLoading(); } });
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          Swal.close();
          this.latitude = pos.coords.latitude.toFixed(7);
          this.longitude = pos.coords.longitude.toFixed(7);
          Swal.fire('Listo', 'Ubicación obtenida.', 'success');
        },
        (err) => {
          Swal.close();
          Swal.fire('Error', 'No se pudo obtener la ubicación: ' + err.message, 'error');
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    },

    async submit() {
      if (!this.file) {
        Swal.fire('Error', 'Selecciona una foto de evidencia.', 'error');
        return;
      }

      this.loading = true;

      const formData = new FormData();
      formData.append('photo', this.file);
      if (this.latitude) formData.append('latitude', this.latitude);
      if (this.longitude) formData.append('longitude', this.longitude);

      try {
        const res = await api.post('/attendances', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        Swal.fire('Éxito', res.data.message || 'Asistencia guardada.', 'success');
        this.$emit('saved', res.data.attendance);

        this.file = null;
        this.preview && URL.revokeObjectURL(this.preview);
        this.preview = null;
        this.latitude = '';
        this.longitude = '';
      } catch (error) {
        const msg = error?.response?.data?.message || 'Error al guardar la asistencia.';
        Swal.fire('Error', msg, 'error');
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped></style>
