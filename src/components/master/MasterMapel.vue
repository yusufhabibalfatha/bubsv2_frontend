<template>
  <div class="neo-card">
    <h3 class="sec-title">📚 Kelola Mata Pelajaran</h3>

    <form class="add-form" @submit.prevent="simpanMapel">
      <input
        v-model="namaMapel"
        type="text"
        class="neo-input"
        placeholder="Ketik nama mata pelajaran baru..."
        required
      />
      <button type="submit" class="neo-btn neo-btn-blue">
        {{ editId ? '💾 Update' : '➕ Tambah' }}
      </button>
      <button v-if="editId" type="button" class="neo-btn neo-btn-white" @click="batalEdit">
        Batal
      </button>
    </form>

    <div class="mapel-list">
      <div v-for="m in list" :key="m.id" class="mapel-item">
        <span class="font-bold">{{ m.nama }}</span>
        <div class="actions">
          <button type="button" class="neo-btn neo-btn-yellow btn-xs" @click="mulaiEdit(m)">✏️</button>
          <button type="button" class="neo-btn neo-btn-red btn-xs" @click="hapus(m.id)">🗑️</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'

const list = ref([])
const namaMapel = ref('')
const editId = ref(null)

async function fetchData() {
  const res = await api.get('/mata-pelajaran')
  list.value = res.data?.data || []
}

async function simpanMapel() {
  try {
    if (editId.value) {
      await api.put(`/mata-pelajaran/${editId.value}`, { nama: namaMapel.value })
    } else {
      await api.post('/mata-pelajaran', { nama: namaMapel.value })
    }
    batalEdit()
    await fetchData()
  } catch (err) {
    alert('Gagal menyimpan mata pelajaran (pastikan nama belum duplikat).')
  }
}

function mulaiEdit(m) {
  editId.value = m.id
  namaMapel.value = m.nama
}

function batalEdit() {
  editId.value = null
  namaMapel.value = ''
}

async function hapus(id) {
  if (!confirm('Hapus mata pelajaran ini?')) return
  await api.delete(`/mata-pelajaran/${id}`)
  await fetchData()
}

onMounted(fetchData)
</script>

<style scoped>
.sec-title { font-size: 1.05rem; font-weight: 900; margin-bottom: 0.85rem; }
.add-form { display: flex; gap: 0.5rem; margin-bottom: 1rem; }
.mapel-list { display: grid; grid-template-columns: 1fr; gap: 0.5rem; }
.mapel-item {
  display: flex; justify-content: space-between; align-items: center;
  padding: 0.6rem 0.75rem; border: 2px solid var(--black); border-radius: 8px;
}
.font-bold { font-weight: 800; font-size: 0.9rem; }
.actions { display: flex; gap: 0.35rem; }
.btn-xs { padding: 0.3rem 0.55rem; font-size: 0.72rem; }
@media (min-width: 640px) {
  .mapel-list { grid-template-columns: repeat(2, 1fr); }
}
</style>