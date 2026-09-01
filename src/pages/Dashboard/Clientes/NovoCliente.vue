<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import iconChevronLeft from '@/assets/imgs/administradores/icon-chevron-left.svg'
import { postCliente } from '@/services/http/clientes'

const router = useRouter()
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
const fetching = ref(false)

async function handleSubmit() {
  if (fetching.value) return

  if (!nome.value || !email.value || !contato.value) {
    toast.error('Preencha os campos obrigatórios')
    return
  }

  try {
    fetching.value = true
    await postCliente({
      nome: nome.value,
      email: email.value,
      nome_empresa: nome_empresa.value || undefined,
      cpf: cpf.value || undefined,
      cnpj: cnpj.value || undefined,
      contato: contato.value,
      endereco: {
        rua: endereco.value,
        numero: numero.value,
        bairro: bairro.value,
        cidade: cidade.value,
        estado: estado.value,
        cep: cep.value,
        complemento: complemento.value || undefined
      }
    })
    toast.success('Cliente cadastrado')
    setTimeout(() => {
      router.push('/dashboard/clientes')
    }, 2000)
  } catch (error) {
    toast.error('Erro ao cadastrar cliente')
    console.error(error)
  } finally {
    fetching.value = false
  }
}

function goBack() {
  router.push('/dashboard/clientes')
}
</script>

<template>
  <section class="novo-cliente">
    <div class="novo-cliente__heading">
      <button
        type="button"
        class="novo-cliente__back"
        aria-label="Voltar para Clientes"
        @click="goBack"
      >
        <img :src="iconChevronLeft" width="24" height="24" alt="" />
      </button>
      <h2 class="novo-cliente__title dashboard_title">NOVO CLIENTE</h2>
    </div>

    <div class="novo-cliente__panel">
      <form class="novo-cliente__form" @submit.prevent="handleSubmit">
        <div class="novo-cliente__row">
          <div class="novo-cliente__field novo-cliente__field--wide">
            <label class="novo-cliente__label night-field-label" for="nome">NOME</label>
            <input
              id="nome"
              v-model="nome"
              type="text"
              class="novo-cliente__input"
              placeholder="Nome completo"
            />
          </div>
          <div class="novo-cliente__field novo-cliente__field--narrow">
            <label class="novo-cliente__label night-field-label" for="cpf">CPF</label>
            <input
              id="cpf"
              v-model="cpf"
              type="text"
              class="novo-cliente__input"
              placeholder="000.000.000-00"
            />
          </div>
        </div>

        <div class="novo-cliente__row">
          <div class="novo-cliente__field novo-cliente__field--wide">
            <label class="novo-cliente__label night-field-label" for="nome_empresa">NOME DA EMPRESA</label>
            <input
              id="nome_empresa"
              v-model="nome_empresa"
              type="text"
              class="novo-cliente__input"
              placeholder="Nome da empresa"
            />
          </div>
          <div class="novo-cliente__field novo-cliente__field--narrow">
            <label class="novo-cliente__label night-field-label" for="cnpj">CNPJ</label>
            <input
              id="cnpj"
              v-model="cnpj"
              type="text"
              class="novo-cliente__input"
              placeholder="00.000.000/0000-00"
            />
          </div>
        </div>

        <div class="novo-cliente__row">
          <div class="novo-cliente__field novo-cliente__field--wide">
            <label class="novo-cliente__label night-field-label" for="email">E-MAIL</label>
            <input
              id="email"
              v-model="email"
              type="email"
              class="novo-cliente__input"
              placeholder="contato@email.com"
            />
          </div>
          <div class="novo-cliente__field novo-cliente__field--narrow">
            <label class="novo-cliente__label night-field-label" for="contato">CONTATO</label>
            <input
              id="contato"
              v-model="contato"
              type="text"
              class="novo-cliente__input"
              placeholder="(00) 00000-0000"
            />
          </div>
        </div>

        <div class="novo-cliente__row">
          <div class="novo-cliente__field novo-cliente__field--wide">
            <label class="novo-cliente__label night-field-label" for="endereco">ENDEREÇO</label>
            <input
              id="endereco"
              v-model="endereco"
              type="text"
              class="novo-cliente__input"
              placeholder="Rua, avenida, logradouro"
            />
          </div>
          <div class="novo-cliente__field novo-cliente__field--narrow">
            <label class="novo-cliente__label night-field-label" for="numero">NÚMERO</label>
            <input
              id="numero"
              v-model="numero"
              type="text"
              class="novo-cliente__input"
              placeholder="0000"
            />
          </div>
        </div>

        <div class="novo-cliente__row novo-cliente__row--thirds">
          <div class="novo-cliente__field">
            <label class="novo-cliente__label night-field-label" for="bairro">BAIRRO</label>
            <input
              id="bairro"
              v-model="bairro"
              type="text"
              class="novo-cliente__input"
              placeholder="Bairro"
            />
          </div>
          <div class="novo-cliente__field">
            <label class="novo-cliente__label night-field-label" for="cidade">CIDADE</label>
            <input
              id="cidade"
              v-model="cidade"
              type="text"
              class="novo-cliente__input"
              placeholder="Cidade"
            />
          </div>
          <div class="novo-cliente__field">
            <label class="novo-cliente__label night-field-label" for="estado">ESTADO</label>
            <input
              id="estado"
              v-model="estado"
              type="text"
              class="novo-cliente__input"
              placeholder="Estado"
            />
          </div>
        </div>

        <div class="novo-cliente__row">
          <div class="novo-cliente__field novo-cliente__field--wide">
            <label class="novo-cliente__label night-field-label" for="complemento">COMPLEMENTO</label>
            <input
              id="complemento"
              v-model="complemento"
              type="text"
              class="novo-cliente__input"
              placeholder="Complemento"
            />
          </div>
          <div class="novo-cliente__field novo-cliente__field--narrow">
            <label class="novo-cliente__label night-field-label" for="cep">CEP</label>
            <input
              id="cep"
              v-model="cep"
              type="text"
              class="novo-cliente__input"
              placeholder="00000-000"
            />
          </div>
        </div>

        <button type="submit" class="novo-cliente__submit" :disabled="fetching">
          {{ fetching ? 'Salvando…' : 'SALVAR' }}
        </button>
      </form>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.novo-cliente {
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
      .novo-cliente__field {
        flex: 1;
        min-width: 0;
      }
    }
  }

  &__field {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
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
    width: 100%;
    margin: 0;
    font-family: var(--night-font, 'Source Code Pro', monospace);
    font-size: 14px;
    font-weight: 700;
    line-height: 18px;
    letter-spacing: 0;
    color: var(--night-gray, #f7f7f7);
    opacity: 0.7;
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

    &::placeholder {
      color: #f7f7f7;
      opacity: 0.6;
    }
  }

  &__submit {
    width: 170px;
    height: 46px;
    margin: 8px auto 0;
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

    &__input {
      height: 44px;
      font-size: 13px;
    }

    &__submit {
      height: 44px;
      margin-top: 8px;
      font-size: 14px;
    }
  }
}
</style>
