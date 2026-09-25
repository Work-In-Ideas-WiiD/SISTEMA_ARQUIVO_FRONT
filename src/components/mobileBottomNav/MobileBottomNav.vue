<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import iconFiles from '@/assets/imgs/dashboard/icon-menu-files.svg'
import iconProfile from '@/assets/imgs/dashboard/icon-menu-profile.svg'

const route = useRoute()
const isMobile = ref(
  typeof window !== 'undefined' && window.matchMedia('(max-width: 900px)').matches
)

let mql: MediaQueryList | null = null

function updateMobile() {
  isMobile.value = window.matchMedia('(max-width: 900px)').matches
}

onMounted(() => {
  mql = window.matchMedia('(max-width: 900px)')
  updateMobile()
  mql.addEventListener('change', updateMobile)
})

onUnmounted(() => {
  mql?.removeEventListener('change', updateMobile)
})

const items = [
  {
    key: 'arquivos',
    label: 'Arquivos',
    to: '/dashboard/arquivos',
    icon: iconFiles,
    width: 15,
    height: 19,
    match: (path: string) =>
      path === '/dashboard' ||
      path === '/dashboard/' ||
      path.startsWith('/dashboard/arquivos') ||
      path.startsWith('/dashboard/arquivos'),
  },
  {
    key: 'perfil',
    label: 'Perfil',
    to: '/dashboard/perfil',
    icon: iconProfile,
    width: 18,
    height: 18,
    match: (path: string) => path.startsWith('/dashboard/perfil'),
  },
] as const

const activeKey = computed(() => {
  const path = route.path
  return items.find((item) => item.match(path))?.key ?? null
})
</script>

<template>
  <Teleport to="body">
    <nav
      v-if="isMobile"
      class="mobile-bottom-nav"
      aria-label="Menu principal"
    >
      <div class="mobile-bottom-nav__bar">
        <RouterLink
          v-for="item in items"
          :key="item.key"
          :to="item.to"
          class="mobile-bottom-nav__item"
          :class="{ 'mobile-bottom-nav__item--active': activeKey === item.key }"
        >
          <span class="mobile-bottom-nav__indicator" aria-hidden="true" />
          <img
            class="mobile-bottom-nav__icon"
            :src="item.icon"
            :width="item.width"
            :height="item.height"
            alt=""
          />
          <span class="mobile-bottom-nav__label">{{ item.label }}</span>
        </RouterLink>
      </div>
    </nav>
  </Teleport>
</template>

<style lang="scss">
/* Sem scoped: Teleport no body precisa dos estilos globais do componente */
.mobile-bottom-nav {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 16px;
  z-index: 9999;
  display: flex;
  justify-content: center;
  padding: 0 16px;
  padding-bottom: env(safe-area-inset-bottom, 0);
  pointer-events: none;
  box-sizing: border-box;
}

.mobile-bottom-nav__bar {
  pointer-events: auto;
  width: 240px;
  height: 74px;
  border-radius: 20px;
  background: #132438;
  border: 1px solid rgba(176, 141, 87, 0.25);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  padding: 0 10px;
  box-sizing: border-box;
}

.mobile-bottom-nav__item {
  position: relative;
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  text-decoration: none;
  color: #ffffff;
  opacity: 0.6;
  padding-top: 8px;
  box-sizing: border-box;
}

.mobile-bottom-nav__item--active {
  opacity: 1;
}

.mobile-bottom-nav__item--active .mobile-bottom-nav__indicator {
  opacity: 1;
}

/* Indicador ativo Ouro AkiDocs */
.mobile-bottom-nav__indicator {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 31px;
  height: 6px;
  border-radius: 11px;
  background: #B08D57;
  box-shadow: 0 0 10px rgba(176, 141, 87, 0.5);
  opacity: 0;
}

.mobile-bottom-nav__icon {
  display: block;
  flex-shrink: 0;
  object-fit: contain;
}

.mobile-bottom-nav__label {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 600;
  line-height: 1;
  letter-spacing: 0;
  color: #ffffff;
  white-space: nowrap;
}
</style>
