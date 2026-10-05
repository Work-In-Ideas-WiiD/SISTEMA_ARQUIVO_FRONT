<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import SidebarItem from './SidebarItem.vue'
import EmpresaIdentidade from '@/components/EmpresaIdentidade/EmpresaIdentidade.vue'
import type { TUserTypes } from '@/types/auth'
import { isFeatureEnabled } from '@/config/features'
import logoAkidocs from '@/assets/imgs/login/logo-akidocs-white.png'

interface IMenuItem {
  title: string
  icon: string
  path: string
  classname?: string
  roles: TUserTypes[]
  featureFlag?: 'assinaturas' | 'envioParaAssinatura'
  /** Item que abre um submenu (o path serve só para marcar a seção ativa). */
  children?: IMenuItem[]
}

const route = useRoute()
const authStore = useAuthStore()

const menuItems: IMenuItem[] = [
  {
    title: 'Administradores',
    icon: 'admin',
    path: '/dashboard/admins',
    roles: ['administrador']
  },
  {
    title: 'Arquivos',
    icon: 'files',
    path: '/dashboard/arquivos',
    roles: ['administrador', 'cliente', 'empresa']
  },
  {
    title: 'Empresas',
    icon: 'building',
    path: '/dashboard/empresas',
    roles: ['administrador']
  },
  {
    title: 'Clientes',
    icon: 'clientes',
    path: '/dashboard/clientes',
    roles: ['administrador']
  },
  {
    title: 'Empresas',
    icon: 'building',
    path: '/dashboard/minhas-empresas',
    roles: ['empresa']
  },
  {
    title: 'Clientes',
    icon: 'clientes',
    path: '/dashboard/clientes',
    roles: ['empresa']
  },
  {
    title: 'Empresas',
    icon: 'building',
    path: '/dashboard/clientes',
    roles: ['cliente']
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
    title: 'Categorias de arquivo',
    icon: 'folder',
    path: '/dashboard/categorias-arquivo',
    roles: ['administrador', 'empresa']
  },
  {
    title: 'Relatórios',
    icon: 'report',
    path: '/dashboard/relatorios',
    roles: ['administrador', 'empresa'],
    children: [
      {
        title: 'Logs de arquivo',
        icon: 'document',
        path: '/dashboard/relatorios/logs-arquivo',
        roles: ['administrador', 'empresa']
      }
    ]
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
  {
    title: 'Assinaturas',
    icon: 'pen',
    path: '/dashboard/assinaturas',
    roles: ['administrador', 'cliente', 'empresa'],
    featureFlag: 'assinaturas' // Clicksign — NÃO misturar com SaaS
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

const gruposAbertos = ref(new Set<string>())

function grupoAberto(item: IMenuItem): boolean {
  return gruposAbertos.value.has(item.path)
}

function alternarGrupo(item: IMenuItem) {
  const next = new Set(gruposAbertos.value)
  if (next.has(item.path)) next.delete(item.path)
  else next.add(item.path)
  gruposAbertos.value = next
}

watch(
  () => route.path,
  (path) => {
    const ativo = menuItems.find((i) => i.children && (path === i.path || path.startsWith(i.path + '/')))
    if (ativo && !gruposAbertos.value.has(ativo.path)) {
      gruposAbertos.value = new Set([...gruposAbertos.value, ativo.path])
    }
  },
  { immediate: true }
)

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
    <img class="logo" :src="logoAkidocs" alt="Logotipo AkiDocs — Todos os seus documentos, Aki!" />
    <EmpresaIdentidade />
    <nav class="sidebar__nav">
      <template v-for="item in menuItems" :key="item.path">
        <template v-if="item.children && shouldShowItem(item)">
          <button
            type="button"
            class="sidebar-group"
            :class="{ 'is-open': grupoAberto(item), 'is-section-active': isActive(item.path) }"
            :aria-expanded="grupoAberto(item)"
            @click="alternarGrupo(item)"
          >
            <span class="sidebar-group__icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
              </svg>
            </span>
            <span class="sidebar-group__title">{{ item.title }}</span>
            <svg class="sidebar-group__chevron" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M7.41 8.59 12 13.17l4.59-4.58L18 10l-6 6-6-6z" />
            </svg>
          </button>
          <template v-if="grupoAberto(item)">
            <template v-for="sub in item.children" :key="sub.path">
              <SidebarItem
                v-if="shouldShowItem(sub)"
                class="sidebar-item--sub"
                :title="sub.title"
                :icon="sub.icon"
                :path="sub.path"
                :is-active="isActive(sub.path)"
              />
            </template>
          </template>
        </template>
        <SidebarItem
          v-else-if="shouldShowItem(item)"
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
  /* item min 50px (barra ativa); gap menor mantém densidade parecida ao Figma */
  --sidebar-nav-gap: 14px;
  width: 364px;
  height: 100vh;
  min-height: 100vh;
  background: linear-gradient(180deg, #0B1B2B 0%, #10243B 100%);
  border-right: 1px solid rgba(176, 141, 87, 0.15);
  box-shadow: 4px 0 24px rgba(0, 0, 0, 0.3);
  border-radius: 0 50px 50px 0;
  position: fixed;
  top: 0;
  left: 0;
  overflow: hidden;
  font-family: 'Inter', sans-serif;
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
    min-height: 0;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: var(--sidebar-nav-gap);
    overflow-x: hidden;
    overflow-y: auto;
    overscroll-behavior-y: contain;
    padding: 0 0 8px;
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.35) transparent;

    &::-webkit-scrollbar {
      width: 4px;
    }

    &::-webkit-scrollbar-track {
      background: transparent;
    }

    &::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.35);
      border-radius: 4px;
    }

    &::-webkit-scrollbar-button {
      display: none;
      width: 0;
      height: 0;
    }
  }

  &__footer {
    flex-shrink: 0;
    width: 100%;
    padding: 16px 0 40px;
  }

  .sidebar-group {
    display: flex;
    align-items: center;
    gap: 22px;
    min-height: 50px;
    width: 100%;
    padding: 0 28px 0 var(--sidebar-nav-pad, 50px);
    box-sizing: border-box;
    flex-shrink: 0;
    border: 0;
    background: transparent;
    color: #ffffff;
    font-family: 'Inter', sans-serif;
    cursor: pointer;
    opacity: 0.6;
    transition: opacity 0.2s ease;

    &:hover,
    &.is-section-active {
      opacity: 0.95;
    }
  }

  .sidebar-group__icon {
    width: 32px;
    min-width: 32px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .sidebar-group__title {
    flex: 1;
    text-align: left;
    font-size: 16px;
    font-weight: 500;
    line-height: 1;
  }

  .sidebar-group__chevron {
    flex-shrink: 0;
    transition: transform 0.15s ease;
  }

  .sidebar-group.is-open .sidebar-group__chevron {
    transform: rotate(180deg);
  }

  .sidebar-item--sub {
    padding-left: calc(var(--sidebar-nav-pad, 50px) + 26px);

    :deep(.title) {
      font-size: 15px;
    }
  }

  /* Full HD (1080p): comprime para caber sem scroll ou com scroll mínimo */
  @media (min-height: 921px) and (max-height: 1080px) {
    .logo {
      margin: 52px auto 24px;
      width: 160px;
      height: 105px;
    }

    --sidebar-nav-gap: 8px;

    &__nav {
      padding-bottom: 4px;
    }

    &__footer {
      padding: 12px 0 36px;
    }

    :deep(.sidebar-item) {
      min-height: 44px;

      .title {
        font-size: 16px;
      }

      &.active::before {
        height: 44px;
      }
    }
  }

  @media (max-width: 1366px) {
    width: 300px;
  }

  @media (max-width: 1200px) {
    --sidebar-nav-pad: 36px;
    --sidebar-nav-gap: 12px;
    width: 260px;

    .logo {
      margin: 48px auto 28px;
      width: 150px;
      height: auto;
    }
  }

  /* Telas baixas: comprime logo/espaços pra caber sem scroll */
  @media (max-height: 920px) {
    .logo {
      margin: 40px auto 20px;
      width: 150px;
      height: 100px;
    }

    --sidebar-nav-gap: 10px;

    &__footer {
      padding: 16px 0 32px;
    }

    :deep(.sidebar-item) {
      min-height: 44px;

      &.active::before {
        height: 44px;
      }
    }
  }

  @media (max-height: 800px) {
    .logo {
      margin: 24px auto 12px;
      width: 120px;
      height: 80px;
    }

    --sidebar-nav-gap: 6px;

    &__footer {
      padding: 12px 0 20px;
    }

    :deep(.sidebar-item) {
      min-height: 40px;

      .title {
        font-size: 15px;
      }

      &.active::before {
        height: 40px;
      }
    }
  }

  @media (max-width: 900px) {
    display: none;
  }
}
</style>
