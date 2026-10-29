<template>
  <div class="tab-rekap-jurnal">
    <!-- Filter Tanggal & Kelas -->
    <div class="neo-card filter-box">
      <div class="filter-field">
        <label>📅 Tanggal</label>
        <input v-model="filterTanggal" type="date" class="neo-input" @change="fetchJurnal" />
      </div>

      <div class="filter-field">
        <label>🏷️ Kelas</label>
        <select v-model="filterKelasId" class="neo-select" @change="fetchJurnal">
          <option value="">Semua Kelas</option>
          <option v-for="k in kelasList" :key="k.id" :value="k.id">
            {{ k.nama }} ({{ k.nama_sekolah }})
          </option>
        </select>
      </div>

      <div class="filter-actions">
        <button type="button" class="neo-btn neo-btn-white btn-sm" @click="resetTanggal">
          Tampilkan Semua Tgl
        </button>
      </div>
    </div>

    <StateMessage
      :loading="loading"
      loading-text="Memuat riwayat jurnal mengajar..."
      :error="errorMsg"
      :empty="!loading && !errorMsg && jurnalList.length === 0"
      empty-text="Belum ada jurnal mengajar pada filter ini."
      @retry="fetchJurnal"
    />

    <!-- Daftar Kartu Jurnal -->
    <div v-if="!loading && jurnalList.length > 0" class="jurnal-grid">
      <div
        v-for="item in jurnalList"
        :key="item.id"
        class="neo-card neo-card-left-bar jurnal-card"
        @click="bukaDetail(item)"
      >
        <div class="jurnal-top">
          <span class="neo-badge neo-badge-yellow">
            Kelas {{ item.nama_kelas }}
          </span>
          <span class="jurnal-date">
            📅 {{ item.tanggal }} • JP {{ item.jam_ke || '-' }}
          </span>
        </div>

        <h4 class="jurnal-mapel">{{ item.nama_mapel || 'Tanpa Mapel' }}</h4>
        <p class="jurnal-guru">👨‍🏫 {{ item.nama_guru }}</p>
        <p class="jurnal-materi">📖 <strong>Materi:</strong> {{ item.materi || '-' }}</p>

        <div class="jurnal-footer">
          <small class="school-tag">🏫 {{ item.nama_sekolah }}</small>
          <span class="detail-link">Lihat & Edit Absen →</span>
        </div>
      </div>
    </div>

    <!-- Modal Detail & Edit Absen -->
    <ModalDetailJurnal
      v-model="showModal"
      :jurnal="selectedJurnal"
      @deleted="fetchJurnal"
    />
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import api from '@/services/api'
import { appState } from '@/stores/appState'
import StateMessage from '@/components/ui/StateMessage.vue'
import ModalDetailJurnal from './ModalDetailJurnal.vue'

const filterTanggal = ref(new Date().toISOString().slice(0, 10))
const filterKelasId = ref('')
const kelasList = ref([])
const jurnalList = ref([])

const loading = ref(false)
const errorMsg = ref(null)
const showModal = ref(false)
const selectedJurnal = ref(null)

async function fetchKelasFilter() {
  try {
    const params = {}
    if (appState.selectedSekolahId) params.sekolah_id = appState.selectedSekolahId
    const res = await api.get('/kelas', { params })
    kelasList.value = res.data?.data || []
  } catch (e) {
    console.error(e)
  }
}

async function fetchJurnal() {
  loading.value = true
  errorMsg.value = null
  try {
    const params = {}
    if (appState.selectedSekolahId) params.sekolah_id = appState.selectedSekolahId
    if (filterKelasId.value) params.kelas_id = filterKelasId.value
    if (filterTanggal.value) params.tanggal = filterTanggal.value

    const res = await api.get('/jurnal-mengajar', { params })
    jurnalList.value = res.data?.data || []
  } catch (e) {
    errorMsg.value = 'Gagal mengambil riwayat jurnal mengajar.'
  } finally {
    loading.value = false
  }
}

function resetTanggal() {
  filterTanggal.value = ''
  fetchJurnal()
}

function bukaDetail(item) {
  selectedJurnal.value = item
  showModal.value = true
}

watch(
  () => appState.selectedSekolahId,
  () => {
    filterKelasId.value = ''
    fetchKelasFilter()
    fetchJurnal()
  }
)

onMounted(() => {
  fetchKelasFilter()
  fetchJurnal()
})
</script>

<style scoped>
.filter-box {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
  margin-bottom: 1rem;
  align-items: end;
}

.filter-field label {
  display: block;
  font-size: 0.75rem;
  font-weight: 800;
  margin-bottom: 0.25rem;
  text-transform: uppercase;
}

.jurnal-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
}

.jurnal-card {
  cursor: pointer;
}

.jurnal-card:hover {
  transform: translateY(-2px);
  border-color: var(--primary-blue);
}

.jurnal-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.jurnal-date {
  font-size: 0.75rem;
  font-weight: 800;
  color: var(--gray-dark);
}

.jurnal-mapel {
  font-size: 1.05rem;
  font-weight: 900;
  color: var(--primary-blue);
  margin-bottom: 0.2rem;
}

.jurnal-guru {
  font-size: 0.85rem;
  font-weight: 800;
  margin-bottom: 0.35rem;
}

.jurnal-materi {
  font-size: 0.82rem;
  color: var(--gray-dark);
  margin-bottom: 0.65rem;
}

.jurnal-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 0.5rem;
  border-top: 1.5px dashed var(--gray-muted);
  font-size: 0.75rem;
  font-weight: 800;
}

.detail-link {
  color: var(--primary-blue);
}

@media (min-width: 640px) {
  .filter-box {
    grid-template-columns: 1fr 1fr auto;
  }
  .jurnal-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>