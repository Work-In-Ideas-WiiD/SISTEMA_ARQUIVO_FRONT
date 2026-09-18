<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import iconChevronDown from '@/assets/imgs/administradores/icon-chevron-down.svg'

const props = withDefaults(
  defineProps<{
    modelValue: string
    placeholder?: string
    id?: string
  }>(),
  {
    placeholder: 'dd/mm/aaaa',
    id: undefined
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'change', value: string): void
}>()

type PanelMode = 'days' | 'months' | 'years'

const open = ref(false)
const panelMode = ref<PanelMode>('days')
const rootRef = ref<HTMLElement | null>(null)
const triggerRef = ref<HTMLElement | null>(null)
const panelRef = ref<HTMLElement | null>(null)
const panelStyle = ref<Record<string, string>>({})
const viewYear = ref(new Date().getFullYear())
const viewMonth = ref(new Date().getMonth())
/** Início da página de anos (grade 12). */
const yearPageStart = ref(Math.floor(new Date().getFullYear() / 12) * 12)
/** Texto digitável no formato dd/mm/aaaa. */
const inputText = ref(props.modelValue ? formatDisplay(props.modelValue) : '')

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

const monthShortNames = [
  'Jan',
  'Fev',
  'Mar',
  'Abr',
  'Mai',
  'Jun',
  'Jul',
  'Ago',
  'Set',
  'Out',
  'Nov',
  'Dez'
]

const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']

const yearOptions = computed(() =>
  Array.from({ length: 12 }, (_, i) => yearPageStart.value + i)
)

watch(
  () => props.modelValue,
  (value) => {
    const next = value ? formatDisplay(value) : ''
    if (inputText.value !== next) {
      inputText.value = next
    }
    if (!value || !open.value) return
    const d = new Date(`${value}T00:00:00`)
    if (Number.isNaN(d.getTime())) return
    viewYear.value = d.getFullYear()
    viewMonth.value = d.getMonth()
  }
)

const hasValue = computed(() => Boolean(props.modelValue) || Boolean(inputText.value))

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

