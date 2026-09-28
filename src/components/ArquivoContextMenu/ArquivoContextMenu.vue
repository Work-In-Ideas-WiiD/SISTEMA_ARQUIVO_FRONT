<script setup lang="ts">
import { nextTick, onUnmounted, ref, watch } from 'vue'
import type { ContextMenuItem } from './types'

const props = defineProps<{
  open: boolean
  x: number
  y: number
  items: ContextMenuItem[]
  title?: string
}>()

const emit = defineEmits<{
  (e: 'select', key: string): void
  (e: 'close'): void
}>()

const menuRef = ref<HTMLElement | null>(null)
const pos = ref({ left: 0, top: 0 })
const MARGEM = 8

async function posicionar() {
  pos.value = { left: props.x, top: props.y }
  await nextTick()
  const el = menuRef.value
  if (!el) return
  const { width, height } = el.getBoundingClientRect()
  pos.value = {
    left: Math.max(MARGEM, Math.min(props.x, window.innerWidth - width - MARGEM)),
    top: Math.max(MARGEM, Math.min(props.y, window.innerHeight - height - MARGEM))
  }
  el.querySelector<HTMLButtonElement>('button')?.focus()
}

function onPointerDown(event: PointerEvent) {
  if (menuRef.value && !menuRef.value.contains(event.target as Node)) emit('close')
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    event.stopPropagation()
    emit('close')
    return
  }
  if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return
  event.preventDefault()
  const botoes = Array.from(menuRef.value?.querySelectorAll<HTMLButtonElement>('button') || [])
  const atual = botoes.indexOf(document.activeElement as HTMLButtonElement)
  const proximo = (atual + (event.key === 'ArrowDown' ? 1 : -1) + botoes.length) % botoes.length
  botoes[proximo]?.focus()
}

function fechar() {
  emit('close')
}

function bind(on: boolean) {
  const metodo = on ? 'addEventListener' : 'removeEventListener'
  document[metodo]('pointerdown', onPointerDown as EventListener, true)
  window[metodo]('resize', fechar)
  window[metodo]('blur', fechar)
  document[metodo]('scroll', fechar, true)
}

watch(
  () => [props.open, props.x, props.y] as const,
  ([open]) => {
    bind(false)
    if (!open) return
    void posicionar()
    bind(true)
  }
)

onUnmounted(() => bind(false))

function escolher(key: string) {
  emit('select', key)
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      ref="menuRef"
      class="ctx-menu"
      role="menu"
      :style="{ left: `${pos.left}px`, top: `${pos.top}px` }"
      @keydown="onKeydown"
      @contextmenu.prevent
    >
      <p v-if="title" class="ctx-menu__title">{{ title }}</p>
      <button
        v-for="item in items"
        :key="item.key"
        type="button"
        class="ctx-menu__item"
        role="menuitem"
        @click="escolher(item.key)"
      >
        <img :src="item.icon" width="18" height="18" alt="" />
        <span>{{ item.label }}</span>
      </button>
    </div>
  </Teleport>
</template>

<style lang="scss" scoped>
.ctx-menu {
  position: fixed;
  z-index: 1300;
  min-width: 210px;
  padding: 6px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  background: #0b1b2b;
  border: 1px solid rgba(176, 141, 87, 0.45);
  border-radius: 12px;
  box-shadow: 0 14px 32px rgba(0, 0, 0, 0.6);
  font-family: var(--night-font, 'Inter', sans-serif);
}

.ctx-menu__title {
  margin: 4px 10px 6px;
  color: #b08d57;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.ctx-menu__item {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 10px 12px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: #fffcff;
  font: inherit;
  font-size: 14px;
  text-align: left;
  cursor: pointer;

  img {
    flex-shrink: 0;
    opacity: 0.85;
  }

  &:hover,
  &:focus-visible {
    background: rgba(176, 141, 87, 0.28);
    outline: none;
  }
}
</style>
