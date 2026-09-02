<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useAuthStore } from '@/stores/auth'
import { useUploadProgressStore } from '@/stores/uploadProgress'
import { usePageFileDrop } from '@/composables/usePageFileDrop'
import UploadDropOverlay from '@/components/UploadDropOverlay/UploadDropOverlay.vue'
import iconChevronLeft from '@/assets/imgs/administradores/icon-chevron-left.svg'
import iconChevronDown from '@/assets/imgs/administradores/icon-chevron-down.svg'
import iconUpload from '@/assets/imgs/arquivos/Upload.svg'
import { postArquivo } from '@/services/http/arquivos'
import { getAllEmpresas } from '@/services/http/empresas'
import { postAddEmpresaToArquivo } from '@/services/http/administradores'
import { getAllSetores, type ISetor } from '@/services/http/setores'
import { getAllFuncoes, type IFuncao } from '@/services/http/funcoes'
import { getApiErrorMessage } from '@/utils/apiError'
import { validateUploadFile } from '@/utils/fileUploadValidation'

const router = useRouter()
const toast = useToast()
const authStore = useAuthStore()
const uploadStore = useUploadProgressStore()

const isAdmin = computed(() => authStore.userRole === 'administrador')

const nome = ref('')
const empresaId = ref('')
const empresas = ref<{ id: string; nome: string }[]>([])
const empresaOpen = ref(false)
const empresaFilterRef = ref<HTMLElement | null>(null)
const arquivo = ref<File | null>(null)
const fetching = ref(false)
const fileInputRef = ref<HTMLInputElement | null>(null)

const setoresDisponiveis = ref<ISetor[]>([])
const funcoesDisponiveis = ref<IFuncao[]>([])
const setoresSelecionados = ref<string[]>([])
const funcoesSelecionadas = ref<string[]>([])

const empresaLabel = computed(() => {
  if (!empresaId.value) return 'Empresa (opcional)'
  return empresas.value.find((e) => e.id === empresaId.value)?.nome ?? 'Empresa (opcional)'
})

const { isDragging } = usePageFileDrop((file) => {
  applySelectedFile(file, true)
})

function onDocumentClick(event: MouseEvent) {
  if (empresaFilterRef.value && !empresaFilterRef.value.contains(event.target as Node)) {
    empresaOpen.value = false
  }
}

onMounted(async () => {
  document.addEventListener('click', onDocumentClick)

  try {
    if (isAdmin.value) {
      const { data } = await getAllEmpresas()
      empresas.value = data.data
    }
  } catch (error) {
    console.error(error)
    toast.error('Erro ao carregar empresas')
  }
})

onUnmounted(() => {
  document.removeEventListener('click', onDocumentClick)
})

watch(empresaId, async (id) => {
  setoresSelecionados.value = []
  funcoesSelecionadas.value = []
  setoresDisponiveis.value = []
  funcoesDisponiveis.value = []

  if (id) {
    await loadSetoresFuncoes(id)
  }
})

function toggleEmpresaMenu() {
  empresaOpen.value = !empresaOpen.value
}

function selectEmpresa(id: string) {
  empresaId.value = id
  empresaOpen.value = false
}

async function loadSetoresFuncoes(empresa: string) {
  try {
    const [setoresRes, funcoesRes] = await Promise.all([
      getAllSetores(empresa),
      getAllFuncoes(empresa)
    ])
    setoresDisponiveis.value = setoresRes.data
    funcoesDisponiveis.value = funcoesRes.data
  } catch (error) {
    console.error(error)
    toast.error('Erro ao carregar setores/funções')
  }
}

function applySelectedFile(file: File, autoUpload: boolean) {
  const validation = validateUploadFile(file, 'arquivo')
  if (!validation.ok) {
    toast.error(validation.message)
    return
  }

  arquivo.value = file

  if (!autoUpload) return

  // Drag-and-drop: anexa o arquivo e só inicia o envio se o formulário estiver completo
  if (!nome.value.trim()) {
    toast.error('Arquivo anexado. Preencha o nome para enviar.')
    return
  }

  if (isAdmin.value && !empresaId.value) {
    toast.error('Arquivo anexado. Selecione uma empresa para enviar.')
    return
  }

  void handleSubmit()
}

function onFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    applySelectedFile(target.files[0], false)
  }
}

function toggleSetor(id: string) {
  const idx = setoresSelecionados.value.indexOf(id)
  if (idx >= 0) {
    setoresSelecionados.value.splice(idx, 1)
  } else {
    setoresSelecionados.value.push(id)
  }
}

