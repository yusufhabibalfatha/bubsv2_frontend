<template>
  <div class="neo-card">
    <h3 class="sec-title">👥 Kelola Siswa & Nomor WA Orang Tua</h3>

    <!-- Form Tambah / Edit Siswa Sekaligus Penempatan Kelas -->
    <form class="siswa-form" @submit.prevent="simpanSiswa">
      <input
        v-model="form.nama"
        type="text"
        class="neo-input"
        placeholder="Nama Lengkap Siswa *"
        required
      />

      <input
        v-model="form.no_hp"
        type="text"
        class="neo-input"
        placeholder="No. WA Orang Tua (Contoh: 08123456789)"
      />

      <select v-model="form.jenis_kelamin" class="neo-select" required>
        <option value="L">👦 Laki-laki (L)</option>
        <option value="P">👧 Perempuan (P)</option>
      </select>

      <select v-if="!editId" v-model="form.kelas_id" class="neo-select">
        <option value="">-- Masukkan ke Kelas (Opsional) --</option>
        <option v-for="k in kelasList" :key="k.id" :value="k.id">
          Kelas {{ k.nama }} ({{ k.nama_sekolah }})
        </option>
      </select>

      <div class="form-btns">
        <button type="submit" class="neo-btn neo-btn-blue">
          {{ editId ? '💾 Update Siswa' : '➕ Tambah Siswa' }}
        </button>
        <button v-if="editId" type="button" class="neo-btn neo-btn-white" @click="resetForm">
          Batal
        </button>
      </div>
    </form>

    <!-- Pencarian Siswa -->
    <div style="margin-bottom: 0.75rem">
      <input
        v-model="search"
        type="text"
        class="neo-input"
        placeholder="🔍 Cari nama siswa..."
        @input="fetchSiswa"
      />
    </div>

    <div class="siswa-list">
      <div v-for="s in siswaList" :key="s.id" class="siswa-row">
        <div>
          <p class="s-name">
            {{ s.nama }}
            <span class="neo-badge neo-badge-gray">{{ s.jenis_kelamin }}</span>
          </p>
          <small class="s-meta">
            📱 WA Ortu: <strong>{{ s.no_hp || '⚠️ Belum diisi' }}</strong> • Status: {{ s.status }}
          </small>
        </div>
        <div class="row-actions">
          <button type="button" class="neo-btn neo-btn-yellow btn-xs" @click="mulaiEdit(s)">✏️</button>
          <button type="button" class="neo-btn neo-btn-red btn-xs" @click="hapus(s.id)">🗑️</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'
import { appState } from '@/stores/appState'

const siswaList = ref([])
const kelasList = ref([])
const search = ref('')
const editId = ref(null)

const form = ref({
  nama: '',
  no_hp: '',
  jenis_kelamin: 'L',
  status: 'aktif',
  kelas_id: '',
})

async function fetchSiswa() {
  const res = await api.get('/siswa', {
    params: { search: search.value },
  })
  siswaList.value = res.data?.data || []
}

async function fetchKelas() {
  const res = await api.get('/kelas')
  kelasList.value = res.data?.data || []
}

async function simpanSiswa() {
  try {
    if (editId.value) {
      await api.put(`/siswa/${editId.value}`, {
        nama: form.value.nama,
        no_hp: form.value.no_hp,
        jenis_kelamin: form.value.jenis_kelamin,
        status: form.value.status,
      })
    } else {
      const res = await api.post('/siswa', {
        nama: form.value.nama,
        no_hp: form.value.no_hp,
        jenis_kelamin: form.value.jenis_kelamin,
        status: 'aktif',
      })
      const newSiswaId = res.data?.data?.id

      // Jika langsung memilih kelas, tempatkan ke tabel siswa_kelas
      if (newSiswaId && form.value.kelas_id) {
        const k = kelasList.value.find(item => Number(item.id) === Number(form.value.kelas_id))
        await api.post('/siswa-kelas', {
          siswa_id: newSiswaId,
          kelas_id: form.value.kelas_id,
          tahun_ajaran_id: k?.tahun_ajaran_id || appState.tahunAjaranAktif?.id,
          is_aktif: 1,
        })
      }
    }
    resetForm()
    await fetchSiswa()
  } catch (err) {
    alert('Gagal menyimpan data siswa.')
  }
}

function mulaiEdit(s) {
  editId.value = s.id
  form.value = {
    nama: s.nama,
    no_hp: s.no_hp || '',
    jenis_kelamin: s.jenis_kelamin,
    status: s.status,
    kelas_id: '',
  }
}

function resetForm() {
  editId.value = null
  form.value = { nama: '', no_hp: '', jenis_kelamin: 'L', status: 'aktif', kelas_id: '' }
}

async function hapus(id) {
  if (!confirm('Hapus siswa ini?')) return
  await api.delete(`/siswa/${id}`)
  await fetchSiswa()
}

onMounted(() => {
  fetchSiswa()
  fetchKelas()
})
</script>

<style scoped>
.sec-title { font-size: 1.05rem; font-weight: 900; margin-bottom: 0.85rem; }
.siswa-form { display: grid; grid-template-columns: 1fr; gap: 0.5rem; margin-bottom: 1rem; }
.form-btns { display: flex; gap: 0.5rem; }
.siswa-list { display: flex; flex-direction: column; gap: 0.5rem; max-height: 400px; overflow-y: auto; }
.siswa-row {
  display: flex; justify-content: space-between; align-items: center;
  padding: 0.65rem; border: 2px solid var(--black); border-radius: 8px;
}
.s-name { font-weight: 900; font-size: 0.92rem; display: flex; align-items: center; gap: 0.4rem; }
.s-meta { font-size: 0.75rem; color: var(--gray-dark); }
.row-actions { display: flex; gap: 0.35rem; }
.btn-xs { padding: 0.3rem 0.55rem; font-size: 0.72rem; }
@media (min-width: 640px) {
  .siswa-form { grid-template-columns: repeat(2, 1fr); }
}
</style>