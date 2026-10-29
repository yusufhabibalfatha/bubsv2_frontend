<template>
  <div class="app-shell bg-pattern">
    <!-- Jika mode Sticky aktif, TopNavbar berada di luar area scroll -->
    <TopNavbar v-if="appState.isTopNavbarSticky" />

    <!-- Area Konten Tengah yang bisa di-scroll -->
    <main class="main-scroll-area">
      <!-- Jika mode Sticky dimatikan (🔓), TopNavbar ikut tergulung di dalam scroll -->
      <TopNavbar v-if="!appState.isTopNavbarSticky" class="non-sticky-navbar" />

      <div class="page-content container-page">
        <RouterView />
      </div>
    </main>

    <!-- Bottom Navigation (Selalu Sticky di bawah) -->
    <BottomNav />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { appState } from '@/stores/appState'
import TopNavbar from './TopNavbar.vue'
import BottomNav from './BottomNav.vue'

onMounted(() => {
  appState.initAppData()
})
</script>

<style scoped>
.app-shell {
  height: 100dvh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.main-scroll-area {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  scroll-behavior: smooth;
  display: flex;
  flex-direction: column;
}

.non-sticky-navbar {
  margin-bottom: 0.5rem;
}

.page-content {
  padding: 1rem 0.85rem 2rem;
  flex: 1;
}

@media (min-width: 768px) {
  .page-content {
    padding: 1.5rem 1.25rem 2.5rem;
  }
}
</style>