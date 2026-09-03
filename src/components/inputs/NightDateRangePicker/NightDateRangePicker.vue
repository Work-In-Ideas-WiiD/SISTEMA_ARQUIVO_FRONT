<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import iconChevronDown from '@/assets/imgs/administradores/icon-chevron-down.svg'

const props = withDefaults(
  defineProps<{
    modelValue: { from: string; to: string }
    label?: string
    placeholder?: string
  }>(),
  {
    label: '',
    placeholder: 'dd/mm/aaaa — dd/mm/aaaa'
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: { from: string; to: string }): void
  (e: 'change', value: { from: string; to: string }): void
}>()

const open = ref(false)
const rootRef = ref<HTMLElement | null>(null)
const triggerRef = ref<HTMLButtonElement | null>(null)
const panelRef = ref<HTMLElement | null>(null)
const panelStyle = ref<Record<string, string>>({})
const viewYear = ref(new Date().getFullYear())
const viewMonth = ref(new Date().getMonth())
const picking = ref<'from' | 'to'>('from')
const draftFrom = ref(props.modelValue.from)
const draftTo = ref(props.modelValue.to)

const monthNames = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro'
]

const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']

watch(
  () => props.modelValue,
  (value) => {
    draftFrom.value = value.from
    draftTo.value = value.to
  },
  { deep: true }
)

const displayLabel = computed(() => {
  if (!props.modelValue.from && !props.modelValue.to) return props.placeholder
  const from = props.modelValue.from ? formatDisplay(props.modelValue.from) : '…'
  const to = props.modelValue.to ? formatDisplay(props.modelValue.to) : '…'
  return `${from} — ${to}`
})

const hasValue = computed(() => Boolean(props.modelValue.from || props.modelValue.to))

const calendarDays = computed(() => {
  const first = new Date(viewYear.value, viewMonth.value, 1)
  const startWeekday = first.getDay()
  const daysInMonth = new Date(viewYear.value, viewMonth.value + 1, 0).getDate()
  const prevDays = new Date(viewYear.value, viewMonth.value, 0).getDate()

  const cells: Array<{
    key: string
    date: string
    day: number
    outside: boolean
  }> = []

  for (let i = startWeekday - 1; i >= 0; i--) {
    const day = prevDays - i
    const date = toIso(viewYear.value, viewMonth.value - 1, day)
    cells.push({ key: `p-${date}`, date, day, outside: true })
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const date = toIso(viewYear.value, viewMonth.value, day)
    cells.push({ key: date, date, day, outside: false })
  }

  const remaining = 42 - cells.length
  for (let day = 1; day <= remaining; day++) {
    const date = toIso(viewYear.value, viewMonth.value + 1, day)
    cells.push({ key: `n-${date}`, date, day, outside: true })
  }

  return cells
})

