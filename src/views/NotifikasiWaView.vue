<template>
  <div class="notifikasi-wa-view">
    <div class="header-row">
      <h2 class="page-title">💬 Log WhatsApp Gateway (Fonnte)</h2>
      <div class="header-actions">
        <button type="button" class="neo-btn neo-btn-yellow btn-sm" @click="fetchLogWa">
          🔄 Segarkan Log
        </button>
        <button
          type="button"
          class="neo-btn neo-btn-red btn-sm"
          :disabled="resendingBulk || loading"
          @click="bukaModalResendBulk"
        >
          {{ resendingBulk ? '⏳ Mengirim...' : '🚀 Kirim Ulang Semua Gagal' }}
        </button>
      </div>
    </div>

    <!-- Banner jika ada pesan WA gagal di daftar saat ini -->
    <div v-if="!loading && countGagalOnList > 0" class="neo-card failed-alert-banner">
      <div class="banner-content">
        <div class="banner-title">
          ⚠️ Terdeteksi <strong>{{ countGagalOnList }}</strong> pesan WA Gagal
          <span v-if="filterTanggal">pada tanggal <strong>{{ formatTanggalIndo(filterTanggal) }}</strong></span>
        </div>
        <p class="banner-desc">
          Kirim ulang semua pesan gagal sekaligus ke nomor orang tua/wali siswa tanpa harus menekan tombol satu persatu.
        </p>
      </div>
      <button
        type="button"
        class="neo-btn neo-btn-red btn-sm"
        :disabled="resendingBulk"
        @click="bukaModalResendBulk"
      >
        🚀 Kirim Ulang Semua Gagal
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
            :disabled="resendingId === item.id || resendingBulk"
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

    <!-- Modal Kirim Ulang Semua Gagal -->
    <NeoModal v-model="showResendBulkModal" title="🚀 Kirim Ulang Semua WA Gagal">
      <div class="resend-modal-body">
        <p class="resend-desc">
          Sistem akan mengirim ulang semua pesan WhatsApp yang <strong>berstatus Gagal</strong> secara otomatis ke antrean server Fonnte.
        </p>

        <div class="form-group mb-3">
          <label class="form-label">📅 Pilih Tanggal Absensi yang Ingin Dikirim Ulang:</label>
          <input
            v-model="resendTanggal"
            type="date"
            class="neo-input w-full"
            :disabled="resendingBulk"
            @change="cekJumlahGagalTarget"
          />
        </div>

        <div v-if="appState.getSelectedSekolah()" class="school-info-pill mb-3">
          🏫 Memfilter sekolah: <strong>{{ appState.getSelectedSekolah()?.nama }}</strong>
        </div>

        <div v-if="statusCheckLoading" class="check-box">
          ⏳ Menghitung jumlah pesan gagal pada tanggal ini...
        </div>
        <div
          v-else-if="targetGagalCount !== null"
          class="check-box"
          :class="targetGagalCount > 0 ? 'check-warning' : 'check-ok'"
        >
          <span v-if="targetGagalCount > 0">
            ⚠️ Ditemukan <strong>{{ targetGagalCount }} pesan gagal</strong> pada tanggal <strong>{{ formatTanggalIndo(resendTanggal) }}</strong>.
          </span>
          <span v-else>
            ✅ Tidak ada pesan gagal pada tanggal <strong>{{ formatTanggalIndo(resendTanggal) }}</strong>.
          </span>
        </div>

        <div v-if="resendingBulk" class="resend-loading-box">
          <div class="spinner-icon">⏳</div>
          <div>
            <strong>Sedang mengirim ulang notifikasi WhatsApp...</strong>
            <p>Mohon jangan menutup atau merefresh halaman ini.</p>
          </div>
        </div>
      </div>

      <template #footer>
        <button
          type="button"
          class="neo-btn neo-btn-white btn-sm"
          :disabled="resendingBulk"
          @click="showResendBulkModal = false"
        >
          Batal
        </button>
        <button
          type="button"
          class="neo-btn neo-btn-red btn-sm"
          :disabled="resendingBulk || !resendTanggal || (targetGagalCount === 0 && !statusCheckLoading)"
          @click="eksekusiKirimUlangSemua"
        >
          {{ resendingBulk ? '⏳ Sedang Memproses...' : '🚀 Kirim Ulang Sekarang' }}
        </button>
      </template>
    </NeoModal>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
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

