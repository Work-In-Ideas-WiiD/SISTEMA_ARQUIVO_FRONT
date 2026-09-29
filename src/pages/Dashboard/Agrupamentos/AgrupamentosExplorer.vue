<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useAuthStore } from '@/stores/auth'
import {
  deleteAgrupamento,
  getAgrupamento,
  getAllAgrupamentos,
  patchAgrupamento,
  postAgrupamento,
  type IAgrupamento
} from '@/services/http/agrupamentos'
import { getAllFuncionarios, type IFuncionario } from '@/services/http/funcionarios'
import { getAllEmpresas } from '@/services/http/empresas'
import { getPastas, postPasta, type IPasta } from '@/services/http/pastas'
import {
  getArquivos,
  postArquivoOuSubstituir,
  type IDestinoArquivo,
  type IGetArquivosDataRes
} from '@/services/http/arquivos'
import {
  getAllCategoriasArquivo,
  type ICategoriaArquivo
} from '@/services/http/categorias-arquivo'
import { getApiErrorMessage } from '@/utils/apiError'
import { openArquivoRegistrado } from '@/utils/openFile'
import { usePageFileDrop } from '@/composables/usePageFileDrop'
import { useNightConfirm } from '@/composables/useNightConfirm'
import { opcoesSubstituirArquivo } from '@/utils/substituirArquivo'
import { useDropdownPlacement } from '@/composables/useDropdownPlacement'
import UploadDropOverlay from '@/components/UploadDropOverlay/UploadDropOverlay.vue'
import NightConfirmModal from '@/components/NightConfirmModal/NightConfirmModal.vue'
import ArquivoUploadModal from '@/components/ArquivoUploadModal/ArquivoUploadModal.vue'
import ArquivoContextMenu from '@/components/ArquivoContextMenu/ArquivoContextMenu.vue'
import MoverArquivosModal from '@/components/MoverArquivosModal/MoverArquivosModal.vue'
import PermissoesArquivosModal from '@/components/PermissoesArquivosModal/PermissoesArquivosModal.vue'
import CompartilharArquivoModal from '@/components/CompartilharArquivoModal/CompartilharArquivoModal.vue'
import CompartilharMultiplosModal from '@/components/CompartilharMultiplosModal/CompartilharMultiplosModal.vue'
import LogAcessosArquivoModal from '@/components/LogAcessosArquivoModal/LogAcessosArquivoModal.vue'
import EditarCategoriaDataModal from '@/components/EditarCategoriaDataModal/EditarCategoriaDataModal.vue'
import { useArquivoInteractions } from '@/composables/useArquivoInteractions'
import {
  MESES,
  yearOptions,
  type ArquivoUploadPayload
} from '@/components/ArquivoUploadModal/uploadMeta'
import iconChevronLeft from '@/assets/imgs/administradores/icon-chevron-left.svg'
import iconChevronDown from '@/assets/imgs/administradores/icon-chevron-down.svg'
import iconNewFolder from '@/assets/imgs/administradores/icon-new-folder.svg'
import iconEdit from '@/assets/imgs/administradores/icon-edit.svg'
import iconDelete from '@/assets/imgs/agrupamentos/delete.svg'
import iconUpload from '@/assets/imgs/arquivos/Upload.svg'
import iconFolder from '@/assets/imgs/arquivos/folder.svg'
import iconFiles from '@/assets/imgs/dashboard/icon-menu-files.svg'
import iconAgrupamento from '@/assets/imgs/dashboard/icon-menu-agrupamentos.svg'
import MembrosTreeNode from './MembrosTreeNode.vue'
import EditarMembrosModal from './EditarMembrosModal.vue'
import { allNodeKeys, buildMembrosTree } from './membrosTree'

type FilterKey = 'empresa' | 'categoria' | 'mes' | 'ano' | 'grupoEmpresa'

const router = useRouter()
const toast = useToast()
const authStore = useAuthStore()
const isAdmin = computed(() => authStore.userRole === 'administrador')
const {
  open: confirmOpen,
  options: confirmOptions,
  askConfirm,
  onConfirm,
  onCancel
} = useNightConfirm()

const empresas = ref<{ id: string; nome: string }[]>([])
const filterEmpresaId = ref('')

const agrupamentos = ref<IAgrupamento[]>([])
const loadingGrupos = ref(true)
const selected = ref<IAgrupamento | null>(null)

const membrosIds = ref<string[]>([])
const funcionariosEmpresa = ref<IFuncionario[]>([])
const membrosExpanded = ref(new Set<string>())
const loadingMembros = ref(false)

const pastaStack = ref<{ id: string; nome: string }[]>([])
const pastas = ref<IPasta[]>([])
const arquivos = ref<IGetArquivosDataRes[]>([])
const categorias = ref<ICategoriaArquivo[]>([])
const filterCategoriaId = ref('')
const filterMes = ref<number | ''>('')
const filterAno = ref<number | ''>('')
const anosFiltro = yearOptions()
const selectOpen = ref<FilterKey | null>(null)

const saving = ref(false)
const grupoModalOpen = ref(false)
const grupoEditingId = ref<string | null>(null)
const grupoFormNome = ref('')
const grupoFormDescricao = ref('')
const grupoFormEmpresaId = ref('')
const pastaModalOpen = ref(false)
const pastaNome = ref('')
const uploadOpen = ref(false)
const uploadInitialFile = ref<File | null>(null)
const membrosModalOpen = ref(false)

const currentPastaId = computed(() => pastaStack.value[pastaStack.value.length - 1]?.id || null)

function nomeEmpresa(grupo: IAgrupamento | null): string {
  if (!grupo) return 'Empresa'
  if (grupo.empresa) return (grupo.empresa.nome_empresa || grupo.empresa.nome || 'Empresa').trim()
  if (authStore.me?.id === grupo.empresa_id) {
    return (authStore.me.nome_empresa || authStore.me.nome || 'Empresa').trim()
  }
  return empresas.value.find((e) => e.id === grupo.empresa_id)?.nome || 'Empresa'
}

const empresaNome = computed(() => nomeEmpresa(selected.value))

const membrosTree = computed(() => {
  const ids = new Set(membrosIds.value)
  return buildMembrosTree(
    empresaNome.value,
    funcionariosEmpresa.value.filter((f) => ids.has(f.id))
  )
})

const arquivosTitle = computed(() => {
  const pasta = pastaStack.value[pastaStack.value.length - 1]
  return `Arquivos de ${pasta?.nome || selected.value?.nome || ''}`
})

const acessoUploadLabel = computed(
  () => `${empresaNome.value} › Agrupamento ${selected.value?.nome || ''}`
)

