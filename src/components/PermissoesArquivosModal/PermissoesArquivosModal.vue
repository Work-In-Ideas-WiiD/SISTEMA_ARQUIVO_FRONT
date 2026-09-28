<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useToast } from 'vue-toastification'
import { getAllSetores } from '@/services/http/setores'
import { getAllFuncoes } from '@/services/http/funcoes'
import { getAllFuncionarios, type IFuncionario } from '@/services/http/funcionarios'
import { getAgrupamento, getAllAgrupamentos } from '@/services/http/agrupamentos'
import {
  editarPermissoesArquivos,
  type IAlteracoesPermissao,
  type IGetArquivosDataRes,
  type TipoPermissao
} from '@/services/http/arquivos'
import { getApiErrorMessage } from '@/utils/apiError'
import iconChevronDown from '@/assets/imgs/administradores/icon-chevron-down.svg'
import iconSetor from '@/assets/imgs/dashboard/icon-menu-setores.svg'
import iconFuncao from '@/assets/imgs/dashboard/icon-menu-funcoes.svg'
import iconAgrupamento from '@/assets/imgs/dashboard/icon-menu-agrupamentos.svg'
import iconPessoa from '@/assets/imgs/dashboard/icon-menu-funcionarios.svg'

type Estado = 'on' | 'off' | 'mixed'
type TipoGrupo = Exclude<TipoPermissao, 'funcionarios'>

interface Opcao {
  id: string
  nome: string
}

interface Linha {
  key: string
  kind: 'secao' | 'grupo' | 'pessoa'
  tipo: TipoPermissao | null
  id: string
  nome: string
  depth: number
  icon?: string
  expandable: boolean
  expanded: boolean
  loading?: boolean
  /** Pessoa já coberta porque o grupo acima está marcado. */
  viaGrupo?: boolean
  vazio?: string
}

const props = defineProps<{
  open: boolean
  empresaId: string
  arquivos: IGetArquivosDataRes[]
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'saved'): void
}>()

const toast = useToast()

const SECOES: { tipo: TipoPermissao; titulo: string; icon: string }[] = [
  { tipo: 'setores', titulo: 'Setores', icon: iconSetor },
  { tipo: 'funcoes', titulo: 'Funções', icon: iconFuncao },
  { tipo: 'agrupamentos', titulo: 'Agrupamentos', icon: iconAgrupamento },
  { tipo: 'funcionarios', titulo: 'Pessoas', icon: iconPessoa }
]

const CHAVE_NO_ARQUIVO: Record<TipoPermissao, keyof IGetArquivosDataRes> = {
  setores: 'setores',
  funcoes: 'funcoes',
  agrupamentos: 'agrupamentos_acesso',
  funcionarios: 'funcionarios'
}

const opcoes = ref<Record<TipoPermissao, Opcao[]>>({
  setores: [],
  funcoes: [],
  agrupamentos: [],
  funcionarios: []
})
const funcionarios = ref<IFuncionario[]>([])
const membrosAgrupamento = ref<Record<string, Opcao[]>>({})
const carregandoAgrupamento = ref(new Set<string>())

const estado = ref<Record<TipoPermissao, Record<string, Estado>>>({
  setores: {},
  funcoes: {},
  agrupamentos: {},
  funcionarios: {}
})
let estadoInicial: Record<TipoPermissao, Record<string, Estado>> = {
  setores: {},
  funcoes: {},
  agrupamentos: {},
  funcionarios: {}
}

const expanded = ref(new Set<string>(SECOES.map((s) => `sec:${s.tipo}`)))
const busca = ref('')
const loading = ref(false)
const saving = ref(false)

const titulo = computed(() =>
  props.arquivos.length === 1
    ? props.arquivos[0].descricao
    : `${props.arquivos.length} arquivos selecionados`
)

