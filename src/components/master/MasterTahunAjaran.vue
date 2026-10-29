<template>
  <div class="neo-card">
    <h3 class="sec-title">📅 Kelola Tahun Ajaran & Semester</h3>

    <form class="add-form" @submit.prevent="tambahTahun">
      <input
        v-model="form.nama_tahun"
        type="text"
        class="neo-input"
        placeholder="Tahun (Contoh: 2026/2027)"
        required
      />
      <select v-model="form.semester" class="neo-select" required>
        <option value="Ganjil">Semester Ganjil</option>
        <option value="Genap">Semester Genap</option>
      </select>
      <button type="submit" class="neo-btn neo-btn-blue">➕ Tambah</button>
    </form>

    <div class="list-container">
      <div v-for="item in list" :key="item.id" class="row-item">
        <div>
          <strong>{{ item.nama_tahun }} — Semester {{ item.semester }}</strong>
          <span v-if="Number(item.is_aktif) === 1" class="neo-badge neo-badge-green" style="margin-left: 0.5rem">
            AKTIF
          </span>
        </div>
        <div class="row-actions">
          <button
            v-if="Number(item.is_aktif) !== 1"
            type="button"
            class="neo-btn neo-btn-yellow btn-xs"
            @click="setAktif(item)"
          >
            ✅ Jadikan Aktif
          </button>
          <button
            type="button"
            class="neo-btn neo-btn-red btn-xs"
            @click="hapus(item.id)"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'
import { appState } from '@/stores/appState'

const list = ref([])
const form = ref({ nama_tahun: '', semester: 'Ganjil', is_aktif: 0 })

async function fetchData() {
  const res = await api.get('/tahun-ajaran')
  list.value = res.data?.data || []
}

async function tambahTahun() {
  try {
    await api.post('/tahun-ajaran', form.value)
    form.value.nama_tahun = ''
    await fetchData()
    await appState.initAppData()
  } catch (err) {
    alert(err.response?.data?.messages?.error || 'Gagal menambah tahun ajaran.')
  }
}

async function setAktif(item) {
  await api.put(`/tahun-ajaran/${item.id}`, {
    nama_tahun: item.nama_tahun,
    semester: item.semester,
    is_aktif: 1,
  })
  await fetchData()
  await appState.initAppData()
}

async function hapus(id) {
  if (!confirm('Hapus tahun ajaran ini?')) return
  try {
    await api.delete(`/tahun-ajaran/${id}`)
    await fetchData()
  } catch (err) {
    alert(err.response?.data?.messages?.error || 'Tidak dapat menghapus tahun ajaran.')
  }
}

onMounted(fetchData)
</script>

<style scoped>
.sec-title { font-size: 1.05rem; font-weight: 900; margin-bottom: 0.85rem; }
.add-form { display: grid; grid-template-columns: 1fr; gap: 0.5rem; margin-bottom: 1rem; }
.list-container { display: flex; flex-direction: column; gap: 0.5rem; }
.row-item {
  display: flex; justify-content: space-between; align-items: center;
  padding: 0.65rem; border: 2px solid var(--black); border-radius: 8px;
}
.row-actions { display: flex; gap: 0.4rem; }
.btn-xs { padding: 0.3rem 0.6rem; font-size: 0.72rem; }
@media (min-width: 640px) {
  .add-form { grid-template-columns: 1fr 1fr auto; }
}
</style>