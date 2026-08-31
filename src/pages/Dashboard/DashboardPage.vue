<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterView, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Sidebar from '@/components/sidebar/Sidebar.vue'
import MobileHeader from '@/components/mobileHeader/MobileHeader.vue'

const authStore = useAuthStore()
const router = useRouter()

const isReady = ref(false)

onMounted(async () => {
  // Tenta restaurar a sessão do usuário
  const isAuthenticated = await authStore.checkAuth()
  
  if (!isAuthenticated) {
    router.push('/')
    return
  }
  
  isReady.value = true
})
</script>

<template>
  <main v-if="isReady" class="main dashboard-night">
    <div class="aside_container">
      <Sidebar />
    </div>
    <div class="outlat_container">
      <MobileHeader />
      <RouterView />
    </div>
  </main>
  <div v-else class="loading">
    <span>Carregando...</span>
  </div>
</template>

<style lang="scss" scoped>
.loading {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-blue-700);
  color: white;
  font-size: 1.2rem;
}

.main {
  height: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: row;
  background-color: #252525;

  .aside_container {
    flex-shrink: 0;
    width: 364px;
    min-height: 100vh;
  }

  .outlat_container {
    flex: 1;
    min-width: 0;
    min-height: 100vh;
    width: auto;
    background-color: #252525;
    overflow-x: hidden;
  }

  @media (max-width: 1366px) {
    .aside_container {
      width: 300px;
    }
  }

  @media (max-width: 1200px) {
    .aside_container {
      width: 260px;
    }
  }

  @media (max-width: 900px) {
    .outlat_container {
      min-height: 100vh;
      width: 100%;
    }

    .aside_container {
      display: none;
    }
  }
}
</style>
