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
  <main v-if="isReady" class="main">
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

  .aside_container {
    min-height: 100vh;
    width: 364px;
  }

  .outlat_container {
    min-height: 100vh;
    width: calc(100% - 364px);
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
