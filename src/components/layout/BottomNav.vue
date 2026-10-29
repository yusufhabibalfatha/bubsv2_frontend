<template>
  <nav class="bottom-nav">
    <div class="bottom-nav-inner container-page">
      <RouterLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="nav-item"
        :class="{ active: isActive(item.to) }"
      >
        <div class="nav-icon-box">
          <AppIcon :name="item.icon" size="1.25rem" />
        </div>
        <span class="nav-label">{{ item.label }}</span>
      </RouterLink>
    </div>
  </nav>
</template>

<script setup>
import { useRoute } from 'vue-router'
import AppIcon from '@/components/ui/AppIcon.vue'

const route = useRoute()

const navItems = [
  { to: '/', label: 'Beranda', icon: 'nav-home' },
  { to: '/pilih', label: 'Absen', icon: 'nav-absen' },
  { to: '/rekap', label: 'Rekap', icon: 'nav-rekap' },
  { to: '/notifikasi-wa', label: 'Log WA', icon: 'nav-wa' },
  { to: '/master', label: 'Master', icon: 'nav-master' },
]

function isActive(targetPath) {
  if (targetPath === '/') return route.path === '/'
  if (targetPath === '/pilih') {
    return route.path.startsWith('/pilih') || route.path.startsWith('/absen')
  }
  return route.path.startsWith(targetPath)
}
</script>

<style scoped>
.bottom-nav {
  background: var(--white);
  border-top: var(--border);
  padding: 0.4rem 0.5rem calc(0.4rem + env(safe-area-inset-bottom, 0px));
  z-index: 100;
  flex-shrink: 0;
}

.bottom-nav-inner {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.35rem;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.2rem;
  padding: 0.35rem 0.25rem;
  border-radius: 10px;
  border: 2px solid transparent;
  text-decoration: none;
  color: var(--gray-dark);
  font-weight: 700;
  transition: all 0.15s ease;
}

.nav-item:hover {
  background: var(--gray-light);
  color: var(--black);
}

.nav-item.active {
  background: var(--accent-yellow);
  color: var(--black);
  border-color: var(--black);
  box-shadow: var(--shadow-sm);
  transform: translateY(-2px);
}

.nav-label {
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.2px;
}

@media (min-width: 768px) {
  .nav-item {
    flex-direction: row;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
  }
  .nav-label {
    font-size: 0.85rem;
  }
}
</style>