// State untuk fitur Kirim Ulang Semua Gagal
const showResendBulkModal = ref(false)
const resendTanggal = ref('')
const targetGagalCount = ref(null)
const statusCheckLoading = ref(false)
const resendingBulk = ref(false)

const countGagalOnList = computed(() => {
  return logList.value.filter(item => item.status_kirim === 'gagal').length
})

function formatTanggalIndo(dateStr) {
  if (!dateStr) return '-'
  try {
    const parts = dateStr.split('-')
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`
    }
    return dateStr
  } catch {
    return dateStr
  }
}

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

async function cekJumlahGagalTarget() {
  if (!resendTanggal.value) {
    targetGagalCount.value = null
    return
  }
  statusCheckLoading.value = true
  try {
    const params = {
      tanggal: resendTanggal.value,
      status_kirim: 'gagal',
    }
    if (appState.selectedSekolahId) {
      params.sekolah_id = appState.selectedSekolahId
    }
    const res = await api.get('/notifikasi-wa', { params })
    const items = res.data?.data || []
    targetGagalCount.value = items.length
  } catch (e) {
    targetGagalCount.value = null
  } finally {
    statusCheckLoading.value = false
  }
}

function bukaModalResendBulk() {
  resendTanggal.value = filterTanggal.value || new Date().toISOString().slice(0, 10)
  showResendBulkModal.value = true
  cekJumlahGagalTarget()
}

async function eksekusiKirimUlangSemua() {
  if (!resendTanggal.value) {
    alert('Silakan pilih tanggal terlebih dahulu.')
    return
  }

  resendingBulk.value = true
  try {
    const payload = {
      tanggal: resendTanggal.value,
      sekolah_id: appState.selectedSekolahId || undefined,
    }

    const res = await api.post('/notifikasi-wa/resend-all', payload)
    const data = res.data
    alert(data?.message || 'Proses kirim ulang notifikasi WA selesai.')

    showResendBulkModal.value = false
    // Arahkan filter ke tanggal yang baru dikirim ulang agar admin langsung melihat status terbarunya
    filterTanggal.value = resendTanggal.value
    await fetchLogWa()
  } catch (err) {
    const msg =
      err.response?.data?.messages?.error ||
      err.response?.data?.message ||
      'Gagal melakukan kirim ulang massal.'
    alert(msg)
    await fetchLogWa()
  } finally {
    resendingBulk.value = false
  }
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
  gap: 0.75rem;
  flex-wrap: wrap;
}

.header-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.page-title {
  font-size: 1.25rem;
  font-weight: 900;
  color: var(--primary-blue);
  text-shadow: 1px 1px 0px var(--accent-yellow);
}

.failed-alert-banner {
  background: #fef2f2;
  border-left: 8px solid #ef4444;
  padding: 0.85rem 1rem;
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.banner-content {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.banner-title {
  font-size: 0.95rem;
  color: #991b1b;
}

.banner-desc {
  font-size: 0.8rem;
  color: #7f1d1d;
  margin: 0;
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

/* Modal Styling */
.resend-modal-body {
  font-size: 0.9rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.resend-desc {
  font-size: 0.85rem;
  color: var(--gray-dark);
  margin-bottom: 0.25rem;
  line-height: 1.4;
}

.form-label {
  display: block;
  font-size: 0.8rem;
  font-weight: 800;
  margin-bottom: 0.35rem;
  text-transform: uppercase;
}

.w-full {
  width: 100%;
}

.school-info-pill {
  font-size: 0.82rem;
  background: #f0fdf4;
  border: 2px solid var(--black);
  padding: 0.4rem 0.6rem;
  border-radius: 6px;
}

.check-box {
  padding: 0.6rem 0.75rem;
  border: 2px solid var(--black);
  border-radius: 6px;
  font-size: 0.85rem;
}

.check-warning {
  background: #fffbeb;
  color: #92400e;
  border-color: #f59e0b;
}

.check-ok {
  background: #ecfdf5;
  color: #065f46;
  border-color: #10b981;
}

.resend-loading-box {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: #eff6ff;
  border: 2px solid #3b82f6;
  border-radius: 6px;
  padding: 0.75rem;
  font-size: 0.85rem;
}

.spinner-icon {
  font-size: 1.5rem;
  animation: pulse 1s infinite alternate;
}

@keyframes pulse {
  from { transform: scale(1); }
  to { transform: scale(1.15); }
}

@media (min-width: 640px) {
  .filter-bar {
    grid-template-columns: 1fr 1fr auto;
  }
}
</style>
