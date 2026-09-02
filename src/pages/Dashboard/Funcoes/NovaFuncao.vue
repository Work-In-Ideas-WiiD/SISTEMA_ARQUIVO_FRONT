<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useAuthStore } from '@/stores/auth'
import iconChevronLeft from '@/assets/imgs/administradores/icon-chevron-left.svg'
import iconChevronDown from '@/assets/imgs/administradores/icon-chevron-down.svg'
import { postFuncao, type IPostFuncaoModel } from '@/services/http/funcoes'
import { getAllEmpresas } from '@/services/http/empresas'

const router = useRouter()
const toast = useToast()
const authStore = useAuthStore()

const loading = ref(false)
const empresas = ref<{ id: string; nome: string }[]>([])
const empresaOpen = ref(false)
const empresaFilterRef = ref<HTMLElement | null>(null)
const form = ref({
  nome: '',
  descricao: '',
  empresa_id: ''
})

const isAdmin = computed(() => authStore.userRole === 'administrador')

const empresaLabel = computed(() => {
  if (!form.value.empresa_id) return 'Selecione uma empresa'
  return empresas.value.find((e) => e.id === form.value.empresa_id)?.nome ?? 'Selecione uma empresa'
})

function onDocumentClick(event: MouseEvent) {
  if (empresaFilterRef.value && !empresaFilterRef.value.contains(event.target as Node)) {
    empresaOpen.value = false
  }
}

onMounted(async () => {
  document.addEventListener('click', onDocumentClick)

  if (isAdmin.value) {
    try {
      const { data } = await getAllEmpresas()
      empresas.value = data.data
    } catch (error) {
      console.error('Erro ao carregar empresas', error)
    }
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

  try {
    loading.value = true
    const payload: IPostFuncaoModel = {
      nome: form.value.nome.trim(),
      ...(form.value.descricao.trim() ? { descricao: form.value.descricao.trim() } : {}),
      ...(isAdmin.value ? { empresa_id: form.value.empresa_id } : {})
    }

    await postFuncao(payload)
    toast.success('Função criada com sucesso')
    router.push('/dashboard/funcoes')
  } catch (error) {
    console.error(error)
    toast.error('Erro ao criar função')
  } finally {
    loading.value = false
  }
}

function goBack() {
  router.push('/dashboard/funcoes')
}
</script>

<template>
  <section class="nova-funcao">
    <div class="nova-funcao__heading">
      <button
        type="button"
        class="nova-funcao__back"
        aria-label="Voltar para Funções"
        @click="goBack"
      >
        <img :src="iconChevronLeft" width="24" height="24" alt="" />
      </button>
      <h2 class="nova-funcao__title dashboard_title">NOVA FUNÇÃO</h2>
    </div>

    <div class="nova-funcao__panel">
      <form class="nova-funcao__form" @submit.prevent="handleSubmit">
        <div v-if="isAdmin" class="nova-funcao__field">
          <span class="nova-funcao__label night-field-label" id="empresa-label">EMPRESA*</span>
          <div ref="empresaFilterRef" class="nova-funcao__select">
            <button
              type="button"
              class="nova-funcao__select-trigger"
              :class="{ 'is-placeholder': !form.empresa_id }"
              aria-haspopup="listbox"
              aria-labelledby="empresa-label"
              :aria-expanded="empresaOpen"
              @click.stop="toggleEmpresaMenu"
            >
              <span>{{ empresaLabel }}</span>
              <img
                class="nova-funcao__select-chevron"
                :class="{ 'nova-funcao__select-chevron--open': empresaOpen }"
                :src="iconChevronDown"
                width="16"
                height="9"
                alt=""
              />
            </button>

            <ul
              v-if="empresaOpen"
              class="nova-funcao__select-menu"
              role="listbox"
              aria-labelledby="empresa-label"
            >
              <li>
                <button
                  type="button"
                  class="nova-funcao__select-option"
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
                  class="nova-funcao__select-option"
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

        <div class="nova-funcao__field">
          <label class="nova-funcao__label night-field-label" for="nome">NOME*</label>
          <input
            id="nome"
            v-model="form.nome"
            type="text"
            class="nova-funcao__input"
            placeholder="Nome da função"
            required
          />
        </div>

        <div class="nova-funcao__field">
          <label class="nova-funcao__label night-field-label" for="descricao">DESCRIÇÃO</label>
          <textarea
            id="descricao"
            v-model="form.descricao"
            class="nova-funcao__textarea"
            placeholder="Descrição da função (opcional)"
            rows="4"
          />
        </div>

        <div class="nova-funcao__actions">
          <button type="button" class="nova-funcao__cancel" @click="goBack">
            CANCELAR
          </button>
          <button type="submit" class="nova-funcao__submit" :disabled="loading">
            {{ loading ? 'Salvando…' : 'SALVAR' }}
          </button>
        </div>
      </form>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.nova-funcao {
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
    box-sizing: border-box;
    padding: 48px 75px 40px;
    background: rgba(121, 121, 121, 0.1);
    border-radius: var(--night-radius, 30px);
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
    font-family: var(--night-font, 'Source Code Pro', monospace);
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
    border: none;
    border-radius: 30px;
    background: rgba(121, 121, 121, 0.3);
    font-family: 'Source Code Pro', monospace;
    font-size: 14px;
    font-weight: 300;
    line-height: 1.4;
    color: #ffffff;
    outline: none;
    -webkit-text-fill-color: #ffffff;

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

  &__select {
    position: relative;
    width: 100%;
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
      opacity: 0.85;

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

  &__textarea {
    min-height: 120px;
    padding: 16px 20px;
    resize: vertical;
  }

  &__actions {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 12px;
    margin-top: 8px;
  }

  &__cancel,
  &__submit {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 140px;
    height: 46px;
    padding: 0 28px;
    border-radius: 30px;
    font-family: 'Source Code Pro', monospace;
    font-size: 16px;
    font-weight: 700;
    line-height: 1;
    letter-spacing: 0;
    text-transform: uppercase;
    white-space: nowrap;
    cursor: pointer;
  }

  &__cancel {
    border: 1px solid rgba(247, 247, 247, 0.7);
    background: transparent;
    color: #ffffff;

    &:hover {
      opacity: 0.85;
    }
  }

  &__submit {
    border: none;
    background: #ff00ff;
    color: #ffffff;

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
      padding: 32px 24px;
    }

    &__form {
      width: 100%;
    }
  }

  @media (max-width: 768px) {
    &__heading {
      margin-bottom: 24px;
    }

    &__panel {
      padding: 28px 20px 32px;
    }

    &__actions {
      flex-direction: column-reverse;
    }

    &__cancel,
    &__submit {
      width: 100%;
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

    &__textarea {
      min-height: 100px;
      font-size: 13px;
    }

    &__cancel,
    &__submit {
      height: 44px;
      font-size: 14px;
    }
  }
}
</style>
