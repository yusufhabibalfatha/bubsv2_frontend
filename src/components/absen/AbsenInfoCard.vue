<template>
  <section class="neo-card neo-card-left-bar info-card-box">
    <div class="info-grid">
      <div class="info-row">
        <span class="info-icon"><AppIcon name="calendar" size="1.15rem" /></span>
        <div class="info-body">
          <span class="info-lbl">Hari / Tanggal</span>
          <span class="info-val">{{ jadwal?.hari || '-' }}</span>
        </div>
      </div>

      <div class="info-row">
        <span class="info-icon"><AppIcon name="class" size="1.15rem" /></span>
        <div class="info-body">
          <span class="info-lbl">Kelas & Unit</span>
          <span class="info-val">
            {{ jadwal?.kelas?.nama || '-' }} ({{ jadwal?.kelas?.nama_sekolah || '-' }})
          </span>
        </div>
      </div>

      <div class="info-row">
        <span class="info-icon"><AppIcon name="book" size="1.15rem" /></span>
        <div class="info-body">
          <span class="info-lbl">Mata Pelajaran & Jam</span>
          <span class="info-val">
            {{ jadwal?.mapel?.nama || '-' }} • JP {{ jadwal?.jam?.jamKe || '-' }} ({{ jadwal?.jam?.labelJam || '-' }})
          </span>
        </div>
      </div>

      <div class="info-row teacher-highlight">
        <span class="info-icon"><AppIcon name="teacher" size="1.15rem" /></span>
        <div class="info-body">
          <span class="info-lbl">Guru Pengajar</span>
          <span class="info-val">{{ jadwal?.guru?.nama || '-' }}</span>
        </div>
      </div>
    </div>

    <!-- Baris Materi & Catatan Kelas -->
    <div class="materi-bar" :class="{ empty: !materi }">
      <div class="materi-text">
        <span class="materi-label">📖 Materi Pembelajaran Hari Ini:</span>
        <p class="materi-value">
          {{ materi || '⚠️ Belum diisi (Wajib diisi sebelum simpan absensi)' }}
        </p>
        <small v-if="catatanJurnal" class="catatan-jurnal-preview">
          💬 Catatan Kelas: {{ catatanJurnal }}
        </small>
      </div>
      <button
        type="button"
        class="neo-btn"
        :class="materi ? 'neo-btn-yellow' : 'neo-btn-orange'"
        @click="$emit('open-materi')"
      >
        {{ materi ? '✍️ Edit Materi' : '➕ Isi Materi' }}
      </button>
    </div>
  </section>
</template>

<script setup>
import AppIcon from '@/components/ui/AppIcon.vue'

defineProps({
  jadwal: { type: Object, default: () => ({}) },
  materi: { type: String, default: '' },
  catatanJurnal: { type: String, default: '' },
})

defineEmits(['open-materi'])
</script>

<style scoped>
.info-card-box {
  margin-bottom: 1rem;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.55rem;
  margin-bottom: 0.85rem;
}

.info-row {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.55rem 0.75rem;
  background: var(--white);
  border: 2px solid var(--gray-muted);
  border-radius: 8px;
}

.teacher-highlight {
  background: #fef3c7;
  border-color: var(--accent-yellow);
}

.info-body {
  display: flex;
  flex-direction: column;
}

.info-lbl {
  font-size: 0.68rem;
  font-weight: 800;
  text-transform: uppercase;
  color: var(--gray-dark);
}

.info-val {
  font-size: 0.9rem;
  font-weight: 900;
  color: var(--black);
}

.materi-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.75rem;
  padding: 0.75rem;
  border: var(--border-sm);
  border-radius: 8px;
  background: #ecfdf5;
}

.materi-bar.empty {
  background: #fff7ed;
  border-color: var(--accent-orange);
}

.materi-text {
  flex: 1;
  min-width: 200px;
}

.materi-label {
  font-size: 0.72rem;
  font-weight: 800;
  text-transform: uppercase;
  color: var(--gray-dark);
}

.materi-value {
  font-size: 0.92rem;
  font-weight: 800;
  color: var(--black);
  margin-top: 0.15rem;
}

.catatan-jurnal-preview {
  display: block;
  margin-top: 0.25rem;
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--gray-dark);
}

@media (min-width: 640px) {
  .info-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>