function toggleFuncao(id: string) {
  const idx = funcoesSelecionadas.value.indexOf(id)
  if (idx >= 0) {
    funcoesSelecionadas.value.splice(idx, 1)
  } else {
    funcoesSelecionadas.value.push(id)
  }
}

async function handleSubmit() {
  if (fetching.value) return

  if (!nome.value.trim()) {
    toast.error('Preencha o nome do arquivo')
    return
  }

  if (!arquivo.value) {
    toast.error('Selecione um arquivo')
    return
  }

  if (isAdmin.value && !empresaId.value) {
    toast.error('Selecione uma empresa')
    return
  }

  const validation = validateUploadFile(arquivo.value, 'arquivo')
  if (!validation.ok) {
    toast.error(validation.message)
    return
  }

  const uploadId = uploadStore.startUpload(arquivo.value.name)

  try {
    fetching.value = true
    const formData = new FormData()
    formData.append('descricao', nome.value)
    formData.append('file', arquivo.value)
    formData.append('empresa_id', empresaId.value)

    setoresSelecionados.value.forEach((id) => {
      formData.append('setores[]', id)
    })
    funcoesSelecionadas.value.forEach((id) => {
      formData.append('funcoes[]', id)
    })

    const { data: arquivoRes } = await postArquivo(formData, (percent) => {
      uploadStore.setProgress(uploadId, percent)
    })

    await postAddEmpresaToArquivo([empresaId.value], arquivoRes.id)

    uploadStore.setSuccess(uploadId)
    toast.success('Arquivo cadastrado')
    setTimeout(() => {
      router.push('/dashboard/arquivos')
    }, 1500)
  } catch (error) {
    uploadStore.setError(uploadId, getApiErrorMessage(error, 'Erro ao cadastrar arquivo'))
    toast.error(getApiErrorMessage(error, 'Erro ao cadastrar arquivo'))
    console.error(error)
  } finally {
    fetching.value = false
    if (fileInputRef.value) {
      fileInputRef.value.value = ''
    }
  }
}

function goBack() {
  router.push('/dashboard/arquivos')
}
</script>

