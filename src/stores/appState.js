import { reactive } from 'vue'
import api from '@/services/api'

export const appState = reactive({
  sekolahList: [],
  selectedSekolahId: '', // '' = Semua Jenjang, 1 = SMP, 2 = SMA
  tahunAjaranAktif: null,
  isTopNavbarSticky: true, // Bisa di-toggle untuk melihat bagus sticky atau tidak
  loadingInit: false,

  // Ambil data awal (Sekolah & Tahun Ajaran Aktif) saat aplikasi dibuka
  async initAppData() {
    this.loadingInit = true
    try {
      const [resSekolah, resTahun] = await Promise.allSettled([
        api.get('/sekolah'),
        api.get('/tahun-ajaran/aktif'),
      ])

      if (resSekolah.status === 'fulfilled') {
        this.sekolahList = resSekolah.value.data?.data || []
      }
      if (resTahun.status === 'fulfilled') {
        this.tahunAjaranAktif = resTahun.value.data?.data || null
      }
    } catch (err) {
      console.error('Gagal memuat data inisialisasi:', err)
    } finally {
      this.loadingInit = false
    }
  },

  // Helper untuk mendapatkan objek sekolah yang sedang dipilih
  getSelectedSekolah() {
    if (!this.selectedSekolahId) return null
    return this.sekolahList.find(s => Number(s.id) === Number(this.selectedSekolahId)) || null
  }
})