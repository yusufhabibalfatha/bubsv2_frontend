<template>
  <div class="tab-rekap-kelas">
    <!-- Filter Kelas, Mapel, & Rentang Tanggal -->
    <div class="neo-card filter-grid">
      <div class="filter-item">
        <label>🏷️ Pilih Kelas *</label>
        <select v-model="selectedKelasId" class="neo-select" @change="fetchRekap">
          <option value="">-- Pilih Kelas --</option>
          <option v-for="k in kelasList" :key="k.id" :value="k.id">
            {{ k.nama }} — {{ k.nama_sekolah }}
          </option>
        </select>
      </div>

      <div class="filter-item">
        <label>📚 Mata Pelajaran</label>
        <select v-model="selectedMapelId" class="neo-select" @change="fetchRekap">
          <option value="">Semua Mata Pelajaran</option>
          <option v-for="m in mapelList" :key="m.id" :value="m.id">
            {{ m.nama }}
          </option>
        </select>
      </div>

      <div class="filter-item">
        <label>📅 Dari Tanggal</label>
        <input v-model="tanggalMulai" type="date" class="neo-input" @change="fetchRekap" />
      </div>

      <div class="filter-item">
        <label>📅 Sampai Tanggal</label>
        <input v-model="tanggalSelesai" type="date" class="neo-input" @change="fetchRekap" />
      </div>
    </div>

    <div v-if="!selectedKelasId" class="neo-card prompt-box">
      👆 Silakan pilih <strong>Kelas</strong> terlebih dahulu untuk menampilkan tabel rekapitulasi siswa.
    </div>

    <StateMessage
      v-else
      :loading="loading"
      loading-text="Menghitung rekap kehadiran & rata-rata nilai siswa..."
      :error="errorMsg"
      @retry="fetchRekap"
    />

    <!-- Tabel Hasil Rekapitulasi -->
    <div v-if="selectedKelasId && !loading && rekapData" class="neo-card table-card">
      <div class="table-header-info">
        <div>
          <h4 class="rekap-class-title">
            📊 Rekap Kelas {{ rekapData.info_kelas?.nama }} ({{ rekapData.info_kelas?.nama_sekolah }})
          </h4>
          <small class="wali-label">
            Wali Kelas: {{ rekapData.info_kelas?.nama_wali_kelas || '-' }}
          </small>
        </div>
      </div>

      <div class="table-responsive">
        <table class="neo-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Nama Siswa</th>
              <th>JK</th>
              <th title="Total Pertemuan">Pertemuan</th>
              <th>Hadir</th>
              <th>Telat</th>
              <th>Izin</th>
              <th>Sakit</th>
              <th>Dispen</th>
              <th>Alpa</th>
              <th>% Hadir</th>
              <th>Rata Nilai</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(s, idx) in rekapData.rekap_siswa" :key="s.siswa_id">
              <td class="text-center">{{ idx + 1 }}</td>
              <td class="font-bold">{{ s.nama_siswa }}</td>
              <td class="text-center">{{ s.jenis_kelamin }}</td>
              <td class="text-center">{{ s.total_pertemuan }}</td>
              <td class="text-center bg-hadir">{{ s.hadir }}</td>
              <td class="text-center">{{ s.terlambat }}</td>
              <td class="text-center">{{ s.izin }}</td>
              <td class="text-center">{{ s.sakit }}</td>
              <td class="text-center">{{ s.dispensasi }}</td>
              <td class="text-center bg-alpa">{{ s.alpa }}</td>
              <td class="text-center font-bold">{{ s.persentase_hadir }}%</td>
              <td class="text-center font-bold">
                {{ s.rata_rata_nilai !== null ? s.rata_rata_nilai : '-' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import api from '@/services/api'
import { appState } from '@/stores/appState'
import StateMessage from '@/components/ui/StateMessage.vue'

const kelasList = ref([])
const mapelList = ref([])

const selectedKelasId = ref('')
const selectedMapelId = ref('')
const tanggalMulai = ref('')
const tanggalSelesai = ref('')

const rekapData = ref(null)
const loading = ref(false)
const errorMsg = ref(null)

async function initMasterFilter() {
  try {
    const params = {}
    if (appState.selectedSekolahId) params.sekolah_id = appState.selectedSekolahId

    const [resKelas, resMapel] = await Promise.all([
      api.get('/kelas', { params }),
      api.get('/mata-pelajaran'),
    ])

    kelasList.value = resKelas.data?.data || []
    mapelList.value = resMapel.data?.data || []

    // Otomatis pilih kelas pertama jika ada
    if (kelasList.value.length > 0 && !selectedKelasId.value) {
      selectedKelasId.value = kelasList.value[0].id
      fetchRekap()
    }
  } catch (e) {
    console.error(e)
  }
}

async function fetchRekap() {
  if (!selectedKelasId.value) return
  loading.value = true
  errorMsg.value = null

  try {
    const params = { kelas_id: selectedKelasId.value }
    if (selectedMapelId.value) params.mata_pelajaran_id = selectedMapelId.value
    if (tanggalMulai.value) params.tanggal_mulai = tanggalMulai.value
    if (tanggalSelesai.value) params.tanggal_selesai = tanggalSelesai.value

    const res = await api.get('/laporan/rekap-kelas', { params })
    rekapData.value = res.data?.data || null
  } catch (e) {
    errorMsg.value = 'Gagal menghitung data rekapitulasi kelas.'
  } finally {
    loading.value = false
  }
}

watch(
  () => appState.selectedSekolahId,
  () => {
    selectedKelasId.value = ''
    rekapData.value = null
    initMasterFilter()
  }
)

onMounted(() => {
  initMasterFilter()
})
</script>

<style scoped>
.filter-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.filter-item label {
  display: block;
  font-size: 0.75rem;
  font-weight: 800;
  margin-bottom: 0.25rem;
  text-transform: uppercase;
}

.prompt-box {
  text-align: center;
  font-weight: 700;
  background: #fef3c7;
}

.table-card {
  padding: 1rem;
}

.table-header-info {
  margin-bottom: 0.85rem;
}

.rekap-class-title {
  font-size: 1rem;
  font-weight: 900;
  color: var(--primary-blue);
}

.wali-label {
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--gray-dark);
}

.table-responsive {
  overflow-x: auto;
}

.neo-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.8rem;
}

.neo-table th,
.neo-table td {
  border: 2px solid var(--black);
  padding: 0.5rem 0.6rem;
}

.neo-table th {
  background: var(--accent-yellow);
  font-weight: 900;
  text-transform: uppercase;
  font-size: 0.72rem;
}

.text-center { text-align: center; }
.font-bold   { font-weight: 800; }
.bg-hadir    { background: #ecfdf5; font-weight: 800; color: #065f46; }
.bg-alpa     { background: #fef2f2; font-weight: 800; color: #991b1b; }

@media (min-width: 640px) {
  .filter-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 900px) {
  .filter-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>