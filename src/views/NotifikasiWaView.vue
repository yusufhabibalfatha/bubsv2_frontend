<template>
  <div class="notifikasi-wa-view">
    <div class="header-row">
      <h2 class="page-title">💬 Log WhatsApp Gateway (Fonnte)</h2>
      <button type="button" class="neo-btn neo-btn-yellow btn-sm" @click="fetchLogWa">
        🔄 Segarkan Log
      </button>
    </div>

    <!-- Filter Status Kirim & Tanggal -->
    <div class="neo-card filter-bar">
      <div class="filter-group">
        <label>📅 Tanggal Mengajar</label>
        <input v-model="filterTanggal" type="date" class="neo-input" @change="fetchLogWa" />
      </div>

      <div class="filter-group">
        <label>📡 Status Pengiriman</label>
        <select v-model="filterStatus" class="neo-select" @change="fetchLogWa">
          <option value="">Semua Status</option>
          <option value="berhasil">✅ Berhasil</option>
          <option value="pending">⏳ Pending</option>
          <option value="gagal">❌ Gagal</option>
        </select>
      </div>

      <div class="filter-group">
        <button type="button" class="neo-btn neo-btn-white btn-sm" @click="semuaTanggal">
          Lihat Semua Tanggal
        </button>
      </div>
    </div>

    <StateMessage
      :loading="loading"
      loading-text="Mengambil log pengiriman WhatsApp..."
      :error="errorMsg"
      :empty="!loading && !errorMsg && logList.length === 0"
      empty-text="Tidak ada catatan pengiriman WhatsApp pada filter ini."
      @retry="fetchLogWa"
    />

    <!-- Daftar Kartu Log WA -->
    <div v-if="!loading && logList.length > 0" class="log-list">
      <div
        v-for="item in logList"
        :key="item.id"
        class="neo-card log-card"
        :class="`border-${item.status_kirim}`"
      >
        <div class="log-top">
          <div>
            <span class="siswa-name">{{ item.nama_siswa }}</span>
            <span class="kelas-badge">
              {{ item.nama_kelas }} • {{ item.nama_sekolah }}
            </span>
          </div>

          <span
            class="neo-badge"
            :class="{
              'neo-badge-green': item.status_kirim === 'berhasil',
              'neo-badge-yellow': item.status_kirim === 'pending',
              'neo-badge-red': item.status_kirim === 'gagal',
            }"
          >
            {{ item.status_kirim.toUpperCase() }}
          </span>
        </div>

        <div class="log-body">
          <p><strong>📱 No. WA Tujuan:</strong> {{ item.no_tujuan || '⚠️ Kosong' }}</p>
          <p><strong>📚 Mapel / Tanggal:</strong> {{ item.nama_mapel || '-' }} ({{ item.tanggal }}, JP {{ item.jam_ke || '-' }})</p>
          <p><strong>📌 Status Absen:</strong> {{ item.status_absen?.toUpperCase() }}</p>
          <p><strong>📡 Respon Fonnte:</strong> {{ item.fonnte_status_detail || '-' }}</p>
          <p v-if="item.waktu_kirim"><strong>🕒 Waktu Kirim:</strong> {{ item.waktu_kirim }}</p>
        </div>

        <div class="log-actions">
          <button
            type="button"
            class="neo-btn neo-btn-white btn-xs"
            @click="bukaPreviewPesan(item)"
          >
            👁️ Lihat Isi Pesan
          </button>

          <button
            v-if="item.status_kirim !== 'berhasil'"
            type="button"
            class="neo-btn neo-btn-green btn-xs"
            :disabled="resendingId === item.id"
            @click="kirimUlang(item)"
          >
            {{ resendingId === item.id ? '⏳ Mengirim...' : '🔄 Kirim Ulang (Resend)' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Lihat Isi Pesan WA -->
    <NeoModal v-model="showMessageModal" title="📩 Isi Pesan WhatsApp">
      <pre class="wa-preview-box">{{ activePesanText }}</pre>
    </NeoModal>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import api from '@/services/api'
import { appState } from '@/stores/appState'
import StateMessage from '@/components/ui/StateMessage.vue'
import NeoModal from '@/components/ui/NeoModal.vue'

const filterTanggal = ref(new Date().toISOString().slice(0, 10))
const filterStatus = ref('')
const logList = ref([])

const loading = ref(false)
const errorMsg = ref(null)
const resendingId = ref(null)

const showMessageModal = ref(false)
const activePesanText = ref('')

async function fetchLogWa() {
  loading.value = true
  errorMsg.value = null
  try {
    const params = {}
    if (appState.selectedSekolahId) params.sekolah_id = appState.selectedSekolahId
    if (filterStatus.value) params.status_kirim = filterStatus.value
    if (filterTanggal.value) params.tanggal = filterTanggal.value

    const res = await api.get('/notifikasi-wa', { params })
    logList.value = res.data?.data || []
  } catch (e) {
    errorMsg.value = 'Gagal memuat data log notifikasi WhatsApp.'
  } finally {
    loading.value = false
  }
}

function semuaTanggal() {
  filterTanggal.value = ''
  fetchLogWa()
}

function bukaPreviewPesan(item) {
  activePesanText.value = item.isi_pesan
  showMessageModal.value = true
}

async function kirimUlang(item) {
  resendingId.value = item.id
  try {
    const res = await api.post(`/notifikasi-wa/resend/${item.id}`)
    alert(res.data?.message || 'Pesan berhasil dikirim ulang!')
    await fetchLogWa()
  } catch (err) {
    const msg = err.response?.data?.messages?.error || 'Gagal mengirim ulang pesan WA.'
    alert(msg)
    await fetchLogWa()
  } finally {
    resendingId.value = null
  }
}

watch(
  () => appState.selectedSekolahId,
  () => fetchLogWa()
)

onMounted(() => {
  fetchLogWa()
})
</script>

<style scoped>
.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.page-title {
  font-size: 1.25rem;
  font-weight: 900;
  color: var(--primary-blue);
  text-shadow: 1px 1px 0px var(--accent-yellow);
}

.filter-bar {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
  align-items: end;
  margin-bottom: 1rem;
}

.filter-group label {
  display: block;
  font-size: 0.75rem;
  font-weight: 800;
  margin-bottom: 0.25rem;
  text-transform: uppercase;
}

.log-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.log-card {
  padding: 1rem;
}

.border-berhasil { border-left: 8px solid #10b981; }
.border-pending  { border-left: 8px solid #f59e0b; }
.border-gagal    { border-left: 8px solid #ef4444; background: #fff5f5; }

.log-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.5rem;
  margin-bottom: 0.6rem;
}

.siswa-name {
  font-size: 1rem;
  font-weight: 900;
  display: block;
}

.kelas-badge {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--gray-dark);
}

.log-body {
  font-size: 0.82rem;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  margin-bottom: 0.75rem;
}

.log-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.btn-sm { padding: 0.45rem 0.85rem; font-size: 0.78rem; }
.btn-xs { padding: 0.35rem 0.7rem; font-size: 0.74rem; }

.wa-preview-box {
  white-space: pre-wrap;
  font-family: inherit;
  font-size: 0.85rem;
  background: #dcfce7;
  border: 2px solid var(--black);
  border-radius: 8px;
  padding: 0.85rem;
  line-height: 1.45;
}

@media (min-width: 640px) {
  .filter-bar {
    grid-template-columns: 1fr 1fr auto;
  }
}
</style>