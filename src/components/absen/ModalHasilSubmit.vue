<template>
  <NeoModal
    :model-value="modelValue"
    title="✅ Absensi & Jurnal Tersimpan!"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <!-- 1. Kotak Status Pengiriman WA Otomatis (Fonnte) ke Orang Tua -->
    <div class="wa-gateway-box" :class="hasilWa?.dikirim ? 'ok' : 'warn'">
      <h4 class="wa-box-title">
        {{ hasilWa?.dikirim ? '💬 Notifikasi WA Orang Tua Terkirim Otomatis!' : '⚠️ Info Notifikasi WA Gateway' }}
      </h4>
      <p class="wa-box-desc">
        <template v-if="hasilWa?.dikirim">
          Sebanyak <strong>{{ hasilWa.jumlah_target }} pesan personal</strong> berhasil dimasukkan ke antrean WhatsApp Fonnte ({{ hasilWa.respon_fonnte }}).
        </template>
        <template v-else>
          {{ hasilWa?.keterangan || hasilWa?.respon_fonnte || 'Pesan disimpan di log notifikasi.' }}
        </template>
      </p>
    </div>

    <!-- 2. Kotak Teks Ringkasan Kelas (Opsional untuk Grup WA Guru/Wali Kelas) -->
    <div class="group-share-section">
      <label class="share-label">📋 Ringkasan Kelas (Opsional untuk Grup Sekolah):</label>
      <textarea
        readonly
        :value="teksRingkasanGrup"
        rows="8"
        class="neo-textarea summary-textarea"
      />
    </div>

    <template #footer>
      <button type="button" class="neo-btn neo-btn-yellow" @click="salinTeks">
        {{ copied ? '✅ Tersalin!' : '📋 Salin Teks' }}
      </button>
      <button type="button" class="neo-btn neo-btn-green" @click="kirimKeGrupWa">
        📤 Buka WA Grup
      </button>
      <button type="button" class="neo-btn neo-btn-blue" @click="$router.push('/')">
        🏠 Ke Beranda
      </button>
    </template>
  </NeoModal>
</template>

<script setup>
import { ref } from 'vue'
import NeoModal from '@/components/ui/NeoModal.vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  hasilWa: { type: Object, default: () => ({}) },
  teksRingkasanGrup: { type: String, default: '' },
})

defineEmits(['update:modelValue'])

const copied = ref(false)

async function salinTeks() {
  try {
    await navigator.clipboard.writeText(props.teksRingkasanGrup)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2500)
  } catch (e) {
    alert('Gagal menyalin teks.')
  }
}

function kirimKeGrupWa() {
  const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(props.teksRingkasanGrup)}`
  window.open(url, '_blank')
}
</script>

<style scoped>
.wa-gateway-box {
  padding: 0.85rem;
  border: var(--border-sm);
  border-radius: 8px;
  margin-bottom: 1rem;
}

.wa-gateway-box.ok {
  background: #d1fae5;
  border-color: #059669;
  color: #065f46;
}

.wa-gateway-box.warn {
  background: #fef3c7;
  border-color: #d97706;
  color: #92400e;
}

.wa-box-title {
  font-size: 0.92rem;
  font-weight: 900;
  margin-bottom: 0.25rem;
}

.wa-box-desc {
  font-size: 0.8rem;
  font-weight: 600;
  line-height: 1.4;
}

.share-label {
  display: block;
  font-size: 0.78rem;
  font-weight: 800;
  margin-bottom: 0.35rem;
}

.summary-textarea {
  font-size: 0.78rem;
  background: var(--gray-light);
}
</style>