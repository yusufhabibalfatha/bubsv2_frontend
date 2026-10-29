<template>
  <div class="pilih-jadwal-view">
    <div class="page-top-bar">
      <button type="button" class="neo-btn neo-btn-yellow btn-sm" @click="$router.push('/')">
        ← Beranda
      </button>
      <h2 class="page-heading">📚 Persiapan Mengajar</h2>
    </div>

    <!-- Step 1: Pilih Kelas -->
    <StepPilihKelas v-model="selectedClass" />

    <!-- Step 2: Pilih Mata Pelajaran -->
    <StepPilihMapel
      v-model="selectedSubject"
      :selected-class="selectedClass"
    />

    <!-- Step 3: Pilih Jam Pelajaran -->
    <StepPilihJam v-model="selectedTime" />

    <!-- Step 4: Pilih Guru (Lintas Jenjang) -->
    <StepPilihGuru
      v-model="selectedTeacher"
      :selected-subject="selectedSubject"
    />

    <!-- Ringkasan & Tombol Lanjut -->
    <SelectionPreview
      v-if="selectedClass || selectedSubject || selectedTime || selectedTeacher"
      :selected-class="selectedClass"
      :selected-subject="selectedSubject"
      :selected-time="selectedTime"
      :selected-teacher="selectedTeacher"
      @proceed="lanjutKeAbsensi"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import StepPilihKelas from '@/components/absen/StepPilihKelas.vue'
import StepPilihMapel from '@/components/absen/StepPilihMapel.vue'
import StepPilihJam from '@/components/absen/StepPilihJam.vue'
import StepPilihGuru from '@/components/absen/StepPilihGuru.vue'
import SelectionPreview from '@/components/absen/SelectionPreview.vue'

const router = useRouter()

const selectedClass = ref(null)
const selectedSubject = ref(null)
const selectedTime = ref(null)
const selectedTeacher = ref(null)

const STORAGE_KEY = 'presensi_draft_jadwal'

onMounted(() => {
  // Pulihkan pilihan terakhir jika guru baru saja menekan tombol "Kembali" dari halaman absen
  const saved = sessionStorage.getItem(STORAGE_KEY)
  if (saved) {
    try {
      const parsed = JSON.parse(saved)
      selectedClass.value = parsed.kelas || null
      selectedSubject.value = parsed.mapel || null
      selectedTime.value = parsed.jam || null
      selectedTeacher.value = parsed.guru || null
    } catch (e) {
      sessionStorage.removeItem(STORAGE_KEY)
    }
  }
})

function lanjutKeAbsensi() {
  if (!selectedClass.value || !selectedSubject.value || !selectedTime.value || !selectedTeacher.value) {
    return
  }

  const payloadJadwal = {
    hari: new Date().toLocaleDateString('id-ID', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }),
    tanggal: new Date().toISOString().slice(0, 10),
    kelas: selectedClass.value,
    mapel: selectedSubject.value,
    jam: selectedTime.value,
    guru: selectedTeacher.value,
  }

  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payloadJadwal))
  router.push('/absen')
}
</script>

<style scoped>
.page-top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.page-heading {
  font-size: 1.25rem;
  font-weight: 900;
  color: var(--primary-blue);
  text-shadow: 1px 1px 0px var(--accent-yellow);
}

.btn-sm {
  padding: 0.45rem 0.85rem;
  font-size: 0.8rem;
}
</style>