const filterEmpresaLabel = computed(
  () => empresas.value.find((e) => e.id === filterEmpresaId.value)?.nome || 'Empresa'
)
const grupoFormEmpresaLabel = computed(
  () => empresas.value.find((e) => e.id === grupoFormEmpresaId.value)?.nome || 'Selecione a empresa'
)
const filterCategoriaLabel = computed(
  () => categorias.value.find((c) => c.id === filterCategoriaId.value)?.nome || 'Categoria'
)
const filterMesLabel = computed(
  () => MESES.find((m) => m.value === filterMes.value)?.label || 'Mês'
)
const filterAnoLabel = computed(() => (filterAno.value ? String(filterAno.value) : 'Ano'))

const {
  place: placeMenu,
  menuClass: filterMenuClass,
  menuStyle: filterMenuStyle
} = useDropdownPlacement('.agrup-explorer')

function toggleSelect(key: FilterKey, event?: MouseEvent) {
  selectOpen.value = selectOpen.value === key ? null : key
  if (selectOpen.value && event) placeMenu(event.currentTarget)
}

function onDocClick(event: MouseEvent) {
  if (!(event.target as HTMLElement | null)?.closest('.night-select')) selectOpen.value = null
}

async function loadEmpresas() {
  if (!isAdmin.value) return
  try {
    const { data } = await getAllEmpresas()
    empresas.value = (data.data || []).map(
      (e: { id: string; nome?: string; nome_empresa?: string }) => ({
        id: e.id,
        nome: (e.nome_empresa || e.nome || 'Empresa').trim()
      })
    )
  } catch {
    empresas.value = []
  }
}

async function loadAgrupamentos() {
  loadingGrupos.value = true
  try {
    const { data } = await getAllAgrupamentos(
      isAdmin.value ? filterEmpresaId.value || undefined : undefined
    )
    agrupamentos.value = data || []
    if (selected.value) {
      const atual = agrupamentos.value.find((g) => g.id === selected.value?.id)
      if (atual) selected.value = atual
      else clearSelection()
    }
  } catch (error) {
    toast.error(getApiErrorMessage(error, 'Erro ao carregar agrupamentos'))
    agrupamentos.value = []
  } finally {
    loadingGrupos.value = false
  }
}

async function loadMembros() {
  const grupo = selected.value
  if (!grupo) return
  loadingMembros.value = true
  try {
    const [{ data: detalhe }, { data: funcionarios }] = await Promise.all([
      getAgrupamento(grupo.id),
      getAllFuncionarios(grupo.empresa_id)
    ])
    if (selected.value?.id !== grupo.id) return
    membrosIds.value = (detalhe.todos_funcionarios || []).map((f) => f.id)
    funcionariosEmpresa.value = funcionarios || []
    membrosExpanded.value = new Set(allNodeKeys(membrosTree.value))
  } catch (error) {
    toast.error(getApiErrorMessage(error, 'Erro ao carregar membros'))
  } finally {
    loadingMembros.value = false
  }
}

async function loadPastas() {
  const grupo = selected.value
  if (!grupo) return
  try {
    const { data } = await getPastas(grupo.empresa_id, currentPastaId.value, 1, grupo.id)
    pastas.value = data.data || []
  } catch (error) {
    toast.error(getApiErrorMessage(error, 'Erro ao carregar pastas'))
    pastas.value = []
  }
}

async function loadArquivos() {
  const grupo = selected.value
  if (!grupo) return
  try {
    const { data } = await getArquivos(1, '', {
      agrupamento_id: grupo.id,
      pasta_id: currentPastaId.value,
      categoria_id: filterCategoriaId.value || null,
      mes: filterMes.value || null,
      ano: filterAno.value || null
    })
    arquivos.value = data.data || []
  } catch (error) {
    toast.error(getApiErrorMessage(error, 'Erro ao carregar arquivos'))
    arquivos.value = []
  }
}

async function loadCategorias() {
  if (!selected.value) return
  try {
    const { data } = await getAllCategoriasArquivo(selected.value.empresa_id)
    categorias.value = data || []
  } catch {
    categorias.value = []
  }
}

function resetConteudo() {
  pastaStack.value = []
  pastas.value = []
  arquivos.value = []
  membrosIds.value = []
  funcionariosEmpresa.value = []
  filterCategoriaId.value = ''
  filterMes.value = ''
  filterAno.value = ''
}

function clearSelection() {
  selected.value = null
  resetConteudo()
}

async function selectGrupo(grupo: IAgrupamento) {
  if (selected.value?.id === grupo.id) return
  selected.value = grupo
  resetConteudo()
  await Promise.all([loadMembros(), loadPastas(), loadArquivos(), loadCategorias()])
}

async function goToPasta(index: number) {
  pastaStack.value = pastaStack.value.slice(0, index + 1)
  await Promise.all([loadPastas(), loadArquivos()])
}

async function enterPasta(pasta: IPasta) {
  pastaStack.value = [...pastaStack.value, { id: pasta.id, nome: pasta.nome }]
  await Promise.all([loadPastas(), loadArquivos()])
}

async function goToGrupoRaiz() {
  await goToPasta(-1)
}

function goBack() {
  if (pastaStack.value.length) {
    void goToPasta(pastaStack.value.length - 2)
    return
  }
  if (selected.value) {
    clearSelection()
    return
  }
  router.push('/dashboard/arquivos')
}

function toggleMembroNode(key: string) {
  const next = new Set(membrosExpanded.value)
  if (next.has(key)) next.delete(key)
  else next.add(key)
  membrosExpanded.value = next
}

function selectFilterEmpresa(id: string) {
  filterEmpresaId.value = filterEmpresaId.value === id ? '' : id
  selectOpen.value = null
  void loadAgrupamentos()
}

function selectFilterCategoria(id: string) {
  filterCategoriaId.value = filterCategoriaId.value === id ? '' : id
  selectOpen.value = null
}

function selectFilterMes(value: number) {
  filterMes.value = filterMes.value === value ? '' : value
  selectOpen.value = null
}

function selectFilterAno(value: number) {
  filterAno.value = filterAno.value === value ? '' : value
  selectOpen.value = null
}

function openNovoGrupo() {
  grupoEditingId.value = null
  grupoFormNome.value = ''
  grupoFormDescricao.value = ''
  grupoFormEmpresaId.value = filterEmpresaId.value
  selectOpen.value = null
  grupoModalOpen.value = true
}

function openEditarGrupo(grupo: IAgrupamento) {
  grupoEditingId.value = grupo.id
  grupoFormNome.value = grupo.nome
  grupoFormDescricao.value = grupo.descricao || ''
  grupoFormEmpresaId.value = grupo.empresa_id
  selectOpen.value = null
  grupoModalOpen.value = true
}

