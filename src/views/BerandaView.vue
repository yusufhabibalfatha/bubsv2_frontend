<template>
  <div class="beranda-view">
    <!-- 1. Kartu Hero & Pintasan Utama -->
    <HeroWelcomeCard />

    <!-- Filter Tanggal Ringkasan -->
    <div class="filter-bar neo-card">
      <div class="filter-left">
        <span class="filter-label">📌 Ringkasan Data Tanggal:</span>
        <input
          v-model="selectedDate"
          type="date"
          class="neo-input date-picker"
          @change="fetchDashboard"
        />
      </div>
      <button type="button" class="neo-btn neo-btn-yellow btn-refresh" @click="fetchDashboard">
        🔄 Segarkan Data
      </button>
    </div>

    <!-- Indikator Loading / Error -->
    <StateMessage
      :loading="loading"
      loading-text="Mengambil statistik sekolah..."
      :error="errorMsg"
      @retry="fetchDashboard"
    />

    <!-- Konten Statistik Dashboard -->
    <template v-if="!loading && !errorMsg && dashboardData">
      <!-- 2. Kartu Ringkasan Data Master & Jurnal -->
      <MasterSummaryCards
        :summary="dashboardData.summary_master"
        :jurnal-hari-ini="dashboardData.jurnal_hari_ini"
      />

      <!-- 3. Statistik Kehadiran Mapel Hari Ini -->
      <TodayAttendanceStats :absensi="dashboardData.absensi_hari_ini" />

      <!-- 4. Status Pengiriman WhatsApp Fonnte -->
      <TodayWaGatewayCard :wa-stats="dashboardData.wa_hari_ini" />
    </template>

    <p class="version-footer">
      Sistem Presensi Digital Sekolah v2.0 • Terintegrasi WhatsApp Gateway
    </p>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import api from '@/services/api'
import { appState } from '@/stores/appState'
import StateMessage from '@/components/ui/StateMessage.vue'
import HeroWelcomeCard from '@/components/beranda/HeroWelcomeCard.vue'
import MasterSummaryCards from '@/components/beranda/MasterSummaryCards.vue'
import TodayAttendanceStats from '@/components/beranda/TodayAttendanceStats.vue'
import TodayWaGatewayCard from '@/components/beranda/TodayWaGatewayCard.vue'

function getTodayString() {
  const d = new Date()
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

const selectedDate = ref(getTodayString())
const dashboardData = ref(null)
const loading = ref(false)
const errorMsg = ref(null)

async function fetchDashboard() {
  loading.value = true
  errorMsg.value = null
  try {
    const params = {
      tanggal: selectedDate.value,
    }
    if (appState.selectedSekolahId) {
      params.sekolah_id = appState.selectedSekolahId
    }

    const res = await api.get('/laporan/dashboard', { params })
    dashboardData.value = res.data?.data || null
  } catch (err) {
    errorMsg.value = err.response?.data?.messages?.error || 'Gagal memuat data statistik dashboard.'
  } finally {
    loading.value = false
  }
}

// Otomatis muat ulang dashboard jika user mengganti unit sekolah (SMP / SMA) di TopNavbar
watch(
  () => appState.selectedSekolahId,
  () => {
    fetchDashboard()
  }
)

onMounted(() => {
  fetchDashboard()
})
</script>

<style scoped>
.filter-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.75rem;
  padding: 0.85rem 1rem;
  margin-bottom: 1.25rem;
  background: var(--white);
}

.filter-left {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  flex-wrap: wrap;
}

.filter-label {
  font-size: 0.85rem;
  font-weight: 800;
}

.date-picker {
  width: auto;
  padding: 0.45rem 0.7rem;
  font-size: 0.85rem;
}

.btn-refresh {
  padding: 0.5rem 0.9rem;
  font-size: 0.78rem;
}

.version-footer {
  text-align: center;
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--gray-dark);
  margin-top: 1.5rem;
}
</style>