<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { getEmpresa } from '@/services/http/empresas'
import { getSetor, getSetores, postSetor, type ISetor } from '@/services/http/setores'
import { getFuncao, getFuncoes, postFuncao, type IFuncao } from '@/services/http/funcoes'
import {
  getFuncionarios,
  postFuncionario,
  type IFuncionario
} from '@/services/http/funcionarios'
import { getPastas, getPasta, postPasta, type IPasta } from '@/services/http/pastas'
import {
  getArquivos,
  postArquivo,
  type IDestinoArquivo,
  type IGetArquivosDataRes
} from '@/services/http/arquivos'
import {
  getAllCategoriasArquivo,
  type ICategoriaArquivo
} from '@/services/http/categorias-arquivo'
import { postAddEmpresaToArquivo } from '@/services/http/administradores'
import { useAuthStore } from '@/stores/auth'
import { getApiErrorMessage } from '@/utils/apiError'
import { openFile } from '@/utils/openFile'
import { usePageFileDrop } from '@/composables/usePageFileDrop'
import { useDropdownPlacement } from '@/composables/useDropdownPlacement'
import { useArquivoInteractions } from '@/composables/useArquivoInteractions'
import UploadDropOverlay from '@/components/UploadDropOverlay/UploadDropOverlay.vue'
import ArquivoContextMenu from '@/components/ArquivoContextMenu/ArquivoContextMenu.vue'
import MoverArquivosModal from '@/components/MoverArquivosModal/MoverArquivosModal.vue'
import PermissoesArquivosModal from '@/components/PermissoesArquivosModal/PermissoesArquivosModal.vue'
import CompartilharArquivoModal from '@/components/CompartilharArquivoModal/CompartilharArquivoModal.vue'
import CompartilharMultiplosModal from '@/components/CompartilharMultiplosModal/CompartilharMultiplosModal.vue'
import iconChevronLeft from '@/assets/imgs/administradores/icon-chevron-left.svg'
import iconChevronDown from '@/assets/imgs/administradores/icon-chevron-down.svg'
import iconNewFolder from '@/assets/imgs/administradores/icon-new-folder.svg'
import iconUpload from '@/assets/imgs/arquivos/Upload.svg'
import iconSetores from '@/assets/imgs/dashboard/icon-menu-setores.svg'
import iconFuncoes from '@/assets/imgs/dashboard/icon-menu-funcoes.svg'
import iconFuncionarios from '@/assets/imgs/dashboard/icon-menu-funcionarios.svg'
import iconFolder from '@/assets/imgs/arquivos/folder.svg'
import iconFiles from '@/assets/imgs/dashboard/icon-menu-files.svg'

type HierarchyLevel = 'empresa' | 'setor' | 'funcao'

const MESES = [
  { value: 1, label: 'Janeiro' },
  { value: 2, label: 'Fevereiro' },
  { value: 3, label: 'Março' },
  { value: 4, label: 'Abril' },
  { value: 5, label: 'Maio' },
  { value: 6, label: 'Junho' },
  { value: 7, label: 'Julho' },
  { value: 8, label: 'Agosto' },
  { value: 9, label: 'Setembro' },
  { value: 10, label: 'Outubro' },
  { value: 11, label: 'Novembro' },
  { value: 12, label: 'Dezembro' }
] as const

function dateFromFile(file: File): { mes: number; ano: number } {
  const d = new Date(file.lastModified || Date.now())
  return { mes: d.getMonth() + 1, ano: d.getFullYear() }
}

function yearOptions(around = new Date().getFullYear()): number[] {
  const years: number[] = []
  for (let y = around + 2; y >= around - 30; y -= 1) years.push(y)
  return years
}

const route = useRoute()
const router = useRouter()
const toast = useToast()
const authStore = useAuthStore()

const empresaId = computed(() => String(route.params.empresaId || ''))
const setorId = computed(() =>
  route.params.setorId ? String(route.params.setorId) : null
)
const funcaoId = computed(() =>
  route.params.funcaoId ? String(route.params.funcaoId) : null
)
const pastaId = computed(() =>
  route.params.pastaId ? String(route.params.pastaId) : null
)

const level = computed<HierarchyLevel>(() => {
  if (funcaoId.value) return 'funcao'
  if (setorId.value) return 'setor'
  return 'empresa'
})

const empresaNome = ref('Empresa')
const setorNome = ref('Setor')
const funcaoNome = ref('Função')
const loading = ref(true)

const setores = ref<ISetor[]>([])
const funcoes = ref<IFuncao[]>([])
const funcionarios = ref<IFuncionario[]>([])
const pastas = ref<IPasta[]>([])
const arquivos = ref<IGetArquivosDataRes[]>([])
const breadcrumbPastas = ref<{ id: string; nome: string }[]>([])

const setorModalOpen = ref(false)
const funcaoModalOpen = ref(false)
const funcionarioModalOpen = ref(false)
const pastaModalOpen = ref(false)
const uploadModalOpen = ref(false)
const saving = ref(false)

const setorFormNome = ref('')
const setorFormDescricao = ref('')
const funcaoFormNome = ref('')
const funcaoFormDescricao = ref('')
const funcionarioFormNome = ref('')
const funcionarioFormEmail = ref('')
const pastaNome = ref('')
const uploadNome = ref('')
const uploadFile = ref<File | null>(null)
const uploadFileInputRef = ref<HTMLInputElement | null>(null)
const uploadCategoriaId = ref('')
const uploadMes = ref<number>(new Date().getMonth() + 1)
const uploadAno = ref<number>(new Date().getFullYear())
const uploadSelectOpen = ref<'categoria' | 'mes' | 'ano' | null>(null)
const filterSelectOpen = ref<'categoria' | 'mes' | 'ano' | null>(null)
const categorias = ref<ICategoriaArquivo[]>([])
const filterCategoriaId = ref('')
const filterMes = ref<number | ''>('')
const filterAno = ref<number | ''>('')
const anosFiltro = yearOptions()

const isInsidePasta = computed(() => Boolean(pastaId.value))

const acessoUploadLabel = computed(() => {
  const parts = [empresaNome.value]
  if (setorId.value) parts.push(setorNome.value)
  if (funcaoId.value) parts.push(funcaoNome.value)
  return parts.join(' › ')
})

