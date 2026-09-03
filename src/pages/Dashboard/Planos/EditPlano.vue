<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'
import iconChevronLeft from '@/assets/imgs/administradores/icon-chevron-left.svg'
import iconChevronDown from '@/assets/imgs/administradores/icon-chevron-down.svg'
import { getPlano, patchPlano } from '@/services/http/planos'
import { getApiErrorMessage } from '@/utils/apiError'

const router = useRouter()
const route = useRoute()
const toast = useToast()

const id = route.params.id as string
const loading = ref(false)
const fetching = ref(true)
const statusOpen = ref(false)
const statusRef = ref<HTMLElement | null>(null)
const form = ref({
  nome: '',
  descricao: '',
  valor_reais: '' as string | number,
  max_usuarios: '' as string | number,
  armazenamento_gb: '' as string | number,
  ativo: true
})

const statusLabel = computed(() => (form.value.ativo ? 'Ativo' : 'Inativo'))

function onDocumentClick(event: MouseEvent) {
  if (statusRef.value && !statusRef.value.contains(event.target as Node)) {
    statusOpen.value = false
  }
}

onMounted(async () => {
  document.addEventListener('click', onDocumentClick)

  try {
    const { data } = await getPlano(id)
    form.value = {
      nome: data.nome,
      descricao: data.descricao || '',
      valor_reais: data.valor_mensal_centavos / 100,
      max_usuarios: data.max_usuarios,
      armazenamento_gb: data.armazenamento_bytes / 1024 ** 3,
      ativo: data.ativo
    }
  } catch (error) {
    console.error(error)
    toast.error(getApiErrorMessage(error, 'Erro ao carregar plano'))
    router.push('/dashboard/planos')
  } finally {
    fetching.value = false
  }
})

onUnmounted(() => {
  document.removeEventListener('click', onDocumentClick)
})

function toggleStatusMenu() {
  statusOpen.value = !statusOpen.value
}

function selectStatus(ativo: boolean) {
  form.value.ativo = ativo
  statusOpen.value = false
}

async function handleSubmit() {
  if (loading.value) return

  const valor = Number(form.value.valor_reais)
  const maxU = Number(form.value.max_usuarios)
  const gb = Number(form.value.armazenamento_gb)

  if (!form.value.nome.trim()) {
    toast.error('Nome é obrigatório')
    return
  }
  if (!Number.isFinite(valor) || valor < 0) {
    toast.error('Valor mensal inválido')
    return
  }
  if (!Number.isFinite(maxU) || maxU < 1) {
    toast.error('Máximo de usuários deve ser ao menos 1')
    return
  }
  if (!Number.isFinite(gb) || gb < 0) {
    toast.error('Armazenamento inválido')
    return
  }

  try {
    loading.value = true
    await patchPlano(
      {
        nome: form.value.nome.trim(),
        descricao: form.value.descricao.trim() || undefined,
        valor_mensal_centavos: Math.round(valor * 100),
        max_usuarios: Math.round(maxU),
        armazenamento_bytes: Math.round(gb * 1024 ** 3),
        ativo: form.value.ativo
      },
      id
    )
    toast.success('Plano atualizado com sucesso')
    router.push('/dashboard/planos')
  } catch (error) {
    console.error(error)
    toast.error(getApiErrorMessage(error, 'Erro ao atualizar plano'))
  } finally {
    loading.value = false
  }
}

function goBack() {
  router.push('/dashboard/planos')
}
</script>