async function saveGrupo() {
  const nome = grupoFormNome.value.trim()
  if (!nome) {
    toast.error('Informe o nome do agrupamento')
    return
  }
  if (isAdmin.value && !grupoEditingId.value && !grupoFormEmpresaId.value) {
    toast.error('Selecione a empresa')
    return
  }
  const descricao = grupoFormDescricao.value.trim()
  saving.value = true
  try {
    if (grupoEditingId.value) {
      await patchAgrupamento({ nome, descricao: descricao || undefined }, grupoEditingId.value)
      toast.success('Agrupamento atualizado')
      grupoModalOpen.value = false
      await loadAgrupamentos()
      return
    }

    const { data } = await postAgrupamento({
      nome,
      ...(descricao ? { descricao } : {}),
      tipo: 'individual',
      funcionarios: [],
      ...(isAdmin.value ? { empresa_id: grupoFormEmpresaId.value } : {})
    })
    toast.success('Agrupamento criado')
    grupoModalOpen.value = false
    await loadAgrupamentos()
    const novo = agrupamentos.value.find((g) => g.id === data.id)
    if (novo) await selectGrupo(novo)
  } catch (error) {
    toast.error(getApiErrorMessage(error, 'Erro ao salvar agrupamento'))
  } finally {
    saving.value = false
  }
}

async function removeGrupo(grupo: IAgrupamento) {
  const ok = await askConfirm({
    title: 'Excluir agrupamento',
    body: `Tem certeza que deseja excluir o agrupamento “${grupo.nome}”?`,
    confirmLabel: 'EXCLUIR',
    danger: true
  })
  if (!ok) return
  try {
    await deleteAgrupamento(grupo.id)
    toast.success('Agrupamento excluído com sucesso')
    if (selected.value?.id === grupo.id) clearSelection()
    await loadAgrupamentos()
  } catch (error) {
    toast.error(getApiErrorMessage(error, 'Erro ao excluir agrupamento'))
  }
}

async function saveMembros(ids: string[]) {
  const grupo = selected.value
  if (!grupo) return
  saving.value = true
  try {
    await patchAgrupamento({ tipo: 'individual', funcionarios: ids }, grupo.id)
    toast.success('Membros atualizados')
    membrosModalOpen.value = false
    selected.value = { ...grupo, tipo: 'individual' }
    await loadMembros()
  } catch (error) {
    toast.error(getApiErrorMessage(error, 'Erro ao salvar membros'))
  } finally {
    saving.value = false
  }
}

function openPastaModal() {
  pastaNome.value = ''
  pastaModalOpen.value = true
}

async function savePasta() {
  const grupo = selected.value
  if (!grupo) return
  if (!pastaNome.value.trim()) {
    toast.error('Informe o nome da pasta')
    return
  }
  saving.value = true
  try {
    await postPasta({
      nome: pastaNome.value.trim(),
      empresa_id: grupo.empresa_id,
      parent_id: currentPastaId.value,
      agrupamento_id: grupo.id
    })
    toast.success('Pasta criada')
    pastaModalOpen.value = false
    await loadPastas()
  } catch (error) {
    toast.error(getApiErrorMessage(error, 'Erro ao criar pasta'))
  } finally {
    saving.value = false
  }
}

function openUpload(file: File | null = null) {
  uploadInitialFile.value = file
  uploadOpen.value = true
}

function closeUpload() {
  uploadOpen.value = false
  uploadInitialFile.value = null
}

async function saveUpload(payload: ArquivoUploadPayload) {
  const grupo = selected.value
  if (!grupo) return
  saving.value = true
  try {
    const formData = new FormData()
    formData.append('file', payload.file)
    formData.append('descricao', payload.nome)
    formData.append('empresa_id', grupo.empresa_id)
    formData.append('agrupamento_id', grupo.id)
    if (payload.categoria_id) formData.append('categoria_id', payload.categoria_id)
    formData.append('mes', String(payload.mes))
    formData.append('ano', String(payload.ano))
    if (currentPastaId.value) formData.append('pasta_id', currentPastaId.value)

    const res = await postArquivoOuSubstituir(formData, (nome) =>
      askConfirm(opcoesSubstituirArquivo(nome))
    )
    if (!res) return
    toast.success(res.substituido ? 'Arquivo substituído' : 'Arquivo enviado')
    closeUpload()
    await loadArquivos()
  } catch (error) {
    toast.error(getApiErrorMessage(error, 'Erro ao enviar arquivo'))
  } finally {
    saving.value = false
  }
}

function openArquivo(item: IGetArquivosDataRes) {
  void openArquivoRegistrado(item)
}

function arquivoExtensao(arquivo: IGetArquivosDataRes): string {
  const nome = (arquivo.path || arquivo.descricao || '').split('/').pop() || ''
  const partes = nome.split('.')
  return partes.length < 2 ? '' : partes[partes.length - 1].toUpperCase()
}

const { isDragging } = usePageFileDrop((file) => {
  if (!selected.value) {
    toast.info('Selecione um agrupamento para enviar o arquivo')
    return
  }
  openUpload(file)
})

watch([filterCategoriaId, filterMes, filterAno], () => {
  if (selected.value) void loadArquivos()
})

const arquivosGridRef = ref<HTMLElement | null>(null)
const empresaIdAtual = computed(() => selected.value?.empresa_id || '')

const {
  isSelected,
  clear: limparSelecaoArquivos,
  drag: { dragging, hoverKey, end: dragEnd, over: dragOver, leave: dragLeave, drop: dragDrop },
  menu,
  menuItems,
  menuTitle,
  moverOpen,
  permissoesOpen,
  compartilharOpen,
  logOpen,
  categoriaDataOpen,
  alvo,
  onTileClick,
  onTileDblClick,
  onTileContextMenu,
  onTileDragStart,
  onGridKeydown,
  closeMenu,
  onMenuSelect,
  onMoved,
  onPermissoesSaved
} = useArquivoInteractions({
  arquivos,
  empresaId: empresaIdAtual,
  abrir: openArquivo,
  recarregar: loadArquivos
})

function destinoGrupo(grupoId: string, pastaId?: string): IDestinoArquivo {
  return { agrupamento_id: grupoId, ...(pastaId ? { pasta_id: pastaId } : {}) }
}

function aceitaDrop(grupo: IAgrupamento) {
  return !!selected.value && grupo.empresa_id === selected.value.empresa_id
}

onMounted(async () => {
  document.addEventListener('click', onDocClick)
  await loadEmpresas()
  await loadAgrupamentos()
})

onUnmounted(() => {
  document.removeEventListener('click', onDocClick)
})
</script>