const uploadCategoriaLabel = computed(() => {
  if (!uploadCategoriaId.value) return 'Selecione a categoria'
  return categorias.value.find((c) => c.id === uploadCategoriaId.value)?.nome || 'Selecione a categoria'
})

const uploadMesLabel = computed(
  () => MESES.find((m) => m.value === uploadMes.value)?.label || 'Mês'
)

const filterCategoriaLabel = computed(() => {
  if (!filterCategoriaId.value) return 'Categoria'
  return categorias.value.find((c) => c.id === filterCategoriaId.value)?.nome || 'Categoria'
})

const filterMesLabel = computed(() => {
  if (!filterMes.value) return 'Mês'
  return MESES.find((m) => m.value === filterMes.value)?.label || 'Mês'
})

const filterAnoLabel = computed(() => {
  if (!filterAno.value) return 'Ano'
  return String(filterAno.value)
})

function toggleUploadSelect(key: 'categoria' | 'mes' | 'ano') {
  filterSelectOpen.value = null
  uploadSelectOpen.value = uploadSelectOpen.value === key ? null : key
}

const {
  place: placeFilterMenu,
  menuClass: filterMenuClass,
  menuStyle: filterMenuStyle
} = useDropdownPlacement('.empresa-explorer')

function toggleFilterSelect(key: 'categoria' | 'mes' | 'ano', event?: MouseEvent) {
  uploadSelectOpen.value = null
  filterSelectOpen.value = filterSelectOpen.value === key ? null : key
  if (filterSelectOpen.value && event) placeFilterMenu(event.currentTarget)
}

function selectUploadCategoria(id: string) {
  uploadCategoriaId.value = id
  uploadSelectOpen.value = null
}

function selectUploadMes(value: number) {
  uploadMes.value = value
  uploadSelectOpen.value = null
}

function selectUploadAno(value: number) {
  uploadAno.value = value
  uploadSelectOpen.value = null
}

function selectFilterCategoria(id: string) {
  filterCategoriaId.value = filterCategoriaId.value === id ? '' : id
  filterSelectOpen.value = null
}

function selectFilterMes(value: number | '') {
  filterMes.value = filterMes.value === value ? '' : value
  filterSelectOpen.value = null
}

function selectFilterAno(value: number | '') {
  filterAno.value = filterAno.value === value ? '' : value
  filterSelectOpen.value = null
}

function onNightSelectDocClick(event: MouseEvent) {
  const target = event.target as HTMLElement | null
  if (!target?.closest('.night-select')) {
    uploadSelectOpen.value = null
    filterSelectOpen.value = null
  }
}

onMounted(() => {
  document.addEventListener('click', onNightSelectDocClick)
})

onUnmounted(() => {
  document.removeEventListener('click', onNightSelectDocClick)
  document.body.style.overflow = ''
})

const hierarchyTitle = computed(() => {
  if (level.value === 'funcao') return funcaoNome.value
  if (level.value === 'setor') return setorNome.value
  return empresaNome.value
})

const hierarchySubtitle = computed(() => {
  if (level.value === 'funcao') return 'Funcionários'
  if (level.value === 'setor') return 'Funções'
  return 'Setores'
})

const novoBtnLabel = computed(() => {
  if (level.value === 'funcao') return 'Novo Funcionário'
  if (level.value === 'setor') return 'Nova Função'
  return 'Novo Setor'
})

const arquivosTitle = computed(() => {
  if (isInsidePasta.value) {
    const last = breadcrumbPastas.value[breadcrumbPastas.value.length - 1]
    return `Arquivos de ${last?.nome || 'Pasta'}`
  }
  return `Arquivos de ${hierarchyTitle.value}`
})

async function loadNames() {
  try {
    if (authStore.userRole === 'empresa' && authStore.me?.id === empresaId.value) {
      empresaNome.value = (authStore.me.nome_empresa || authStore.me.nome || 'Empresa').trim()
    } else {
      const { data } = await getEmpresa(empresaId.value)
      empresaNome.value = (data.nome_empresa || data.nome || 'Empresa').trim()
    }
  } catch {
    empresaNome.value = 'Empresa'
  }

  if (setorId.value) {
    try {
      const { data } = await getSetor(setorId.value)
      setorNome.value = data.nome
    } catch {
      setorNome.value = 'Setor'
    }
  }

  if (funcaoId.value) {
    try {
      const { data } = await getFuncao(funcaoId.value)
      funcaoNome.value = data.nome
    } catch {
      funcaoNome.value = 'Função'
    }
  }
}

async function buildPastaBreadcrumb() {
  const stack: { id: string; nome: string }[] = []
  let currentId = pastaId.value
  while (currentId) {
    try {
      const { data } = await getPasta(currentId)
      stack.unshift({ id: data.id, nome: data.nome })
      currentId = data.parent_id || null
    } catch {
      break
    }
  }
  breadcrumbPastas.value = stack
}

async function loadHierarchyItems() {
  if (isInsidePasta.value) {
    setores.value = []
    funcoes.value = []
    funcionarios.value = []
    return
  }

  try {
    if (level.value === 'empresa') {
      const { data } = await getSetores(1, '', empresaId.value)
      setores.value = data.data || []
      funcoes.value = []
      funcionarios.value = []
      return
    }

    if (level.value === 'setor') {
      const { data } = await getFuncoes(1, '', empresaId.value)
      funcoes.value = data.data || []
      setores.value = []
      funcionarios.value = []
      return
    }

    const { data } = await getFuncionarios(
      1,
      '',
      empresaId.value,
      setorId.value || undefined,
      funcaoId.value || undefined
    )
    funcionarios.value = data.data || []
    setores.value = []
    funcoes.value = []
  } catch (error) {
    toast.error(getApiErrorMessage(error, 'Erro ao carregar itens'))
  }
}

async function loadPastas() {
  try {
    const { data } = await getPastas(empresaId.value, pastaId.value)
    pastas.value = data.data || []
  } catch (error) {
    toast.error(getApiErrorMessage(error, 'Erro ao carregar pastas'))
    pastas.value = []
  }
}

async function loadCategorias() {
  try {
    const { data } = await getAllCategoriasArquivo(empresaId.value)
    categorias.value = data || []
  } catch {
    categorias.value = []
  }
}