<template>
  <section class="edit-plano">
    <div class="edit-plano__heading">
      <button
        type="button"
        class="edit-plano__back"
        aria-label="Voltar para Planos"
        @click="goBack"
      >
        <img :src="iconChevronLeft" width="24" height="24" alt="" />
      </button>
      <h2 class="edit-plano__title dashboard_title">EDITAR PLANO</h2>
    </div>

    <p v-if="fetching" class="edit-plano__loading">Carregando...</p>

    <div v-else class="edit-plano__panel">
      <form class="edit-plano__form" @submit.prevent="handleSubmit">
        <div class="edit-plano__field">
          <label class="edit-plano__label night-field-label" for="nome">NOME*</label>
          <input
            id="nome"
            v-model="form.nome"
            type="text"
            class="edit-plano__input"
            placeholder="Nome do plano"
            required
          />
        </div>

        <div class="edit-plano__field">
          <label class="edit-plano__label night-field-label" for="descricao">DESCRIÇÃO</label>
          <textarea
            id="descricao"
            v-model="form.descricao"
            class="edit-plano__textarea"
            placeholder="Descrição (opcional)"
            rows="4"
          />
        </div>

        <div class="edit-plano__row">
          <div class="edit-plano__field">
            <label class="edit-plano__label night-field-label" for="valor">VALOR MENSAL (R$)*</label>
            <input
              id="valor"
              v-model="form.valor_reais"
              type="number"
              step="0.01"
              min="0"
              class="edit-plano__input"
              placeholder="149,90"
              required
            />
          </div>

          <div class="edit-plano__field">
            <label class="edit-plano__label night-field-label" for="max_usuarios">MÁX. USUÁRIOS*</label>
            <input
              id="max_usuarios"
              v-model="form.max_usuarios"
              type="number"
              min="1"
              step="1"
              class="edit-plano__input"
              placeholder="10"
              required
            />
          </div>
        </div>

        <div class="edit-plano__row">
          <div class="edit-plano__field">
            <label class="edit-plano__label night-field-label" for="armazenamento">ARMAZENAMENTO (GB)*</label>
            <input
              id="armazenamento"
              v-model="form.armazenamento_gb"
              type="number"
              min="0"
              step="0.1"
              class="edit-plano__input"
              placeholder="10"
              required
            />
          </div>

          <div class="edit-plano__field">
            <span class="edit-plano__label night-field-label" id="status-label">STATUS</span>
            <div ref="statusRef" class="edit-plano__select">
              <button
                type="button"
                class="edit-plano__select-trigger"
                aria-haspopup="listbox"
                aria-labelledby="status-label"
                :aria-expanded="statusOpen"
                @click.stop="toggleStatusMenu"
              >
                <span>{{ statusLabel }}</span>
                <img
                  class="edit-plano__select-chevron"
                  :class="{ 'edit-plano__select-chevron--open': statusOpen }"
                  :src="iconChevronDown"
                  width="16"
                  height="9"
                  alt=""
                />
              </button>

              <ul
                v-if="statusOpen"
                class="edit-plano__select-menu"
                role="listbox"
                aria-labelledby="status-label"
              >
                <li>
                  <button
                    type="button"
                    class="edit-plano__select-option"
                    role="option"
                    :aria-selected="form.ativo"
                    :class="{ 'is-active': form.ativo }"
                    @click="selectStatus(true)"
                  >
                    Ativo
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    class="edit-plano__select-option"
                    role="option"
                    :aria-selected="!form.ativo"
                    :class="{ 'is-active': !form.ativo }"
                    @click="selectStatus(false)"
                  >
                    Inativo
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div class="edit-plano__actions">
          <button type="button" class="edit-plano__cancel" @click="goBack">
            CANCELAR
          </button>
          <button type="submit" class="edit-plano__submit" :disabled="loading">
            {{ loading ? 'Salvando…' : 'SALVAR' }}
          </button>
        </div>
      </form>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.edit-plano {
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
    margin: 0;
    font-family: 'Source Code Pro', monospace;
    font-size: 14px;
    color: #f7f7f7;
    opacity: 0.7;
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

  &__row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
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
    margin: 0;
    padding: 10px;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 4px;
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

    &__row {
      grid-template-columns: 1fr;
      gap: 24px;
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

    &__row {
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
