<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useToast } from 'vue-toastification'
import { getPastas, moverPasta } from '@/services/http/pastas'
import { getAllSetores, type ISetor } from '@/services/http/setores'
import { getAllFuncoes, type IFuncao } from '@/services/http/funcoes'
import { getAllAgrupamentos } from '@/services/http/agrupamentos'
import { moverArquivos, type IDestinoArquivo } from '@/services/http/arquivos'
import { getApiErrorMessage } from '@/utils/apiError'
import iconChevronDown from '@/assets/imgs/administradores/icon-chevron-down.svg'
import iconEmpresa from '@/assets/imgs/dashboard/icon-card-building.svg'
import iconSetor from '@/assets/imgs/dashboard/icon-menu-setores.svg'
import iconFuncao from '@/assets/imgs/dashboard/icon-menu-funcoes.svg'
import iconAgrupamento from '@/assets/imgs/dashboard/icon-menu-agrupamentos.svg'
import iconPasta from '@/assets/imgs/arquivos/folder.svg'

type NodeType = 'empresa' | 'setor' | 'funcao' | 'pasta' | 'agrupamentos' | 'agrupamento'

interface DestNode {
  key: string
  type: NodeType
  label: string
  /** Contexto herdado pelos filhos (sem pasta). */
  ctx: IDestinoArquivo
  /** null = nó só agrupa (não pode ser destino). */
  destino: IDestinoArquivo | null
  children: DestNode[] | null
  loading: boolean
  caminho: string
}

const props = defineProps<{
  open: boolean
  empresaId: string
  empresaNome: string
  arquivoIds: string[]
  /** Quando informado, move esta pasta (com o que tem dentro) em vez de arquivos. */
  pasta?: { id: string; nome: string } | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'moved', destino: IDestinoArquivo): void
}>()

const toast = useToast()
const ICONS: Record<NodeType, string> = {
  empresa: iconEmpresa,
  setor: iconSetor,
  funcao: iconFuncao,
  pasta: iconPasta,
  agrupamentos: iconAgrupamento,
  agrupamento: iconAgrupamento
}

const root = ref<DestNode | null>(null)
const expanded = ref(new Set<string>())
const selectedKey = ref<string | null>(null)
const saving = ref(false)
let setoresCache: ISetor[] | null = null
let funcoesCache: IFuncao[] | null = null

function node(
  key: string,
  type: NodeType,
  label: string,
  ctx: IDestinoArquivo,
  destino: IDestinoArquivo | null,
  caminho: string
): DestNode {
  return { key, type, label, ctx, destino, children: null, loading: false, caminho }
}

async function pastaNodes(parent: DestNode, parentPastaId: string | null): Promise<DestNode[]> {
  const { data } = await getPastas(
    props.empresaId,
    parentPastaId,
    1,
    parent.ctx.agrupamento_id || null,
    { setor_id: parent.ctx.setor_id, funcao_id: parent.ctx.funcao_id }
  )
  return (data.data || []).filter((p) => p.id !== props.pasta?.id).map((p) =>
    node(
      `${parent.key}|p:${p.id}`,
      'pasta',
      p.nome,
      parent.ctx,
      { ...parent.ctx, pasta_id: p.id },
      `${parent.caminho} › ${p.nome}`
    )
  )
}

