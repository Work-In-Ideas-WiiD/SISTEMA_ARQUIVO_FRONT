<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

// Verificar se o usuário é administrador
if (authStore.userRole !== 'administrador') {
  authStore.signOut()
}
</script>

<template>
  <main class="page dashboard_padding">
    <RouterView />
  </main>
</template>

<style lang="scss" scoped>
.page {
  width: 100%;
}
</style>
