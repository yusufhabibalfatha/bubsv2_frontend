<template>
  <div class="quick-actions">
    <button
      type="button"
      class="neo-btn neo-btn-green"
      @click="$emit('mark-all-hadir')"
    >
      ✅ Semua Hadir
    </button>

    <button
      type="button"
      class="neo-btn neo-btn-yellow"
      @click="$emit('reset-all')"
    >
      🔄 Reset Semua
    </button>
  </div>
</template>

<script setup>
defineEmits(['mark-all-hadir', 'reset-all'])
</script>

<style scoped>
.quick-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.65rem;
  margin-bottom: 1rem;
}
</style>