async function loadChildren(n: DestNode) {
  if (n.children || n.loading) return
  n.loading = true
  try {
    if (n.type === 'empresa') {
      setoresCache ??= (await getAllSetores(props.empresaId)).data || []
      const [pastas, { data: grupos }] = await Promise.all([
        pastaNodes(n, null),
        getAllAgrupamentos(props.empresaId)
      ])
      const setores = setoresCache.map((s) =>
        node(`s:${s.id}`, 'setor', s.nome, { setor_id: s.id }, { setor_id: s.id }, `${n.caminho} › ${s.nome}`)
      )
      const filhos = [...pastas, ...setores]
      if (grupos?.length) {
        const grupoRaiz = node('agrupamentos', 'agrupamentos', 'Agrupamentos', {}, null, n.caminho)
        grupoRaiz.children = grupos.map((g) =>
          node(
            `g:${g.id}`,
            'agrupamento',
            g.nome,
            { agrupamento_id: g.id },
            { agrupamento_id: g.id },
            `Agrupamento ${g.nome}`
          )
        )
        filhos.push(grupoRaiz)
      }
      n.children = filhos
    } else if (n.type === 'setor') {
      funcoesCache ??= (await getAllFuncoes(props.empresaId)).data || []
      const pastas = await pastaNodes(n, null)
      const setorId = n.ctx.setor_id
      const funcoes = funcoesCache.filter((f) => f.setor_id === setorId).map((f) => {
        const ctx = { ...n.ctx, funcao_id: f.id }
        return node(`${n.key}|f:${f.id}`, 'funcao', f.nome, ctx, ctx, `${n.caminho} › ${f.nome}`)
      })
      n.children = [...pastas, ...funcoes]
    } else if (n.type === 'pasta') {
      n.children = await pastaNodes(n, n.destino?.pasta_id || null)
    } else if (n.type === 'funcao' || n.type === 'agrupamento') {
      n.children = await pastaNodes(n, null)
    } else {
      n.children = []
    }
  } catch (error) {
    toast.error(getApiErrorMessage(error, 'Erro ao carregar destinos'))
  } finally {
    n.loading = false
  }
}

async function toggle(n: DestNode) {
  const next = new Set(expanded.value)
  if (next.has(n.key)) {
    next.delete(n.key)
  } else {
    next.add(n.key)
    await loadChildren(n)
  }
  expanded.value = next
}

function selecionar(n: DestNode) {
  if (!n.destino) {
    void toggle(n)
    return
  }
  selectedKey.value = n.key
}

const linhas = computed(() => {
  const out: { node: DestNode; depth: number }[] = []
  const walk = (n: DestNode, depth: number) => {
    out.push({ node: n, depth })
    if (expanded.value.has(n.key)) n.children?.forEach((c) => walk(c, depth + 1))
  }
  if (root.value) walk(root.value, 0)
  return out
})

const selecionado = computed(
  () => linhas.value.find((l) => l.node.key === selectedKey.value)?.node || null
)

function temFilhos(n: DestNode) {
  return n.children === null || n.children.length > 0
}

async function confirmar() {
  const alvo = selecionado.value
  if (!alvo?.destino) return
  saving.value = true
  try {
    if (props.pasta) {
      await moverPasta(props.pasta.id, alvo.destino)
      toast.success(`Pasta movida para ${alvo.label}`)
      emit('moved', alvo.destino)
      emit('close')
      return
    }
    const { data } = await moverArquivos(props.arquivoIds, props.empresaId, alvo.destino)
    toast.success(
      data.movidos === 1 ? `Arquivo movido para ${alvo.label}` : `${data.movidos} arquivos movidos para ${alvo.label}`
    )
    emit('moved', alvo.destino)
    emit('close')
  } catch (error) {
    toast.error(getApiErrorMessage(error, props.pasta ? 'Erro ao mover a pasta' : 'Erro ao mover arquivos'))
  } finally {
    saving.value = false
  }
}

