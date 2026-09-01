<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'
import iconChevronLeft from '@/assets/imgs/administradores/icon-chevron-left.svg'
import { getCliente } from '@/services/http/clientes'

const router = useRouter()
const route = useRoute()
const toast = useToast()

const nome = ref('')
const cpf = ref('')
const nome_empresa = ref('')
const cnpj = ref('')
const email = ref('')
const contato = ref('')
const endereco = ref('')
const numero = ref('')
const bairro = ref('')
const cidade = ref('')
const estado = ref('')
const complemento = ref('')
const cep = ref('')
const loading = ref(true)

const clienteId = route.params.id as string

onMounted(async () => {
  try {
    const { data } = await getCliente(clienteId)
    nome.value = data.nome || ''
    cpf.value = data.cpf || ''
    nome_empresa.value = data.nome_empresa || ''
    cnpj.value = data.cnpj || ''
    email.value = data.email || ''
    contato.value = data.contato || ''

    if (data.endereco && typeof data.endereco === 'object') {
      endereco.value = data.endereco.rua || ''
      numero.value = data.endereco.numero || ''
      bairro.value = data.endereco.bairro || ''
      cidade.value = data.endereco.cidade || ''
      estado.value = data.endereco.estado || ''
      complemento.value = data.endereco.complemento || ''
      cep.value = data.endereco.cep || ''
    }
  } catch (error) {
    toast.error('Erro ao carregar cliente')
    router.push('/dashboard/clientes')
  } finally {
    loading.value = false
  }
})

function goBack() {
  router.push('/dashboard/clientes')
}
</script>

<template>
  <section class="visualizar-cliente">
    <div class="visualizar-cliente__heading">
      <button
        type="button"
        class="visualizar-cliente__back"
        aria-label="Voltar para Clientes"
        @click="goBack"
      >
        <img :src="iconChevronLeft" width="24" height="24" alt="" />
      </button>
      <h2 class="visualizar-cliente__title dashboard_title">CLIENTE</h2>
    </div>

    <div v-if="loading" class="visualizar-cliente__loading">
      <p>Carregando…</p>
    </div>

    <div v-else class="visualizar-cliente__panel">
      <form class="visualizar-cliente__form">
        <div class="visualizar-cliente__row">
          <div class="visualizar-cliente__field visualizar-cliente__field--wide">
            <span class="visualizar-cliente__label night-field-label">NOME</span>
            <input v-model="nome" type="text" class="visualizar-cliente__input" disabled />
          </div>
          <div class="visualizar-cliente__field visualizar-cliente__field--narrow">
            <span class="visualizar-cliente__label night-field-label">CPF</span>
            <input v-model="cpf" type="text" class="visualizar-cliente__input" disabled />
          </div>
        </div>

        <div class="visualizar-cliente__row">
          <div class="visualizar-cliente__field visualizar-cliente__field--wide">
            <span class="visualizar-cliente__label night-field-label">NOME DA EMPRESA</span>
            <input v-model="nome_empresa" type="text" class="visualizar-cliente__input" disabled />
          </div>
          <div class="visualizar-cliente__field visualizar-cliente__field--narrow">
            <span class="visualizar-cliente__label night-field-label">CNPJ</span>
            <input v-model="cnpj" type="text" class="visualizar-cliente__input" disabled />
          </div>
        </div>

        <div class="visualizar-cliente__row">
          <div class="visualizar-cliente__field visualizar-cliente__field--wide">
            <span class="visualizar-cliente__label night-field-label">E-MAIL</span>
            <input v-model="email" type="email" class="visualizar-cliente__input" disabled />
          </div>
          <div class="visualizar-cliente__field visualizar-cliente__field--narrow">
            <span class="visualizar-cliente__label night-field-label">CONTATO</span>
            <input v-model="contato" type="text" class="visualizar-cliente__input" disabled />
          </div>
        </div>

        <div class="visualizar-cliente__row">
          <div class="visualizar-cliente__field visualizar-cliente__field--wide">
            <span class="visualizar-cliente__label night-field-label">ENDEREÇO</span>
            <input v-model="endereco" type="text" class="visualizar-cliente__input" disabled />
          </div>
          <div class="visualizar-cliente__field visualizar-cliente__field--narrow">
            <span class="visualizar-cliente__label night-field-label">NÚMERO</span>
            <input v-model="numero" type="text" class="visualizar-cliente__input" disabled />
          </div>
        </div>

        <div class="visualizar-cliente__row visualizar-cliente__row--thirds">
          <div class="visualizar-cliente__field">
            <span class="visualizar-cliente__label night-field-label">BAIRRO</span>
            <input v-model="bairro" type="text" class="visualizar-cliente__input" disabled />
          </div>
          <div class="visualizar-cliente__field">
            <span class="visualizar-cliente__label night-field-label">CIDADE</span>
            <input v-model="cidade" type="text" class="visualizar-cliente__input" disabled />
          </div>
          <div class="visualizar-cliente__field">
            <span class="visualizar-cliente__label night-field-label">ESTADO</span>
            <input v-model="estado" type="text" class="visualizar-cliente__input" disabled />
          </div>
        </div>

        <div class="visualizar-cliente__row">
          <div class="visualizar-cliente__field visualizar-cliente__field--wide">
            <span class="visualizar-cliente__label night-field-label">COMPLEMENTO</span>
            <input v-model="complemento" type="text" class="visualizar-cliente__input" disabled />
          </div>
          <div class="visualizar-cliente__field visualizar-cliente__field--narrow">
            <span class="visualizar-cliente__label night-field-label">CEP</span>
            <input v-model="cep" type="text" class="visualizar-cliente__input" disabled />
          </div>
        </div>
      </form>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.visualizar-cliente {
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
    width: 1000px;
    max-width: 100%;
    box-sizing: border-box;
    padding: 48px 75px 40px;
    background: rgba(121, 121, 121, 0.1);
    border-radius: var(--night-radius, 30px);
  }

  &__form {
    width: 850px;
    max-width: 100%;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 24px;
  }

  &__row {
    display: flex;
    gap: 13px;
    width: 100%;

    &--thirds {
      .visualizar-cliente__field {
        flex: 1;
        min-width: 0;
      }
    }
  }

  &__field {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    min-width: 0;

    &--wide {
      flex: 550;
    }

    &--narrow {
      flex: 287;
    }
  }

  &__label {
    display: block;
    flex-shrink: 0;
    font-family: 'Source Code Pro', monospace;
    font-size: 14px;
    font-weight: 700;
    line-height: 18px;
    letter-spacing: 0;
    color: rgba(247, 247, 247, 0.7);
    text-transform: uppercase;
  }

  &__input {
    width: 100%;
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

    &:disabled {
      opacity: 1;
      cursor: default;
      color: #ffffff;
      -webkit-text-fill-color: #ffffff;
    }
  }

  @media (max-width: 1024px) {
    &__panel {
      width: 100%;
      padding: 32px 24px 32px;
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

    &__row {
      flex-direction: column;
      gap: 24px;

      &--thirds {
        flex-direction: column;
      }
    }

    &__field--wide,
    &__field--narrow {
      flex: unset;
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
  }
}
</style>