<template>
  <section class="agrup-explorer">
    <UploadDropOverlay :visible="isDragging && !!selected" />

    <div class="agrup-explorer__heading">
      <button type="button" class="agrup-explorer__back" aria-label="Voltar" @click="goBack">
        <img :src="iconChevronLeft" width="24" height="24" alt="" />
      </button>
      <h2 v-if="!selected" class="agrup-explorer__title dashboard_title">AGRUPAMENTOS</h2>
      <nav v-else class="agrup-explorer__crumb" aria-label="Navegação">
        <button type="button" class="agrup-explorer__crumb-link" @click="clearSelection">
          Agrupamentos
        </button>
        <span class="agrup-explorer__crumb-sep">›</span>
        <button
          type="button"
          class="agrup-explorer__crumb-link"
          :class="{ 'is-current': !pastaStack.length, 'is-drop-target': hoverKey === 'c:grupo' }"
          @click="goToGrupoRaiz"
          @dragover="dragOver($event, 'c:grupo')"
          @dragleave="dragLeave('c:grupo')"
          @drop="dragDrop($event, destinoGrupo(selected.id))"
        >
          {{ selected.nome }}
        </button>
        <template v-for="(p, idx) in pastaStack" :key="p.id">
          <span class="agrup-explorer__crumb-sep">›</span>
          <button
            type="button"
            class="agrup-explorer__crumb-link"
            :class="{
              'is-current': idx === pastaStack.length - 1,
              'is-drop-target': hoverKey === 'c:p:' + p.id
            }"
            @click="goToPasta(idx)"
            @dragover="dragOver($event, 'c:p:' + p.id)"
            @dragleave="dragLeave('c:p:' + p.id)"
            @drop="dragDrop($event, destinoGrupo(selected.id, p.id))"
          >
            {{ p.nome }}
          </button>
        </template>
      </nav>
    </div>

    <div class="agrup-explorer__body" :class="{ 'has-selection': !!selected }">
      <div class="agrup-explorer__main">
        <!-- Agrupamentos -->
        <div
          class="agrup-explorer__panel agrup-explorer__panel--grupos"
          :class="{ 'agrup-explorer__panel--fill': !selected }"
        >
          <div class="agrup-explorer__panel-head">
            <div class="agrup-explorer__panel-head-left">
              <h3 class="agrup-explorer__panel-title">Agrupamentos</h3>
              <div v-if="isAdmin" class="agrup-explorer__filters">
                <div
                  class="night-select night-select--filter"
                  :class="{ 'is-open': selectOpen === 'empresa' }"
                >
                  <button
                    type="button"
                    class="night-select__trigger"
                    :class="{ 'is-placeholder': !filterEmpresaId, 'is-open': selectOpen === 'empresa' }"
                    aria-label="Empresa"
                    @click="toggleSelect('empresa', $event)"
                  >
                    <span>{{ filterEmpresaLabel }}</span>
                    <img
                      class="night-select__chevron"
                      :class="{ 'is-open': selectOpen === 'empresa' }"
                      :src="iconChevronDown"
                      width="12"
                      height="12"
                      alt=""
                    />
                  </button>
                  <ul
                    v-if="selectOpen === 'empresa'"
                    class="night-select__menu"
                    :class="filterMenuClass"
                    :style="filterMenuStyle"
                    role="listbox"
                  >
                    <li v-for="emp in empresas" :key="emp.id">
                      <button
                        type="button"
                        class="night-select__option"
                        :class="{ 'is-active': filterEmpresaId === emp.id }"
                        @click="selectFilterEmpresa(emp.id)"
                      >
                        {{ emp.nome }}
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <button type="button" class="agrup-explorer__cta" @click="openNovoGrupo">
              <img :src="iconNewFolder" width="20" height="16" alt="" />
              <span>Novo Agrupamento</span>
            </button>
          </div>

          <div
            class="agrup-explorer__scroll"
            :class="selected ? 'agrup-explorer__scroll--rows' : 'agrup-explorer__scroll--fill'"
          >
            <p v-if="loadingGrupos" class="agrup-explorer__empty">Carregando…</p>
            <ul v-else-if="agrupamentos.length" class="agrup-explorer__grid" role="list">
              <li
                v-for="grupo in agrupamentos"
                :key="grupo.id"
                class="agrup-explorer__item"
                :class="{
                  'is-selected': selected?.id === grupo.id,
                  'is-drop-target': hoverKey === 'g:' + grupo.id
                }"
              >
                <button
                  type="button"
                  class="agrup-explorer__tile"
                  :aria-pressed="selected?.id === grupo.id"
                  @click="selectGrupo(grupo)"
                  @dragover="aceitaDrop(grupo) && dragOver($event, 'g:' + grupo.id)"
                  @dragleave="dragLeave('g:' + grupo.id)"
                  @drop="aceitaDrop(grupo) && dragDrop($event, destinoGrupo(grupo.id))"
                >
                  <span class="agrup-explorer__box">
                    <img
                      :src="iconAgrupamento"
                      width="44"
                      height="40"
                      alt=""
                      class="agrup-explorer__icon"
                    />
                  </span>
                  <span class="agrup-explorer__name">{{ grupo.nome }}</span>
                  <span v-if="isAdmin && !filterEmpresaId" class="agrup-explorer__meta">
                    {{ nomeEmpresa(grupo) }}
                  </span>
                </button>
                <div class="agrup-explorer__tile-actions">
                  <button
                    type="button"
                    class="agrup-explorer__tile-action"
                    aria-label="Editar agrupamento"
                    @click.stop="openEditarGrupo(grupo)"
                  >
                    <img :src="iconEdit" width="14" height="14" alt="" />
                  </button>
                  <button
                    type="button"
                    class="agrup-explorer__tile-action"
                    aria-label="Excluir agrupamento"
                    @click.stop="removeGrupo(grupo)"
                  >
                    <img :src="iconDelete" width="14" height="14" alt="" />
                  </button>
                </div>
              </li>
            </ul>
            <p v-else class="agrup-explorer__empty">
              Nenhum agrupamento. Clique em “Novo Agrupamento” para criar.
            </p>
          </div>
        </div>

        <!-- Arquivos do agrupamento -->
        <div
          v-if="selected"
          class="agrup-explorer__panel agrup-explorer__panel--arquivos"
          :class="{ 'agrup-explorer__panel--drop': isDragging }"
        >
          <div class="agrup-explorer__panel-head">
            <div class="agrup-explorer__panel-head-left">
              <h3 class="agrup-explorer__panel-title">{{ arquivosTitle }}</h3>
              <div class="agrup-explorer__filters">
                <div
                  class="night-select night-select--filter"
                  :class="{ 'is-open': selectOpen === 'categoria' }"
                >
                  <button
                    type="button"
                    class="night-select__trigger"
                    :class="{ 'is-placeholder': !filterCategoriaId, 'is-open': selectOpen === 'categoria' }"
                    aria-label="Categoria"
                    @click="toggleSelect('categoria', $event)"
                  >
                    <span>{{ filterCategoriaLabel }}</span>
                    <img
                      class="night-select__chevron"
                      :class="{ 'is-open': selectOpen === 'categoria' }"
                      :src="iconChevronDown"
                      width="12"
                      height="12"
                      alt=""
                    />
                  </button>
                  <ul
                    v-if="selectOpen === 'categoria'"
                    class="night-select__menu"
                    :class="filterMenuClass"
                    :style="filterMenuStyle"
                    role="listbox"
                  >
                    <li v-if="!categorias.length" class="night-select__empty">Nenhuma categoria</li>
                    <li v-for="cat in categorias" :key="cat.id">
                      <button
                        type="button"
                        class="night-select__option"
                        :class="{ 'is-active': filterCategoriaId === cat.id }"
                        @click="selectFilterCategoria(cat.id)"
                      >
                        {{ cat.nome }}
                      </button>
                    </li>
                  </ul>
                </div>

                <div
                  class="night-select night-select--filter"
                  :class="{ 'is-open': selectOpen === 'mes' }"
                >
                  <button
                    type="button"
                    class="night-select__trigger"
                    :class="{ 'is-placeholder': !filterMes, 'is-open': selectOpen === 'mes' }"
                    aria-label="Mês"
                    @click="toggleSelect('mes', $event)"
                  >
                    <span>{{ filterMesLabel }}</span>
                    <img
                      class="night-select__chevron"
                      :class="{ 'is-open': selectOpen === 'mes' }"
                      :src="iconChevronDown"
                      width="12"
                      height="12"
                      alt=""
                    />
                  </button>
                  <ul
                    v-if="selectOpen === 'mes'"
                    class="night-select__menu"
                    :class="filterMenuClass"
                    :style="filterMenuStyle"
                    role="listbox"
                  >
                    <li v-for="m in MESES" :key="m.value">
                      <button
                        type="button"
                        class="night-select__option"
                        :class="{ 'is-active': filterMes === m.value }"
                        @click="selectFilterMes(m.value)"
                      >
                        {{ m.label }}
                      </button>
                    </li>
                  </ul>
                </div>

                <div
                  class="night-select night-select--filter"
                  :class="{ 'is-open': selectOpen === 'ano' }"
                >
                  <button
                    type="button"
                    class="night-select__trigger"
                    :class="{ 'is-placeholder': !filterAno, 'is-open': selectOpen === 'ano' }"
                    aria-label="Ano"
                    @click="toggleSelect('ano', $event)"
                  >
                    <span>{{ filterAnoLabel }}</span>
                    <img
                      class="night-select__chevron"
                      :class="{ 'is-open': selectOpen === 'ano' }"
                      :src="iconChevronDown"
                      width="12"
                      height="12"
                      alt=""
                    />
                  </button>
                  <ul
                    v-if="selectOpen === 'ano'"
                    class="night-select__menu"
                    :class="filterMenuClass"
                    :style="filterMenuStyle"
                    role="listbox"
                  >
                    <li v-for="y in anosFiltro" :key="y">
                      <button
                        type="button"
                        class="night-select__option"
                        :class="{ 'is-active': filterAno === y }"
                        @click="selectFilterAno(y)"
                      >
                        {{ y }}
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="agrup-explorer__actions">
              <button type="button" class="agrup-explorer__upload" @click="openUpload()">
                <img :src="iconUpload" width="24" height="24" alt="" />
                <span>Upload de Arquivo</span>
              </button>
              <button type="button" class="agrup-explorer__cta" @click="openPastaModal">
                <img :src="iconNewFolder" width="20" height="16" alt="" />
                <span>Nova Pasta</span>
              </button>
            </div>
          </div>

          <div
            class="agrup-explorer__scroll agrup-explorer__scroll--fill"
            @click="limparSelecaoArquivos"
          >
            <ul
              v-if="pastas.length || arquivos.length"
              ref="arquivosGridRef"
              class="agrup-explorer__grid"
              role="list"
              tabindex="-1"
              @keydown="onGridKeydown($event, arquivosGridRef, pastas.length)"
            >
              <li v-for="pasta in pastas" :key="'p-' + pasta.id">
                <button
                  type="button"
                  class="agrup-explorer__tile"
                  :class="{ 'is-drop-target': hoverKey === 'p:' + pasta.id }"
                  @click.stop="enterPasta(pasta)"
                  @dragover="dragOver($event, 'p:' + pasta.id)"
                  @dragleave="dragLeave('p:' + pasta.id)"
                  @drop="selected && dragDrop($event, destinoGrupo(selected.id, pasta.id))"
                >
                  <span class="agrup-explorer__box">
                    <img :src="iconFolder" width="40" height="40" alt="" />
                  </span>
                  <span class="agrup-explorer__name">{{ pasta.nome }}</span>
                </button>
              </li>
              <li v-for="(arquivo, index) in arquivos" :key="'a-' + arquivo.id">
                <button
                  type="button"
                  class="agrup-explorer__tile agrup-explorer__tile--arquivo"
                  :class="{
                    'is-selected': isSelected(arquivo.id),
                    'is-dragging': dragging && isSelected(arquivo.id)
                  }"
                  :data-arquivo-index="index"
                  draggable="true"
                  :title="arquivo.descricao"
                  @click.stop="onTileClick(index, $event)"
                  @dblclick="onTileDblClick(arquivo)"
                  @contextmenu.prevent.stop="onTileContextMenu(index, $event)"
                  @dragstart="onTileDragStart($event, arquivo)"
                  @dragend="dragEnd"
                >
                  <span class="agrup-explorer__box" data-drag-preview>
                    <span v-if="arquivoExtensao(arquivo)" class="agrup-explorer__ext">
                      {{ arquivoExtensao(arquivo) }}
                    </span>
                    <img
                      :src="iconFiles"
                      width="28"
                      height="34"
                      alt=""
                      class="agrup-explorer__icon"
                    />
                  </span>
                  <span class="agrup-explorer__name">{{ arquivo.descricao }}</span>
                </button>
              </li>
            </ul>
            <p v-else class="agrup-explorer__empty">
              Nenhuma pasta ou arquivo. Arraste um arquivo para enviar.
            </p>
          </div>
        </div>
      </div>

      <!-- Membros -->
      <aside class="agrup-explorer__panel agrup-explorer__panel--membros">
        <div class="agrup-explorer__panel-head agrup-explorer__panel-head--membros">
          <h3 class="agrup-explorer__panel-title">Membros</h3>
          <button
            v-if="selected"
            type="button"
            class="agrup-explorer__cta agrup-explorer__cta--sm"
            :disabled="loadingMembros"
            @click="membrosModalOpen = true"
          >
            <img :src="iconEdit" width="16" height="16" alt="" />
            <span>Editar membros</span>
          </button>
        </div>

        <div class="agrup-explorer__scroll agrup-explorer__scroll--fill">
          <p v-if="!selected" class="agrup-explorer__empty">
            Selecione um agrupamento para ver os membros.
          </p>
          <p v-else-if="loadingMembros" class="agrup-explorer__empty">Carregando…</p>
          <ul v-else-if="membrosIds.length" class="agrup-explorer__tree" role="tree">
            <MembrosTreeNode
              :node="membrosTree"
              :expanded="membrosExpanded"
              @toggle="toggleMembroNode"
            />
          </ul>
          <p v-else class="agrup-explorer__empty">
            Nenhum membro. Clique em “Editar membros” para adicionar.
          </p>
        </div>
      </aside>
    </div>

    <Teleport to="body">
      <div v-if="grupoModalOpen" class="night-confirm" @click.self="grupoModalOpen = false">
        <div class="night-confirm__modal" role="dialog" aria-modal="true">
          <h3 class="night-confirm__title">
            {{ grupoEditingId ? 'Editar Agrupamento' : 'Novo Agrupamento' }}
          </h3>
          <template v-if="isAdmin && !grupoEditingId">
            <label class="night-confirm__label">Empresa</label>
            <div class="night-select" :class="{ 'is-open': selectOpen === 'grupoEmpresa' }">
              <button
                type="button"
                class="night-select__trigger"
                :class="{ 'is-placeholder': !grupoFormEmpresaId, 'is-open': selectOpen === 'grupoEmpresa' }"
                @click.stop="toggleSelect('grupoEmpresa')"
              >
                <span>{{ grupoFormEmpresaLabel }}</span>
                <img
                  class="night-select__chevron"
                  :class="{ 'is-open': selectOpen === 'grupoEmpresa' }"
                  :src="iconChevronDown"
                  width="14"
                  height="14"
                  alt=""
                />
              </button>
              <ul v-if="selectOpen === 'grupoEmpresa'" class="night-select__menu" role="listbox">
                <li v-for="emp in empresas" :key="emp.id">
                  <button
                    type="button"
                    class="night-select__option"
                    :class="{ 'is-active': grupoFormEmpresaId === emp.id }"
                    @click.stop="grupoFormEmpresaId = emp.id; selectOpen = null"
                  >
                    {{ emp.nome }}
                  </button>
                </li>
              </ul>
            </div>
          </template>
          <label class="night-confirm__label">Nome</label>
          <input v-model="grupoFormNome" class="night-confirm__input" type="text" maxlength="255" />
          <label class="night-confirm__label">Descrição (opcional)</label>
          <input
            v-model="grupoFormDescricao"
            class="night-confirm__input"
            type="text"
            maxlength="500"
          />
          <p v-if="!grupoEditingId" class="night-confirm__hint">
            Depois de criar, use “Editar membros” para escolher quem participa.
          </p>
          <div class="night-confirm__actions">
            <button
              type="button"
              class="night-confirm__btn night-confirm__btn--ghost"
              @click="grupoModalOpen = false"
            >
              Cancelar
            </button>
            <button type="button" class="night-confirm__btn" :disabled="saving" @click="saveGrupo">
              Salvar
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <Teleport to="body">
      <div v-if="pastaModalOpen" class="night-confirm" @click.self="pastaModalOpen = false">
        <div class="night-confirm__modal" role="dialog" aria-modal="true">
          <h3 class="night-confirm__title">Nova Pasta</h3>
          <label class="night-confirm__label">Nome</label>
          <input v-model="pastaNome" class="night-confirm__input" type="text" maxlength="255" />
          <div class="night-confirm__actions">
            <button
              type="button"
              class="night-confirm__btn night-confirm__btn--ghost"
              @click="pastaModalOpen = false"
            >
              Cancelar
            </button>
            <button type="button" class="night-confirm__btn" :disabled="saving" @click="savePasta">
              Salvar
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <ArquivoUploadModal
      v-if="selected"
      :open="uploadOpen"
      :empresa-id="selected.empresa_id"
      :acesso-label="acessoUploadLabel"
      :initial-file="uploadInitialFile"
      :saving="saving"
      @close="closeUpload"
      @submit="saveUpload"
      @invalid="toast.error($event)"
    />

    <EditarMembrosModal
      v-if="selected"
      :open="membrosModalOpen"
      :agrupamento-nome="selected.nome"
      :empresa-nome="empresaNome"
      :funcionarios="funcionariosEmpresa"
      :membros-ids="membrosIds"
      :saving="saving"
      @close="membrosModalOpen = false"
      @save="saveMembros"
    />

    <ArquivoContextMenu
      :open="menu.open"
      :x="menu.x"
      :y="menu.y"
      :items="menuItems"
      :title="menuTitle"
      @select="onMenuSelect"
      @close="closeMenu"
    />
    <MoverArquivosModal
      v-if="selected"
      :open="moverOpen"
      :empresa-id="selected.empresa_id"
      :empresa-nome="empresaNome"
      :arquivo-ids="alvo.map((a) => a.id)"
      @close="moverOpen = false"
      @moved="onMoved"
    />
    <PermissoesArquivosModal
      v-if="selected"
      :open="permissoesOpen"
      :empresa-id="selected.empresa_id"
      :arquivos="alvo"
      @close="permissoesOpen = false"
      @saved="onPermissoesSaved"
    />
    <CompartilharArquivoModal
      :open="compartilharOpen && alvo.length === 1"
      :arquivo-id="alvo[0]?.id || ''"
      :arquivo-nome="alvo[0]?.descricao"
      @close="compartilharOpen = false"
    />
    <CompartilharMultiplosModal
      :open="compartilharOpen && alvo.length > 1"
      :arquivos="alvo"
      @close="compartilharOpen = false"
    />
    <LogAcessosArquivoModal
      :open="logOpen && alvo.length === 1"
      :arquivo-id="alvo[0]?.id || ''"
      :arquivo-nome="alvo[0]?.descricao"
      :arquivo-formato="alvo[0] ? arquivoExtensao(alvo[0]) : ''"
      @close="logOpen = false"
    />
    <EditarCategoriaDataModal
      :open="categoriaDataOpen && alvo.length === 1"
      :empresa-id="empresaIdAtual"
      :arquivo="alvo[0] || null"
      :formato="alvo[0] ? arquivoExtensao(alvo[0]) : ''"
      @close="categoriaDataOpen = false"
      @saved="onPermissoesSaved"
    />

    <NightConfirmModal
      :open="confirmOpen"
      :title="confirmOptions.title"
      :body="confirmOptions.body"
      :confirm-label="confirmOptions.confirmLabel"
      :cancel-label="confirmOptions.cancelLabel"
      :danger="confirmOptions.danger"
      @confirm="onConfirm"
      @cancel="onCancel"
    />
  </section>
