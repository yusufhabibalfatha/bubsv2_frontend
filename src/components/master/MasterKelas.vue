<template>
  <div class="neo-card">
    <h3 class="sec-title">🏷️ Kelola Rombel Kelas</h3>

    <form class="kelas-form" @submit.prevent="simpanKelas">
      <select v-model="form.sekolah_id" class="neo-select" required>
        <option value="">-- Pilih Sekolah --</option>
        <option v-for="s in appState.sekolahList" :key="s.id" :value="s.id">
          {{ s.nama_jenjang }} — {{ s.nama }}
        </option>
      </select>

      <input v-model="form.nama" type="text" class="neo-input" placeholder="Nama Kelas (Contoh: VII-A / XI-1) *" required />
      <input v-model="form.tingkat" type="text" class="neo-input" placeholder="Tingkat (7 / 8 / 9 / 10 / 11 / 12)" />

      <select v-model="form.wali_guru_id" class="neo-select">
        <option value="">-- Pilih Wali Kelas (Opsional) --</option>
        <option v-for="g in guruList" :key="g.id" :value="g.id">
          {{ g.nama }}
        </option>
      </select>

      <div class="form-btns">
        <button type="submit" class="neo-btn neo-btn-blue">
          {{ editId ? '💾 Update Kelas' : '➕ Tambah Kelas' }}
        </button>
        <button v-if="editId" type="button" class="neo-btn neo-btn-white" @click="resetForm">
          Batal
        </button>
      </div>
    </form>

    <div class="kelas-list">
      <div v-for="k in list" :key="k.id" class="kelas-row">
        <div>
          <p class="k-name">{{ k.nama }} <small>({{ k.nama_sekolah }})</small></p>
          <small class="k-meta">
            TA: {{ k.nama_tahun }} ({{ k.semester }}) • Wali Kelas: {{ k.nama_wali_kelas || '-' }}
          </small>
        </div>
        <div class="row-actions">
          <button type="button" class="neo-btn neo-btn-yellow btn-xs" @click="mulaiEdit(k)">✏️</button>
          <button type="button" class="neo-btn neo-btn-red btn-xs" @click="hapus(k.id)">🗑️</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import api from '@/services/api'
import { appState } from '@/stores/appState'

const list = ref([])
const guruList = ref([])
const editId = ref(null)

const form = ref({
  sekolah_id: '',
  tahun_ajaran_id: '',
  nama: '',
  tingkat: '',
  wali_guru_id: '',
  is_aktif: 1,
})

async function fetchData() {
  const params = {}
  if (appState.selectedSekolahId) params.sekolah_id = appState.selectedSekolahId
  if (appState.tahunAjaranAktif?.id) params.tahun_ajaran_id = appState.tahunAjaranAktif.id

  const [resKelas, resGuru] = await Promise.all([
    api.get('/kelas', { params }),
    api.get('/guru'),
  ])

  list.value = resKelas.data?.data || []
  guruList.value = resGuru.data?.data || []
}

async function simpanKelas() {
  const payload = {
    ...form.value,
    tahun_ajaran_id: form.value.tahun_ajaran_id || appState.tahunAjaranAktif?.id,
    wali_guru_id: form.value.wali_guru_id || null,
  }

  try {
    if (editId.value) {
      await api.put(`/kelas/${editId.value}`, payload)
    } else {
      await api.post('/kelas', payload)
    }
    resetForm()
    await fetchData()
  } catch (err) {
    alert(err.response?.data?.messages?.error || 'Gagal menyimpan kelas.')
  }
}

function mulaiEdit(k) {
  editId.value = k.id
  form.value = {
    sekolah_id: k.sekolah_id,
    tahun_ajaran_id: k.tahun_ajaran_id,
    nama: k.nama,
    tingkat: k.tingkat || '',
    wali_guru_id: k.wali_guru_id || '',
    is_aktif: k.is_aktif,
  }
}

function resetForm() {
  editId.value = null
  form.value = {
    sekolah_id: appState.selectedSekolahId || '',
    tahun_ajaran_id: appState.tahunAjaranAktif?.id || '',
    nama: '',
    tingkat: '',
    wali_guru_id: '',
    is_aktif: 1,
  }
}

async function hapus(id) {
  if (!confirm('Hapus kelas ini?')) return
  try {
    await api.delete(`/kelas/${id}`)
    await fetchData()
  } catch (err) {
    alert(err.response?.data?.messages?.error || 'Kelas tidak dapat dihapus karena masih memiliki siswa/jurnal.')
  }
}

watch(() => appState.selectedSekolahId, fetchData)
onMounted(() => {
  resetForm()
  fetchData()
})
</script>

<style scoped>
.sec-title { font-size: 1.05rem; font-weight: 900; margin-bottom: 0.85rem; }
.kelas-form { display: grid; grid-template-columns: 1fr; gap: 0.5rem; margin-bottom: 1rem; }
.form-btns { display: flex; gap: 0.5rem; }
.kelas-list { display: flex; flex-direction: column; gap: 0.5rem; }
.kelas-row {
  display: flex; justify-content: space-between; align-items: center;
  padding: 0.65rem; border: 2px solid var(--black); border-radius: 8px;
}
.k-name { font-weight: 900; font-size: 0.95rem; }
.k-meta { font-size: 0.75rem; color: var(--gray-dark); font-weight: 600; }
.row-actions { display: flex; gap: 0.35rem; }
.btn-xs { padding: 0.3rem 0.55rem; font-size: 0.72rem; }
@media (min-width: 640px) {
  .kelas-form { grid-template-columns: repeat(2, 1fr); }
}
</style>