async function loadArquivos() {
  try {
    const { data } = await getArquivos(1, '', {
      empresa_id: empresaId.value,
      pasta_id: pastaId.value || undefined,
      ...(funcaoId.value
        ? { funcao_id: funcaoId.value }
        : setorId.value
          ? { setor_id: setorId.value }
          : { somente_livres: true }),
      ...(filterCategoriaId.value ? { categoria_id: filterCategoriaId.value } : {}),
      ...(filterMes.value ? { mes: Number(filterMes.value) } : {}),
      ...(filterAno.value ? { ano: Number(filterAno.value) } : {})
    })
    arquivos.value = data.data || []
  } catch (error) {
    toast.error(getApiErrorMessage(error, 'Erro ao carregar arquivos'))
    arquivos.value = []
  }
}

async function refreshAll() {
  loading.value = true
  try {
    await loadNames()
    await buildPastaBreadcrumb()
    await Promise.all([
      loadHierarchyItems(),
      loadPastas(),
      loadCategorias(),
      loadArquivos()
    ])
  } finally {
    loading.value = false
  }
}

function routeForLevel(opts: {
  setorId?: string | null
  funcaoId?: string | null
  pastaId?: string | null
}) {
  const emp = empresaId.value
  const s = opts.setorId === undefined ? setorId.value : opts.setorId
  const f = opts.funcaoId === undefined ? funcaoId.value : opts.funcaoId
  const p = opts.pastaId === undefined ? null : opts.pastaId

  if (f && s && p) {
    return {
      name: 'arquivos-empresa-funcao-pasta' as const,
      params: { empresaId: emp, setorId: s, funcaoId: f, pastaId: p }
    }
  }
  if (f && s) {
    return {
      name: 'arquivos-empresa-funcao' as const,
      params: { empresaId: emp, setorId: s, funcaoId: f }
    }
  }
  if (s && p) {
    return {
      name: 'arquivos-empresa-setor-pasta' as const,
      params: { empresaId: emp, setorId: s, pastaId: p }
    }
  }
  if (s) {
    return {
      name: 'arquivos-empresa-setor' as const,
      params: { empresaId: emp, setorId: s }
    }
  }
  if (p) {
    return {
      name: 'arquivos-empresa-pasta' as const,
      params: { empresaId: emp, pastaId: p }
    }
  }
  return { name: 'arquivos-empresa' as const, params: { empresaId: emp } }
}

function goBack() {
  if (pastaId.value) {
    const parent = breadcrumbPastas.value[breadcrumbPastas.value.length - 2]
    router.push(routeForLevel({ pastaId: parent?.id || null }))
    return
  }
  if (level.value === 'funcao') {
    router.push(routeForLevel({ funcaoId: null, setorId: setorId.value, pastaId: null }))
    return
  }
  if (level.value === 'setor') {
    router.push(routeForLevel({ setorId: null, funcaoId: null, pastaId: null }))
    return
  }
  router.push('/dashboard/arquivos')
}

function enterSetor(setor: ISetor) {
  router.push(routeForLevel({ setorId: setor.id, funcaoId: null, pastaId: null }))
}

function enterFuncao(funcao: IFuncao) {
  router.push(routeForLevel({ setorId: setorId.value, funcaoId: funcao.id, pastaId: null }))
}

function enterPasta(pasta: IPasta) {
  router.push(routeForLevel({ pastaId: pasta.id }))
}

function openArquivo(item: IGetArquivosDataRes) {
  if (item.url) openFile(item.url)
}

function openNovoHierarchyModal() {
  if (level.value === 'empresa') {
    setorFormNome.value = ''
    setorFormDescricao.value = ''
    setorModalOpen.value = true
    return
  }
  if (level.value === 'setor') {
    funcaoFormNome.value = ''
    funcaoFormDescricao.value = ''
    funcaoModalOpen.value = true
    return
  }
  funcionarioFormNome.value = ''
  funcionarioFormEmail.value = ''
  funcionarioModalOpen.value = true
}

function openPastaModal() {
  pastaNome.value = ''
  pastaModalOpen.value = true
}

function openUploadModal() {
  uploadNome.value = ''
  uploadFile.value = null
  uploadCategoriaId.value = ''
  uploadSelectOpen.value = null
  if (uploadFileInputRef.value) uploadFileInputRef.value.value = ''
  const now = new Date()
  uploadMes.value = now.getMonth() + 1
  uploadAno.value = now.getFullYear()
  uploadModalOpen.value = true
  void loadCategorias()
}

function applyFileToUpload(file: File) {
  const nomeAnteriorDoArquivo = uploadFile.value
    ? uploadFile.value.name.replace(/\.[^.]+$/, '')
    : ''
  uploadFile.value = file
  // Atualiza o nome se estiver vazio ou ainda for o do arquivo anterior (troca de arquivo).
  if (!uploadNome.value.trim() || uploadNome.value.trim() === nomeAnteriorDoArquivo) {
    uploadNome.value = file.name.replace(/\.[^.]+$/, '')
  }
  const { mes, ano } = dateFromFile(file)
  uploadMes.value = mes
  uploadAno.value = ano
  uploadSelectOpen.value = null
  uploadModalOpen.value = true
  void loadCategorias()
}

function onPickFile(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  applyFileToUpload(file)
}

function openFilePicker() {
  uploadFileInputRef.value?.click()
}

async function saveSetor() {
  if (!setorFormNome.value.trim()) {
    toast.error('Informe o nome do setor')
    return
  }
  saving.value = true
  try {
    await postSetor({
      nome: setorFormNome.value.trim(),
      ...(setorFormDescricao.value.trim()
        ? { descricao: setorFormDescricao.value.trim() }
        : {}),
      empresa_id: empresaId.value
    })
    toast.success('Setor criado')
    setorModalOpen.value = false
    await loadHierarchyItems()
  } catch (error) {
    toast.error(getApiErrorMessage(error, 'Erro ao criar setor'))
  } finally {
    saving.value = false
  }
}

async function saveFuncao() {
  if (!funcaoFormNome.value.trim()) {
    toast.error('Informe o nome da função')
    return
  }
  saving.value = true
  try {
    await postFuncao({
      nome: funcaoFormNome.value.trim(),
      ...(funcaoFormDescricao.value.trim()
        ? { descricao: funcaoFormDescricao.value.trim() }
        : {}),
      empresa_id: empresaId.value
    })
    toast.success('Função criada')
    funcaoModalOpen.value = false
    await loadHierarchyItems()
  } catch (error) {
    toast.error(getApiErrorMessage(error, 'Erro ao criar função'))
  } finally {
    saving.value = false
  }
}

