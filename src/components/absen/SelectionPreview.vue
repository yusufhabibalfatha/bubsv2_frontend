<template>
  <section class="neo-card neo-card-left-bar preview-card">
    <h3 class="preview-title">✅ Ringkasan Jadwal Mengajar</h3>

    <div class="preview-list">
      <div class="preview-row">
        <span class="lbl">🏫 Sekolah / Kelas:</span>
        <span class="val">
          {{ selectedClass ? `${selectedClass.nama} (${selectedClass.nama_sekolah})` : '-' }}
        </span>
      </div>

      <div class="preview-row">
        <span class="lbl">📚 Mata Pelajaran:</span>
        <span class="val">{{ selectedSubject?.nama || '-' }}</span>
      </div>

      <div class="preview-row">
        <span class="lbl">⏰ Jam Pelajaran:</span>
        <span class="val">
          {{ selectedTime ? `JP ${selectedTime.jamKe} (${selectedTime.labelJam})` : '-' }}
        </span>
      </div>

      <div class="preview-row">
        <span class="lbl">👨‍🏫 Guru Pengajar:</span>
        <span class="val">{{ selectedTeacher?.nama || '-' }}</span>
      </div>
    </div>

    <div class="preview-actions">
      <button
        type="button"
        class="neo-btn neo-btn-green btn-proceed"
        :disabled="!isComplete"
        @click="$emit('proceed')"
      >
        📋 Lanjut ke Daftar Siswa →
      </button>
      <p v-if="!isComplete" class="incomplete-hint">
        ⚠️ Lengkapi keempat pilihan di atas untuk membuka daftar absensi siswa.
      </p>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  selectedClass: { type: Object, default: null },
  selectedSubject: { type: Object, default: null },
  selectedTime: { type: Object, default: null },
  selectedTeacher: { type: Object, default: null },
})

defineEmits(['proceed'])

const isComplete = computed(() => {
  return Boolean(
    props.selectedClass &&
    props.selectedSubject &&
    props.selectedTime &&
    props.selectedTeacher
  )
})
</script>

<style scoped>
.preview-card {
  background: #f0f9ff;
  margin-top: 1rem;
}

.preview-title {
  font-size: 1rem;
  font-weight: 900;
  color: var(--primary-blue);
  margin-bottom: 0.75rem;
}

.preview-list {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  margin-bottom: 1rem;
}

.preview-row {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.5rem;
  font-size: 0.88rem;
  padding: 0.4rem 0.6rem;
  background: var(--white);
  border: 1.5px solid var(--black);
  border-radius: 6px;
}

.preview-row .lbl {
  font-weight: 700;
  color: var(--gray-dark);
}

.preview-row .val {
  font-weight: 900;
  color: var(--black);
}

.preview-actions {
  text-align: center;
  padding-top: 0.75rem;
  border-top: 2px dashed var(--black);
}

.btn-proceed {
  width: 100%;
  padding: 0.9rem;
  font-size: 1rem;
}

.incomplete-hint {
  margin-top: 0.5rem;
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--accent-red);
}
</style>