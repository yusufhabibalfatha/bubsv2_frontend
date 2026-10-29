<template>
  <section class="neo-card neo-card-left-bar section-box">
    <div class="section-header">
      <h3 class="section-title">📊 Statistik Kehadiran Mapel Hari Ini</h3>
      <span class="neo-badge neo-badge-blue">Total: {{ totalTercatat }} Absen</span>
    </div>

    <div class="status-grid">
      <div class="status-box hadir">
        <span class="count">{{ absensi?.hadir ?? 0 }}</span>
        <span class="label">✅ Hadir</span>
      </div>

      <div class="status-box terlambat">
        <span class="count">{{ absensi?.terlambat ?? 0 }}</span>
        <span class="label">🕐 Terlambat</span>
      </div>

      <div class="status-box izin">
        <span class="count">{{ absensi?.izin ?? 0 }}</span>
        <span class="label">📋 Izin</span>
      </div>

      <div class="status-box sakit">
        <span class="count">{{ absensi?.sakit ?? 0 }}</span>
        <span class="label">🤒 Sakit</span>
      </div>

      <div class="status-box dispensasi">
        <span class="count">{{ absensi?.dispensasi ?? 0 }}</span>
        <span class="label">🎖️ Dispensasi</span>
      </div>

      <div class="status-box alpa">
        <span class="count">{{ absensi?.alpa ?? 0 }}</span>
        <span class="label">❌ Alpa</span>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  absensi: {
    type: Object,
    default: () => ({}),
  },
})

const totalTercatat = computed(() => {
  const a = props.absensi || {}
  return (
    (a.hadir || 0) +
    (a.terlambat || 0) +
    (a.izin || 0) +
    (a.sakit || 0) +
    (a.dispensasi || 0) +
    (a.alpa || 0)
  )
})
</script>

<style scoped>
.section-box {
  margin-bottom: 1.25rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px dashed var(--black);
}

.section-title {
  font-size: 1rem;
  font-weight: 900;
  text-transform: uppercase;
}

.status-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.6rem;
}

.status-box {
  border: var(--border-sm);
  border-radius: 8px;
  padding: 0.65rem 0.4rem;
  text-align: center;
  box-shadow: 2px 2px 0px var(--black);
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.status-box .count {
  font-size: 1.35rem;
  font-weight: 900;
}

.status-box .label {
  font-size: 0.7rem;
  font-weight: 800;
  text-transform: uppercase;
}

.hadir      { background: #d1fae5; color: #065f46; }
.terlambat  { background: #ffedd5; color: #9a3412; }
.izin       { background: #fef3c7; color: #92400e; }
.sakit      { background: #fee2e2; color: #991b1b; }
.dispensasi { background: #ede9fe; color: #5b21b6; }
.alpa       { background: #f3f4f6; color: #374151; }

@media (min-width: 768px) {
  .status-grid {
    grid-template-columns: repeat(6, 1fr);
  }
}
</style>