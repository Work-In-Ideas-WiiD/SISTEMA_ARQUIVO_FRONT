<script setup lang="ts">
import { computed, ref, watch } from 'vue'
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
  type IGetArquivosDataRes
} from '@/services/http/arquivos'
import { postAddEmpresaToArquivo } from '@/services/http/administradores'
import { useAuthStore } from '@/stores/auth'
import { getApiErrorMessage } from '@/utils/apiError'
import { openFile } from '@/utils/openFile'
import { usePageFileDrop } from '@/composables/usePageFileDrop'
import UploadDropOverlay from '@/components/UploadDropOverlay/UploadDropOverlay.vue'
import iconChevronLeft from '@/assets/imgs/administradores/icon-chevron-left.svg'
import iconSetores from '@/assets/imgs/dashboard/icon-menu-setores.svg'
import iconFuncoes from '@/assets/imgs/dashboard/icon-menu-funcoes.svg'
import iconFuncionarios from '@/assets/imgs/dashboard/icon-menu-funcionarios.svg'
import iconFolder from '@/assets/imgs/arquivos/folder.svg'
import iconFiles from '@/assets/imgs/dashboard/icon-menu-files.svg'

type HierarchyLevel = 'empresa' | 'setor' | 'funcao'

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

const isInsidePasta = computed(() => Boolean(pastaId.value))

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