function calcularEstado(tipo: TipoPermissao, ids: string[]): Record<string, Estado> {
  const total = props.arquivos.length
  const chave = CHAVE_NO_ARQUIVO[tipo]
  const out: Record<string, Estado> = {}
  for (const id of ids) {
    const qtd = props.arquivos.filter((a) =>
      (a[chave] as Opcao[] | undefined)?.some((v) => v.id === id)
    ).length
    out[id] = qtd === 0 ? 'off' : qtd === total ? 'on' : 'mixed'
  }
  return out
}

function pessoasDoGrupo(tipo: TipoGrupo, id: string): Opcao[] {
  if (tipo === 'agrupamentos') return membrosAgrupamento.value[id] || []
  const campo = tipo === 'setores' ? 'setores' : 'funcoes'
  return funcionarios.value
    .filter((f) => (f[campo] as Opcao[] | undefined)?.some((v) => v.id === id))
    .map(({ id: fid, nome }) => ({ id: fid, nome }))
}

async function carregarMembros(agrupamentoId: string) {
  if (membrosAgrupamento.value[agrupamentoId] || carregandoAgrupamento.value.has(agrupamentoId)) {
    return
  }
  carregandoAgrupamento.value = new Set(carregandoAgrupamento.value).add(agrupamentoId)
  try {
    const { data } = await getAgrupamento(agrupamentoId)
    membrosAgrupamento.value = {
      ...membrosAgrupamento.value,
      [agrupamentoId]: (data.todos_funcionarios || []).map(({ id, nome }) => ({ id, nome }))
    }
  } catch (error) {
    toast.error(getApiErrorMessage(error, 'Erro ao carregar membros do agrupamento'))
  } finally {
    const next = new Set(carregandoAgrupamento.value)
    next.delete(agrupamentoId)
    carregandoAgrupamento.value = next
  }
}

function toggleExpand(linha: Linha) {
  const next = new Set(expanded.value)
  if (next.has(linha.key)) {
    next.delete(linha.key)
  } else {
    next.add(linha.key)
    if (linha.tipo === 'agrupamentos' && linha.kind === 'grupo') void carregarMembros(linha.id)
  }
  expanded.value = next
}

function alternar(linha: Linha) {
  if (!linha.tipo || linha.viaGrupo) return
  const mapa = estado.value[linha.tipo]
  mapa[linha.id] = mapa[linha.id] === 'on' ? 'off' : 'on'
}

function combina(nome: string) {
  const q = busca.value.trim().toLowerCase()
  return !q || nome.toLowerCase().includes(q)
}

