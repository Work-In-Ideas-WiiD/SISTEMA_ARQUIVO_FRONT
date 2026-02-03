<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import SidebarItem from './SidebarItem.vue'
import type { TUserTypes } from '@/types/auth'
import { isFeatureEnabled } from '@/config/features'

interface IMenuItem {
  title: string
  icon: string
  path: string
  classname?: string
  roles: TUserTypes[]
  featureFlag?: 'assinaturas' | 'envioParaAssinatura'
}

const route = useRoute()
const authStore = useAuthStore()

const menuItems: IMenuItem[] = [
  {
    title: 'Home',
    icon: 'home',
    path: '/dashboard/home',
    roles: ['administrador', 'cliente', 'empresa']
  },
  {
    title: 'Administradores',
    icon: 'admin',
    path: '/dashboard/admins',
    roles: ['administrador']
  },
  {
    title: 'Empresas',
    icon: 'building',
    path: '/dashboard/empresas',
    roles: ['administrador']
  },
  {
    title: 'Contratos',
    icon: 'document',
    path: '/dashboard/contratos',
    roles: ['administrador', 'cliente', 'empresa']
  },
  {
    title: 'Arquivos',
    icon: 'files',
    path: '/dashboard/arquivos',
    roles: ['administrador', 'cliente', 'empresa']
  },
  {
    title: 'Assinaturas',
    icon: 'pen',
    path: '/dashboard/assinaturas',
    roles: ['administrador', 'cliente', 'empresa'],
    featureFlag: 'assinaturas' // Controlado por feature flag
  },
  {
    title: 'Clientes',
    icon: 'person',
    path: '/dashboard/clientes',
    roles: ['administrador', 'cliente', 'empresa']
  },
  {
    title: 'Perfil',
    icon: 'profile',
    path: '/dashboard/perfil',
    roles: ['administrador', 'empresa']
  },
  {
    title: 'Sair',
    icon: 'logout',
    path: '/logout',
    classname: 'last_item',
    roles: ['administrador', 'cliente', 'empresa']
  }
]

function isActive(path: string): boolean {
  return route.path.includes(path)
}

function handleClick(item: IMenuItem) {
  if (item.path === '/logout') {
    authStore.signOut()
  }
}

function shouldShowItem(item: IMenuItem): boolean {
  if (!authStore.userRole) return false
  
  // Verifica se o item está controlado por feature flag
  if (item.featureFlag && !isFeatureEnabled(item.featureFlag)) {
    return false
  }
  
  return item.roles.includes(authStore.userRole)
}
</script>

<template>
  <aside class="sidebar">
    <img class="logo" src="@/assets/imgs/logo_ana.png" alt="logo" />
    <nav>
      <template v-for="item in menuItems" :key="item.path">
        <SidebarItem
          v-if="shouldShowItem(item)"
          :title="item.title"
          :icon="item.icon"
          :path="item.path"
          :is-active="isActive(item.path)"
          :class="item.classname"
          @click="handleClick(item)"
        />
      </template>
    </nav>
  </aside>
</template>

<style lang="scss" scoped>
.sidebar {
  width: 364px;
  height: 100%;
  background-color: var(--color-blue-700);
  position: fixed;
  overflow-y: auto;
  overflow-x: hidden;

  .logo {
    display: block;
    margin: 15px auto;
  }

  nav {
    min-height: 500px;
    width: 100%;
    padding-left: 34px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  @media (max-width: 900px) {
    display: none;
  }
}
</style>
