<template>
  <section class="neo-card neo-card-top-bar hero-card">
    <div class="unit-pill">
      <span class="neo-badge neo-badge-yellow">
        {{ namaUnitAktif }}
      </span>
      <span class="date-label">📅 {{ tanggalHariIni }}</span>
    </div>

    <h2 class="hero-title">Sistem Presensi & Jurnal KBM</h2>

    <div class="school-decoration">
      <span class="decor-item"><AppIcon name="book" size="1.8rem" /></span>
      <span class="decor-item"><AppIcon name="pencil" size="1.8rem" /></span>
      <span class="decor-item"><AppIcon name="grad" size="1.8rem" /></span>
    </div>

    <p class="hero-desc">
      Platform digital pencatatan jurnal mengajar dan kehadiran siswa yang terintegrasi otomatis dengan notifikasi WhatsApp orang tua.
    </p>

    <div class="hero-actions">
      <button
        type="button"
        class="neo-btn neo-btn-blue btn-main-action"
        @click="$router.push('/pilih')"
      >
        <AppIcon name="nav-absen" size="1.2rem" />
        Mulai Absen Kelas
      </button>

      <button
        type="button"
        class="neo-btn neo-btn-yellow"
        @click="$router.push('/rekap')"
      >
        <AppIcon name="nav-rekap" size="1.15rem" />
        Rekap Absensi
      </button>

      <button
        type="button"
        class="neo-btn neo-btn-white"
        @click="$router.push('/notifikasi-wa')"
      >
        <AppIcon name="nav-wa" size="1.15rem" />
        Pantau WA Ortu
      </button>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { appState } from '@/stores/appState'
import AppIcon from '@/components/ui/AppIcon.vue'

const namaUnitAktif = computed(() => {
  const sekolah = appState.getSelectedSekolah()
  return sekolah ? `${sekolah.nama_jenjang} — ${sekolah.nama}` : 'Semua Unit Sekolah (SMP & SMA)'
})

const tanggalHariIni = computed(() => {
  return new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
})
</script>

<style scoped>
.hero-card {
  text-align: center;
  padding-top: 1.75rem;
  margin-bottom: 1.25rem;
}

.unit-pill {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 0.85rem;
}

.date-label {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--gray-dark);
}

.hero-title {
  color: var(--primary-blue);
  font-size: 1.65rem;
  font-weight: 900;
  text-shadow: 2px 2px 0px var(--accent-yellow);
  letter-spacing: -0.5px;
  margin-bottom: 0.75rem;
}

.school-decoration {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin: 0.85rem 0;
}

.decor-item {
  animation: floatIcon 3s ease-in-out infinite;
}

.decor-item:nth-child(2) {
  animation-delay: 0.5s;
}

.decor-item:nth-child(3) {
  animation-delay: 1s;
}

.hero-desc {
  color: var(--gray-dark);
  font-size: 0.92rem;
  line-height: 1.5;
  max-width: 600px;
  margin: 0 auto 1.25rem;
  font-weight: 500;
}

.hero-actions {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.btn-main-action {
  padding: 0.9rem 1.5rem;
  font-size: 1rem;
}

@media (min-width: 640px) {
  .hero-title {
    font-size: 2.1rem;
  }
  .hero-actions {
    flex-direction: row;
    justify-content: center;
    flex-wrap: wrap;
  }
}
</style>