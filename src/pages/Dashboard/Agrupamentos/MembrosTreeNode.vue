<script setup lang="ts">
import { computed } from 'vue'
import iconEmpresa from '@/assets/imgs/dashboard/icon-card-building.svg'
import iconSetor from '@/assets/imgs/dashboard/icon-menu-setores.svg'
import iconFuncao from '@/assets/imgs/dashboard/icon-menu-funcoes.svg'
import iconPessoa from '@/assets/imgs/dashboard/icon-card-person.svg'
import iconChevronDown from '@/assets/imgs/administradores/icon-chevron-down.svg'
import { funcionarioIdsOf, type MembroNode } from './membrosTree'

const props = withDefaults(
  defineProps<{
    node: MembroNode
    expanded: Set<string>
    selectable?: boolean
    selected?: Set<string>
  }>(),
  { selectable: false, selected: () => new Set<string>() }
)

const emit = defineEmits<{
  (e: 'toggle', key: string): void
  (e: 'select', ids: string[], checked: boolean): void
}>()

const ICONS = {
  empresa: iconEmpresa,
  setor: iconSetor,
  funcao: iconFuncao,
  funcionario: iconPessoa
} as const

const isLeaf = computed(() => props.node.type === 'funcionario')
const isOpen = computed(() => !isLeaf.value && props.expanded.has(props.node.key))
const ids = computed(() => funcionarioIdsOf(props.node))
const marcados = computed(() => ids.value.filter((id) => props.selected.has(id)).length)
const checked = computed(() => ids.value.length > 0 && marcados.value === ids.value.length)
const indeterminate = computed(() => marcados.value > 0 && !checked.value)

function toggle() {
  if (!isLeaf.value) emit('toggle', props.node.key)
}

function onCheck(event: Event) {
  emit('select', ids.value, (event.target as HTMLInputElement).checked)
}
</script>

<template>
  <li class="membro-node" :class="`membro-node--${node.type}`">
    <div class="membro-node__row">
      <input
        v-if="selectable"
        type="checkbox"
        class="membro-node__check"
        :checked="checked"
        :indeterminate="indeterminate"
        :disabled="!ids.length"
        :aria-label="`Selecionar ${node.label}`"
        @change="onCheck"
      />
      <button
        type="button"
        class="membro-node__toggle"
        :class="{ 'is-leaf': isLeaf }"
        :aria-expanded="isLeaf ? undefined : isOpen"
        :tabindex="isLeaf ? -1 : 0"
        @click="toggle"
      >
        <img
          v-if="!isLeaf"
          class="membro-node__chevron"
          :class="{ 'is-open': isOpen }"
          :src="iconChevronDown"
          width="10"
          height="10"
          alt=""
        />
        <img class="membro-node__icon" :src="ICONS[node.type]" width="16" height="16" alt="" />
        <span class="membro-node__label">{{ node.label }}</span>
      </button>
    </div>

    <ul v-if="isOpen && node.children.length" class="membro-node__children" role="group">
      <MembrosTreeNode
        v-for="child in node.children"
        :key="child.key"
        :node="child"
        :expanded="expanded"
        :selectable="selectable"
        :selected="selected"
        @toggle="emit('toggle', $event)"
        @select="(childIds, value) => emit('select', childIds, value)"
      />
    </ul>
  </li>
</template>

<style lang="scss" scoped>
.membro-node {
  list-style: none;
  margin: 0;
  padding: 0;
}

.membro-node__row {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.membro-node__check {
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  margin: 0;
  accent-color: #b08d57;
  cursor: pointer;

  &:disabled {
    cursor: default;
    opacity: 0.4;
  }
}

.membro-node__toggle {
  flex: 1 1 auto;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: #fffcff;
  font-family: var(--night-font, 'Inter', sans-serif);
  font-size: 14px;
  text-align: left;
  cursor: pointer;
  transition: background 0.15s ease;

  &:hover:not(.is-leaf) {
    background: rgba(255, 255, 255, 0.06);
  }

  &.is-leaf {
    cursor: default;
    padding-left: 26px;
  }
}

.membro-node__chevron {
  flex-shrink: 0;
  opacity: 0.7;
  filter: brightness(0) invert(1);
  transform: rotate(-90deg);
  transition: transform 0.15s ease;

  &.is-open {
    transform: rotate(0deg);
  }
}

.membro-node__icon {
  flex-shrink: 0;
  object-fit: contain;
  filter: brightness(0) saturate(100%) invert(67%) sepia(18%) saturate(742%) hue-rotate(7deg)
    brightness(95%) contrast(88%);
}

.membro-node__label {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.membro-node--empresa > .membro-node__row .membro-node__label,
.membro-node--setor > .membro-node__row .membro-node__label {
  font-weight: 600;
}

.membro-node--funcao > .membro-node__row .membro-node__label {
  font-size: 13px;
}

.membro-node--funcionario > .membro-node__row .membro-node__label {
  font-size: 13px;
  opacity: 0.9;
}

.membro-node__children {
  margin: 2px 0 4px 14px;
  padding: 0 0 0 10px;
  border-left: 1px dashed rgba(176, 141, 87, 0.45);
}
</style>
