<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { isFeatureEnabled } from '@/config/features'

const authStore = useAuthStore()
const isOpen = ref(false)

function toggleMenu() {
  isOpen.value = !isOpen.value
}

function handleLogout() {
  authStore.signOut()
  isOpen.value = false
}

const showAssinaturas = isFeatureEnabled('assinaturas')
</script>

<template>
  <header class="mobile-header">
    <button class="menu-button" @click="toggleMenu">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
      </svg>
    </button>
    
    <div v-if="isOpen" class="mobile-menu">
      <nav>
        <RouterLink to="/dashboard/home" @click="isOpen = false">Home</RouterLink>
        <RouterLink to="/dashboard/empresas" @click="isOpen = false">Empresas</RouterLink>
        <RouterLink to="/dashboard/contratos" @click="isOpen = false">Contratos</RouterLink>
        <RouterLink to="/dashboard/arquivos" @click="isOpen = false">Arquivos</RouterLink>
        <RouterLink v-if="showAssinaturas" to="/dashboard/assinaturas" @click="isOpen = false">Assinaturas</RouterLink>
        <RouterLink to="/dashboard/clientes" @click="isOpen = false">Clientes</RouterLink>
        <RouterLink to="/dashboard/perfil" @click="isOpen = false">Perfil</RouterLink>
        <button @click="handleLogout">Sair</button>
      </nav>
    </div>
  </header>
</template>

<style lang="scss" scoped>
.mobile-header {
  display: none;
  padding: 15px;
  background-color: var(--color-blue-700);

  @media (max-width: 900px) {
    display: block;
  }

  .menu-button {
    background: none;
    border: none;
    color: white;
    cursor: pointer;
  }

  .mobile-menu {
    position: fixed;
    top: 54px;
    left: 0;
    right: 0;
    background-color: var(--color-blue-700);
    padding: 20px;
    z-index: 100;

    nav {
      display: flex;
      flex-direction: column;
      gap: 15px;

      a, button {
        color: white;
        text-decoration: none;
        font-size: 1rem;
        padding: 10px;
        background: none;
        border: none;
        text-align: left;
        cursor: pointer;

        &:hover {
          background-color: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }
      }
    }
  }
}
</style>
