<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'
import iconChevronLeft from '@/assets/imgs/administradores/icon-chevron-left.svg'
import { getPlano } from '@/services/http/planos'

const router = useRouter()
const route = useRoute()
const toast = useToast()

const nome = ref('')
const descricao = ref('')
const valor = ref('')
const maxUsuarios = ref('')
const armazenamento = ref('')
const status = ref('')
const loading = ref(true)

const planoId = route.params.id as string

function formatBRL(centavos: number) {
  return (centavos / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function formatGB(bytes: number) {
  return `${(bytes / 1024 ** 3).toLocaleString('pt-BR', { maximumFractionDigits: 2 })} GB`
}

onMounted(async () => {
  try {
    const { data } = await getPlano(planoId)
    nome.value = data.nome || ''
    descricao.value = data.descricao || '—'
    valor.value = formatBRL(data.valor_mensal_centavos)
    maxUsuarios.value = String(data.max_usuarios)
    armazenamento.value = formatGB(data.armazenamento_bytes)
    status.value = data.ativo ? 'Ativo' : 'Inativo'
  } catch (error) {
    console.error(error)
    toast.error('Erro ao carregar plano')
    router.push('/dashboard/planos')
  } finally {
    loading.value = false
  }
})

function goToEditar() {
  router.push(`/dashboard/planos/editar/${planoId}`)
}

function goBack() {
  router.push('/dashboard/planos')
}
</script>

<template>
  <section class="visualizar-plano">
    <div class="visualizar-plano__heading">
      <button
        type="button"
        class="visualizar-plano__back"
        aria-label="Voltar para Planos"
        @click="goBack"
      >
        <img :src="iconChevronLeft" width="24" height="24" alt="" />
      </button>
      <h2 class="visualizar-plano__title dashboard_title">PLANO</h2>
    </div>

    <div v-if="loading" class="visualizar-plano__loading">
      <p>Carregando…</p>
    </div>

    <div v-else class="visualizar-plano__panel">
      <form class="visualizar-plano__form" @submit.prevent>
        <div class="visualizar-plano__row">
          <div class="visualizar-plano__field visualizar-plano__field--wide">
            <span class="visualizar-plano__label night-field-label">NOME</span>
            <input v-model="nome" type="text" class="visualizar-plano__input" disabled />
          </div>
          <div class="visualizar-plano__field visualizar-plano__field--narrow">
            <span class="visualizar-plano__label night-field-label">STATUS</span>
            <input v-model="status" type="text" class="visualizar-plano__input" disabled />
          </div>
        </div>

        <div class="visualizar-plano__field">
          <span class="visualizar-plano__label night-field-label">DESCRIÇÃO</span>
          <textarea
            v-model="descricao"
            class="visualizar-plano__textarea"
            rows="4"
            disabled
          />
        </div>

        <div class="visualizar-plano__row visualizar-plano__row--thirds">
          <div class="visualizar-plano__field">
            <span class="visualizar-plano__label night-field-label">VALOR MENSAL</span>
            <input v-model="valor" type="text" class="visualizar-plano__input" disabled />
          </div>
          <div class="visualizar-plano__field">
            <span class="visualizar-plano__label night-field-label">MÁX. USUÁRIOS</span>
            <input v-model="maxUsuarios" type="text" class="visualizar-plano__input" disabled />
          </div>
          <div class="visualizar-plano__field">
            <span class="visualizar-plano__label night-field-label">ARMAZENAMENTO</span>
            <input v-model="armazenamento" type="text" class="visualizar-plano__input" disabled />
          </div>
        </div>

        <div class="visualizar-plano__actions">
          <button type="button" class="visualizar-plano__submit" @click="goToEditar">
            EDITAR
          </button>
        </div>
      </form>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.visualizar-plano {
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
      font-family: 'Source Code Pro', monospace;
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
    display: flex;
    gap: 20px;

    &--thirds {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 20px;
    }
  }

  &__field {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;

    &--wide {
      flex: 3;
      min-width: 0;
    }

    &--narrow {
      flex: 1;
      min-width: 0;
    }
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
    opacity: 1;
    cursor: default;

    &:disabled {
      opacity: 1;
      color: #ffffff;
      -webkit-text-fill-color: #ffffff;
      background: rgba(121, 121, 121, 0.3);
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
    resize: none;
  }

  &__actions {
    display: flex;
    justify-content: center;
    margin-top: 8px;
  }

  &__submit {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 140px;
    height: 46px;
    padding: 0 28px;
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
    white-space: nowrap;
    cursor: pointer;

    &:hover {
      opacity: 0.92;
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
      flex-direction: column;
      gap: 24px;

      &--thirds {
        grid-template-columns: 1fr;
        gap: 24px;
      }
    }
  }

  @media (max-width: 768px) {
    &__heading {
      margin-bottom: 24px;
    }

    &__panel {
      padding: 28px 20px 32px;
    }

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

    &__input {
      height: 44px;
      font-size: 13px;
    }

    &__textarea {
      min-height: 100px;
      font-size: 13px;
    }

    &__submit {
      height: 44px;
      font-size: 14px;
    }
  }
}
</style>