/** Máscara dd/mm/aaaa a partir de dígitos. */
function maskDateDigits(raw: string) {
  const digits = raw.replace(/\D/g, '').slice(0, 8)
  if (digits.length <= 2) return digits
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`
}

/** Converte dd/mm/aaaa em yyyy-mm-dd se for data real. */
function parseDisplayToIso(display: string): string | null {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(display)
  if (!match) return null

  const day = Number(match[1])
  const month = Number(match[2])
  const year = Number(match[3])
  if (month < 1 || month > 12 || day < 1 || year < 1000) return null

  const d = new Date(year, month - 1, day)
  if (
    d.getFullYear() !== year ||
    d.getMonth() !== month - 1 ||
    d.getDate() !== day
  ) {
    return null
  }

  return toIso(year, month - 1, day)
}

function syncYearPage() {
  yearPageStart.value = Math.floor(viewYear.value / 12) * 12
}

function updatePanelPosition() {
  if (!triggerRef.value) return

  const rect = triggerRef.value.getBoundingClientRect()
  const panelWidth = 280
  const panelHeight = panelRef.value?.offsetHeight || 320
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
    panelMode.value = 'days'
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

function onInput(event: Event) {
  const target = event.target as HTMLInputElement
  const masked = maskDateDigits(target.value)
  inputText.value = masked
  target.value = masked

  if (!masked) {
    if (props.modelValue) {
      emit('update:modelValue', '')
      emit('change', '')
    }
    return
  }

  const iso = parseDisplayToIso(masked)
  if (!iso) return

  if (iso !== props.modelValue) {
    emit('update:modelValue', iso)
    emit('change', iso)
  }

  const d = new Date(`${iso}T00:00:00`)
  viewYear.value = d.getFullYear()
  viewMonth.value = d.getMonth()
}

function onInputBlur() {
  if (!inputText.value) {
    if (props.modelValue) {
      emit('update:modelValue', '')
      emit('change', '')
    }
    return
  }

  const iso = parseDisplayToIso(inputText.value)
  if (iso) {
    inputText.value = formatDisplay(iso)
    return
  }

  // Digitação incompleta/inválida: volta pro valor confirmado.
  inputText.value = props.modelValue ? formatDisplay(props.modelValue) : ''
}

async function openCalendar() {
  open.value = true

  const base = props.modelValue || todayIso()
  const d = new Date(`${base}T00:00:00`)
  if (!Number.isNaN(d.getTime())) {
    viewYear.value = d.getFullYear()
    viewMonth.value = d.getMonth()
  }
  panelMode.value = 'days'
  syncYearPage()

  await nextTick()
  updatePanelPosition()
}

async function toggleCalendar() {
  if (open.value) {
    open.value = false
    panelMode.value = 'days'
    return
  }
  await openCalendar()
}

function prevNav() {
  if (panelMode.value === 'days') {
    if (viewMonth.value === 0) {
      viewMonth.value = 11
      viewYear.value -= 1
    } else {
      viewMonth.value -= 1
    }
    return
  }
  if (panelMode.value === 'months') {
    viewYear.value -= 1
    return
  }
  yearPageStart.value -= 12
}

function nextNav() {
  if (panelMode.value === 'days') {
    if (viewMonth.value === 11) {
      viewMonth.value = 0
      viewYear.value += 1
    } else {
      viewMonth.value += 1
    }
    return
  }
  if (panelMode.value === 'months') {
    viewYear.value += 1
    return
  }
  yearPageStart.value += 12
}

function showMonths() {
  panelMode.value = 'months'
  nextTick().then(updatePanelPosition)
}

function showYears() {
  syncYearPage()
  panelMode.value = 'years'
  nextTick().then(updatePanelPosition)
}

function selectMonth(month: number) {
  viewMonth.value = month
  panelMode.value = 'days'
  nextTick().then(updatePanelPosition)
}

function selectYear(year: number) {
  viewYear.value = year
  panelMode.value = 'months'
  nextTick().then(updatePanelPosition)
}

function commit(next: string) {
  inputText.value = next ? formatDisplay(next) : ''
  emit('update:modelValue', next)
  emit('change', next)
  open.value = false
  panelMode.value = 'days'
}

function selectDay(date: string) {
  commit(date)
}

function selectToday() {
  const today = todayIso()
  const d = new Date()
  viewYear.value = d.getFullYear()
  viewMonth.value = d.getMonth()
  commit(today)
}

function clearDate() {
  commit('')
}
</script>

<template>
  <div ref="rootRef" class="night-date">
    <div
      ref="triggerRef"
      class="night-date__trigger"
      :class="{ 'is-placeholder': !hasValue, 'is-open': open }"
    >
      <input
        :id="id"
        :value="inputText"
        type="text"
        class="night-date__input"
        :placeholder="placeholder"
        inputmode="numeric"
        autocomplete="off"
        maxlength="10"
        @input="onInput"
        @blur="onInputBlur"
        @keydown.enter.prevent="onInputBlur"
      />
      <button
        type="button"
        class="night-date__calendar-btn"
        aria-label="Abrir calendário"
        :aria-expanded="open"
        @click.stop="toggleCalendar"
      >
        <img
          class="night-date__chevron"
          :class="{ 'night-date__chevron--open': open }"
          :src="iconChevronDown"
          width="16"
          height="9"
          alt=""
        />
      </button>
    </div>

    <Teleport to="body">
      <div
        v-if="open"
        ref="panelRef"
        class="night-date-panel"
        :style="panelStyle"
        @click.stop
      >
        <div class="night-date-panel__header">
          <button
            type="button"
            class="night-date-panel__nav"
            :aria-label="panelMode === 'years' ? 'Anos anteriores' : panelMode === 'months' ? 'Ano anterior' : 'Mês anterior'"
            @click="prevNav"
          >
            ‹
          </button>

          <div class="night-date-panel__title">
            <template v-if="panelMode === 'days'">
              <button type="button" class="night-date-panel__title-btn" @click="showMonths">
                {{ monthNames[viewMonth] }}
              </button>
              <button type="button" class="night-date-panel__title-btn" @click="showYears">
                {{ viewYear }}
              </button>
            </template>
            <button
              v-else-if="panelMode === 'months'"
              type="button"
              class="night-date-panel__title-btn"
              @click="showYears"
            >
              {{ viewYear }}
            </button>
            <span v-else class="night-date-panel__month">
              {{ yearPageStart }} – {{ yearPageStart + 11 }}
            </span>
          </div>

          <button
            type="button"
            class="night-date-panel__nav"
            :aria-label="panelMode === 'years' ? 'Próximos anos' : panelMode === 'months' ? 'Próximo ano' : 'Próximo mês'"
            @click="nextNav"
          >
            ›
          </button>
        </div>

        <template v-if="panelMode === 'days'">
          <div class="night-date-panel__week">
            <span v-for="(day, index) in weekDays" :key="`${day}-${index}`">{{ day }}</span>
          </div>

          <div class="night-date-panel__grid">
            <button
              v-for="cell in calendarDays"
              :key="cell.key"
              type="button"
              class="night-date-panel__day"
              :class="{
                'is-outside': cell.outside,
                'is-selected': cell.date === modelValue,
                'is-today': cell.date === todayIso() && cell.date !== modelValue
              }"
              @click="selectDay(cell.date)"
            >
              {{ cell.day }}
            </button>
          </div>
        </template>

        <div v-else-if="panelMode === 'months'" class="night-date-panel__picker-grid">
          <button
            v-for="(name, index) in monthShortNames"
            :key="name"
            type="button"
            class="night-date-panel__picker-item"
            :class="{ 'is-selected': index === viewMonth }"
            @click="selectMonth(index)"
          >
            {{ name }}
          </button>
        </div>

        <div v-else class="night-date-panel__picker-grid">
          <button
            v-for="year in yearOptions"
            :key="year"
            type="button"
            class="night-date-panel__picker-item"
            :class="{ 'is-selected': year === viewYear }"
            @click="selectYear(year)"
          >
            {{ year }}
          </button>
        </div>

        <div class="night-date-panel__footer">
          <button type="button" class="night-date-panel__today" @click="selectToday">Hoje</button>
          <button type="button" class="night-date-panel__clear" @click="clearDate">Limpar</button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style lang="scss" scoped>
.night-date {
  position: relative;
  width: 100%;
  min-width: 0;
  z-index: 6;

  &__trigger {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    height: 49px;
    padding: 0 12px 0 20px;
    border: none;
    border-radius: 30px;
    background: rgba(121, 121, 121, 0.3);
    box-sizing: border-box;

    &:hover,
    &.is-open {
      background: rgba(121, 121, 121, 0.4);
    }
  }

  &__input {
    flex: 1;
    min-width: 0;
    height: 100%;
    border: none;
    outline: none;
    background: transparent;
    color: #ffffff;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    font-weight: 300;
    line-height: 1;

    &::placeholder {
      color: rgba(247, 247, 247, 0.7);
    }
  }

  &__calendar-btn {
    flex-shrink: 0;
    width: 32px;
    height: 32px;
    border: none;
    border-radius: 50%;
    background: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    padding: 0;

    &:hover {
      background: rgba(255, 255, 255, 0.08);
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
.night-date-panel {
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
    gap: 6px;
  }

  &__title {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    min-width: 0;
    flex: 1;
  }

  &__title-btn {
    border: none;
    background: transparent;
    padding: 4px 6px;
    border-radius: 8px;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    font-weight: 700;
    color: #f7f7f7;
    cursor: pointer;

    &:hover {
      background: rgba(121, 121, 121, 0.35);
      color: #fff;
    }
  }

  &__month {
    font-family: 'Inter', sans-serif;
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
    flex-shrink: 0;

    &:hover {
      background: rgba(121, 121, 121, 0.45);
    }
  }

  &__week {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 2px;
    margin-bottom: 4px;

    span {
      text-align: center;
      font-family: 'Inter', sans-serif;
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

  &__picker-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 6px;
    min-height: 196px;
  }

  &__picker-item {
    height: 40px;
    border: none;
    border-radius: 10px;
    background: rgba(121, 121, 121, 0.22);
    color: #f7f7f7;
    font-family: 'Inter', sans-serif;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;

    &:hover {
      background: rgba(121, 121, 121, 0.4);
    }

    &.is-selected {
      background: #B08D57;
      color: #fff;
    }
  }

  &__day {
    height: 32px;
    border: none;
    border-radius: 8px;
    background: transparent;
    color: #f7f7f7;
    font-family: 'Inter', sans-serif;
    font-size: 12px;
    cursor: pointer;

    &:hover {
      background: rgba(121, 121, 121, 0.35);
    }

    &.is-outside {
      color: rgba(247, 247, 247, 0.3);
    }

    &.is-today {
      box-shadow: inset 0 0 0 1px rgba(176, 141, 87, 0.7);
    }

    &.is-selected {
      background: #B08D57;
      color: #fff;
      box-shadow: none;
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
    font-family: 'Inter', sans-serif;
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
