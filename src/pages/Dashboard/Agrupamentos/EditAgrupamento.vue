<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useAuthStore } from '@/stores/auth'
import iconChevronLeft from '@/assets/imgs/administradores/icon-chevron-left.svg'
import iconChevronDown from '@/assets/imgs/administradores/icon-chevron-down.svg'
import iconSearch from '@/assets/imgs/administradores/icon-search.svg'
import {
  getAgrupamento,
  patchAgrupamento,
  type IPostAgrupamentoModel
} from '@/services/http/agrupamentos'
import { getAllSetores, type ISetor } from '@/services/http/setores'
import { getAllFuncoes, type IFuncao } from '@/services/http/funcoes'
import { getAllFuncionarios, type IFuncionario } from '@/services/http/funcionarios'
import { getAllEmpresas } from '@/services/http/empresas'
import { getApiErrorMessage } from '@/utils/apiError'

const router = useRouter()
const route = useRoute()
const toast = useToast()
const authStore = useAuthStore()

const loading = ref(false)
const loadingData = ref(true)
const readyEmpresaWatch = ref(false)
const empresas = ref<{ id: string; nome: string }[]>([])
const setoresDisponiveis = ref<ISetor[]>([])
const funcoesDisponiveis = ref<IFuncao[]>([])
const funcionariosDisponiveis = ref<IFuncionario[]>([])
const filtrosSetores = ref<string[]>([])
const filtrosFuncoes = ref<string[]>([])
const buscaFuncionario = ref('')
const empresaOpen = ref(false)
const empresaFilterRef = ref<HTMLElement | null>(null)

const form = ref({
  nome: '',
  descricao: '',
  funcionarios: [] as string[],
  empresa_id: ''
})

const isAdmin = computed(() => authStore.userRole === 'administrador')

const empresaLabel = computed(() => {
  if (!form.value.empresa_id) return 'Selecione uma empresa'
  return empresas.value.find((e) => e.id === form.value.empresa_id)?.nome ?? 'Selecione uma empresa'
})

const temFiltro = computed(
  () => filtrosSetores.value.length > 0 || filtrosFuncoes.value.length > 0
)

/** Funcionários que batem com setores/funções selecionados no filtro. */
const funcionariosFiltrados = computed(() => {
  if (!temFiltro.value) return []

  return funcionariosDisponiveis.value.filter((funcionario) => {
    const setorIds = funcionario.setores?.map((s) => s.id) ?? []
    const funcaoIds = funcionario.funcoes?.map((f) => f.id) ?? []

    const matchSetor = filtrosSetores.value.some((id) => setorIds.includes(id))
    const matchFuncao = filtrosFuncoes.value.some((id) => funcaoIds.includes(id))
    return matchSetor || matchFuncao
  })
})

const funcionariosBusca = computed(() => {
  const term = buscaFuncionario.value.trim().toLowerCase()
  if (!term) return funcionariosDisponiveis.value

  return funcionariosDisponiveis.value.filter((funcionario) => {
    const nome = funcionario.nome?.toLowerCase() ?? ''
    const email = funcionario.email?.toLowerCase() ?? ''
    return nome.includes(term) || email.includes(term)
  })
})

function onDocumentClick(event: MouseEvent) {
  if (empresaFilterRef.value && !empresaFilterRef.value.contains(event.target as Node)) {
    empresaOpen.value = false
  }
}

async function loadDadosEmpresa(empresaId?: string) {
  const [setoresRes, funcoesRes, funcionariosRes] = await Promise.all([
    getAllSetores(empresaId),
    getAllFuncoes(empresaId),
    getAllFuncionarios(empresaId)
  ])
  setoresDisponiveis.value = setoresRes.data
  funcoesDisponiveis.value = funcoesRes.data
  funcionariosDisponiveis.value = funcionariosRes.data
}