const linhas = computed<Linha[]>(() => {
  const buscando = Boolean(busca.value.trim())
  const out: Linha[] = []

  for (const secao of SECOES) {
    const secKey = `sec:${secao.tipo}`
    const secAberta = buscando || expanded.value.has(secKey)
    const filhos: Linha[] = []

    for (const item of opcoes.value[secao.tipo]) {
      if (secao.tipo === 'funcionarios') {
        if (!combina(item.nome)) continue
        filhos.push({
          key: `p:${item.id}`,
          kind: 'pessoa',
          tipo: 'funcionarios',
          id: item.id,
          nome: item.nome,
          depth: 1,
          icon: iconPessoa,
          expandable: false,
          expanded: false
        })
        continue
      }

      const tipo = secao.tipo as TipoGrupo
      const grupoKey = `${tipo}:${item.id}`
      const membros = pessoasDoGrupo(tipo, item.id)
      const membrosVisiveis = membros.filter((m) => combina(m.nome))
      const grupoCombina = combina(item.nome)
      if (buscando && !grupoCombina && !membrosVisiveis.length) continue

      const aberto =
        expanded.value.has(grupoKey) || (buscando && !grupoCombina && membrosVisiveis.length > 0)
      filhos.push({
        key: grupoKey,
        kind: 'grupo',
        tipo,
        id: item.id,
        nome: item.nome,
        depth: 1,
        icon: secao.icon,
        expandable: true,
        expanded: aberto,
        loading: carregandoAgrupamento.value.has(item.id)
      })

      if (!aberto) continue
      const grupoMarcado = estado.value[tipo][item.id] === 'on'
      const lista = buscando && !grupoCombina ? membrosVisiveis : membros
      for (const m of lista) {
        filhos.push({
          key: `${grupoKey}:p:${m.id}`,
          kind: 'pessoa',
          tipo: 'funcionarios',
          id: m.id,
          nome: m.nome,
          depth: 2,
          icon: iconPessoa,
          expandable: false,
          expanded: false,
          viaGrupo: grupoMarcado
        })
      }
      const carregando = carregandoAgrupamento.value.has(item.id)
      if (!lista.length && !carregando) {
        filhos.push({
          key: `${grupoKey}:vazio`,
          kind: 'pessoa',
          tipo: null,
          id: '',
          nome: '',
          depth: 2,
          expandable: false,
          expanded: false,
          vazio: 'Nenhuma pessoa'
        })
      }
    }

    if (buscando && !filhos.length) continue
    out.push({
      key: secKey,
      kind: 'secao',
      tipo: null,
      id: secao.tipo,
      nome: secao.titulo,
      depth: 0,
      expandable: true,
      expanded: secAberta
    })
    if (!secAberta) continue
    if (!filhos.length) {
      out.push({
        key: `${secKey}:vazio`,
        kind: 'pessoa',
        tipo: null,
        id: '',
        nome: '',
        depth: 1,
        expandable: false,
        expanded: false,
        vazio: 'Nenhum item cadastrado'
      })
    }
    out.push(...filhos)
  }
  return out
})

function estadoDe(linha: Linha): Estado {
  if (!linha.tipo) return 'off'
  if (linha.viaGrupo) return 'on'
  return estado.value[linha.tipo][linha.id] || 'off'
}

const totalMarcados = computed(() =>
  SECOES.reduce(
    (acc, s) => acc + Object.values(estado.value[s.tipo]).filter((v) => v === 'on').length,
    0
  )
)

async function carregar() {
  loading.value = true
  busca.value = ''
  membrosAgrupamento.value = {}
  expanded.value = new Set(SECOES.map((s) => `sec:${s.tipo}`))
  try {
    const [{ data: s }, { data: f }, { data: pessoas }, { data: agrup }] = await Promise.all([
      getAllSetores(props.empresaId),
      getAllFuncoes(props.empresaId),
      getAllFuncionarios(props.empresaId),
      getAllAgrupamentos(props.empresaId)
    ])
    funcionarios.value = pessoas || []
    opcoes.value = {
      setores: (s || []).map(({ id, nome }) => ({ id, nome })),
      funcoes: (f || []).map(({ id, nome }) => ({ id, nome })),
      agrupamentos: (agrup || []).map(({ id, nome }) => ({ id, nome })),
      funcionarios: funcionarios.value.map(({ id, nome }) => ({ id, nome }))
    }
    const novo = {} as Record<TipoPermissao, Record<string, Estado>>
    for (const secao of SECOES) {
      novo[secao.tipo] = calcularEstado(
        secao.tipo,
        opcoes.value[secao.tipo].map((o) => o.id)
      )
    }
    estado.value = novo
    estadoInicial = JSON.parse(JSON.stringify(novo))
  } catch (error) {
    toast.error(getApiErrorMessage(error, 'Erro ao carregar permissões'))
  } finally {
    loading.value = false
  }
}