async function loadArquivos() {
  try {
    const { data } = await getArquivos(1, '', {
      empresa_id: empresaId.value,
      pasta_id: pastaId.value || undefined,
      ...(funcaoId.value
        ? { funcao_id: funcaoId.value }
        : setorId.value
          ? { setor_id: setorId.value }
          : { somente_livres: true })
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
    await Promise.all([loadHierarchyItems(), loadPastas(), loadArquivos()])
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
  uploadModalOpen.value = true
}

function onPickFile(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  uploadFile.value = file
  if (!uploadNome.value) {
    uploadNome.value = file.name.replace(/\.[^.]+$/, '')
  }
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

async function uploadSelectedFile(file: File, nome?: string) {
  saving.value = true
  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append(
      'descricao',
      (nome || file.name.replace(/\.[^.]+$/, '')).trim() || 'Arquivo'
    )
    formData.append('empresa_id', empresaId.value)
    if (pastaId.value) formData.append('pasta_id', pastaId.value)
    // Compartilha com o nível atual (membros da empresa via vínculos).
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

async function saveUpload() {
  if (!uploadFile.value) {
    toast.error('Selecione um arquivo')
    return
  }
  await uploadSelectedFile(uploadFile.value, uploadNome.value)
}

const { isDragging } = usePageFileDrop((file) => {
  void uploadSelectedFile(file)
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
    await refreshAll()
  },
  { immediate: true }
)
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
          @click="router.push(routeForLevel({ setorId: null, funcaoId: null, pastaId: null }))"
        >
          {{ empresaNome }}
        </button>
        <template v-if="setorId">
          <span class="empresa-explorer__crumb-sep">›</span>
          <button
            type="button"
            class="empresa-explorer__crumb-link"
            @click="router.push(routeForLevel({ setorId, funcaoId: null, pastaId: null }))"
          >
            {{ setorNome }}
          </button>
        </template>
        <template v-if="funcaoId">
          <span class="empresa-explorer__crumb-sep">›</span>
          <button
            type="button"
            class="empresa-explorer__crumb-link"
            @click="router.push(routeForLevel({ setorId, funcaoId, pastaId: null }))"
          >
            {{ funcaoNome }}
          </button>
        </template>
        <template v-for="(p, idx) in breadcrumbPastas" :key="p.id">
          <span class="empresa-explorer__crumb-sep">›</span>
          <button
            type="button"
            class="empresa-explorer__crumb-link"
            :class="{ 'is-current': idx === breadcrumbPastas.length - 1 }"
            @click="router.push(routeForLevel({ pastaId: p.id }))"
          >
            {{ p.nome }}
          </button>
        </template>
      </nav>
    </div>

    <p v-if="loading" class="empresa-explorer__status">Carregando…</p>

    <template v-else>
      <!-- Hierarquia: Setores / Funções / Funcionários -->
      <div v-if="!isInsidePasta" class="empresa-explorer__panel">
        <div class="empresa-explorer__panel-head">
          <div>
            <h3 class="empresa-explorer__panel-title">{{ hierarchyTitle }}</h3>
            <p class="empresa-explorer__panel-sub">{{ hierarchySubtitle }}</p>
          </div>
          <button type="button" class="empresa-explorer__btn" @click="openNovoHierarchyModal">
            {{ novoBtnLabel }}
          </button>
        </div>

        <ul
          v-if="level === 'empresa' && setores.length"
          class="empresa-explorer__grid"
          role="list"
        >
          <li v-for="setor in setores" :key="setor.id">
            <button type="button" class="empresa-explorer__tile" @click="enterSetor(setor)">
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
            <button type="button" class="empresa-explorer__tile" @click="enterFuncao(funcao)">
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

        <p v-else class="empresa-explorer__empty">
          Nenhum item neste nível.
        </p>
      </div>

      <!-- Arquivos (todas as telas) -->
      <div
        class="empresa-explorer__panel"
        :class="{ 'empresa-explorer__panel--drop': isDragging }"
      >
        <div class="empresa-explorer__panel-head">
          <h3 class="empresa-explorer__panel-title">{{ arquivosTitle }}</h3>
          <div class="empresa-explorer__actions">
            <button type="button" class="empresa-explorer__btn" @click="openUploadModal">
              Upload de Arquivo
            </button>
            <button type="button" class="empresa-explorer__btn" @click="openPastaModal">
              Nova Pasta
            </button>
          </div>
        </div>

        <ul
          v-if="pastas.length || arquivos.length"
          class="empresa-explorer__grid"
          role="list"
        >
          <li v-for="pasta in pastas" :key="'p-' + pasta.id">
            <button type="button" class="empresa-explorer__tile" @click="enterPasta(pasta)">
              <span class="empresa-explorer__box">
                <img :src="iconFolder" width="40" height="40" alt="" />
              </span>
              <span class="empresa-explorer__name">{{ pasta.nome }}</span>
            </button>
          </li>
          <li v-for="arquivo in arquivos" :key="'a-' + arquivo.id">
            <button type="button" class="empresa-explorer__tile" @click="openArquivo(arquivo)">
              <span class="empresa-explorer__box">
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
    </template>

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
        <div class="night-confirm__modal" role="dialog" aria-modal="true">
          <h3 class="night-confirm__title">Upload de Arquivo</h3>
          <label class="night-confirm__label">Nome</label>
          <input v-model="uploadNome" class="night-confirm__input" type="text" maxlength="255" />
          <label class="night-confirm__label">Arquivo</label>
          <input
            class="night-confirm__input"
            type="file"
            accept=".jpeg,.jpg,.png,.pdf,.doc,.docx,.mp4,.mov,.wmv,.mkv,.webm"
            @change="onPickFile"
          />
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
              Enviar
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
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.empresa-explorer__heading {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.empresa-explorer__back {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover {
    background: rgba(176, 141, 87, 0.2);
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

  &--drop {
    border-color: #b08d57;
    box-shadow: 0 0 0 2px rgba(176, 141, 87, 0.35);
  }
}

.empresa-explorer__panel-head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 20px;
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
}

.empresa-explorer__btn {
  border: 0;
  border-radius: 999px;
  padding: 10px 18px;
  background: #b08d57;
  color: #0b1b2b;
  font-family: var(--night-font, 'Inter', sans-serif);
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    background: #c29f68;
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
}

.empresa-explorer__box {
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

@media (max-width: 768px) {
  .empresa-explorer__panel {
    padding: 18px 16px 22px;
  }

  .empresa-explorer__panel-head {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