</template>

<style lang="scss" scoped>
.agrup-explorer {
  width: 100%;
  max-width: 100%;
  min-width: 0;
  min-height: 0;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 18px;
  overflow: hidden;
}

.agrup-explorer__heading {
  display: flex;
  align-items: center;
  gap: 1px;
  min-width: 0;
  min-height: 28px;
  flex-shrink: 0;
}

.agrup-explorer__title {
  margin: 0;
}

.agrup-explorer__back {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  padding: 0;
  border: none;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0.7;

  &:hover {
    opacity: 1;
  }
}

.agrup-explorer__crumb {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  min-width: 0;
  font-family: var(--night-font, 'Inter', sans-serif);
  font-size: 14px;
  color: #fffcff;
}

.agrup-explorer__crumb-sep {
  opacity: 0.5;
}

.agrup-explorer__crumb-link {
  border: 0;
  background: transparent;
  color: #fffcff;
  font: inherit;
  cursor: pointer;
  padding: 0;
  opacity: 0.85;

  &:hover {
    color: #b08d57;
  }

  &.is-current {
    opacity: 1;
    font-weight: 600;
  }
}

.agrup-explorer__body {
  flex: 1 1 auto;
  min-height: 0;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(240px, 300px);
  gap: 18px;
}

.agrup-explorer__main {
  display: flex;
  flex-direction: column;
  gap: 18px;
  min-width: 0;
  min-height: 0;
}