function toIso(year: number, month: number, day: number) {
  const d = new Date(year, month, day)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${dd}`
}

function todayIso() {
  const now = new Date()
  return toIso(now.getFullYear(), now.getMonth(), now.getDate())
}

function formatDisplay(iso: string) {
  const [y, m, d] = iso.split('-')
  if (!y || !m || !d) return iso
  return `${d}/${m}/${y}`
}

function updatePanelPosition() {
  if (!triggerRef.value) return

  const rect = triggerRef.value.getBoundingClientRect()
  const panelWidth = 280
  const panelHeight = panelRef.value?.offsetHeight || 340
  const gap = 8
  const spaceBelow = window.innerHeight - rect.bottom
  const openUp = spaceBelow < panelHeight + gap && rect.top > spaceBelow

  let left = rect.left
  if (left + panelWidth > window.innerWidth - 12) {
    left = Math.max(12, window.innerWidth - panelWidth - 12)
  }

  panelStyle.value = {
    position: 'fixed',
    left: `${left}px`,
    top: openUp ? `${Math.max(12, rect.top - panelHeight - gap)}px` : `${rect.bottom + gap}px`,
    width: `${panelWidth}px`,
    zIndex: '10000'
  }
}

function onDocumentClick(event: MouseEvent) {
  const target = event.target as Node
  const insideRoot = rootRef.value?.contains(target)
  const insidePanel = panelRef.value?.contains(target)
  if (!insideRoot && !insidePanel) {
    open.value = false
  }
}

function onWindowChange() {
  if (open.value) updatePanelPosition()
}

onMounted(() => {
  document.addEventListener('click', onDocumentClick)
  window.addEventListener('resize', onWindowChange)
  window.addEventListener('scroll', onWindowChange, true)
})

onUnmounted(() => {
  document.removeEventListener('click', onDocumentClick)
  window.removeEventListener('resize', onWindowChange)
  window.removeEventListener('scroll', onWindowChange, true)
})

async function toggle() {
  open.value = !open.value
  if (!open.value) return

  draftFrom.value = props.modelValue.from
  draftTo.value = props.modelValue.to
  picking.value = props.modelValue.from && !props.modelValue.to ? 'to' : 'from'
  const base = props.modelValue.from || props.modelValue.to || todayIso()
  const d = new Date(`${base}T00:00:00`)
  viewYear.value = d.getFullYear()
  viewMonth.value = d.getMonth()

  await nextTick()
  updatePanelPosition()
}

function prevMonth() {
  if (viewMonth.value === 0) {
    viewMonth.value = 11
    viewYear.value -= 1
  } else {
    viewMonth.value -= 1
  }
}

function nextMonth() {
  if (viewMonth.value === 11) {
    viewMonth.value = 0
    viewYear.value += 1
  } else {
    viewMonth.value += 1
  }
}

function isSame(a?: string, b?: string) {
  return Boolean(a && b && a === b)
}

function isBetween(date: string) {
  if (!draftFrom.value || !draftTo.value) return false
  return date > draftFrom.value && date < draftTo.value
}

function dayClass(date: string) {
  return {
    'is-start': isSame(date, draftFrom.value),
    'is-end': isSame(date, draftTo.value),
    'is-in-range': isBetween(date),
    'is-single': isSame(date, draftFrom.value) && isSame(date, draftTo.value),
    'is-today': date === todayIso()
  }
}

function commit(next: { from: string; to: string }) {
  emit('update:modelValue', next)
  emit('change', next)
  open.value = false
}

function selectDay(date: string) {
  if (picking.value === 'from' || !draftFrom.value || (draftFrom.value && draftTo.value)) {
    draftFrom.value = date
    draftTo.value = ''
    picking.value = 'to'
    return
  }

  if (date < draftFrom.value) {
    draftTo.value = draftFrom.value
    draftFrom.value = date
  } else {
    draftTo.value = date
  }

  picking.value = 'from'
  commit({ from: draftFrom.value, to: draftTo.value })
}

function selectToday() {
  const today = todayIso()
  draftFrom.value = today
  draftTo.value = today
  picking.value = 'from'
  const d = new Date()
  viewYear.value = d.getFullYear()
  viewMonth.value = d.getMonth()
  commit({ from: today, to: today })
}

function clearRange() {
  draftFrom.value = ''
  draftTo.value = ''
  picking.value = 'from'
  commit({ from: '', to: '' })
}
</script>

<template>
  <div ref="rootRef" class="night-range">
    <span v-if="label" class="night-range__label">{{ label }}</span>
    <button
      ref="triggerRef"
      type="button"
      class="night-range__trigger"
      :class="{ 'is-placeholder': !hasValue, 'is-open': open }"
      @click.stop="toggle"
    >
      <span>{{ displayLabel }}</span>
      <img
        class="night-range__chevron"
        :class="{ 'night-range__chevron--open': open }"
        :src="iconChevronDown"
        width="16"
        height="9"
        alt=""
      />
    </button>

    <Teleport to="body">
      <div
        v-if="open"
        ref="panelRef"
        class="night-range-panel"
        :style="panelStyle"
        @click.stop
      >
        <div class="night-range-panel__header">
          <button type="button" class="night-range-panel__nav" aria-label="Mês anterior" @click="prevMonth">
            ‹
          </button>
          <span class="night-range-panel__month">{{ monthNames[viewMonth] }} {{ viewYear }}</span>
          <button type="button" class="night-range-panel__nav" aria-label="Próximo mês" @click="nextMonth">
            ›
          </button>
        </div>

        <p class="night-range-panel__hint">
          {{ picking === 'from' ? 'Selecione a data inicial' : 'Selecione a data final' }}
        </p>

        <div class="night-range-panel__week">
          <span v-for="(day, index) in weekDays" :key="`${day}-${index}`">{{ day }}</span>
        </div>

        <div class="night-range-panel__grid">
          <button
            v-for="cell in calendarDays"
            :key="cell.key"
            type="button"
            class="night-range-panel__day"
            :class="[{ 'is-outside': cell.outside }, dayClass(cell.date)]"
            @click="selectDay(cell.date)"
          >
            {{ cell.day }}
          </button>
        </div>

        <div class="night-range-panel__footer">
          <button type="button" class="night-range-panel__today" @click="selectToday">Hoje</button>
          <button type="button" class="night-range-panel__clear" @click="clearRange">Limpar</button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style lang="scss" scoped>
.night-range {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 0 0 auto;
  z-index: 6;

  &__label {
    padding-left: 16px;
    font-family: 'Source Code Pro', monospace;
    font-size: 12px;
    font-weight: 700;
    color: #f7f7f7;
    opacity: 0.7;
    text-transform: uppercase;
  }

  &__trigger {
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    min-width: 250px;
    height: 44px;
    padding: 0 16px;
    border: none;
    border-radius: 30px;
    background: rgba(121, 121, 121, 0.3);
    color: #ffffff;
    font-family: 'Source Code Pro', monospace;
    font-size: 13px;
    font-weight: 300;
    line-height: 1;
    cursor: pointer;
    text-align: left;

    span {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    &.is-placeholder {
      color: rgba(247, 247, 247, 0.7);
    }

    &:hover,
    &.is-open {
      background: rgba(121, 121, 121, 0.4);
    }
  }

  &__chevron {
    flex-shrink: 0;
    opacity: 0.7;
    transition: transform 0.2s ease;

    &--open {
      transform: rotate(180deg);
    }
  }
}
</style>

<style lang="scss">
.night-range-panel {
  padding: 14px;
  background: rgba(33, 33, 33, 0.98);
  border: 1px solid rgba(121, 121, 121, 0.45);
  border-radius: 18px;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.35);
  box-sizing: border-box;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
  }

  &__month {
    font-family: 'Source Code Pro', monospace;
    font-size: 14px;
    font-weight: 700;
    color: #f7f7f7;
  }

  &__nav {
    width: 28px;
    height: 28px;
    border: none;
    border-radius: 50%;
    background: rgba(121, 121, 121, 0.3);
    color: #fff;
    font-size: 18px;
    line-height: 1;
    cursor: pointer;

    &:hover {
      background: rgba(121, 121, 121, 0.45);
    }
  }

  &__hint {
    margin: 0 0 10px;
    font-family: 'Source Code Pro', monospace;
    font-size: 11px;
    color: rgba(247, 247, 247, 0.65);
  }

  &__week {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 2px;
    margin-bottom: 4px;

    span {
      text-align: center;
      font-family: 'Source Code Pro', monospace;
      font-size: 11px;
      font-weight: 700;
      color: rgba(247, 247, 247, 0.55);
    }
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 2px;
  }

  &__day {
    height: 32px;
    border: none;
    border-radius: 8px;
    background: transparent;
    color: #f7f7f7;
    font-family: 'Source Code Pro', monospace;
    font-size: 12px;
    cursor: pointer;

    &:hover {
      background: rgba(121, 121, 121, 0.35);
    }

    &.is-outside {
      color: rgba(247, 247, 247, 0.3);
    }

    &.is-today:not(.is-start):not(.is-end):not(.is-single) {
      box-shadow: inset 0 0 0 1px rgba(255, 0, 255, 0.7);
    }

    &.is-in-range {
      background: rgba(255, 0, 255, 0.18);
      border-radius: 0;
    }

    &.is-start,
    &.is-end,
    &.is-single {
      background: #ff00ff;
      color: #fff;
      border-radius: 8px;
    }
  }

  &__footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    margin-top: 10px;
  }

  &__today,
  &__clear {
    border: none;
    background: transparent;
    font-family: 'Source Code Pro', monospace;
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    cursor: pointer;
  }

  &__today {
    color: rgba(247, 247, 247, 0.85);

    &:hover {
      color: #fff;
    }
  }

  &__clear {
    color: rgba(247, 247, 247, 0.75);

    &:hover {
      color: #fff;
    }
  }
}
</style>
