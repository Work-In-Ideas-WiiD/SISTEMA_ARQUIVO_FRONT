<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useToast } from 'vue-toastification'
import { getAllSetores } from '@/services/http/setores'
import { getAllFuncoes, type IFuncao } from '@/services/http/funcoes'
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

interface Opcao {
  id: string
  nome: string
}

/** Nó da árvore: setor › função › pessoa, agrupamento › pessoa, ou pessoa solta. */
interface No {
  key: string
  tipo: TipoPermissao
  id: string
  nome: string
  icon: string
  filhos?: () => No[]
  /** Membros carregados sob demanda (agrupamentos). */
  lazy?: boolean
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
  /** Coberto porque um grupo acima está marcado. */
  via?: string
  /** Agrupamento onde o arquivo está guardado (acesso vem do local, não da permissão). */
  local?: Estado
  marcadosDentro?: number
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

type Secao = 'setores' | 'agrupamentos' | 'funcionarios'
const SECOES: { id: Secao; titulo: string }[] = [
  { id: 'setores', titulo: 'Setores e funções' },
  { id: 'agrupamentos', titulo: 'Agrupamentos' },
  { id: 'funcionarios', titulo: 'Pessoas' }
]
const TIPOS: TipoPermissao[] = ['setores', 'funcoes', 'agrupamentos', 'funcionarios']

const CHAVE_NO_ARQUIVO: Record<TipoPermissao, keyof IGetArquivosDataRes> = {
  setores: 'setores',
  funcoes: 'funcoes',
  agrupamentos: 'agrupamentos_acesso',
  funcionarios: 'funcionarios'
}

const setores = ref<Opcao[]>([])
const funcoes = ref<IFuncao[]>([])
const agrupamentos = ref<Opcao[]>([])
const funcionarios = ref<IFuncionario[]>([])
const membrosAgrupamento = ref<Record<string, Opcao[]>>({})
const carregandoAgrupamento = ref(new Set<string>())

const vazio = (): Record<TipoPermissao, Record<string, Estado>> => ({
  setores: {},
  funcoes: {},
  agrupamentos: {},
  funcionarios: {}
})
const estado = ref(vazio())
let estadoInicial = vazio()

const expanded = ref(new Set<string>())
const busca = ref('')
const loading = ref(false)
const saving = ref(false)

const titulo = computed(() =>
  props.arquivos.length === 1
    ? props.arquivos[0].descricao
    : `${props.arquivos.length} arquivos selecionados`
)

/** Caminho onde o arquivo está (ex.: "TI › Auxiliar TI"), só quando é um arquivo. */
const localDoArquivo = computed(() => {
  if (props.arquivos.length !== 1) return ''
  const a = props.arquivos[0]
  if (ehLivre(a)) {
    const empresa = a.empresas?.[0]?.empresa
    return `${empresa?.nome_empresa || empresa?.nome || 'raiz da empresa'} (toda a empresa)`
  }
  if (a.agrupamento_id) {
    return agrupamentos.value.find((g) => g.id === a.agrupamento_id)?.nome ?? ''
  }
  const setor = a.setores?.[0]?.nome
  const funcao = a.funcoes?.[0]?.nome
  return [setor, funcao].filter(Boolean).join(' › ')
})

/** Arquivo na raiz da empresa, sem nenhuma restrição: toda a empresa tem acesso. */
function ehLivre(a: IGetArquivosDataRes) {
  return (
    !a.agrupamento_id &&
    !a.setores?.length &&
    !a.funcoes?.length &&
    !a.funcionarios?.length &&
    !a.agrupamentos_acesso?.length
  )
}

/** Num arquivo livre, todos os setores e funções contam como marcados. */
const cobreEmpresa = (tipo: TipoPermissao) => tipo === 'setores' || tipo === 'funcoes'

function calcularEstado(tipo: TipoPermissao, ids: string[]): Record<string, Estado> {
  const total = props.arquivos.length
  const chave = CHAVE_NO_ARQUIVO[tipo]
  const out: Record<string, Estado> = {}
  for (const id of ids) {
    const qtd = props.arquivos.filter(
      (a) =>
        (cobreEmpresa(tipo) && ehLivre(a)) ||
        (a[chave] as Opcao[] | undefined)?.some((v) => v.id === id)
    ).length
    out[id] = qtd === 0 ? 'off' : qtd === total ? 'on' : 'mixed'
  }
  return out
}

function estadoLocal(agrupamentoId: string): Estado {
  const qtd = props.arquivos.filter((a) => a.agrupamento_id === agrupamentoId).length
  return qtd === 0 ? 'off' : qtd === props.arquivos.length ? 'on' : 'mixed'
}

const pessoa = (f: Opcao, prefixo: string): No => ({
  key: `${prefixo}:p:${f.id}`,
  tipo: 'funcionarios',
  id: f.id,
  nome: f.nome,
  icon: iconPessoa
})

function pessoasCom(campo: 'setores' | 'funcoes', id: string) {
  return funcionarios.value.filter((f) =>
    (f[campo] as Opcao[] | undefined)?.some((v) => v.id === id)
  )
}

function noFuncao(f: IFuncao, prefixo: string): No {
  const key = `${prefixo}:funcoes:${f.id}`
  return {
    key,
    tipo: 'funcoes',
    id: f.id,
    nome: f.nome,
    icon: iconFuncao,
    filhos: () => pessoasCom('funcoes', f.id).map((p) => pessoa(p, key))
  }
}

const arvore = computed<Record<Secao, No[]>>(() => {
  const setorNos: No[] = setores.value.map((s) => {
    const key = `setores:${s.id}`
    return {
      key,
      tipo: 'setores',
      id: s.id,
      nome: s.nome,
      icon: iconSetor,
      filhos: () => {
        const funcoesDoSetor = funcoes.value.filter((f) => f.setor_id === s.id)
        const idsFuncoes = new Set(funcoesDoSetor.map((f) => f.id))
        const semFuncao = pessoasCom('setores', s.id).filter(
          (p) => !p.funcoes?.some((f) => idsFuncoes.has(f.id))
        )
        return [
          ...funcoesDoSetor.map((f) => noFuncao(f, key)),
          ...semFuncao.map((p) => pessoa(p, key))
        ]
      }
    }
  })
  const orfas = funcoes.value.filter((f) => !f.setor_id || !setores.value.some((s) => s.id === f.setor_id))

  return {
    setores: [...setorNos, ...orfas.map((f) => noFuncao(f, 'sem-setor'))],
    agrupamentos: agrupamentos.value.map((g) => {
      const key = `agrupamentos:${g.id}`
      return {
        key,
        tipo: 'agrupamentos' as const,
        id: g.id,
        nome: g.nome,
        icon: iconAgrupamento,
        lazy: true,
        filhos: () => (membrosAgrupamento.value[g.id] || []).map((p) => pessoa(p, key))
      }
    }),
    funcionarios: funcionarios.value.map((p) => pessoa(p, 'pessoas'))
  }
})

function marcado(no: No) {
  return (estado.value[no.tipo][no.id] || 'off') !== 'off'
}

/** Quantos itens marcados existem abaixo do nó (para mostrar com a lista fechada). */
function contarMarcados(nos: No[]): number {
  let total = 0
  for (const no of nos) {
    if (marcado(no)) total++
    if (no.filhos) total += contarMarcados(no.filhos())
  }
  return total
}

/** Nós com função marcada dentro abrem sozinhos; listas de pessoas ficam fechadas. */
function temGrupoMarcadoDentro(no: No): boolean {
  return (no.filhos?.() || []).some(
    (f) => f.tipo !== 'funcionarios' && (marcado(f) || temGrupoMarcadoDentro(f))
  )
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
  if (!linha.tipo || linha.via || linha.local === 'on') return
  const mapa = estado.value[linha.tipo]
  mapa[linha.id] = mapa[linha.id] === 'on' ? 'off' : 'on'
}

function combina(nome: string) {
  const q = busca.value.trim().toLowerCase()
  return !q || nome.toLowerCase().includes(q)
}

function algumCombina(no: No): boolean {
  return combina(no.nome) || (no.filhos?.() || []).some(algumCombina)
}

function montar(nos: No[], depth: number, via: string | undefined, out: Linha[]) {
  const buscando = Boolean(busca.value.trim())
  for (const no of nos) {
    if (buscando && !algumCombina(no)) continue
    const filhos = no.filhos?.() || []
    const ehGrupo = Boolean(no.filhos)
    const aberto =
      expanded.value.has(no.key) ||
      (buscando && !combina(no.nome) && filhos.some(algumCombina))
    const local = no.tipo === 'agrupamentos' ? estadoLocal(no.id) : undefined

    out.push({
      key: no.key,
      kind: ehGrupo ? 'grupo' : 'pessoa',
      tipo: no.tipo,
      id: no.id,
      nome: no.nome,
      depth,
      icon: no.icon,
      expandable: ehGrupo,
      expanded: aberto,
      loading: no.lazy && carregandoAgrupamento.value.has(no.id),
      via: no.tipo === 'funcionarios' ? via : undefined,
      local,
      marcadosDentro: ehGrupo && !aberto ? contarMarcados(filhos) : 0
    })

    if (!ehGrupo || !aberto) continue
    const cobre = estadoDe(out[out.length - 1]) === 'on' ? no.nome : via
    const visiveis = buscando && !combina(no.nome) ? filhos.filter(algumCombina) : filhos
    if (!visiveis.length && !(no.lazy && carregandoAgrupamento.value.has(no.id))) {
      out.push({
        key: `${no.key}:vazio`,
        kind: 'pessoa',
        tipo: null,
        id: '',
        nome: '',
        depth: depth + 1,
        expandable: false,
        expanded: false,
        vazio: no.tipo === 'setores' ? 'Nenhuma função ou pessoa' : 'Nenhuma pessoa'
      })
      continue
    }
    montar(visiveis, depth + 1, cobre, out)
  }
}

const linhas = computed<Linha[]>(() => {
  const buscando = Boolean(busca.value.trim())
  const out: Linha[] = []
  for (const secao of SECOES) {
    const nos = arvore.value[secao.id]
    const secKey = `sec:${secao.id}`
    const aberta = buscando || expanded.value.has(secKey)
    const inicio = out.length
    out.push({
      key: secKey,
      kind: 'secao',
      tipo: null,
      id: secao.id,
      nome: secao.titulo,
      depth: 0,
      expandable: true,
      expanded: aberta,
      marcadosDentro: aberta ? 0 : contarMarcados(nos)
    })
    if (!aberta) continue
    const antes = out.length
    montar(nos, 1, undefined, out)
    if (out.length === antes) {
      if (buscando) {
        out.splice(inicio, 1)
        continue
      }
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
  }
  return out
})

function estadoDe(linha: Linha): Estado {
  if (!linha.tipo) return 'off'
  if (linha.via || linha.local === 'on') return 'on'
  const atual = estado.value[linha.tipo][linha.id] || 'off'
  if (atual === 'off' && linha.local === 'mixed') return 'mixed'
  return atual
}

const totalMarcados = computed(() =>
  TIPOS.reduce(
    (acc, t) => acc + Object.values(estado.value[t]).filter((v) => v !== 'off').length,
    0
  )
)

function expandirCaminhos() {
  const abertos = new Set<string>(['sec:setores', 'sec:agrupamentos'])
  if (props.arquivos.every(ehLivre)) {
    expanded.value = abertos
    return
  }
  const visitar = (nos: No[]) => {
    for (const no of nos) {
      if (!no.filhos || no.tipo === 'funcoes') continue
      if (temGrupoMarcadoDentro(no)) abertos.add(no.key)
      visitar(no.filhos())
    }
  }
  visitar(arvore.value.setores)
  expanded.value = abertos
}

async function carregar() {
  loading.value = true
  busca.value = ''
  membrosAgrupamento.value = {}
  try {
    const [{ data: s }, { data: f }, { data: pessoas }, { data: agrup }] = await Promise.all([
      getAllSetores(props.empresaId),
      getAllFuncoes(props.empresaId),
      getAllFuncionarios(props.empresaId),
      getAllAgrupamentos(props.empresaId)
    ])
    funcionarios.value = pessoas || []
    setores.value = (s || []).map(({ id, nome }) => ({ id, nome }))
    funcoes.value = f || []
    agrupamentos.value = (agrup || []).map(({ id, nome }) => ({ id, nome }))

    const ids: Record<TipoPermissao, string[]> = {
      setores: setores.value.map((o) => o.id),
      funcoes: funcoes.value.map((o) => o.id),
      agrupamentos: agrupamentos.value.map((o) => o.id),
      funcionarios: funcionarios.value.map((o) => o.id)
    }
    const novo = vazio()
    for (const tipo of TIPOS) novo[tipo] = calcularEstado(tipo, ids[tipo])
    estado.value = novo
    estadoInicial = JSON.parse(JSON.stringify(novo))
    expandirCaminhos()
  } catch (error) {
    toast.error(getApiErrorMessage(error, 'Erro ao carregar permissões'))
  } finally {
    loading.value = false
  }
}

async function salvar() {
  const alteracoes: IAlteracoesPermissao = {}
  /** Arquivo livre que passa a ter restrição recebe a lista completa do que ficou marcado. */
  const paraLivres: IAlteracoesPermissao = {}
  let mudou = false
  for (const tipo of TIPOS) {
    const atual = estado.value[tipo]
    const inicial = estadoInicial[tipo]
    const ids = Object.keys(atual).filter((id) => atual[id] !== inicial[id])
    alteracoes[`${tipo}_adicionar`] = ids.filter((id) => atual[id] === 'on')
    alteracoes[`${tipo}_remover`] = ids.filter((id) => atual[id] === 'off')
    paraLivres[`${tipo}_adicionar`] = Object.keys(atual).filter(
      (id) => atual[id] === 'on' || (cobreEmpresa(tipo) && atual[id] === 'mixed')
    )
    if (ids.length) mudou = true
  }
  if (!mudou) {
    emit('close')
    return
  }

  const livres = props.arquivos.filter(ehLivre).map((a) => a.id)
  const restritos = props.arquivos.filter((a) => !ehLivre(a)).map((a) => a.id)

  saving.value = true
  try {
    await Promise.all([
      restritos.length && editarPermissoesArquivos(restritos, props.empresaId, alteracoes),
      livres.length && editarPermissoesArquivos(livres, props.empresaId, paraLivres)
    ])
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
        <p v-if="localDoArquivo" class="perm-modal__local">
          Está em: <strong>{{ localDoArquivo }}</strong>
        </p>
        <p class="perm-modal__hint">
          Marque quem pode ver {{ arquivos.length === 1 ? 'o arquivo' : 'os arquivos' }}. Abra um
          setor para ver as funções; abra uma função ou agrupamento para ver as pessoas.
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
              :class="[`perm-modal__row--${linha.kind}`, { 'is-via': linha.via || linha.local === 'on' }]"
              :style="{ paddingLeft: `${Math.max(linha.depth - 1, 0) * 20}px` }"
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
                  <small v-if="linha.marcadosDentro" class="perm-modal__badge">
                    {{ linha.marcadosDentro }} com acesso
                  </small>
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
                    :disabled="Boolean(linha.via) || linha.local === 'on'"
                    @change="alternar(linha)"
                  />
                  <img class="perm-modal__icon" :src="linha.icon" width="16" height="16" alt="" />
                  <span class="perm-modal__nome">{{ linha.nome }}</span>
                  <small v-if="linha.loading">carregando…</small>
                  <small v-else-if="linha.local === 'on'">local do arquivo</small>
                  <small v-else-if="linha.via">via {{ linha.via }}</small>
                  <small v-else-if="estadoDe(linha) === 'mixed'">parcial</small>
                  <small v-if="linha.marcadosDentro" class="perm-modal__badge">
                    {{ linha.marcadosDentro }} marcado{{ linha.marcadosDentro > 1 ? 's' : '' }}
                  </small>
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

.perm-modal__local {
  margin: 0 0 8px;
  color: rgba(255, 252, 255, 0.75);
  font-size: 12px;

  strong {
    color: #fffcff;
    font-weight: 600;
  }
}

.perm-modal__badge {
  margin-left: auto;
  padding: 2px 8px;
  border-radius: 999px;
  background: rgba(176, 141, 87, 0.18);
  color: #d9b77e !important;
  font-size: 11px;
  font-weight: 600;
  text-transform: none;
  letter-spacing: 0;
  white-space: nowrap;
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
