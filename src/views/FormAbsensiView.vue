<template>
  <div class="form-absensi-view">
    <!-- Baris Navigasi Atas -->
    <div class="top-nav-row">
      <button type="button" class="neo-btn neo-btn-yellow btn-sm" @click="$router.push('/pilih')">
        ← Ubah Jadwal
      </button>
      <h2 class="page-title">📋 Absensi Siswa</h2>
    </div>

    <!-- 1. Kartu Informasi Kelas, Guru, & Materi -->
    <AbsenInfoCard
      :jadwal="jadwal"
      :materi="materi"
      :catatan-jurnal="catatanJurnal"
      @open-materi="showMateriModal = true"
    />

    <!-- 2. Statistik Real-Time -->
    <AbsenStatistic :stats="stats" />

    <!-- 3. Tombol Aksi Cepat -->
    <AbsenQuickActions
      @mark-all-hadir="tandaiSemuaHadir"
      @reset-all="resetSemuaStatus"
    />

    <!-- Banner Notifikasi Aksi Cepat -->
    <div v-if="flashMessage" class="flash-banner">
      {{ flashMessage }}
    </div>

    <!-- Indikator Loading / Error / Kosong -->
    <StateMessage
      :loading="loadingSiswa"
      loading-text="Memuat daftar siswa kelas..."
      :error="errorMsg"
      :empty="!loadingSiswa && !errorMsg && formData.length === 0"
      empty-text="Belum ada siswa yang ditempatkan di kelas ini."
      @retry="fetchDaftarSiswa"
    />

    <!-- 4. Daftar Kartu Siswa -->
    <form v-if="!loadingSiswa && formData.length > 0" @submit.prevent="submitAbsensi">
      <div class="siswa-count-heading">
        👥 Terdaftar {{ formData.length }} Siswa di Kelas {{ jadwal?.kelas?.nama }}
      </div>

      <SiswaAbsenCard
        v-for="(siswa, idx) in formData"
        :key="siswa.siswa_id"
        :siswa="siswa"
        :index="idx"
        @select-status="ubahStatusSiswa"
        @clear-status="batalkanStatusSiswa"
        @open-detail="bukaModalDetailSiswa"
      />

      <!-- Bagian Bawah Submit & Validasi -->
      <div class="neo-card submit-footer-card">
        <div v-if="stats.belum > 0" class="validation-warn">
          ⚠️ Masih ada <strong>{{ stats.belum }} siswa</strong> yang belum dipilih status kehadirannya.
        </div>

        <div v-if="!materi.trim()" class="validation-warn">
          ⚠️ Materi pembelajaran belum diisi.
          <button
            type="button"
            class="neo-btn neo-btn-orange btn-xs"
            @click="showMateriModal = true"
          >
            ➕ Isi Materi Sekarang
          </button>
        </div>

        <button
          type="submit"
          class="neo-btn neo-btn-green btn-submit-full"
          :disabled="submitLoading || stats.belum > 0 || !materi.trim()"
        >
          {{ submitLoading ? '⏳ Menyimpan & Mengirim WA Ortu...' : '📤 Simpan Absensi & Kirim WA Otomatis' }}
        </button>
      </div>
    </form>

    <!-- Modal Input Materi & Catatan Jurnal -->
    <ModalMateri
      v-model="showMateriModal"
      :materi="materi"
      :catatan-jurnal="catatanJurnal"
      @save="simpanMateri"
    />

    <!-- Modal Input Keterangan, Nilai & Catatan Siswa -->
    <ModalDetailSiswa
      v-model="showDetailModal"
      :siswa="activeSiswaDetail"
      @save="simpanDetailSiswa"
    />

    <!-- Modal Hasil Submit & Laporan WA Fonnte -->
    <ModalHasilSubmit
      v-model="showResultModal"
      :hasil-wa="hasilNotifikasiWa"
      :teks-ringkasan-grup="teksRingkasanGrup"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'
