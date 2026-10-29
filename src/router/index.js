import { createRouter, createWebHistory } from 'vue-router'
import BerandaView from '@/views/BerandaView.vue'

const routes = [
  {
    path: '/',
    name: 'beranda',
    component: BerandaView,
  },
  {
    path: '/pilih',
    name: 'pilih-jadwal',
    component: () => import('@/views/PilihJadwalView.vue'),
  },
  {
    path: '/absen',
    name: 'form-absensi',
    component: () => import('@/views/FormAbsensiView.vue'),
  },
  {
    path: '/rekap',
    name: 'rekap',
    component: () => import('@/views/RekapView.vue'),
  },
  {
    path: '/notifikasi-wa',
    name: 'notifikasi-wa',
    component: () => import('@/views/NotifikasiWaView.vue'),
  },
  {
    path: '/master',
    name: 'master-data',
    component: () => import('@/views/MasterDataView.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router