<template>
  <div class="neo-card">
    <h3 class="sec-title">👨‍🏫 Kelola Data Guru Pengajar</h3>

    <form class="guru-form" @submit.prevent="simpanGuru">
      <select v-model="form.sekolah_id" class="neo-select" required>
        <option value="">-- Pilih Sekolah Induk --</option>
        <option v-for="s in appState.sekolahList" :key="s.id" :value="s.id">
          {{ s.nama_jenjang }} — {{ s.nama }}
        </option>
      </select>

      <input v-model="form.nama" type="text" class="neo-input" placeholder="Nama Lengkap & Gelar *" required />
      <input v-model="form.nip" type="text" class="neo-input" placeholder="NIP / NIY (Opsional)" />
      <input v-model="form.no_hp" type="text" class="neo-input" placeholder="No. HP / WA Guru" />

      <div class="form-btns">
        <button type="submit" class="neo-btn neo-btn-blue">
          {{ editId ? '💾 Update Guru' : '➕ Tambah Guru' }}
        </button>
        <button v-if="editId" type="button" class="neo-btn neo-btn-white" @click="resetForm">
          Batal
        </button>
      </div>
    </form>

    <div class="guru-list">
      <div v-for="g in list" :key="g.id" class="guru-row">
        <div>
          <p class="g-name">{{ g.nama }}</p>
          <small class="g-meta">🏫 {{ g.nama_sekolah }} • NIP: {{ g.nip || '-' }} • HP: {{ g.no_hp || '-' }}</small>
        </div>
        <div class="row-actions">
          <button type="button" class="neo-btn neo-btn-yellow btn-xs" @click="mulaiEdit(g)">✏️</button>
          <button type="button" class="neo-btn neo-btn-red btn-xs" @click="hapus(g.id)">🗑️</button>
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
const editId = ref(null)
const form = ref({ sekolah_id: '', nama: '', nip: '', no_hp: '', status: 'aktif' })

async function fetchData() {
  const params = {}
  if (appState.selectedSekolahId) params.sekolah_id = appState.selectedSekolahId
  const res = await api.get('/guru', { params })
  list.value = res.data?.data || []
}

async function simpanGuru() {
  try {
    if (editId.value) {
      await api.put(`/guru/${editId.value}`, form.value)
    } else {
      await api.post('/guru', form.value)
    }
    resetForm()
    await fetchData()
  } catch (err) {
    alert(err.response?.data?.messages?.error || 'Gagal menyimpan data guru.')
  }
}

function mulaiEdit(g) {
  editId.value = g.id
  form.value = {
    sekolah_id: g.sekolah_id,
    nama: g.nama,
    nip: g.nip || '',
    no_hp: g.no_hp || '',
    status: g.status,
  }
}

function resetForm() {
  editId.value = null
  form.value = { sekolah_id: appState.selectedSekolahId || '', nama: '', nip: '', no_hp: '', status: 'aktif' }
}

async function hapus(id) {
  if (!confirm('Hapus data guru ini?')) return
  try {
    await api.delete(`/guru/${id}`)
    await fetchData()
  } catch (err) {
    alert(err.response?.data?.messages?.error || 'Guru tidak dapat dihapus karena memiliki riwayat jurnal.')
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
.guru-form { display: grid; grid-template-columns: 1fr; gap: 0.5rem; margin-bottom: 1rem; }
.form-btns { display: flex; gap: 0.5rem; }
.guru-list { display: flex; flex-direction: column; gap: 0.5rem; }
.guru-row {
  display: flex; justify-content: space-between; align-items: center;
  padding: 0.65rem; border: 2px solid var(--black); border-radius: 8px;
}
.g-name { font-weight: 900; font-size: 0.92rem; }
.g-meta { font-size: 0.75rem; color: var(--gray-dark); font-weight: 600; }
.row-actions { display: flex; gap: 0.35rem; }
.btn-xs { padding: 0.3rem 0.55rem; font-size: 0.72rem; }
@media (min-width: 640px) {
  .guru-form { grid-template-columns: repeat(2, 1fr); }
}
</style>