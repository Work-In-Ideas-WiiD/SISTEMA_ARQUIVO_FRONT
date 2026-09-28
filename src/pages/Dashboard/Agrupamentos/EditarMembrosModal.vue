<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { IFuncionario } from '@/services/http/funcionarios'
import iconSearch from '@/assets/imgs/administradores/icon-search.svg'
import MembrosTreeNode from './MembrosTreeNode.vue'
import { allNodeKeys, buildMembrosTree } from './membrosTree'

const props = defineProps<{
  open: boolean
  agrupamentoNome: string
  empresaNome: string
  funcionarios: IFuncionario[]
  membrosIds: string[]
  saving?: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'save', ids: string[]): void
}>()

const selected = ref(new Set<string>())
const expanded = ref(new Set<string>())
const busca = ref('')

const funcionariosFiltrados = computed(() => {
  const termo = busca.value.trim().toLocaleLowerCase('pt-BR')
  if (!termo) return props.funcionarios
  return props.funcionarios.filter((f) => f.nome.toLocaleLowerCase('pt-BR').includes(termo))
})

const tree = computed(() => buildMembrosTree(props.empresaNome, funcionariosFiltrados.value))

watch(
  () => props.open,
  (open) => {
    if (!open) return
    busca.value = ''
    selected.value = new Set(props.membrosIds)
    expanded.value = new Set(allNodeKeys(buildMembrosTree(props.empresaNome, props.funcionarios)))
  },
  { immediate: true }
)

watch(busca, () => {
  expanded.value = new Set(allNodeKeys(tree.value))
})

function onToggle(key: string) {
  const next = new Set(expanded.value)
  if (next.has(key)) next.delete(key)
  else next.add(key)
  expanded.value = next
}

function onSelect(ids: string[], checked: boolean) {
  const next = new Set(selected.value)
  ids.forEach((id) => (checked ? next.add(id) : next.delete(id)))
  selected.value = next
}

function expandirTudo() {
  expanded.value = new Set(allNodeKeys(tree.value))
}

function recolherTudo() {
  expanded.value = new Set(['empresa'])
}

function salvar() {
  emit('save', [...selected.value])
}
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="night-confirm" @click.self="emit('close')">
      <div class="night-confirm__modal membros-modal" role="dialog" aria-modal="true">
        <h3 class="night-confirm__title">Editar membros</h3>
        <p class="membros-modal__sub">{{ agrupamentoNome }}</p>

        <label class="membros-modal__search">
          <img :src="iconSearch" width="16" height="16" alt="" />
          <input v-model="busca" type="text" placeholder="Pesquisar funcionário…" />
        </label>

        <div class="membros-modal__tools">
          <span>{{ selected.size }} selecionado{{ selected.size === 1 ? '' : 's' }}</span>
          <div>
            <button type="button" @click="expandirTudo">Expandir tudo</button>
            <button type="button" @click="recolherTudo">Recolher</button>
          </div>
        </div>

        <div class="membros-modal__tree">
          <ul v-if="funcionariosFiltrados.length" class="membros-modal__root" role="tree">
            <MembrosTreeNode
              :node="tree"
              :expanded="expanded"
              :selected="selected"
              selectable
              @toggle="onToggle"
              @select="onSelect"
            />
          </ul>
          <p v-else class="membros-modal__empty">
            {{ busca ? 'Nenhum funcionário encontrado.' : 'Nenhum funcionário cadastrado nesta empresa.' }}
          </p>
        </div>

        <div class="night-confirm__actions">
          <button
            type="button"
            class="night-confirm__btn night-confirm__btn--ghost"
            @click="emit('close')"
          >
            Cancelar
          </button>
          <button type="button" class="night-confirm__btn" :disabled="saving" @click="salvar">
            Salvar
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style lang="scss" scoped>
.night-confirm {
  position: fixed;
  inset: 0;
  z-index: 1200;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  overflow: hidden;
  overscroll-behavior: contain;
}

.night-confirm__modal {
  background: var(--night-surface, #132438);
  border: 1px solid var(--night-surface-border, rgba(176, 141, 87, 0.25));
  border-radius: 16px;
  padding: 24px;
  box-sizing: border-box;
}

.night-confirm__title {
  margin: 0;
  color: #fffcff;
  font-family: var(--night-font, 'Inter', sans-serif);
  font-size: 18px;
  font-weight: 700;
}

.night-confirm__actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 16px;
}

.night-confirm__btn {
  border: 0;
  border-radius: 999px;
  padding: 10px 18px;
  background: #b08d57;
  color: #0b1b2b;
  font-weight: 700;
  cursor: pointer;
  font-family: var(--night-font, 'Inter', sans-serif);

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &--ghost {
    background: transparent;
    color: #fffcff;
    border: 1px solid rgba(255, 255, 255, 0.2);
  }
}

.membros-modal {
  width: min(520px, 100%);
  max-height: min(88vh, 760px);
  display: flex;
  flex-direction: column;
}

.membros-modal__sub {
  margin: 4px 0 16px;
  color: #b08d57;
  font-family: var(--night-font, 'Inter', sans-serif);
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.membros-modal__search {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 42px;
  padding: 0 16px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 30px;
  cursor: text;

  &:focus-within {
    border-color: #b08d57;
    box-shadow: 0 0 0 2px rgba(176, 141, 87, 0.2);
  }

  input {
    flex: 1;
    min-width: 0;
    height: 100%;
    border: 0;
    outline: none;
    background: transparent;
    color: #fff;
    font-family: var(--night-font, 'Inter', sans-serif);
    font-size: 14px;

    &::placeholder {
      color: #fff;
      opacity: 0.6;
    }
  }
}

.membros-modal__tools {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin: 12px 0 8px;
  font-family: var(--night-font, 'Inter', sans-serif);
  font-size: 12px;
  color: rgba(255, 252, 255, 0.7);

  div {
    display: flex;
    gap: 12px;
  }

  button {
    border: 0;
    padding: 0;
    background: transparent;
    color: #b08d57;
    font: inherit;
    font-weight: 600;
    cursor: pointer;

    &:hover {
      color: #c29f68;
    }
  }
}

.membros-modal__tree {
  flex: 1 1 auto;
  min-height: 160px;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 10px 8px;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.08);
  scrollbar-width: thin;
  scrollbar-color: rgba(176, 141, 87, 0.45) transparent;
}

.membros-modal__root {
  margin: 0;
  padding: 0;
}

.membros-modal__empty {
  margin: 12px 8px;
  color: #f7f7f7;
  opacity: 0.7;
  font-family: var(--night-font, 'Inter', sans-serif);
  font-size: 14px;
}
</style>