import StateMessage from '@/components/ui/StateMessage.vue'
import AbsenInfoCard from '@/components/absen/AbsenInfoCard.vue'
import AbsenStatistic from '@/components/absen/AbsenStatistic.vue'
import AbsenQuickActions from '@/components/absen/AbsenQuickActions.vue'
import SiswaAbsenCard from '@/components/absen/SiswaAbsenCard.vue'
import ModalMateri from '@/components/absen/ModalMateri.vue'
import ModalDetailSiswa from '@/components/absen/ModalDetailSiswa.vue'
import ModalHasilSubmit from '@/components/absen/ModalHasilSubmit.vue'

const router = useRouter()
const STORAGE_KEY = 'presensi_draft_jadwal'

const jadwal = ref(null)
const formData = ref([])
const materi = ref('')
const catatanJurnal = ref('')

const loadingSiswa = ref(false)
const submitLoading = ref(false)
const errorMsg = ref(null)
const flashMessage = ref('')

// State Modals
const showMateriModal = ref(false)
const showDetailModal = ref(false)
const activeSiswaDetail = ref(null)
const showResultModal = ref(false)
const hasilNotifikasiWa = ref({})
const teksRingkasanGrup = ref('')

// Hitung statistik real-time
const stats = computed(() => {
  const count = { hadir: 0, terlambat: 0, izin: 0, sakit: 0, dispensasi: 0, alpa: 0, belum: 0 }
  for (const s of formData.value) {
    if (!s.status) count.belum++
    else if (count[s.status] !== undefined) count[s.status]++
  }
  return count
})

function showFlash(msg) {
  flashMessage.value = msg
  setTimeout(() => { flashMessage.value = '' }, 2500)
}

async function fetchDaftarSiswa() {
  if (!jadwal.value?.kelas?.id) return
  loadingSiswa.value = true
  errorMsg.value = null

  try {
    const res = await api.get('/siswa-kelas', {
      params: {
        kelas_id: jadwal.value.kelas.id,
        tahun_ajaran_id: jadwal.value.kelas.tahun_ajaran_id,
      },
    })

    const list = res.data?.data || []
    formData.value = list.map(item => ({
      siswa_id: item.siswa_id,
      nama_siswa: item.nama_siswa,
      jenis_kelamin: item.jenis_kelamin,
      status: '', // Kosong di awal agar guru memilih/klik Semua Hadir
      nilai: null,
      keterangan: null,
      catatan: null,
    }))
  } catch (err) {
    errorMsg.value = 'Gagal memuat daftar siswa kelas ini.'
  } finally {
    loadingSiswa.value = false
  }
}

function ubahStatusSiswa({ siswaId, status }) {
  const target = formData.value.find(s => s.siswa_id === siswaId)
  if (target) {
    target.status = status
  }
}

function batalkanStatusSiswa(siswa) {
  siswa.status = ''
  siswa.keterangan = null
  siswa.nilai = null
  siswa.catatan = null
  showFlash(`❌ Status ${siswa.nama_siswa} dibatalkan`)
}

function tandaiSemuaHadir() {
  formData.value.forEach(s => {
    s.status = 'hadir'
  })
  showFlash('✅ Semua siswa ditandai HADIR')
}

function resetSemuaStatus() {
  formData.value.forEach(s => {
    s.status = ''
    s.keterangan = null
    s.nilai = null
    s.catatan = null
  })
  showFlash('🔄 Status seluruh siswa direset')
}

function simpanMateri({ materi: m, catatanJurnal: c }) {
  materi.value = m
  catatanJurnal.value = c
}

function bukaModalDetailSiswa(siswa) {
  activeSiswaDetail.value = siswa
  showDetailModal.value = true
}

function simpanDetailSiswa(payload) {
  const target = formData.value.find(s => s.siswa_id === payload.siswa_id)
  if (target) {
    target.keterangan = payload.keterangan
    target.nilai = payload.nilai
    target.catatan = payload.catatan
  }
}