async function saveFuncionario() {
  if (!funcionarioFormNome.value.trim() || !funcionarioFormEmail.value.trim()) {
    toast.error('Nome e e-mail são obrigatórios')
    return
  }
  saving.value = true
  try {
    await postFuncionario({
      nome: funcionarioFormNome.value.trim(),
      email: funcionarioFormEmail.value.trim(),
      empresa_id: empresaId.value,
      setores: setorId.value ? [setorId.value] : [],
      funcoes: funcaoId.value ? [funcaoId.value] : []
    })
    toast.success('Funcionário criado')
    funcionarioModalOpen.value = false
    await loadHierarchyItems()
  } catch (error) {
    toast.error(getApiErrorMessage(error, 'Erro ao criar funcionário'))
  } finally {
    saving.value = false
  }
}

async function savePasta() {
  if (!pastaNome.value.trim()) {
    toast.error('Informe o nome da pasta')
    return
  }
  saving.value = true
  try {
    await postPasta({
      nome: pastaNome.value.trim(),
      empresa_id: empresaId.value,
      parent_id: pastaId.value
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

function arquivoExtensao(arquivo: IGetArquivosDataRes): string {
  const fonte = arquivo.path || arquivo.descricao || ''
  const nome = fonte.split('/').pop() || ''
  const partes = nome.split('.')
  if (partes.length < 2) return ''
  return partes[partes.length - 1].toUpperCase()
}

async function saveUpload() {
  if (!uploadFile.value) {
    toast.error('Selecione um arquivo')
    return
  }
  if (!uploadCategoriaId.value) {
    toast.error('Selecione a categoria')
    return
  }
  if (!uploadMes.value || !uploadAno.value) {
    toast.error('Selecione mês e ano')
    return
  }

  saving.value = true
  try {
    const formData = new FormData()
    formData.append('file', uploadFile.value)
    formData.append(
      'descricao',
      (uploadNome.value || uploadFile.value.name.replace(/\.[^.]+$/, '')).trim() || 'Arquivo'
    )
    formData.append('empresa_id', empresaId.value)
    formData.append('categoria_id', uploadCategoriaId.value)
    formData.append('mes', String(uploadMes.value))
    formData.append('ano', String(uploadAno.value))
    if (pastaId.value) formData.append('pasta_id', pastaId.value)
    if (setorId.value) formData.append('setores[]', setorId.value)
    if (funcaoId.value) formData.append('funcoes[]', funcaoId.value)

    const { data } = await postArquivo(formData)
    if (authStore.userRole === 'administrador') {
      try {
        await postAddEmpresaToArquivo([empresaId.value], data.id)
      } catch {
        //
      }
    }
    toast.success('Arquivo enviado')
    uploadModalOpen.value = false
    uploadFile.value = null
    await loadArquivos()
  } catch (error) {
    toast.error(getApiErrorMessage(error, 'Erro ao enviar arquivo'))
  } finally {
    saving.value = false
  }
}

const { isDragging } = usePageFileDrop((file) => {
  applyFileToUpload(file)
})

const arquivosGridRef = ref<HTMLElement | null>(null)

const {
  isSelected,
  clear: clearSelection,
  drag: { dragging, hoverKey, end: dragEnd, over: dragOver, leave: dragLeave, drop: dragDrop },
  menu,
  menuItems,
  menuTitle,
  moverOpen,
  permissoesOpen,
  compartilharOpen,
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
  empresaId,
  abrir: openArquivo,
  recarregar: loadArquivos
})

const destinoAtual = computed<IDestinoArquivo>(() => ({
  setor_id: setorId.value || undefined,
  funcao_id: funcaoId.value || undefined
}))

function destinoPasta(id: string): IDestinoArquivo {
  return { ...destinoAtual.value, pasta_id: id }
}

watch(uploadModalOpen, (open) => {
  if (typeof document === 'undefined') return
  document.body.style.overflow = open ? 'hidden' : ''
  if (!open) uploadSelectOpen.value = null
})

watch(
  () =>
    [
      empresaId.value,
      setorId.value,
      funcaoId.value,
      pastaId.value
    ] as const,
  async ([empId]) => {
    if (!empId) return
    filterCategoriaId.value = ''
    filterMes.value = ''
    filterAno.value = ''
    filterSelectOpen.value = null
    await refreshAll()
  },
  { immediate: true }
)

watch([filterCategoriaId, filterMes, filterAno], () => {
  if (!empresaId.value || loading.value) return
  void loadArquivos()
})
</script>

<template>
  <section class="empresa-explorer">
    <UploadDropOverlay :visible="isDragging" />

    <div class="empresa-explorer__heading">
      <button type="button" class="empresa-explorer__back" aria-label="Voltar" @click="goBack">
        <img :src="iconChevronLeft" width="24" height="24" alt="" />
      </button>
      <nav class="empresa-explorer__crumb" aria-label="Navegação">
        <button
          type="button"
          class="empresa-explorer__crumb-link"
          @click="router.push('/dashboard/arquivos')"
        >
          Empresas
        </button>
        <span class="empresa-explorer__crumb-sep">›</span>
        <button
          type="button"
          class="empresa-explorer__crumb-link"
          :class="{ 'is-drop-target': hoverKey === 'c:empresa' }"
          @click="router.push(routeForLevel({ setorId: null, funcaoId: null, pastaId: null }))"
          @dragover="dragOver($event, 'c:empresa')"
          @dragleave="dragLeave('c:empresa')"
          @drop="dragDrop($event, {})"
        >
          {{ empresaNome }}
        </button>
        <template v-if="setorId">
          <span class="empresa-explorer__crumb-sep">›</span>
          <button
            type="button"
            class="empresa-explorer__crumb-link"
            :class="{ 'is-drop-target': hoverKey === 'c:setor' }"
            @click="router.push(routeForLevel({ setorId, funcaoId: null, pastaId: null }))"
            @dragover="dragOver($event, 'c:setor')"
            @dragleave="dragLeave('c:setor')"
            @drop="dragDrop($event, { setor_id: setorId || undefined })"
          >
            {{ setorNome }}
          </button>
        </template>
        <template v-if="funcaoId">
          <span class="empresa-explorer__crumb-sep">›</span>
          <button
            type="button"
            class="empresa-explorer__crumb-link"
            :class="{ 'is-drop-target': hoverKey === 'c:funcao' }"
            @click="router.push(routeForLevel({ setorId, funcaoId, pastaId: null }))"
            @dragover="dragOver($event, 'c:funcao')"
            @dragleave="dragLeave('c:funcao')"
            @drop="dragDrop($event, destinoAtual)"
          >
            {{ funcaoNome }}
          </button>
        </template>
        <template v-for="(p, idx) in breadcrumbPastas" :key="p.id">
          <span class="empresa-explorer__crumb-sep">›</span>
          <button
            type="button"
            class="empresa-explorer__crumb-link"
            :class="{
              'is-current': idx === breadcrumbPastas.length - 1,
              'is-drop-target': hoverKey === 'c:p:' + p.id
            }"
            @click="router.push(routeForLevel({ pastaId: p.id }))"
            @dragover="dragOver($event, 'c:p:' + p.id)"
            @dragleave="dragLeave('c:p:' + p.id)"
            @drop="dragDrop($event, destinoPasta(p.id))"
          >
            {{ p.nome }}
          </button>
        </template>
      </nav>
    </div>

    <p v-if="loading" class="empresa-explorer__status">Carregando…</p>

    <template v-else>
      <!-- Hierarquia: Setores / Funções / Funcionários -->
      <div
        v-if="!isInsidePasta"
        class="empresa-explorer__panel empresa-explorer__panel--hierarchy"
      >
        <div class="empresa-explorer__panel-head">
          <div>
            <h3 class="empresa-explorer__panel-title">{{ hierarchyTitle }}</h3>
            <p class="empresa-explorer__panel-sub">{{ hierarchySubtitle }}</p>
          </div>
          <button type="button" class="empresa-explorer__cta" @click="openNovoHierarchyModal">
            <img :src="iconNewFolder" width="20" height="16" alt="" />
            <span>{{ novoBtnLabel }}</span>
          </button>
        </div>

        <div class="empresa-explorer__scroll empresa-explorer__scroll--rows">
          <ul
            v-if="level === 'empresa' && setores.length"
            class="empresa-explorer__grid"
            role="list"
          >
            <li v-for="setor in setores" :key="setor.id">
              <button
                type="button"
                class="empresa-explorer__tile"
                :class="{ 'is-drop-target': hoverKey === 's:' + setor.id }"
                @click="enterSetor(setor)"
                @dragover="dragOver($event, 's:' + setor.id)"
                @dragleave="dragLeave('s:' + setor.id)"
                @drop="dragDrop($event, { setor_id: setor.id })"
              >
                <span class="empresa-explorer__box">
                  <img
                    :src="iconSetores"
                    width="40"
                    height="38"
                    alt=""
                    class="empresa-explorer__icon"
                  />
                </span>
                <span class="empresa-explorer__name">{{ setor.nome }}</span>
              </button>
            </li>
          </ul>

          <ul
            v-else-if="level === 'setor' && funcoes.length"
            class="empresa-explorer__grid"
            role="list"
          >
            <li v-for="funcao in funcoes" :key="funcao.id">
              <button
                type="button"
                class="empresa-explorer__tile"
                :class="{ 'is-drop-target': hoverKey === 'f:' + funcao.id }"
                @click="enterFuncao(funcao)"
                @dragover="dragOver($event, 'f:' + funcao.id)"
                @dragleave="dragLeave('f:' + funcao.id)"
                @drop="dragDrop($event, { setor_id: setorId || undefined, funcao_id: funcao.id })"
              >
                <span class="empresa-explorer__box">
                  <img
                    :src="iconFuncoes"
                    width="28"
                    height="36"
                    alt=""
                    class="empresa-explorer__icon"
                  />
                </span>
                <span class="empresa-explorer__name">{{ funcao.nome }}</span>
              </button>
            </li>
          </ul>

          <ul
            v-else-if="level === 'funcao' && funcionarios.length"
            class="empresa-explorer__grid"
            role="list"
          >
            <li v-for="func in funcionarios" :key="func.id">
              <button type="button" class="empresa-explorer__tile" disabled>
                <span class="empresa-explorer__box">
                  <img
                    :src="iconFuncionarios"
                    width="40"
                    height="28"
                    alt=""
                    class="empresa-explorer__icon"
                  />
                </span>
                <span class="empresa-explorer__name">{{ func.nome }}</span>
              </button>
            </li>
          </ul>

          <p v-else class="empresa-explorer__empty">Nenhum item neste nível.</p>
        </div>
      </div>

      <!-- Arquivos (todas as telas) -->
      <div
        class="empresa-explorer__panel empresa-explorer__panel--arquivos"
        :class="{ 'empresa-explorer__panel--drop': isDragging }"
      >
        <div class="empresa-explorer__panel-head empresa-explorer__panel-head--arquivos">
          <div class="empresa-explorer__panel-head-left">
            <h3 class="empresa-explorer__panel-title">{{ arquivosTitle }}</h3>
            <div class="empresa-explorer__filters">
              <div
                class="night-select night-select--filter"
                :class="{ 'is-open': filterSelectOpen === 'categoria' }"
                @click.stop
              >
                <button
                  type="button"
                  class="night-select__trigger"
                  :class="{
                    'is-placeholder': !filterCategoriaId,
                    'is-open': filterSelectOpen === 'categoria'
                  }"
                  aria-label="Categoria"
                  @click="toggleFilterSelect('categoria', $event)"
                >
                  <span>{{ filterCategoriaLabel }}</span>
                  <img
                    class="night-select__chevron"
                    :class="{ 'is-open': filterSelectOpen === 'categoria' }"
                    :src="iconChevronDown"
                    width="12"
                    height="12"
                    alt=""
                  />
                </button>
                <ul
                  v-if="filterSelectOpen === 'categoria'"
                  class="night-select__menu"
                  :class="filterMenuClass"
                  :style="filterMenuStyle"
                  role="listbox"
                >
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
                :class="{ 'is-open': filterSelectOpen === 'mes' }"
                @click.stop
              >
                <button
                  type="button"
                  class="night-select__trigger"
                  :class="{
                    'is-placeholder': !filterMes,
                    'is-open': filterSelectOpen === 'mes'
                  }"
                  aria-label="Mês"
                  @click="toggleFilterSelect('mes', $event)"
                >
                  <span>{{ filterMesLabel }}</span>
                  <img
                    class="night-select__chevron"
                    :class="{ 'is-open': filterSelectOpen === 'mes' }"
                    :src="iconChevronDown"
                    width="12"
                    height="12"
                    alt=""
                  />
                </button>
                <ul
                  v-if="filterSelectOpen === 'mes'"
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
                :class="{ 'is-open': filterSelectOpen === 'ano' }"
                @click.stop
              >
                <button
                  type="button"
                  class="night-select__trigger"
                  :class="{
                    'is-placeholder': !filterAno,
                    'is-open': filterSelectOpen === 'ano'
                  }"
                  aria-label="Ano"
                  @click="toggleFilterSelect('ano', $event)"
                >
                  <span>{{ filterAnoLabel }}</span>
                  <img
                    class="night-select__chevron"
                    :class="{ 'is-open': filterSelectOpen === 'ano' }"
                    :src="iconChevronDown"
                    width="12"
                    height="12"
                    alt=""
                  />
                </button>
                <ul
                  v-if="filterSelectOpen === 'ano'"
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
          <div class="empresa-explorer__actions">
            <button type="button" class="empresa-explorer__upload" @click="openUploadModal">
              <img :src="iconUpload" width="24" height="24" alt="" />
              <span>Upload de Arquivo</span>
            </button>
            <button type="button" class="empresa-explorer__cta" @click="openPastaModal">
              <img :src="iconNewFolder" width="20" height="16" alt="" />
              <span>Nova Pasta</span>
            </button>
          </div>
        </div>

        <div
          class="empresa-explorer__scroll empresa-explorer__scroll--fill"
          @click="clearSelection"
        >
          <ul
            v-if="pastas.length || arquivos.length"
            ref="arquivosGridRef"
            class="empresa-explorer__grid"
            role="list"
            tabindex="-1"
            @keydown="onGridKeydown($event, arquivosGridRef, pastas.length)"
          >
            <li v-for="pasta in pastas" :key="'p-' + pasta.id">
              <button
                type="button"
                class="empresa-explorer__tile"
                :class="{ 'is-drop-target': hoverKey === 'p:' + pasta.id }"
                @click.stop="enterPasta(pasta)"
                @dragover="dragOver($event, 'p:' + pasta.id)"
                @dragleave="dragLeave('p:' + pasta.id)"
                @drop="dragDrop($event, destinoPasta(pasta.id))"
              >
                <span class="empresa-explorer__box">
                  <img :src="iconFolder" width="40" height="40" alt="" />
                </span>
                <span class="empresa-explorer__name">{{ pasta.nome }}</span>
              </button>
            </li>
            <li v-for="(arquivo, index) in arquivos" :key="'a-' + arquivo.id">
              <button
                type="button"
                class="empresa-explorer__tile empresa-explorer__tile--arquivo"
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
                <span class="empresa-explorer__box" data-drag-preview>
                  <span
                    v-if="arquivoExtensao(arquivo)"
                    class="empresa-explorer__ext"
                  >{{ arquivoExtensao(arquivo) }}</span>
                  <img
                    :src="iconFiles"
                    width="28"
                    height="34"
                    alt=""
                    class="empresa-explorer__icon"
                  />
                </span>
                <span class="empresa-explorer__name">{{ arquivo.descricao }}</span>
              </button>
            </li>
          </ul>
          <p v-else class="empresa-explorer__empty">
            Nenhuma pasta ou arquivo. Arraste um arquivo para enviar.
          </p>
        </div>
      </div>
    </template>

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
      :open="moverOpen"
      :empresa-id="empresaId"
      :empresa-nome="empresaNome"
      :arquivo-ids="alvo.map((a) => a.id)"
      @close="moverOpen = false"
      @moved="onMoved"
    />
    <PermissoesArquivosModal
      :open="permissoesOpen"
      :empresa-id="empresaId"
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

    <!-- Modais -->
    <Teleport to="body">
      <div v-if="setorModalOpen" class="night-confirm" @click.self="setorModalOpen = false">
        <div class="night-confirm__modal" role="dialog" aria-modal="true">
          <h3 class="night-confirm__title">Novo Setor</h3>
          <label class="night-confirm__label">Nome</label>
          <input v-model="setorFormNome" class="night-confirm__input" type="text" maxlength="255" />
          <label class="night-confirm__label">Descrição (opcional)</label>
          <input
            v-model="setorFormDescricao"
            class="night-confirm__input"
            type="text"
            maxlength="500"
          />
          <div class="night-confirm__actions">
            <button
              type="button"
              class="night-confirm__btn night-confirm__btn--ghost"
              @click="setorModalOpen = false"
            >
              Cancelar
            </button>
            <button type="button" class="night-confirm__btn" :disabled="saving" @click="saveSetor">
              Salvar
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <Teleport to="body">
      <div v-if="funcaoModalOpen" class="night-confirm" @click.self="funcaoModalOpen = false">
        <div class="night-confirm__modal" role="dialog" aria-modal="true">
          <h3 class="night-confirm__title">Nova Função</h3>
          <label class="night-confirm__label">Nome</label>
          <input v-model="funcaoFormNome" class="night-confirm__input" type="text" maxlength="255" />
          <label class="night-confirm__label">Descrição (opcional)</label>
          <input
            v-model="funcaoFormDescricao"
            class="night-confirm__input"
            type="text"
            maxlength="500"
          />
          <div class="night-confirm__actions">
            <button
              type="button"
              class="night-confirm__btn night-confirm__btn--ghost"
              @click="funcaoModalOpen = false"
            >
              Cancelar
            </button>
            <button
              type="button"
              class="night-confirm__btn"
              :disabled="saving"
              @click="saveFuncao"
            >
              Salvar
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <Teleport to="body">
      <div
        v-if="funcionarioModalOpen"
        class="night-confirm"
        @click.self="funcionarioModalOpen = false"
      >
        <div class="night-confirm__modal" role="dialog" aria-modal="true">
          <h3 class="night-confirm__title">Novo Funcionário</h3>
          <label class="night-confirm__label">Nome</label>
          <input
            v-model="funcionarioFormNome"
            class="night-confirm__input"
            type="text"
            maxlength="255"
          />
          <label class="night-confirm__label">E-mail</label>
          <input
            v-model="funcionarioFormEmail"
            class="night-confirm__input"
            type="email"
            maxlength="255"
          />
          <p class="night-confirm__hint">
            Será vinculado ao setor e à função atuais.
          </p>
          <div class="night-confirm__actions">
            <button
              type="button"
              class="night-confirm__btn night-confirm__btn--ghost"
              @click="funcionarioModalOpen = false"
            >
              Cancelar
            </button>
            <button
              type="button"
              class="night-confirm__btn"
              :disabled="saving"
              @click="saveFuncionario"
            >
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

    <Teleport to="body">
      <div v-if="uploadModalOpen" class="night-confirm" @click.self="uploadModalOpen = false">
        <div class="night-confirm__modal night-confirm__modal--upload" role="dialog" aria-modal="true">
          <h3 class="night-confirm__title">
            {{ uploadFile?.name || 'Upload de Arquivo' }}
          </h3>

          <label class="night-confirm__label">Nome</label>
          <input v-model="uploadNome" class="night-confirm__input" type="text" maxlength="255" />

          <label class="night-confirm__label">Arquivo</label>
          <input
            ref="uploadFileInputRef"
            class="night-confirm__file-native"
            type="file"
            accept=".jpeg,.jpg,.png,.pdf,.doc,.docx,.mp4,.mov,.wmv,.mkv,.webm"
            @change="onPickFile"
          />
          <button
            type="button"
            class="night-confirm__file-btn"
            :class="{ 'has-file': !!uploadFile }"
            @click="openFilePicker"
          >
            <img :src="iconUpload" width="20" height="20" alt="" />
            <span>{{ uploadFile?.name || 'Escolher arquivo' }}</span>
          </button>

          <div class="night-confirm__row">
            <div class="night-confirm__col">
              <label class="night-confirm__label">Mês</label>
              <div
                class="night-select"
                :class="{ 'is-open': uploadSelectOpen === 'mes' }"
                @click.stop
              >
                <button
                  type="button"
                  class="night-select__trigger"
                  :class="{ 'is-open': uploadSelectOpen === 'mes' }"
                  @click="toggleUploadSelect('mes')"
                >
                  <span>{{ uploadMesLabel }}</span>
                  <img
                    class="night-select__chevron"
                    :class="{ 'is-open': uploadSelectOpen === 'mes' }"
                    :src="iconChevronDown"
                    width="14"
                    height="14"
                    alt=""
                  />
                </button>
                <ul
                  v-if="uploadSelectOpen === 'mes'"
                  class="night-select__menu"
                  role="listbox"
                >
                  <li v-for="m in MESES" :key="m.value">
                    <button
                      type="button"
                      class="night-select__option"
                      :class="{ 'is-active': uploadMes === m.value }"
                      role="option"
                      @click="selectUploadMes(m.value)"
                    >
                      {{ m.label }}
                    </button>
                  </li>
                </ul>
              </div>
            </div>
            <div class="night-confirm__col">
              <label class="night-confirm__label">Ano</label>
              <div
                class="night-select"
                :class="{ 'is-open': uploadSelectOpen === 'ano' }"
                @click.stop
              >
                <button
                  type="button"
                  class="night-select__trigger"
                  :class="{ 'is-open': uploadSelectOpen === 'ano' }"
                  @click="toggleUploadSelect('ano')"
                >
                  <span>{{ uploadAno }}</span>
                  <img
                    class="night-select__chevron"
                    :class="{ 'is-open': uploadSelectOpen === 'ano' }"
                    :src="iconChevronDown"
                    width="14"
                    height="14"
                    alt=""
                  />
                </button>
                <ul
                  v-if="uploadSelectOpen === 'ano'"
                  class="night-select__menu night-select__menu--scroll"
                  role="listbox"
                >
                  <li v-for="y in anosFiltro" :key="y">
                    <button
                      type="button"
                      class="night-select__option"
                      :class="{ 'is-active': uploadAno === y }"
                      role="option"
                      @click="selectUploadAno(y)"
                    >
                      {{ y }}
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <label class="night-confirm__label">Selecione a categoria</label>
          <div
            class="night-select"
            :class="{ 'is-open': uploadSelectOpen === 'categoria' }"
            @click.stop
          >
            <button
              type="button"
              class="night-select__trigger"
              :class="{ 'is-placeholder': !uploadCategoriaId, 'is-open': uploadSelectOpen === 'categoria' }"
              @click="toggleUploadSelect('categoria')"
            >
              <span>{{ uploadCategoriaLabel }}</span>
              <img
                class="night-select__chevron"
                :class="{ 'is-open': uploadSelectOpen === 'categoria' }"
                :src="iconChevronDown"
                width="14"
                height="14"
                alt=""
              />
            </button>
            <ul v-if="uploadSelectOpen === 'categoria'" class="night-select__menu" role="listbox">
              <li v-if="!categorias.length" class="night-select__empty">Nenhuma categoria</li>
              <li v-for="cat in categorias" :key="cat.id">
                <button
                  type="button"
                  class="night-select__option"
                  :class="{ 'is-active': uploadCategoriaId === cat.id }"
                  role="option"
                  @click="selectUploadCategoria(cat.id)"
                >
                  {{ cat.nome }}
                </button>
              </li>
            </ul>
          </div>
          <p v-if="!categorias.length" class="night-confirm__hint">
            Nenhuma categoria cadastrada. Crie em “Categorias de arquivo”.
          </p>

          <div class="night-confirm__acessos">
            <p class="night-confirm__acessos-title">Acessos</p>
            <p class="night-confirm__acessos-value">{{ acessoUploadLabel }}</p>
          </div>

          <div class="night-confirm__actions">
            <button
              type="button"
              class="night-confirm__btn night-confirm__btn--ghost"
              @click="uploadModalOpen = false"
            >
              Cancelar
            </button>
            <button
              type="button"
              class="night-confirm__btn"
              :disabled="saving"
              @click="saveUpload"
            >
              Upload
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </section>
</template>