.agrup-explorer__panel {
  background: var(--night-surface, #132438);
  border: 1px solid var(--night-surface-border, rgba(176, 141, 87, 0.18));
  border-radius: var(--night-radius, 20px);
  padding: 24px 28px 28px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  min-height: 0;
  min-width: 0;
  /* visible para os dropdowns dos filtros não serem cortados */
  overflow: visible;

  &--grupos {
    flex: 0 0 auto;
  }

  &--fill,
  &--arquivos {
    flex: 1 1 auto;
  }

  &--membros {
    padding: 24px 20px 24px 24px;
  }

  &--drop {
    border-color: #b08d57;
    box-shadow: 0 0 0 2px rgba(176, 141, 87, 0.35);
  }
}

.agrup-explorer__panel-head {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 20px;
  flex-shrink: 0;
  position: relative;
  z-index: 6;

  &--membros {
    align-items: center;
    margin-bottom: 14px;
  }
}

.agrup-explorer__panel-head-left {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
  flex: 1 1 260px;
}

.agrup-explorer__panel-title {
  margin: 0;
  font-family: var(--night-font, 'Inter', sans-serif);
  font-size: 18px;
  font-weight: 700;
  color: #fffcff;
  overflow-wrap: anywhere;
}

.agrup-explorer__filters {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  position: relative;
  z-index: 5;
}

.agrup-explorer__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: flex-end;

  .agrup-explorer__upload,
  .agrup-explorer__cta {
    height: 40px;
    padding: 0 14px;
    gap: 8px;
  }

  .agrup-explorer__upload span,
  .agrup-explorer__cta span {
    font-size: 12px;
  }

  .agrup-explorer__upload img {
    width: 20px;
    height: 20px;
  }
}