function buatTeksRingkasanGrup() {
  const j = jadwal.value
  let msg = `📅 *Presensi Kelas ${j?.kelas?.nama} (${j?.kelas?.nama_sekolah})*\n`
  msg += `*Hari/Tgl:* ${j?.hari}\n`
  msg += `*Mapel:* ${j?.mapel?.nama} (JP ${j?.jam?.jamKe})\n`
  msg += `*Guru:* ${j?.guru?.nama}\n`
  msg += `*Materi:* ${materi.value}\n\n`

  const urutan = [
    { key: 'hadir', label: 'Hadir', icon: '✅' },
    { key: 'terlambat', label: 'Terlambat', icon: '🕐' },
    { key: 'izin', label: 'Izin', icon: '📋' },
    { key: 'sakit', label: 'Sakit', icon: '🤒' },
    { key: 'dispensasi', label: 'Dispensasi', icon: '🎖️' },
    { key: 'alpa', label: 'Alpa', icon: '❌' },
  ]

  for (const kat of urutan) {
    const grup = formData.value.filter(s => s.status === kat.key)
    if (grup.length > 0) {
      msg += `${kat.icon} *${kat.label} (${grup.length}):*\n`
      grup.forEach(s => {
        const ket = s.keterangan ? ` (${s.keterangan})` : ''
        msg += `- ${s.nama_siswa}${ket}\n`
      })
      msg += `\n`
    }
  }

  msg += `📊 *Total:* ${formData.value.length} Siswa`
  return msg
}

async function submitAbsensi() {
  if (stats.value.belum > 0 || !materi.value.trim()) return

  submitLoading.value = true
  errorMsg.value = null

  const payload = {
    kelas_id: jadwal.value.kelas.id,
    tahun_ajaran_id: jadwal.value.kelas.tahun_ajaran_id,
    guru_id: jadwal.value.guru.id,
    mata_pelajaran_id: jadwal.value.mapel.id,
    tanggal: jadwal.value.tanggal,
    jam_ke: jadwal.value.jam.jamKe,
    jam_mulai: jadwal.value.jam.jamMulai,
    jam_selesai: jadwal.value.jam.jamSelesai,
    materi: materi.value.trim(),
    catatan: catatanJurnal.value.trim() || null,
    absensi: formData.value.map(s => ({
      siswa_id: s.siswa_id,
      status: s.status,
      nilai: s.nilai,
      keterangan: s.keterangan,
      catatan: s.catatan,
    })),
  }

  try {
    const res = await api.post('/jurnal-mengajar', payload)
    hasilNotifikasiWa.value = res.data?.notifikasi_wa || {}
    teksRingkasanGrup.value = buatTeksRingkasanGrup()
    showResultModal.value = true
  } catch (err) {
    const apiErr = err.response?.data?.messages
    errorMsg.value = typeof apiErr === 'object'
      ? Object.values(apiErr).join(' | ')
      : 'Gagal menyimpan data absensi ke server.'
  } finally {
    submitLoading.value = false
  }
}

onMounted(() => {
  const saved = sessionStorage.getItem(STORAGE_KEY)
  if (!saved) {
    router.replace('/pilih')
    return
  }
  jadwal.value = JSON.parse(saved)
  fetchDaftarSiswa()
})
</script>

<style scoped>
.top-nav-row {
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

.btn-sm {
  padding: 0.45rem 0.85rem;
  font-size: 0.8rem;
}

.btn-xs {
  padding: 0.3rem 0.65rem;
  font-size: 0.72rem;
  margin-left: 0.4rem;
}

.flash-banner {
  background: #d1fae5;
  border: 2px solid var(--black);
  border-radius: 8px;
  padding: 0.6rem;
  text-align: center;
  font-weight: 800;
  font-size: 0.85rem;
  margin-bottom: 1rem;
  box-shadow: var(--shadow-sm);
}

.siswa-count-heading {
  text-align: center;
  font-size: 1rem;
  font-weight: 900;
  margin: 1rem 0 0.75rem;
}

.submit-footer-card {
  margin-top: 1.25rem;
  text-align: center;
  background: var(--white);
}

.validation-warn {
  color: #dc2626;
  font-size: 0.82rem;
  font-weight: 800;
  margin-bottom: 0.6rem;
}

.btn-submit-full {
  width: 100%;
  padding: 0.95rem;
  font-size: 1rem;
  margin-top: 0.35rem;
}
</style>