watch(
  () => form.value.empresa_id,
  async (empresaId) => {
    if (!readyEmpresaWatch.value) return

    form.value.funcionarios = []
    filtrosSetores.value = []
    filtrosFuncoes.value = []
    buscaFuncionario.value = ''
    setoresDisponiveis.value = []
    funcoesDisponiveis.value = []
    funcionariosDisponiveis.value = []

    if (isAdmin.value && empresaId) {
      try {
        await loadDadosEmpresa(empresaId)
      } catch (error) {
        console.error(error)
        toast.error(getApiErrorMessage(error, 'Erro ao carregar dados da empresa'))
      }
    }
  }
)

onMounted(async () => {
  document.addEventListener('click', onDocumentClick)

  try {
    if (isAdmin.value) {
      const { data } = await getAllEmpresas()
      empresas.value = data.data
    }

    const { data: agrupamento } = await getAgrupamento(route.params.id as string)
    const empresaId = agrupamento.empresa_id || ''

    form.value.nome = agrupamento.nome
    form.value.descricao = agrupamento.descricao || ''
    form.value.empresa_id = empresaId

    await loadDadosEmpresa(isAdmin.value ? empresaId || undefined : undefined)

    if (agrupamento.tipo === 'setor') {
      filtrosSetores.value = agrupamento.setores?.map((s) => s.id) || []
      form.value.funcionarios =
        agrupamento.todos_funcionarios?.map((f) => f.id) ||
        funcionariosDisponiveis.value
          .filter((f) =>
            (f.setores ?? []).some((s) => filtrosSetores.value.includes(s.id))
          )
          .map((f) => f.id)
    } else {
      form.value.funcionarios = agrupamento.funcionarios?.map((f) => f.id) || []
    }
  } catch (error) {
    console.error(error)
    toast.error(getApiErrorMessage(error, 'Erro ao carregar agrupamento'))
    router.push('/dashboard/agrupamentos')
  } finally {
    loadingData.value = false
    readyEmpresaWatch.value = true
  }
})

onUnmounted(() => {
  document.removeEventListener('click', onDocumentClick)
})

function toggleEmpresaMenu() {
  empresaOpen.value = !empresaOpen.value
}

function selectEmpresa(id: string) {
  form.value.empresa_id = id
  empresaOpen.value = false
}

function toggleFiltroSetor(id: string) {
  const index = filtrosSetores.value.indexOf(id)
  if (index > -1) filtrosSetores.value.splice(index, 1)
  else filtrosSetores.value.push(id)
}

function toggleFiltroFuncao(id: string) {
  const index = filtrosFuncoes.value.indexOf(id)
  if (index > -1) filtrosFuncoes.value.splice(index, 1)
  else filtrosFuncoes.value.push(id)
}

function toggleFuncionario(id: string) {
  const index = form.value.funcionarios.indexOf(id)
  if (index > -1) form.value.funcionarios.splice(index, 1)
  else form.value.funcionarios.push(id)
}

function isSelected(id: string) {
  return form.value.funcionarios.includes(id)
}

async function handleSubmit() {
  if (loading.value) return

  if (!form.value.nome.trim()) {
    toast.error('Nome é obrigatório')
    return
  }

  if (isAdmin.value && !form.value.empresa_id) {
    toast.error('Selecione uma empresa')
    return
  }

  if (form.value.funcionarios.length === 0) {
    toast.error('Selecione pelo menos um funcionário')
    return
  }

  try {
    loading.value = true
    const payload: Partial<IPostAgrupamentoModel> = {
      nome: form.value.nome.trim(),
      descricao: form.value.descricao.trim() || undefined,
      tipo: 'individual',
      funcionarios: [...form.value.funcionarios],
      setores: [],
      ...(isAdmin.value ? { empresa_id: form.value.empresa_id } : {})
    }

    await patchAgrupamento(payload, route.params.id as string)
    toast.success('Agrupamento atualizado com sucesso')
    router.push('/dashboard/agrupamentos')
  } catch (error) {
    console.error(error)
    toast.error(getApiErrorMessage(error, 'Erro ao atualizar agrupamento'))
  } finally {
    loading.value = false
  }
}

function goBack() {
  router.push('/dashboard/agrupamentos')
}
</script>