async function salvar() {
  const alteracoes: IAlteracoesPermissao = {}
  let mudou = false
  for (const { tipo } of SECOES) {
    const atual = estado.value[tipo]
    const inicial = estadoInicial[tipo]
    const ids = Object.keys(atual).filter((id) => atual[id] !== inicial[id])
    alteracoes[`${tipo}_adicionar`] = ids.filter((id) => atual[id] === 'on')
    alteracoes[`${tipo}_remover`] = ids.filter((id) => atual[id] === 'off')
    if (ids.length) mudou = true
  }
  if (!mudou) {
    emit('close')
    return
  }

  saving.value = true
  try {
    await editarPermissoesArquivos(
      props.arquivos.map((a) => a.id),
      props.empresaId,
      alteracoes
    )
    toast.success('Permissões atualizadas')
    emit('saved')
    emit('close')
  } catch (error) {
    toast.error(getApiErrorMessage(error, 'Erro ao salvar permissões'))
  } finally {
    saving.value = false
  }
}

watch(
  () => props.open,
  (open) => {
    if (typeof document !== 'undefined') document.body.style.overflow = open ? 'hidden' : ''
    if (open) void carregar()
  },
  { immediate: true }
)
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="night-confirm" @click.self="emit('close')">
      <div class="night-confirm__modal perm-modal" role="dialog" aria-modal="true">
        <h3 class="night-confirm__title">Editar permissões</h3>
        <p class="perm-modal__sub">{{ titulo }}</p>
        <p class="perm-modal__hint">
          Marque quem pode ver {{ arquivos.length === 1 ? 'o arquivo' : 'os arquivos' }}. Clique na
          seta para ver as pessoas de cada setor, função ou agrupamento.
          <template v-if="arquivos.length > 1">
            Itens “parcial” ficam como estão em cada arquivo, a menos que você os altere.
          </template>
        </p>

        <input
          v-model="busca"
          class="perm-modal__search"
          type="search"
          placeholder="Buscar setor, função, agrupamento ou pessoa"
          :disabled="loading"
        />

        <div class="perm-modal__body">
          <p v-if="loading" class="perm-modal__empty">Carregando…</p>
          <ul v-else class="perm-modal__tree" role="tree">
            <li
              v-for="linha in linhas"
              :key="linha.key"
              class="perm-modal__row"
              :class="[`perm-modal__row--${linha.kind}`, { 'is-via': linha.viaGrupo }]"
              :style="{ paddingLeft: `${linha.depth * 20}px` }"
              role="treeitem"
              :aria-expanded="linha.expandable ? linha.expanded : undefined"
            >
              <p v-if="linha.vazio" class="perm-modal__empty perm-modal__empty--inline">
                {{ linha.vazio }}
              </p>

              <template v-else-if="linha.kind === 'secao'">
                <button type="button" class="perm-modal__section" @click="toggleExpand(linha)">
                  <img
                    class="perm-modal__chevron"
                    :class="{ 'is-open': linha.expanded }"
                    :src="iconChevronDown"
                    width="12"
                    height="12"
                    alt=""
                  />
                  <span>{{ linha.nome }}</span>
                </button>
              </template>

              <template v-else>
                <button
                  v-if="linha.expandable"
                  type="button"
                  class="perm-modal__toggle"
                  :aria-label="linha.expanded ? 'Recolher' : 'Expandir'"
                  @click="toggleExpand(linha)"
                >
                  <img
                    class="perm-modal__chevron"
                    :class="{ 'is-open': linha.expanded }"
                    :src="iconChevronDown"
                    width="12"
                    height="12"
                    alt=""
                  />
                </button>
                <span v-else class="perm-modal__toggle-spacer" />

                <label class="perm-modal__item">
                  <input
                    type="checkbox"
                    :checked="estadoDe(linha) === 'on'"
                    :indeterminate="estadoDe(linha) === 'mixed'"
                    :disabled="linha.viaGrupo"
                    @change="alternar(linha)"
                  />
                  <img class="perm-modal__icon" :src="linha.icon" width="16" height="16" alt="" />
                  <span class="perm-modal__nome">{{ linha.nome }}</span>
                  <small v-if="linha.loading">carregando…</small>
                  <small v-else-if="linha.viaGrupo">via grupo</small>
                  <small v-else-if="estadoDe(linha) === 'mixed'">parcial</small>
                </label>
              </template>
            </li>
          </ul>
        </div>

        <p class="perm-modal__count">
          {{ totalMarcados }} {{ totalMarcados === 1 ? 'item marcado' : 'itens marcados' }}
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
            :disabled="saving || loading"
            @click="salvar"
          >
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
  margin-top: 12px;
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

