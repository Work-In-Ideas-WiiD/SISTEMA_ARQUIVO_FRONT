<script setup lang="ts">
import { RouterLink } from 'vue-router'
import iconHome from '@/assets/imgs/dashboard/icon-menu-home.svg'
import iconFiles from '@/assets/imgs/dashboard/icon-menu-files.svg'
import iconProfile from '@/assets/imgs/dashboard/icon-menu-profile.svg'
import iconLogout from '@/assets/imgs/dashboard/icon-menu-logout.svg'
import iconClientes from '@/assets/imgs/dashboard/icon-menu-clientes.svg'
import iconSetores from '@/assets/imgs/dashboard/icon-menu-setores.svg'
import iconFuncoes from '@/assets/imgs/dashboard/icon-menu-funcoes.svg'
import iconFuncionarios from '@/assets/imgs/dashboard/icon-menu-funcionarios.svg'
import iconAgrupamentos from '@/assets/imgs/dashboard/icon-menu-agrupamentos.svg'
import iconEmpresas from '@/assets/imgs/dashboard/icon-menu-empresas.svg'
import iconAdmins from '@/assets/imgs/dashboard/icon-menu-admins.svg'
import iconPlanos from '@/assets/imgs/dashboard/icon-menu-planos.svg'
import iconAssinaturas from '@/assets/imgs/dashboard/icon-menu-assinaturas.svg'

defineProps<{
  title: string
  icon: string
  path: string
  isActive?: boolean
}>()

const emit = defineEmits<{
  (e: 'click'): void
}>()

function handleClick() {
  emit('click')
}

const figmaIcons: Record<string, { src: string; w: number; h: number }> = {
  home: { src: iconHome, w: 24.75, h: 22.45 },
  files: { src: iconFiles, w: 15, h: 19 },
  profile: { src: iconProfile, w: 20, h: 20 },
  logout: { src: iconLogout, w: 28.86, h: 25.25 },
  clientes: { src: iconClientes, w: 20, h: 20 },
  setores: { src: iconSetores, w: 23, h: 22 },
  funcoes: { src: iconFuncoes, w: 16, h: 22 },
  funcionarios: { src: iconFuncionarios, w: 28, h: 19 },
  agrupamentos: { src: iconAgrupamentos, w: 22, h: 20 },
  building: { src: iconEmpresas, w: 20, h: 23 },
  admin: { src: iconAdmins, w: 29, h: 23 },
  plans: { src: iconPlanos, w: 22, h: 22 },
  subscription: { src: iconAssinaturas, w: 22, h: 22 }
}
</script>

<template>
  <RouterLink
    v-if="path !== '/logout'"
    :to="path"
    :class="['sidebar-item', { active: isActive }]"
  >
    <div class="icon-wrapper">
      <img
        v-if="figmaIcons[icon]"
        :src="figmaIcons[icon].src"
        :width="figmaIcons[icon].w"
        :height="figmaIcons[icon].h"
        alt=""
      />
      <svg v-else-if="icon === 'admin'" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-5 3c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm4 8h-8v-1c0-1.33 2.67-2 4-2s4 .67 4 2v1z"/>
      </svg>
      <svg v-else-if="icon === 'building'" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"/>
      </svg>
      <svg v-else-if="icon === 'document'" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
      </svg>
      <svg v-else-if="icon === 'pen'" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
      </svg>
      <svg v-else-if="icon === 'person'" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
      </svg>
      <svg v-else-if="icon === 'folder'" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/>
      </svg>
    </div>
    <span class="title">{{ title }}</span>
  </RouterLink>
  <div
    v-else
    class="sidebar-item sidebar-item--logout"
    @click="handleClick"
  >
    <div class="icon-wrapper">
      <img
        :src="figmaIcons.logout.src"
        :width="figmaIcons.logout.w"
        :height="figmaIcons.logout.h"
        alt=""
      />
    </div>
    <span class="title">{{ title }}</span>
  </div>
</template>

<style lang="scss" scoped>
.sidebar-item {
  display: flex;
  align-items: center;
  gap: 22px;
  min-height: 50px;
  width: 100%;
  padding: 0 0 0 var(--sidebar-nav-pad, 50px);
  box-sizing: border-box;
  cursor: pointer;
  transition: opacity 0.2s ease;
  text-decoration: none;
  position: relative;
  opacity: 0.6;
  color: #ffffff;
  flex-shrink: 0;

  .icon-wrapper {
    width: 32px;
    min-width: 32px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ffffff;
    flex-shrink: 0;

    img,
    svg {
      display: block;
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
      flex-shrink: 0;
    }
  }

  .title {
    color: #ffffff;
    font-size: 18px;
    font-weight: 500;
    line-height: 1;
    letter-spacing: 0;
    font-family: 'Source Code Pro', monospace;
    text-transform: none;
  }

  &.active {
    opacity: 1;

    .title {
      font-weight: 700;
    }

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 11px;
      height: 50px;
      background-color: #ff00ff;
      border-radius: 0 11px 11px 0;
    }
  }

  &--logout {
    opacity: 1;

    .icon-wrapper {
      width: 32px;
      height: 28px;
    }

    .title {
      font-size: 17px;
      font-weight: 400;
    }
  }

  &:hover:not(.active):not(.sidebar-item--logout) {
    opacity: 0.85;
  }
}
</style>
