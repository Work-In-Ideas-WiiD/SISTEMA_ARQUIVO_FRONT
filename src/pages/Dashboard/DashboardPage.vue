<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Sidebar from '@/components/sidebar/Sidebar.vue'
import MobileHeader from '@/components/mobileHeader/MobileHeader.vue'

const authStore = useAuthStore()
const router = useRouter()

onMounted(() => {
  if (authStore.me.id === '') {
    router.push('/')
  }
})
</script>

<template>
  <main class="main">
    <div class="aside_container">
      <Sidebar />
    </div>
    <div class="outlat_container">
      <MobileHeader />
      <RouterView />
    </div>
  </main>
</template>

<style lang="scss" scoped>
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
