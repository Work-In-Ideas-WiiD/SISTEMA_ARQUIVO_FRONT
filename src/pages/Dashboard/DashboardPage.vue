<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { RouterView, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Sidebar from '@/components/sidebar/Sidebar.vue'
import MobileHeader from '@/components/mobileHeader/MobileHeader.vue'
import MobileBottomNav from '@/components/mobileBottomNav/MobileBottomNav.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const authStore = useAuthStore()
const router = useRouter()

const isReady = ref(false)

/** Hamburger só pra admin/empresa (módulos extras). Bottom nav aparece pra todos. */
const showMobileHeader = computed(() => {
  const role = authStore.userRole
  return role === 'administrador' || role === 'empresa'
})

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
  <main v-if="isReady" class="main dashboard-night main--with-bottom-nav">
    <div class="aside_container">
      <Sidebar />
    </div>
    <div class="outlat_container">
      <MobileHeader v-if="showMobileHeader" />
      <RouterView />
    </div>
    <MobileBottomNav />
  </main>
  <div v-else class="dashboard-loading dashboard-night">
    <LoadingSpinner theme="night" size="lg" />
    <span class="dashboard-loading__text">Carregando...</span>
  </div>
</template>

<style lang="scss" scoped>
.dashboard-loading {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  background-color: var(--night-bg, #0B1B2B);

  &__text {
    font-family: var(--night-font, 'Inter', sans-serif);
    font-size: 14px;
    font-weight: 500;
    line-height: 1;
    letter-spacing: 0.05em;
    color: var(--night-gray, #FFFCFF);
    opacity: 0.85;
    text-transform: uppercase;
  }
}

.main {
  height: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: row;
  background-color: #0B1B2B;

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
    background-color: #0B1B2B;
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
    background-color: #0B1B2B;

    .outlat_container {
      min-height: 100vh;
      width: 100%;
      background-color: #0B1B2B;
      /* Espaço pro menu flutuante 74px + margem */
      padding-bottom: 106px;
      box-sizing: border-box;
    }

    .aside_container {
      display: none;
    }
  }
}
</style>
