<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import SidebarItem from './SidebarItem.vue'
import type { TUserTypes } from '@/types/auth'
import { isFeatureEnabled } from '@/config/features'
import logoWiidocs from '@/assets/imgs/login/logo-wiidocs-white.png'

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
    title: 'Planos',
    icon: 'plans',
    path: '/dashboard/planos',
    roles: ['administrador']
  },
  {
    title: 'Assinaturas SaaS',
    icon: 'subscription',
    path: '/dashboard/assinaturas-saas',
    roles: ['administrador']
  },
  // {
  //   title: 'Contratos',
  //   icon: 'document',
  //   path: '/dashboard/contratos',
  //   roles: ['administrador', 'cliente', 'empresa']
  // },
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
    featureFlag: 'assinaturas' // Clicksign — NÃO misturar com SaaS
  },
  {
    title: 'Clientes',
    icon: 'clientes',
    path: '/dashboard/clientes',
    roles: ['administrador', 'cliente', 'empresa']
  },
  {
    title: 'Setores',
    icon: 'setores',
    path: '/dashboard/setores',
    roles: ['administrador', 'empresa']
  },
  {
    title: 'Funções',
    icon: 'funcoes',
    path: '/dashboard/funcoes',
    roles: ['administrador', 'empresa']
  },
  {
    title: 'Funcionários',
    icon: 'funcionarios',
    path: '/dashboard/funcionarios',
    roles: ['administrador', 'empresa']
  },
  {
    title: 'Agrupamentos',
    icon: 'agrupamentos',
    path: '/dashboard/agrupamentos',
    roles: ['administrador', 'empresa']
  },
  {
    title: 'Perfil',
    icon: 'profile',
    path: '/dashboard/perfil',
    roles: ['administrador', 'empresa', 'cliente']
  }
]

const logoutItem: IMenuItem = {
  title: 'Sair',
  icon: 'logout',
  path: '/logout',
  roles: ['administrador', 'cliente', 'empresa']
}

function isActive(path: string): boolean {
  return route.path === path || route.path.startsWith(path + '/')
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
    <img class="logo" :src="logoWiidocs" alt="WiiDocs" />
    <nav class="sidebar__nav">
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
    <div v-if="shouldShowItem(logoutItem)" class="sidebar__footer">
      <SidebarItem
        :title="logoutItem.title"
        :icon="logoutItem.icon"
        :path="logoutItem.path"
        @click="handleClick(logoutItem)"
      />
    </div>
  </aside>
</template>

<style lang="scss" scoped>
.sidebar {
  --sidebar-nav-pad: 50px;
  width: 364px;
  height: 100vh;
  min-height: 100vh;
  background: linear-gradient(110deg, #212121 27%, #ff00ff 94%);
  border-radius: 0 50px 50px 0;
  position: fixed;
  top: 0;
  left: 0;
  overflow: hidden;
  font-family: 'Source Code Pro', monospace;
  display: flex;
  flex-direction: column;
  z-index: 10;

  .logo {
    display: block;
    margin: 75px auto 40px;
    width: 191px;
    height: 126px;
    object-fit: contain;
    flex-shrink: 0;
  }

  &__nav {
    flex: 1;
    width: 100%;
    padding-left: var(--sidebar-nav-pad);
    display: flex;
    flex-direction: column;
    gap: 28px;
    overflow-y: auto;
    padding-top: 8px;
  }

  &__footer {
    flex-shrink: 0;
    width: 100%;
    padding: 24px 0 56px var(--sidebar-nav-pad);
  }

  @media (max-width: 1366px) {
    width: 300px;
  }

  @media (max-width: 1200px) {
    --sidebar-nav-pad: 36px;
    width: 260px;

    .logo {
      margin: 48px auto 28px;
      width: 150px;
      height: auto;
    }

    &__nav {
      gap: 22px;
    }
  }

  @media (max-width: 900px) {
    display: none;
  }
}
</style>