.agrup-explorer__upload {
  flex: 0 0 auto;
  height: 46px;
  max-width: 100%;
  padding: 0 18px;
  border: 2px solid rgba(176, 141, 87, 0.5);
  border-radius: 30px;
  background: rgba(255, 255, 255, 0.06);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;

  span {
    font-family: var(--night-font, 'Inter', sans-serif);
    font-size: 14px;
    font-weight: 700;
    line-height: 1;
    color: #f7f7f7;
    text-transform: uppercase;
  }

  &:hover {
    border-color: #b08d57;
    background: rgba(176, 141, 87, 0.15);
  }
}

.agrup-explorer__cta {
  flex: 0 0 auto;
  height: 46px;
  padding: 0 18px;
  border: none;
  border-radius: 30px;
  background: #b08d57;
  color: #ffffff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  cursor: pointer;
  font-family: var(--night-font, 'Inter', sans-serif);
  font-size: 14px;
  font-weight: 700;
  line-height: 1;
  text-transform: uppercase;
  white-space: nowrap;
  transition: all 0.2s ease;

  span {
    color: #ffffff;
  }

  &:hover:not(:disabled) {
    background: #c29f68;
    box-shadow: 0 4px 12px rgba(176, 141, 87, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &--sm {
    height: 38px;
    padding: 0 14px;
    font-size: 12px;
    gap: 8px;
  }
}

.agrup-explorer__scroll {
  min-height: 0;
  overflow-x: hidden;
  overflow-y: auto;
  overscroll-behavior: contain;
  scrollbar-width: thin;
  scrollbar-color: rgba(176, 141, 87, 0.45) transparent;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(176, 141, 87, 0.45);
    border-radius: 6px;
  }

  /* 2 linhas de tiles, depois rolagem interna */
  &--rows {
    --tile-row: calc(94px + 8px + (13px * 1.3 * 3));
    max-height: calc(var(--tile-row) * 2 + 16px);
  }

  &--fill {
    flex: 1 1 auto;
  }
}

.agrup-explorer__grid {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, 110px);
  gap: 16px;
}

.agrup-explorer__item {
  position: relative;

  &:hover .agrup-explorer__tile-actions,
  &:focus-within .agrup-explorer__tile-actions {
    opacity: 1;
    pointer-events: auto;
  }

  &.is-selected .agrup-explorer__box {
    background: rgba(176, 141, 87, 0.18);
    border-color: #b08d57;
  }

  &.is-selected .agrup-explorer__name {
    color: #e5c38c;
    font-weight: 600;
  }
}

.agrup-explorer__tile {
  width: 110px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
  text-align: left;
  color: inherit;
  font: inherit;

  &:hover .agrup-explorer__box {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(176, 141, 87, 0.3);
  }

  &:focus-visible {
    outline: none;
  }

  &--arquivo {
    user-select: none;
  }

  &.is-selected .agrup-explorer__box,
  &.is-selected:hover .agrup-explorer__box {
    border-color: #fffcff;
    box-shadow: 0 0 0 1px #fffcff;
    background: rgba(255, 255, 255, 0.12);
  }

  &.is-dragging {
    opacity: 0.45;
  }

  &.is-drop-target .agrup-explorer__box {
    border: 1px dashed #b08d57;
    box-shadow: 0 0 0 1px #b08d57;
    background: rgba(176, 141, 87, 0.22);
  }
}

