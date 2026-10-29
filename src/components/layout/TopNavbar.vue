<template>
  <header class="top-navbar">
    <div class="navbar-inner container-page">
      <!-- Kiri: Logo & Nama Sistem -->
      <div class="brand-box" @click="$router.push('/')">
        <div class="logo-wrapper">
          <AppIcon name="logo-sekolah" size="1.6rem" />
        </div>
        <div class="brand-text">
          <h1 class="brand-title">PRESENSI SEKOLAH</h1>
          <span class="brand-subtitle">
            TA {{ appState.tahunAjaranAktif?.nama_tahun || '2026/2027' }} •
            {{ appState.tahunAjaranAktif?.semester || 'Ganjil' }}
          </span>
        </div>
      </div>

      <!-- Kanan: Switcher Unit Sekolah (Semua / SMP / SMA) & Tombol Uji Sticky -->
      <div class="navbar-actions">
        <select
          v-model="appState.selectedSekolahId"
          class="neo-select unit-selector"
          title="Filter Unit Sekolah"
        >
          <option value="">🏫 Semua Unit</option>
          <option
            v-for="s in appState.sekolahList"
            :key="s.id"
            :value="s.id"
          >
            🎓 {{ s.nama_jenjang }} — {{ s.nama }}
          </option>
        </select>

        <!-- Tombol eksperimen untuk menguji apakah TopNavbar lebih enak Sticky atau ikut Scroll -->
        <button
          type="button"
          class="pin-toggle-btn"
          :class="{ active: appState.isTopNavbarSticky }"
          @click="appState.isTopNavbarSticky = !appState.isTopNavbarSticky"
          :title="appState.isTopNavbarSticky ? 'Navbar dikunci di atas (Klik untuk lepas)' : 'Navbar ikut scroll (Klik untuk kunci)'"
        >
          {{ appState.isTopNavbarSticky ? '📌' : '🔓' }}
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { appState } from '@/stores/appState'
import AppIcon from '@/components/ui/AppIcon.vue'
</script>

<style scoped>
.top-navbar {
  background: var(--white);
  border-bottom: var(--border);
  padding: 0.65rem 1rem;
  z-index: 100;
  flex-shrink: 0;
}

.navbar-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

.brand-box {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  cursor: pointer;
}

.logo-wrapper {
  width: 42px;
  height: 42px;
  background: var(--accent-yellow);
  border: var(--border-sm);
  border-radius: 10px;
  box-shadow: var(--shadow-sm);
  display: flex;
  align-items: center;
  justify-content: center;
}

.brand-title {
  font-size: 1rem;
  font-weight: 900;
  color: var(--primary-blue);
  letter-spacing: -0.3px;
  line-height: 1.1;
}

.brand-subtitle {
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--gray-dark);
  display: block;
}

.navbar-actions {
  display: flex;
  align-items: center;
  gap: 0.45rem;
}

.unit-selector {
  padding: 0.4rem 0.6rem;
  font-size: 0.78rem;
  max-width: 175px;
  background: #fef3c7;
}

.pin-toggle-btn {
  width: 34px;
  height: 34px;
  border: var(--border-sm);
  border-radius: 8px;
  background: var(--gray-light);
  box-shadow: var(--shadow-sm);
  cursor: pointer;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pin-toggle-btn.active {
  background: #d1fae5;
}

@media (min-width: 768px) {
  .brand-title {
    font-size: 1.2rem;
  }
  .unit-selector {
    max-width: 280px;
    font-size: 0.85rem;
  }
}
</style>