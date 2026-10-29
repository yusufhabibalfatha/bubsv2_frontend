<template>
  <Teleport to="body">
    <div v-if="modelValue" class="neo-modal-overlay" @click.self="close">
      <div class="neo-modal-box">
        <div class="modal-header">
          <h3 class="modal-title">{{ title }}</h3>
          <button type="button" class="close-btn" @click="close">✖</button>
        </div>
        <div class="modal-body">
          <slot />
        </div>
        <div v-if="$slots.footer" class="modal-footer">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: 'Informasi' },
})

const emit = defineEmits(['update:modelValue'])

function close() {
  emit('update:modelValue', false)
}
</script>

<style scoped>
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.6rem;
  border-bottom: 3px solid var(--black);
}

.modal-title {
  font-size: 1.2rem;
  font-weight: 800;
}

.close-btn {
  background: var(--accent-red);
  color: var(--white);
  border: 2px solid var(--black);
  border-radius: 6px;
  width: 32px;
  height: 32px;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 2px 2px 0px var(--black);
}

.modal-footer {
  margin-top: 1.25rem;
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}
</style>