.agrup-explorer__item.is-drop-target .agrup-explorer__box {
  border: 1px dashed #b08d57;
  box-shadow: 0 0 0 1px #b08d57;
  background: rgba(176, 141, 87, 0.22);
}

.agrup-explorer__grid:focus {
  outline: none;
}

.agrup-explorer__crumb-link.is-drop-target {
  color: #b08d57;
  opacity: 1;
  border-radius: 6px;
  outline: 1px dashed #b08d57;
  outline-offset: 3px;
}

.agrup-explorer__box {
  position: relative;
  width: 110px;
  height: 94px;
  border-radius: 15px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  box-sizing: border-box;
}

.agrup-explorer__tile-actions {
  position: absolute;
  top: 6px;
  right: 6px;
  display: flex;
  gap: 4px;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.15s ease;
}

.agrup-explorer__tile-action {
  width: 26px;
  height: 26px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: rgba(11, 27, 43, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(176, 141, 87, 0.45);
  }
}

.agrup-explorer__ext {
  position: absolute;
  top: 6px;
  right: 8px;
  font-family: var(--night-font, 'Inter', sans-serif);
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.04em;
  line-height: 1;
  color: rgba(176, 141, 87, 0.95);
  text-transform: uppercase;
  pointer-events: none;
}

.agrup-explorer__icon {
  filter: brightness(0) saturate(100%) invert(67%) sepia(18%) saturate(742%) hue-rotate(7deg)
    brightness(95%) contrast(88%);
}

.agrup-explorer__name {
  width: 100%;
  font-family: var(--night-font, 'Inter', sans-serif);
  font-size: 13px;
  font-weight: 500;
  line-height: 1.3;
  color: #ffffff;
  word-break: break-word;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.agrup-explorer__meta {
  width: 100%;
  margin-top: -4px;
  font-family: var(--night-font, 'Inter', sans-serif);
  font-size: 11px;
  color: #b08d57;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.agrup-explorer__tree {
  margin: 0;
  padding: 0;
}

.agrup-explorer__empty {
  margin: 0;
  color: #f7f7f7;
  opacity: 0.7;
  font-family: var(--night-font, 'Inter', sans-serif);
  font-size: 0.95rem;
}

.night-select {
  position: relative;
  z-index: 2;
  margin-bottom: 14px;

  &.is-open {
    z-index: 60;
  }
}

.night-select__trigger {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: #0b1b2b;
  color: #fffcff;
  font-family: var(--night-font, 'Inter', sans-serif);
  font-size: 14px;
  text-align: left;
  cursor: pointer;
  box-sizing: border-box;

  span {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &.is-placeholder {
    color: rgba(255, 252, 255, 0.55);
  }

  &.is-open {
    border-color: rgba(176, 141, 87, 0.55);
  }
}

.night-select__chevron {
  flex-shrink: 0;
  opacity: 0.8;
  transition: transform 0.15s ease;
  filter: brightness(0) invert(1);

  &.is-open {
    transform: rotate(180deg);
  }
}

.night-select__menu {
  position: absolute;
  left: 0;
  right: 0;
  top: calc(100% + 4px);
  z-index: 70;
  margin: 0;
  padding: 6px;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 4px;
  background: #0b1b2b;
  border: 1px solid rgba(176, 141, 87, 0.45);
  border-radius: 10px;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.65);
  max-height: 200px;
  overflow-y: auto;
  overscroll-behavior: contain;
  isolation: isolate;

  &--scroll {
    max-height: 160px;
  }

  &--up {
    top: auto;
    bottom: calc(100% + 4px);
  }
}

.night-select__option {
  width: 100%;
  border: 0;
  background: #0b1b2b;
  color: #fffcff;
  text-align: left;
  padding: 10px 12px;
  border-radius: 8px;
  font: inherit;
  cursor: pointer;

  &:hover,
  &.is-active {
    background: rgba(176, 141, 87, 0.28);
    color: #fffcff;
  }
}

.night-select__empty {
  padding: 10px 12px;
  color: rgba(255, 252, 255, 0.55);
  font-size: 13px;
}

.night-select--filter {
  margin-bottom: 0;
  min-width: 120px;
  max-width: 200px;
  flex: 0 1 auto;

  .night-select__trigger {
    padding: 8px 10px;
    font-size: 12px;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.12);

    &.is-open,
    &:focus-visible {
      border-color: rgba(255, 255, 255, 0.55);
      outline: none;
    }
  }

  .night-select__menu {
    min-width: 100%;
    width: max-content;
    max-width: 260px;
  }
}

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
  width: min(420px, 100%);
  background: var(--night-surface, #132438);
  border: 1px solid var(--night-surface-border, rgba(176, 141, 87, 0.25));
  border-radius: 16px;
  padding: 24px;
  box-sizing: border-box;
}

.night-confirm__title {
  margin: 0 0 16px;
  color: #fffcff;
  font-family: var(--night-font, 'Inter', sans-serif);
  font-size: 18px;
  font-weight: 700;
}

.night-confirm__label {
  display: block;
  margin: 0 0 6px;
  color: #b08d57;
  font-size: 12px;
  font-weight: 600;
  font-family: var(--night-font, 'Inter', sans-serif);
}

.night-confirm__hint {
  margin: 0 0 12px;
  color: #f7f7f7;
  opacity: 0.65;
  font-size: 12px;
  font-family: var(--night-font, 'Inter', sans-serif);
}

.night-confirm__input {
  width: 100%;
  margin-bottom: 14px;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(0, 0, 0, 0.25);
  color: #fff;
  font-family: var(--night-font, 'Inter', sans-serif);
  box-sizing: border-box;
}

.night-confirm__actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 8px;
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

/* Tablet: painéis empilhados, mas a tela continua fixa e cada painel rola por dentro. */
@media (max-width: 1100px) {
  .agrup-explorer__body {
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: minmax(0, 1fr) auto;
  }

  .agrup-explorer__panel--membros {
    max-height: 30dvh;
  }

  .agrup-explorer__scroll--rows {
    max-height: calc(var(--tile-row) + 8px);
  }
}

@media (max-width: 768px) {
  .agrup-explorer {
    height: auto;
    overflow: visible;
  }

  .agrup-explorer__body {
    grid-template-rows: none;
  }

  .agrup-explorer__panel--arquivos,
  .agrup-explorer__panel--membros {
    max-height: min(58dvh, 520px);
  }

  .agrup-explorer__panel {
    padding: 18px 16px 22px;
  }

  .agrup-explorer__panel-head {
    flex-direction: column;
    align-items: stretch;
  }

  .agrup-explorer__panel-head--membros {
    flex-direction: row;
    align-items: center;
  }

  .agrup-explorer__tile-actions {
    opacity: 1;
    pointer-events: auto;
  }
}
</style>