.perm-modal {
  width: min(520px, 100%);
  max-height: min(90vh, 760px);
  display: flex;
  flex-direction: column;
  font-family: var(--night-font, 'Inter', sans-serif);
}

.perm-modal__sub {
  margin: 4px 0 8px;
  color: #b08d57;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  overflow-wrap: anywhere;
}

.perm-modal__hint {
  margin: 0 0 10px;
  color: #f7f7f7;
  opacity: 0.7;
  font-size: 12px;
}

.perm-modal__search {
  height: 38px;
  margin-bottom: 10px;
  padding: 0 12px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(0, 0, 0, 0.25);
  color: #fffcff;
  font-size: 13px;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #b08d57;
  }
}

.perm-modal__body {
  flex: 1 1 auto;
  min-height: 200px;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 8px 10px;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.08);
  scrollbar-width: thin;
  scrollbar-color: rgba(176, 141, 87, 0.45) transparent;
}

.perm-modal__tree {
  list-style: none;
  margin: 0;
  padding: 0;
}

.perm-modal__row {
  display: flex;
  align-items: center;
  gap: 2px;
  min-height: 32px;

  &--secao {
    margin-top: 8px;

    &:first-child {
      margin-top: 0;
    }
  }

  &.is-via {
    opacity: 0.7;
  }
}

.perm-modal__section {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 6px 4px;
  border: 0;
  background: transparent;
  color: #b08d57;
  font: inherit;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  cursor: pointer;
  text-align: left;
}

.perm-modal__toggle,
.perm-modal__toggle-spacer {
  flex: 0 0 24px;
  width: 24px;
  height: 24px;
}

.perm-modal__toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: 6px;
  background: transparent;
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
  }
}

.perm-modal__chevron {
  filter: brightness(0) invert(1);
  opacity: 0.7;
  transform: rotate(-90deg);
  transition: transform 0.15s ease;

  &.is-open {
    transform: rotate(0deg);
  }
}

.perm-modal__section .perm-modal__chevron {
  filter: brightness(0) saturate(100%) invert(67%) sepia(18%) saturate(742%) hue-rotate(7deg)
    brightness(95%) contrast(88%);
  opacity: 1;
}

.perm-modal__item {
  flex: 1 1 auto;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 5px 6px;
  border-radius: 8px;
  color: #fffcff;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }

  input {
    flex-shrink: 0;
    width: 16px;
    height: 16px;
    margin: 0;
    accent-color: #b08d57;
    cursor: pointer;

    &:disabled {
      cursor: default;
    }
  }

  small {
    flex-shrink: 0;
    color: rgba(255, 252, 255, 0.55);
    font-size: 11px;
  }
}

.perm-modal__row--pessoa .perm-modal__item {
  font-size: 13px;
}

.perm-modal__nome {
  flex: 1 1 auto;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.perm-modal__icon {
  flex-shrink: 0;
  object-fit: contain;
  filter: brightness(0) saturate(100%) invert(67%) sepia(18%) saturate(742%) hue-rotate(7deg)
    brightness(95%) contrast(88%);
}

.perm-modal__empty {
  margin: 4px 0;
  color: #f7f7f7;
  opacity: 0.7;
  font-size: 13px;

  &--inline {
    margin: 0 0 0 30px;
    font-size: 12px;
    opacity: 0.5;
  }
}

.perm-modal__count {
  margin: 8px 0 0;
  color: rgba(255, 252, 255, 0.6);
  font-size: 12px;
}
</style>