<style lang="scss" scoped>
.empresa-explorer {
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

.empresa-explorer__heading {
  display: flex;
  align-items: center;
  gap: 1px;
  min-width: 0;
  flex-shrink: 0;
}

.empresa-explorer__back {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  padding: 0;
  border: none;
  border-radius: 0;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0.7;

  &:hover {
    opacity: 1;
    background: transparent;
  }
}

.empresa-explorer__crumb {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  min-width: 0;
  font-family: var(--night-font, 'Inter', sans-serif);
  font-size: 14px;
  color: #fffcff;
}

.empresa-explorer__crumb-sep {
  opacity: 0.5;
}

.empresa-explorer__crumb-link {
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

.empresa-explorer__status,
.empresa-explorer__empty {
  margin: 0;
  color: #f7f7f7;
  opacity: 0.7;
  font-family: var(--night-font, 'Inter', sans-serif);
  font-size: 0.95rem;
}

.empresa-explorer__panel {
  background: var(--night-surface, #132438);
  border: 1px solid var(--night-surface-border, rgba(176, 141, 87, 0.18));
  border-radius: var(--night-radius, 20px);
  padding: 24px 28px 28px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  min-height: 0;
  /* visible para os dropdowns dos filtros não serem cortados */
  overflow: visible;

  &--hierarchy {
    flex: 0 0 auto;
  }

  &--arquivos {
    flex: 1 1 auto;
    min-height: 0;
  }

  &--drop {
    border-color: #b08d57;
    box-shadow: 0 0 0 2px rgba(176, 141, 87, 0.35);
  }
}

.empresa-explorer__panel-head {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 20px;
  flex-shrink: 0;
  position: relative;
  z-index: 6;

  &--arquivos {
    align-items: flex-start;
  }
}

.empresa-explorer__panel-head-left {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
  flex: 1 1 auto;
}

.empresa-explorer__filters {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  position: relative;
  z-index: 5;
}

.night-select--filter {
  margin-bottom: 0;
  min-width: 120px;
  max-width: 180px;
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
  }
}

.empresa-explorer__scroll {
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

.empresa-explorer__panel-title {
  margin: 0;
  font-family: var(--night-font, 'Inter', sans-serif);
  font-size: 18px;
  font-weight: 700;
  color: #fffcff;
}

.empresa-explorer__panel-sub {
  margin: 4px 0 0;
  font-family: var(--night-font, 'Inter', sans-serif);
  font-size: 12px;
  color: #b08d57;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.empresa-explorer__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: flex-end;
}

.empresa-explorer__upload {
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
  min-width: 0;
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

.empresa-explorer__cta {
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
  letter-spacing: 0;
  text-transform: uppercase;
  white-space: nowrap;
  transition: all 0.2s ease;

  span {
    color: #ffffff;
  }

  &:hover {
    background: #c29f68;
    box-shadow: 0 4px 12px rgba(176, 141, 87, 0.3);
  }
}

.empresa-explorer__grid {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, 110px);
  gap: 16px;
}

.empresa-explorer__tile {
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

  &:disabled {
    cursor: default;
  }

  &:hover:not(:disabled) .empresa-explorer__box {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(176, 141, 87, 0.3);
  }

  &:focus-visible {
    outline: none;
  }

  &--arquivo {
    user-select: none;
  }

  &.is-selected .empresa-explorer__box,
  &.is-selected:hover .empresa-explorer__box {
    border-color: #fffcff;
    box-shadow: 0 0 0 1px #fffcff;
    background: rgba(255, 255, 255, 0.12);
  }

  &.is-dragging {
    opacity: 0.45;
  }

  &.is-drop-target .empresa-explorer__box {
    border: 1px dashed #b08d57;
    box-shadow: 0 0 0 1px #b08d57;
    background: rgba(176, 141, 87, 0.22);
  }
}

.empresa-explorer__grid:focus {
  outline: none;
}

.empresa-explorer__crumb-link.is-drop-target {
  color: #b08d57;
  opacity: 1;
  border-radius: 6px;
  outline: 1px dashed #b08d57;
  outline-offset: 3px;
}

.empresa-explorer__box {
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

.empresa-explorer__ext {
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

.empresa-explorer__icon {
  filter: brightness(0) saturate(100%) invert(67%) sepia(18%) saturate(742%) hue-rotate(7deg)
    brightness(95%) contrast(88%);
}

.empresa-explorer__name {
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

  &--upload {
    width: min(460px, 100%);
    max-height: min(90vh, 720px);
    overflow-x: hidden;
    overflow-y: auto;
    overscroll-behavior: contain;
  }
}

.night-confirm__row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  position: relative;
  /* sobe junto com o select aberto (evita texto vazando por cima do menu) */
  z-index: 2;

  &:has(.night-select.is-open) {
    z-index: 50;
  }
}

.night-confirm__col {
  min-width: 0;
  position: relative;
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
  opacity: 1;
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

.night-confirm__acessos {
  margin: 4px 0 16px;
  padding: 12px 14px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.night-confirm__acessos-title {
  margin: 0 0 6px;
  color: #b08d57;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
}

.night-confirm__acessos-value {
  margin: 0;
  color: #fffcff;
  font-size: 14px;
  font-weight: 500;
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

.night-confirm__file-native {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.night-confirm__file-btn {
  width: 100%;
  margin-bottom: 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  border-radius: 8px;
  border: 1px dashed rgba(176, 141, 87, 0.55);
  background: rgba(255, 255, 255, 0.04);
  color: #fffcff;
  font-family: var(--night-font, 'Inter', sans-serif);
  font-size: 13px;
  text-align: left;
  cursor: pointer;
  box-sizing: border-box;

  span {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &.has-file {
    border-style: solid;
    border-color: rgba(176, 141, 87, 0.7);
    background: rgba(176, 141, 87, 0.12);
  }

  &:hover {
    border-color: #b08d57;
    background: rgba(176, 141, 87, 0.15);
  }
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

@media (max-width: 768px) {
  .empresa-explorer {
    height: auto;
    overflow: visible;
  }

  .empresa-explorer__panel--arquivos {
    flex: 0 0 auto;
    max-height: min(58dvh, 520px);
  }

  .empresa-explorer__panel {
    padding: 18px 16px 22px;
  }

  .empresa-explorer__panel-head {
    flex-direction: column;
    align-items: stretch;
  }

  .empresa-explorer__scroll--rows {
    max-height: calc(var(--tile-row) * 2 + 14px);
  }
}
</style>
