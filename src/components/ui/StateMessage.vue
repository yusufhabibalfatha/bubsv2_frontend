<template>
  <div v-if="loading" class="neo-card state-box loading-box">
    <div class="state-icon pulse">⏳</div>
    <p class="state-text">{{ loadingText }}</p>
  </div>

  <div v-else-if="error" class="neo-card state-box error-box">
    <div class="state-icon">❌</div>
    <p class="state-text">{{ error }}</p>
    <button type="button" class="neo-btn neo-btn-blue" @click="$emit('retry')">
      🔄 Coba Lagi
    </button>
  </div>

  <div v-else-if="empty" class="neo-card state-box empty-box">
    <div class="state-icon">📭</div>
    <p class="state-text">{{ emptyText }}</p>
    <button v-if="showRetryOnEmpty" type="button" class="neo-btn neo-btn-yellow" @click="$emit('retry')">
      🔄 Muat Ulang
    </button>
  </div>
</template>

<script setup>
defineProps({
  loading: { type: Boolean, default: false },
  loadingText: { type: String, default: 'Sedang memuat data...' },
  error: { type: [String, Boolean], default: null },
  empty: { type: Boolean, default: false },
  emptyText: { type: String, default: 'Belum ada data tersedia.' },
  showRetryOnEmpty: { type: Boolean, default: false },
})

defineEmits(['retry'])
</script>

<style scoped>
.state-box {
  text-align: center;
  padding: 2rem 1rem;
  margin: 1rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.loading-box {
  background: #f0f9ff;
  border-color: var(--primary-blue);
}

.error-box {
  background: #fee2e2;
  border-color: var(--accent-red);
}

.empty-box {
  background: var(--gray-light);
}

.state-icon {
  font-size: 2rem;
}

.state-text {
  font-weight: 700;
  font-size: 0.95rem;
  color: var(--black);
}

.pulse {
  animation: pulseAnim 1.4s infinite ease-in-out;
}

@keyframes pulseAnim {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.12); opacity: 0.65; }
}
</style>