<template>
  <section class="novo-agrupamento">
    <div class="novo-agrupamento__heading">
      <button
        type="button"
        class="novo-agrupamento__back"
        aria-label="Voltar para Agrupamentos"
        @click="goBack"
      >
        <img :src="iconChevronLeft" width="24" height="24" alt="" />
      </button>
      <h2 class="novo-agrupamento__title dashboard_title">EDITAR AGRUPAMENTO</h2>
    </div>

    <div v-if="loadingData" class="novo-agrupamento__loading">
      <p>Carregando…</p>
    </div>

    <div v-else class="novo-agrupamento__panel">
      <form class="novo-agrupamento__form" @submit.prevent="handleSubmit">
        <div v-if="isAdmin" class="novo-agrupamento__field">
          <span class="novo-agrupamento__label night-field-label" id="empresa-label">EMPRESA*</span>
          <div ref="empresaFilterRef" class="novo-agrupamento__select">
            <button
              type="button"
              class="novo-agrupamento__select-trigger"
              :class="{ 'is-placeholder': !form.empresa_id }"
              aria-haspopup="listbox"
              aria-labelledby="empresa-label"
              :aria-expanded="empresaOpen"
              @click.stop="toggleEmpresaMenu"
            >
              <span>{{ empresaLabel }}</span>
              <img
                class="novo-agrupamento__select-chevron"
                :class="{ 'novo-agrupamento__select-chevron--open': empresaOpen }"
                :src="iconChevronDown"
                width="16"
                height="9"
                alt=""
              />
            </button>

            <ul
              v-if="empresaOpen"
              class="novo-agrupamento__select-menu"
              role="listbox"
              aria-labelledby="empresa-label"
            >
              <li>
                <button
                  type="button"
                  class="novo-agrupamento__select-option"
                  role="option"
                  :aria-selected="!form.empresa_id"
                  :class="{ 'is-active': !form.empresa_id }"
                  @click="selectEmpresa('')"
                >
                  Selecione uma empresa
                </button>
              </li>
              <li v-for="empresa in empresas" :key="empresa.id">
                <button
                  type="button"
                  class="novo-agrupamento__select-option"
                  role="option"
                  :aria-selected="form.empresa_id === empresa.id"
                  :class="{ 'is-active': form.empresa_id === empresa.id }"
                  @click="selectEmpresa(empresa.id)"
                >
                  {{ empresa.nome }}
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div class="novo-agrupamento__field">
          <label class="novo-agrupamento__label night-field-label" for="nome">NOME*</label>
          <input
            id="nome"
            v-model="form.nome"
            type="text"
            class="novo-agrupamento__input"
            placeholder="Nome do agrupamento"
            required
          />
        </div>

        <div class="novo-agrupamento__field">
          <label class="novo-agrupamento__label night-field-label" for="descricao">DESCRIÇÃO</label>
          <textarea
            id="descricao"
            v-model="form.descricao"
            class="novo-agrupamento__textarea"
            placeholder="Descrição do agrupamento (opcional)"
            rows="4"
          />
        </div>

        <div class="novo-agrupamento__field">
          <span class="novo-agrupamento__label night-field-label">FILTRAR</span>
          <div
            class="novo-agrupamento__checks"
            :class="{
              'novo-agrupamento__checks--empty':
                (isAdmin && !form.empresa_id) ||
                (setoresDisponiveis.length === 0 && funcoesDisponiveis.length === 0)
            }"
          >
            <p v-if="isAdmin && !form.empresa_id" class="novo-agrupamento__checks-empty">
              Selecione uma empresa primeiro
            </p>
            <template v-else-if="setoresDisponiveis.length === 0 && funcoesDisponiveis.length === 0">
              <p class="novo-agrupamento__checks-empty">Nenhum setor ou função cadastrado</p>
            </template>
            <template v-else>
              <label
                v-for="setor in setoresDisponiveis"
                :key="`setor-${setor.id}`"
                class="novo-agrupamento__check"
              >
                <input
                  type="checkbox"
                  :checked="filtrosSetores.includes(setor.id)"
                  @change="toggleFiltroSetor(setor.id)"
                />
                <span>{{ setor.nome }} <em class="novo-agrupamento__check-tag">setor</em></span>
              </label>
              <label
                v-for="funcao in funcoesDisponiveis"
                :key="`funcao-${funcao.id}`"
                class="novo-agrupamento__check"
              >
                <input
                  type="checkbox"
                  :checked="filtrosFuncoes.includes(funcao.id)"
                  @change="toggleFiltroFuncao(funcao.id)"
                />
                <span>{{ funcao.nome }} <em class="novo-agrupamento__check-tag">função</em></span>
              </label>
            </template>
          </div>
          <small class="novo-agrupamento__helper">
            Selecione setores e/ou funções para listar os funcionários abaixo
          </small>
        </div>

        <div class="novo-agrupamento__field">
          <span class="novo-agrupamento__label night-field-label">FUNCIONÁRIOS</span>
          <div
            class="novo-agrupamento__checks"
            :class="{
              'novo-agrupamento__checks--empty':
                !temFiltro || funcionariosFiltrados.length === 0
            }"
          >
            <p v-if="!temFiltro" class="novo-agrupamento__checks-empty">
              Selecione um setor ou função
            </p>
            <p
              v-else-if="funcionariosFiltrados.length === 0"
              class="novo-agrupamento__checks-empty"
            >
              Nenhum funcionário encontrado para o filtro
            </p>
            <label
              v-for="funcionario in funcionariosFiltrados"
              :key="`filtrado-${funcionario.id}`"
              class="novo-agrupamento__check"
            >
              <input
                type="checkbox"
                :checked="isSelected(funcionario.id)"
                @change="toggleFuncionario(funcionario.id)"
              />
              <span>{{ funcionario.nome }}</span>
            </label>
          </div>
          <small v-if="temFiltro" class="novo-agrupamento__helper">
            {{ funcionariosFiltrados.length }} funcionário(s) no filtro ·
            {{ form.funcionarios.length }} selecionado(s)
          </small>
        </div>

        <div class="novo-agrupamento__field">
          <span class="novo-agrupamento__label night-field-label">TODOS OS FUNCIONÁRIOS*</span>
          <div class="novo-agrupamento__stack">
            <div class="novo-agrupamento__search">
              <img :src="iconSearch" width="16" height="16" alt="" />
              <input
                v-model="buscaFuncionario"
                type="text"
                placeholder="Buscar por nome ou e-mail…"
                :disabled="isAdmin && !form.empresa_id"
              />
            </div>
            <div
              class="novo-agrupamento__list"
              :class="{
                'novo-agrupamento__list--empty':
                  (isAdmin && !form.empresa_id) || funcionariosBusca.length === 0
              }"
            >
            <p v-if="isAdmin && !form.empresa_id" class="novo-agrupamento__checks-empty">
              Selecione uma empresa primeiro
            </p>
            <p
              v-else-if="funcionariosDisponiveis.length === 0"
              class="novo-agrupamento__checks-empty"
            >
              Nenhum funcionário cadastrado
            </p>
            <p
              v-else-if="funcionariosBusca.length === 0"
              class="novo-agrupamento__checks-empty"
            >
              Nenhum resultado para a busca
            </p>
              <button
                v-for="funcionario in funcionariosBusca"
                :key="`busca-${funcionario.id}`"
                type="button"
                class="novo-agrupamento__list-item"
                :class="{ 'is-selected': isSelected(funcionario.id) }"
                @click="toggleFuncionario(funcionario.id)"
              >
                <span class="novo-agrupamento__list-name">{{ funcionario.nome }}</span>
                <span v-if="funcionario.email" class="novo-agrupamento__list-email">
                  {{ funcionario.email }}
                </span>
              </button>
            </div>
          </div>
          <small class="novo-agrupamento__helper">
            Clique para selecionar ou remover · {{ form.funcionarios.length }} selecionado(s)
          </small>
        </div>

        <div class="novo-agrupamento__actions">
          <button type="button" class="novo-agrupamento__cancel" @click="goBack">
            CANCELAR
          </button>
          <button type="submit" class="novo-agrupamento__submit" :disabled="loading">
            {{ loading ? 'Salvando…' : 'SALVAR ALTERAÇÕES' }}
          </button>
        </div>
      </form>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.novo-agrupamento {
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

  &__loading {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 200px;

    p {
      font-family: var(--night-font, 'Inter', sans-serif);
      font-size: 14px;
      color: #f7f7f7;
      opacity: 0.7;
    }
  }

  &__panel {
    width: 800px;
    max-width: 100%;
    box-sizing: border-box;
    padding: 48px 75px 40px;
    background: var(--night-surface, #132438);
    border: 1px solid var(--night-surface-border, rgba(176, 141, 87, 0.18));
    border-radius: var(--night-radius, 20px);
  }

  &__form {
    width: 650px;
    max-width: 100%;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 24px;
  }

  &__field {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  &__label {
    display: block;
    flex-shrink: 0;
    width: 100%;
    margin: 0;
    padding-left: 20px;
    box-sizing: border-box;
    font-family: var(--night-font, 'Inter', sans-serif);
    font-size: 14px;
    font-weight: 700;
    line-height: 18px;
    letter-spacing: 0;
    color: var(--night-gray, #f7f7f7);
    opacity: 0.7;
    text-transform: uppercase;
  }

  &__input,
  &__textarea {
    width: 100%;
    box-sizing: border-box;
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 30px;
    background: rgba(255, 255, 255, 0.06);
    font-family: var(--night-font, 'Inter', sans-serif);
    font-size: 14px;
    font-weight: 400;
    line-height: 1.4;
    color: #ffffff;
    outline: none;
    -webkit-text-fill-color: #ffffff;
    transition: all 0.2s ease;

    &:focus {
      border-color: #B08D57;
      box-shadow: 0 0 0 2px rgba(176, 141, 87, 0.2);
    }

    &::placeholder {
      color: #f7f7f7;
      opacity: 0.6;
      -webkit-text-fill-color: #f7f7f7;
    }
  }

  &__input {
    height: 49px;
    padding: 0 20px;
    line-height: 1;
  }

  &__textarea {
    min-height: 120px;
    padding: 16px 20px;
    resize: vertical;
  }

  &__select {
    position: relative;
    width: 100%;
    z-index: 5;
  }

  &__select-trigger {
    width: 100%;
    height: 49px;
    border: 1px solid rgba(255, 255, 255, 0.12);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 0 20px;
    background: rgba(255, 255, 255, 0.06);
    border-radius: 30px;
    font-family: var(--night-font, 'Inter', sans-serif);
    font-size: 14px;
    font-weight: 400;
    line-height: 1;
    color: #ffffff;
    cursor: pointer;
    text-align: left;
    transition: all 0.2s ease;

    span {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    &.is-placeholder {
      color: #f7f7f7;
      opacity: 0.85;

      span {
        opacity: 0.7;
      }
    }

    &:hover {
      background: rgba(255, 255, 255, 0.09);
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
    background: #10243B;
    border: 1px solid var(--night-surface-border, rgba(176, 141, 87, 0.18));
    border-radius: 16px;
    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.35);
    z-index: 10;
  }

  &__select-option {
    width: 100%;
    border: none;
    background: transparent;
    text-align: left;
    padding: 10px 14px;
    font-family: var(--night-font, 'Inter', sans-serif);
    font-size: 14px;
    font-weight: 400;
    line-height: 1.2;
    color: #f7f7f7;
    border-radius: 10px;
    cursor: pointer;
    white-space: nowrap;
    transition: all 0.2s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.08);
    }

    &.is-active {
      background: #B08D57;
      color: #ffffff;
      font-weight: 600;
    }
  }

  &__checks {
    width: 100%;
    box-sizing: border-box;
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    align-items: center;
    gap: 10px;
    padding: 14px 20px;
    min-height: 49px;
    height: auto;
    max-height: 180px;
    overflow-x: hidden;
    overflow-y: auto;
    overscroll-behavior: contain;
    border-radius: 30px;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.08);

    &--empty {
      display: flex;
      flex-wrap: nowrap;
      align-items: center;
      align-content: center;
      height: auto;
      min-height: 49px;
      max-height: none;
      padding: 12px 20px;
      background: rgba(255, 255, 255, 0.03);
      overflow: hidden;
    }
  }

  &__checks-empty {
    margin: 0;
    width: 100%;
    font-family: var(--night-font, 'Inter', sans-serif);
    font-size: 14px;
    font-weight: 400;
    line-height: 1.3;
    letter-spacing: 0;
    color: #f7f7f7;
    opacity: 0.6;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__check {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    user-select: none;

    input {
      width: 16px;
      height: 16px;
      accent-color: #B08D57;
      cursor: pointer;
      flex-shrink: 0;
    }

    span {
      font-family: var(--night-font, 'Inter', sans-serif);
      font-size: 13px;
      font-weight: 400;
      color: #f7f7f7;
      line-height: 1.2;
    }
  }

  &__check-tag {
    font-style: normal;
    opacity: 0.45;
    font-size: 11px;
    text-transform: uppercase;
    margin-left: 2px;
  }

  &__helper {
    padding-left: 20px;
    font-family: var(--night-font, 'Inter', sans-serif);
    font-size: 12px;
    color: #f7f7f7;
    opacity: 0.5;
  }

  &__stack {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  &__search {
    width: 100%;
    height: 49px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 0 20px;
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 30px;
    background: rgba(255, 255, 255, 0.06);

    img {
      flex-shrink: 0;
      opacity: 0.65;
    }

    input {
      flex: 1;
      min-width: 0;
      height: 100%;
      border: none;
      outline: none;
      background: transparent;
      color: #ffffff;
      font-family: var(--night-font, 'Inter', sans-serif);
      font-size: 14px;

      &::placeholder {
        color: #f7f7f7;
        opacity: 0.55;
      }

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }
  }

  &__list {
    width: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 10px;
    min-height: 0;
    height: auto;
    max-height: 240px;
    overflow-x: hidden;
    overflow-y: auto;
    overscroll-behavior: contain;
    border-radius: 30px;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.08);
    flex-shrink: 0;

    &--empty {
      justify-content: center;
      align-items: center;
      height: 49px;
      min-height: 49px;
      max-height: 49px;
      padding: 0 20px;
      background: rgba(255, 255, 255, 0.03);
      overflow: hidden;
    }
  }

  &__list-item {
    width: 100%;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 2px;
    padding: 10px 14px;
    border: none;
    border-radius: 12px;
    background: transparent;
    text-align: left;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.08);
    }

    &.is-selected {
      background: rgba(176, 141, 87, 0.22);
      box-shadow: inset 0 0 0 1px #B08D57;
    }
  }

  &__list-name {
    font-family: var(--night-font, 'Inter', sans-serif);
    font-size: 14px;
    font-weight: 600;
    color: #f7f7f7;
  }

  &__list-email {
    font-family: var(--night-font, 'Inter', sans-serif);
    font-size: 12px;
    color: #f7f7f7;
    opacity: 0.55;
  }

  &__actions {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    margin-top: 12px;
    flex-wrap: wrap;
  }

  &__cancel,
  &__submit {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 160px;
    height: 46px;
    padding: 0 28px;
    border-radius: 30px;
    font-family: var(--night-font, 'Inter', sans-serif);
    font-size: 16px;
    font-weight: 700;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  &__cancel {
    border: 1px solid rgba(255, 255, 255, 0.2);
    background: transparent;
    color: #f7f7f7;

    &:hover {
      background: rgba(255, 255, 255, 0.06);
    }
  }

  &__submit {
    border: none;
    background: #B08D57;
    color: #ffffff;

    &:hover:not(:disabled) {
      background: #C29F68;
      box-shadow: 0 4px 12px rgba(176, 141, 87, 0.3);
    }

    &:disabled {
      opacity: 0.7;
      cursor: wait;
    }
  }

  @media (max-width: 900px) {
    &__panel {
      padding: 28px 16px 28px;
    }

    &__form {
      width: 100%;
    }

    &__label {
      padding-left: 12px;
    }

    &__helper {
      padding-left: 12px;
    }
  }
}
</style>