watch(
  () => props.open,
  async (open) => {
    if (typeof document !== 'undefined') document.body.style.overflow = open ? 'hidden' : ''
    if (!open) return
    setoresCache = null
    funcoesCache = null
    selectedKey.value = null
    root.value = node('empresa', 'empresa', props.empresaNome, {}, {}, props.empresaNome)
    expanded.value = new Set(['empresa'])
    await loadChildren(root.value)
  },
  { immediate: true }
)
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="night-confirm" @click.self="emit('close')">
      <div class="night-confirm__modal mover-modal" role="dialog" aria-modal="true">
        <h3 class="night-confirm__title">
          <template v-if="pasta">Mover pasta “{{ pasta.nome }}”</template>
          <template v-else>
            Mover {{ arquivoIds.length === 1 ? 'arquivo' : `${arquivoIds.length} arquivos` }}
          </template>
        </h3>
        <p class="mover-modal__sub">Escolha a pasta ou o nível de destino</p>

        <ul class="mover-modal__tree" role="tree">
          <li
            v-for="{ node: n, depth } in linhas"
            :key="n.key"
            class="mover-modal__row"
            :class="{ 'is-selected': selectedKey === n.key, 'is-group': !n.destino }"
            :style="{ paddingLeft: `${8 + depth * 18}px` }"
            role="treeitem"
            :aria-expanded="temFilhos(n) ? expanded.has(n.key) : undefined"
            :aria-selected="selectedKey === n.key"
          >
            <button
              type="button"
              class="mover-modal__chevron"
              :class="{ 'is-open': expanded.has(n.key), 'is-hidden': !temFilhos(n) }"
              :aria-label="expanded.has(n.key) ? 'Recolher' : 'Expandir'"
              :tabindex="temFilhos(n) ? 0 : -1"
              @click="toggle(n)"
            >
              <img :src="iconChevronDown" width="10" height="10" alt="" />
            </button>
            <button
              type="button"
              class="mover-modal__label"
              @click="selecionar(n)"
              @dblclick="toggle(n)"
            >
              <img
                class="mover-modal__icon"
                :class="{ 'is-folder': n.type === 'pasta' }"
                :src="ICONS[n.type]"
                width="18"
                height="18"
                alt=""
              />
              <span>{{ n.label }}</span>
              <span v-if="n.loading" class="mover-modal__loading">carregando…</span>
            </button>
          </li>
        </ul>

        <p class="mover-modal__destino">
          <span>Destino:</span>
          {{ selecionado ? selecionado.caminho : 'nenhum selecionado' }}
        </p>

        <div class="night-confirm__actions">
          <button
            type="button"
            class="night-confirm__btn night-confirm__btn--ghost"
            @click="emit('close')"
          >
            Cancelar
          </button>
          <button
            type="button"
            class="night-confirm__btn"
            :disabled="saving || !selecionado"
            @click="confirmar"
          >
            Mover aqui
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

.mover-modal {
  width: min(520px, 100%);
  max-height: min(88vh, 720px);
  display: flex;
  flex-direction: column;
  font-family: var(--night-font, 'Inter', sans-serif);
}

.mover-modal__sub {
  margin: 4px 0 14px;
  color: #b08d57;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.mover-modal__tree {
  flex: 1 1 auto;
  min-height: 220px;
  margin: 0;
  padding: 8px 6px;
  list-style: none;
  overflow-y: auto;
  overscroll-behavior: contain;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.08);
  scrollbar-width: thin;
  scrollbar-color: rgba(176, 141, 87, 0.45) transparent;
}

.mover-modal__row {
  display: flex;
  align-items: center;
  gap: 4px;
  border-radius: 8px;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }

  &.is-selected {
    background: rgba(176, 141, 87, 0.28);
  }

  &.is-group .mover-modal__label span:first-of-type {
    color: #b08d57;
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }
}

.mover-modal__chevron {
  flex-shrink: 0;
  width: 22px;
  height: 22px;
  padding: 0;
  border: 0;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  img {
    filter: brightness(0) invert(1);
    opacity: 0.7;
    transform: rotate(-90deg);
    transition: transform 0.15s ease;
  }

  &.is-open img {
    transform: rotate(0deg);
  }

  &.is-hidden {
    visibility: hidden;
  }
}

.mover-modal__label {
  flex: 1 1 auto;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 8px 7px 2px;
  border: 0;
  background: transparent;
  color: #fffcff;
  font: inherit;
  font-size: 14px;
  text-align: left;
  cursor: pointer;

  span:first-of-type {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.mover-modal__icon {
  flex-shrink: 0;
  object-fit: contain;
  filter: brightness(0) saturate(100%) invert(67%) sepia(18%) saturate(742%) hue-rotate(7deg)
    brightness(95%) contrast(88%);

  &.is-folder {
    filter: none;
  }
}

.mover-modal__loading {
  font-size: 11px;
  color: rgba(255, 252, 255, 0.55);
}

.mover-modal__destino {
  margin: 12px 0 0;
  color: #fffcff;
  font-size: 13px;
  overflow-wrap: anywhere;

  span {
    color: #b08d57;
    font-weight: 700;
    margin-right: 4px;
  }
}
</style>