<template>
  <section class="novo-arquivo">
    <UploadDropOverlay :visible="isDragging" />

    <div class="novo-arquivo__heading">
      <button
        type="button"
        class="novo-arquivo__back"
        aria-label="Voltar para Arquivos"
        @click="goBack"
      >
        <img :src="iconChevronLeft" width="24" height="24" alt="" />
      </button>
      <h2 class="novo-arquivo__title dashboard_title">NOVO ARQUIVO</h2>
    </div>

    <div class="novo-arquivo__panel">
      <form class="novo-arquivo__form" @submit.prevent="handleSubmit">
        <div class="novo-arquivo__field">
          <label class="novo-arquivo__label" for="nome">NOME</label>
          <input
            id="nome"
            v-model="nome"
            type="text"
            class="novo-arquivo__input"
            placeholder="Nome do arquivo"
          />
        </div>

        <div v-if="isAdmin" class="novo-arquivo__field">
          <span class="novo-arquivo__label" id="empresa-label">EMPRESA</span>
          <div ref="empresaFilterRef" class="novo-arquivo__select">
            <button
              type="button"
              class="novo-arquivo__select-trigger"
              :class="{ 'is-placeholder': !empresaId }"
              aria-haspopup="listbox"
              aria-labelledby="empresa-label"
              :aria-expanded="empresaOpen"
              @click.stop="toggleEmpresaMenu"
            >
              <span>{{ empresaLabel }}</span>
              <img
                class="novo-arquivo__select-chevron"
                :class="{ 'novo-arquivo__select-chevron--open': empresaOpen }"
                :src="iconChevronDown"
                width="16"
                height="9"
                alt=""
              />
            </button>

            <ul
              v-if="empresaOpen"
              class="novo-arquivo__select-menu"
              role="listbox"
              aria-labelledby="empresa-label"
            >
              <li>
                <button
                  type="button"
                  class="novo-arquivo__select-option"
                  role="option"
                  :aria-selected="!empresaId"
                  :class="{ 'is-active': !empresaId }"
                  @click="selectEmpresa('')"
                >
                  Empresa (opcional)
                </button>
              </li>
              <li v-for="emp in empresas" :key="emp.id">
                <button
                  type="button"
                  class="novo-arquivo__select-option"
                  role="option"
                  :aria-selected="empresaId === emp.id"
                  :class="{ 'is-active': empresaId === emp.id }"
                  @click="selectEmpresa(emp.id)"
                >
                  {{ emp.nome }}
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div class="novo-arquivo__field">
          <label class="novo-arquivo__label">
            Setor <span class="novo-arquivo__optional">(opcional)</span>
          </label>
          <div class="novo-arquivo__checks">
            <div v-if="!empresaId" class="novo-arquivo__checks-empty">
              Selecione uma empresa primeiro
            </div>
            <div v-else-if="setoresDisponiveis.length === 0" class="novo-arquivo__checks-empty">
              Nenhum setor cadastrado
            </div>
            <label
              v-for="setor in setoresDisponiveis"
              :key="setor.id"
              class="novo-arquivo__check"
            >
              <input
                type="checkbox"
                :checked="setoresSelecionados.includes(setor.id)"
                @change="toggleSetor(setor.id)"
              />
              <span>{{ setor.nome }}</span>
            </label>
          </div>
        </div>

        <div class="novo-arquivo__field">
          <label class="novo-arquivo__label">
            Função <span class="novo-arquivo__optional">(opcional)</span>
          </label>
          <div class="novo-arquivo__checks">
            <div v-if="!empresaId" class="novo-arquivo__checks-empty">
              Selecione uma empresa primeiro
            </div>
            <div v-else-if="funcoesDisponiveis.length === 0" class="novo-arquivo__checks-empty">
              Nenhuma função cadastrada
            </div>
            <label
              v-for="funcao in funcoesDisponiveis"
              :key="funcao.id"
              class="novo-arquivo__check"
            >
              <input
                type="checkbox"
                :checked="funcoesSelecionadas.includes(funcao.id)"
                @change="toggleFuncao(funcao.id)"
              />
              <span>{{ funcao.nome }}</span>
            </label>
          </div>
        </div>

        <div class="novo-arquivo__upload-wrap">
          <label class="novo-arquivo__upload">
            <img class="novo-arquivo__upload-icon" :src="iconUpload" width="24" height="24" alt="" />
            <span class="novo-arquivo__upload-text">
              {{ arquivo ? arquivo.name : 'Fazer upload do arquivo' }}
            </span>
            <input
              ref="fileInputRef"
              type="file"
              hidden
              accept=".jpeg,.jpg,.png,.mp4,.mov,.wmv,.mkv,.webm"
              @change="onFileChange"
            />
          </label>
        </div>

        <button type="submit" class="novo-arquivo__submit" :disabled="fetching">
          {{ fetching ? 'Enviando…' : 'ADICIONAR ARQUIVO' }}
        </button>
      </form>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.novo-arquivo {
  width: 100%;
  max-width: 100%;
  min-width: 0;

  &__heading {
    display: flex;
    align-items: center;
    gap: 1px;
    margin-bottom: 42px;
  }

  &__back {
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

  &__title {
    margin: 0;
  }

  &__panel {
    width: 800px;
    max-width: 100%;
    min-height: 481px;
    box-sizing: border-box;
    padding: 48px 75px 56px;
    background: rgba(121, 121, 121, 0.1);
    border-radius: var(--night-radius, 30px);
  }

  &__form {
    width: 650px;
    max-width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 24px;
  }

  &__field {
    width: 650px;
    max-width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  &__label {
    display: block;
    height: 18px;
    padding-left: 20px;
    box-sizing: border-box;
    font-family: 'Source Code Pro', monospace;
    font-size: 14px;
    font-weight: 700;
    font-style: normal;
    line-height: 18px;
    letter-spacing: 0;
    color: #f7f7f7;
    opacity: 0.7;
    text-transform: uppercase;
  }

  &__optional {
    font-weight: 400;
    text-transform: none;
    opacity: 0.8;
  }

  &__input {
    width: 650px;
    max-width: 100%;
    height: 49px;
    box-sizing: border-box;
    padding: 0 20px;
    border: none;
    border-radius: 30px;
    background: rgba(121, 121, 121, 0.3);
    font-family: 'Source Code Pro', monospace;
    font-size: 14px;
    font-weight: 300;
    line-height: 1;
    color: #ffffff;
    outline: none;
    appearance: none;

    &::placeholder {
      color: #ffffff;
      opacity: 0.6;
    }
  }

  &__select {
    position: relative;
    width: 650px;
    max-width: 100%;
    z-index: 5;
  }

  &__select-trigger {
    width: 100%;
    height: 49px;
    border: none;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 0 20px;
    background: rgba(121, 121, 121, 0.3);
    border-radius: 30px;
    font-family: 'Source Code Pro', monospace;
    font-size: 14px;
    font-weight: 300;
    line-height: 1;
    color: #ffffff;
    cursor: pointer;
    text-align: left;

    span {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    &.is-placeholder {
      color: #f7f7f7;

      span {
        opacity: 0.7;
      }
    }

    &:hover {
      background: rgba(121, 121, 121, 0.4);
    }
  }

  &__select-chevron {
    flex-shrink: 0;
    opacity: 0.7;
    transition: transform 0.2s ease;

    &--open {
      transform: rotate(180deg);
    }
  }

  &__select-menu {
    position: absolute;
    top: calc(100% + 8px);
    left: 0;
    width: 100%;
    max-height: 240px;
    margin: 0;
    padding: 10px;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 4px;
    overflow-y: auto;
    background: rgba(33, 33, 33, 0.96);
    border: 1px solid rgba(121, 121, 121, 0.45);
    border-radius: 16px;
    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.35);
    z-index: 10;
    box-sizing: border-box;
  }

  &__select-option {
    width: 100%;
    border: none;
    background: transparent;
    text-align: left;
    padding: 10px 14px;
    font-family: 'Source Code Pro', monospace;
    font-size: 14px;
    font-weight: 300;
    line-height: 1.2;
    color: #f7f7f7;
    border-radius: 10px;
    cursor: pointer;
    white-space: nowrap;

    &:hover {
      background: rgba(121, 121, 121, 0.35);
    }

    &.is-active {
      background: #ff00ff;
      color: #ffffff;
      font-weight: 400;
    }
  }

  &__checks {
    width: 650px;
    max-width: 100%;
    box-sizing: border-box;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    padding: 14px 16px;
    min-height: 49px;
    border-radius: 30px;
    background: rgba(121, 121, 121, 0.3);
    max-height: 160px;
    overflow-y: auto;
  }

  &__checks-empty {
    font-family: 'Source Code Pro', monospace;
    font-size: 13px;
    font-weight: 300;
    color: #f7f7f7;
    opacity: 0.6;
    font-style: italic;
  }

  &__check {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 6px 12px;
    border-radius: 20px;
    background: rgba(33, 33, 33, 0.4);
    cursor: pointer;
    font-family: 'Source Code Pro', monospace;
    font-size: 13px;
    font-weight: 300;
    color: #f7f7f7;

    input {
      cursor: pointer;
    }
  }

  &__upload-wrap {
    width: 650px;
    max-width: 100%;
    display: flex;
    justify-content: center;
    padding-top: 8px;
  }

  &__upload {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    min-width: 281px;
    max-width: 100%;
    height: 49px;
    padding: 0 24px;
    border: 3px solid #f7f7f7;
    border-radius: 30px;
    background: rgba(121, 121, 121, 0.3);
    cursor: pointer;

    &:hover {
      opacity: 0.9;
    }
  }

  &__upload-icon {
    flex-shrink: 0;
    width: 24px;
    height: 24px;
  }

  &__upload-text {
    font-family: 'Source Code Pro', monospace;
    font-size: 14px;
    font-weight: 700;
    line-height: 1;
    color: #f7f7f7;
    text-transform: uppercase;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__submit {
    width: 243px;
    height: 46px;
    margin-top: 16px;
    align-self: center;
    border: none;
    border-radius: 30px;
    background: #ff00ff;
    color: #ffffff;
    font-family: 'Source Code Pro', monospace;
    font-size: 16px;
    font-weight: 700;
    line-height: 1;
    letter-spacing: 0;
    text-transform: uppercase;
    cursor: pointer;

    &:hover:not(:disabled) {
      opacity: 0.92;
    }

    &:disabled {
      opacity: 0.7;
      cursor: wait;
    }
  }

  @media (max-width: 900px) {
    &__panel {
      width: 100%;
      min-height: auto;
      padding: 32px 24px 40px;
    }

    &__form,
    &__field,
    &__input,
    &__select,
    &__checks,
    &__upload-wrap {
      width: 100%;
      max-width: 100%;
    }
  }

  @media (max-width: 768px) {
    &__heading {
      margin-bottom: 24px;
    }

    &__panel {
      padding: 28px 20px 32px;
    }

    &__upload-wrap {
      justify-content: stretch;
    }

    &__upload {
      width: 100%;
      min-width: 0;
    }

    &__submit {
      width: 100%;
      max-width: 100%;
    }
  }

  @media (max-width: 480px) {
    &__heading {
      margin-bottom: 16px;
    }

    &__panel {
      padding: 24px 16px 28px;
      border-radius: 20px;
    }

    &__form {
      gap: 18px;
    }

    &__label {
      font-size: 12px;
    }

    &__input,
    &__select-trigger {
      height: 44px;
      font-size: 13px;
    }

    &__checks {
      padding: 12px 14px;
      max-height: 140px;
    }

    &__upload {
      height: 44px;
      padding: 0 16px;
    }

    &__upload-text {
      font-size: 12px;
    }

    &__submit {
      height: 44px;
      margin-top: 8px;
      font-size: 14px;
    }
  }
}
</style>
