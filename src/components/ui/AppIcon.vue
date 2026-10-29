<template>
  <span class="app-icon" :style="{ fontSize: size }">
    <!-- 1. Jika nama ikon terdaftar sebagai gambar/SVG eksternal di bawah -->
    <img
      v-if="customImageIcons[name]"
      :src="customImageIcons[name]"
      :alt="name"
      class="icon-img"
      :style="{ width: size, height: size }"
    />

    <!-- 2. Jika menggunakan Emoji / Simbol bawaan -->
    <span v-else class="icon-emoji" role="img" :aria-label="name">
      {{ emojiMap[name] || '📌' }}
    </span>
  </span>
</template>

<script setup>
defineProps({
  name: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    default: '1.25rem',
  },
})

/**
 * PANDUAN GANTI IKON SVG / LOGO SEKOLAH NANTI:
 * Cukup taruh file SVG/PNG Anda di folder public/icons/ atau src/assets/icons/
 * lalu daftarkan di sini, contoh:
 * 'logo-sekolah': '/icons/logo-budi-utomo.png',
 * 'nav-home': '/icons/home.svg',
 */
const customImageIcons = {
  // 'logo-sekolah': '/icons/logo-sekolah.png',
}

const emojiMap = {
  // Ikon Navigasi Utama
  'logo-sekolah': '🏫',
  'nav-home': '🏠',
  'nav-absen': '📋',
  'nav-rekap': '📊',
  'nav-wa': '💬',
  'nav-master': '⚙️',

  // Ikon Fitur & Status
  'book': '📚',
  'pencil': '✏️',
  'grad': '🎓',
  'class': '🏷️',
  'teacher': '👨‍🏫',
  'student': '👥',
  'clock': '⏰',
  'calendar': '📅',
  'qr': '📷',
  'check': '✅',
  'warning': '⚠️',
  'error': '❌',
  'refresh': '🔄',
  'send': '📤',
  'copy': '📋',
  'save': '💾',
  'back': '←',
  'pin': '📌',
}
</script>

<style scoped>
.app-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  flex-shrink: 0;
}

.icon-img {
  object-fit: contain;
  display: block;
}
</style>