<template>
  <NeoModal
    :model-value="modelValue"
    title="📖 Isi Materi & Catatan Jurnal"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <div class="form-group">
      <label class="form-label">Materi Pokok Pelajaran (Wajib) *</label>
      <textarea
        v-model="localMateri"
        rows="3"
        class="neo-textarea"
        placeholder="Contoh: Klasifikasi Makhluk Hidup / Konstitusi Negara"
      />
    </div>

    <div class="form-group" style="margin-top: 0.85rem">
      <label class="form-label">Catatan Jurnal Kelas (Opsional)</label>
      <textarea
        v-model="localCatatan"
        rows="2"
        class="neo-textarea"
        placeholder="Contoh: Siswa antusias berdiskusi, proyektor kelas berjalan baik."
      />
    </div>

    <template #footer>
      <button
        type="button"
        class="neo-btn neo-btn-white"
        @click="$emit('update:modelValue', false)"
      >
        Batal
      </button>
      <button
        type="button"
        class="neo-btn neo-btn-green"
        @click="simpan"
      >
        💾 Simpan Materi
      </button>
    </template>
  </NeoModal>
</template>

<script setup>
import { ref, watch } from 'vue'
import NeoModal from '@/components/ui/NeoModal.vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  materi: { type: String, default: '' },
  catatanJurnal: { type: String, default: '' },
})

const emit = defineEmits(['update:modelValue', 'save'])

const localMateri = ref('')
const localCatatan = ref('')

watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) {
      localMateri.value = props.materi || ''
      localCatatan.value = props.catatanJurnal || ''
    }
  }
)

function simpan() {
  emit('save', {
    materi: localMateri.value.trim(),
    catatanJurnal: localCatatan.value.trim(),
  })
  emit('update:modelValue', false)
}
</script>

<style scoped>
.form-label {
  display: block;
  font-size: 0.82rem;
  font-weight: 800;
  margin-bottom: 0.35rem;
}
</style>