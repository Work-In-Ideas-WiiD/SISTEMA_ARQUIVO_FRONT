<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'
import iconChevronLeft from '@/assets/imgs/administradores/icon-chevron-left.svg'
import { getEmpresa, patchEmpresa } from '@/services/http/empresas'
import {
  isValidOptionalCnpj,
  isValidOptionalCpf,
  maskCnpj,
  maskCpf
} from '@/utils/formatCpfCnpj'
import { maskPhone, stripDigits } from '@/utils/formatPhone'

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
const fetching = ref(false)
const loading = ref(true)

const empresaId = route.params.id as string

onMounted(async () => {
  try {
    const { data } = await getEmpresa(empresaId)
    nome.value = data.nome || ''
    cpf.value = data.cpf ? maskCpf(data.cpf) : ''
    nome_empresa.value = data.nome_empresa || ''
    cnpj.value = data.cnpj ? maskCnpj(data.cnpj) : ''
    email.value = data.email || ''
    contato.value = data.contato ? maskPhone(data.contato) : ''

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
    toast.error('Erro ao carregar empresa')
    router.push('/dashboard/empresas')
  } finally {
    loading.value = false
  }
})

function onCpfInput(event: Event) {
  cpf.value = maskCpf((event.target as HTMLInputElement).value)
}

function onCnpjInput(event: Event) {
  cnpj.value = maskCnpj((event.target as HTMLInputElement).value)
}

function onContatoInput(event: Event) {
  contato.value = maskPhone((event.target as HTMLInputElement).value)
}

async function handleSubmit() {
  if (fetching.value) return

  const cpfDigits = stripDigits(cpf.value)
  const cnpjDigits = stripDigits(cnpj.value)
  const contatoDigits = stripDigits(contato.value)

  if (!nome.value.trim() || !email.value.trim() || !contatoDigits) {
    toast.error('Preencha os campos obrigatórios')
    return
  }

  if (!isValidOptionalCpf(cpf.value)) {
    toast.error('CPF inválido')
    return
  }

  if (!isValidOptionalCnpj(cnpj.value)) {
    toast.error('CNPJ inválido')
    return
  }

  if (contatoDigits.length < 10 || contatoDigits.length > 11) {
    toast.error('Contato inválido')
    return
  }

  try {
    fetching.value = true
    await patchEmpresa(
      {
        type: 'empresa',
        nome: nome.value.trim(),
        nome_empresa: nome_empresa.value.trim() || undefined,
        cpf: cpfDigits || undefined,
        cnpj: cnpjDigits || undefined,
        email: email.value.trim().toLowerCase(),
        contato: contatoDigits,
        endereco: {
          rua: endereco.value.trim(),
          numero: numero.value.trim(),
          bairro: bairro.value.trim(),
          cidade: cidade.value.trim(),
          estado: estado.value.trim(),
          cep: stripDigits(cep.value),
          complemento: complemento.value.trim() || undefined
        }
      },
      empresaId
    )
    toast.success('Empresa atualizada')
    setTimeout(() => {
      router.push('/dashboard/empresas')
    }, 2000)
  } catch (error) {
    toast.error('Erro ao atualizar empresa')
  } finally {
    fetching.value = false
  }
}

function goBack() {
  router.push('/dashboard/empresas')
}
</script>

<template>
  <section class="nova-empresa">
    <div class="nova-empresa__heading">
      <button
        type="button"
        class="nova-empresa__back"
        aria-label="Voltar para Empresas"
        @click="goBack"
      >
        <img :src="iconChevronLeft" width="24" height="24" alt="" />
      </button>
      <h2 class="nova-empresa__title dashboard_title">EDITAR EMPRESA</h2>
    </div>

    <div v-if="loading" class="nova-empresa__loading">
      <p>Carregando…</p>
    </div>

    <div v-else class="nova-empresa__panel">
      <form class="nova-empresa__form" @submit.prevent="handleSubmit">
        <div class="nova-empresa__row">
          <div class="nova-empresa__field nova-empresa__field--wide">
            <label class="nova-empresa__label night-field-label" for="nome">NOME</label>
            <input
              id="nome"
              v-model="nome"
              type="text"
              class="nova-empresa__input"
              placeholder="Nome completo"
            />
          </div>
          <div class="nova-empresa__field nova-empresa__field--narrow">
            <label class="nova-empresa__label night-field-label" for="cpf">CPF</label>
            <input
              id="cpf"
              v-model="cpf"
              type="text"
              class="nova-empresa__input"
              placeholder="000.000.000-00"
              inputmode="numeric"
              autocomplete="off"
              @input="onCpfInput"
            />
          </div>
        </div>

        <div class="nova-empresa__row">
          <div class="nova-empresa__field nova-empresa__field--wide">
            <label class="nova-empresa__label night-field-label" for="nome_empresa">NOME DA EMPRESA</label>
            <input
              id="nome_empresa"
              v-model="nome_empresa"
              type="text"
              class="nova-empresa__input"
              placeholder="Nome da empresa"
            />
          </div>
          <div class="nova-empresa__field nova-empresa__field--narrow">
            <label class="nova-empresa__label night-field-label" for="cnpj">CNPJ</label>
            <input
              id="cnpj"
              v-model="cnpj"
              type="text"
              class="nova-empresa__input"
              placeholder="00.000.000/0000-00"
              inputmode="numeric"
              autocomplete="off"
              @input="onCnpjInput"
            />
          </div>
        </div>

        <div class="nova-empresa__row">
          <div class="nova-empresa__field nova-empresa__field--wide">
            <label class="nova-empresa__label night-field-label" for="email">E-MAIL</label>
            <input
              id="email"
              v-model="email"
              type="email"
              class="nova-empresa__input"
              placeholder="contato@email.com"
              disabled
            />
          </div>
          <div class="nova-empresa__field nova-empresa__field--narrow">
            <label class="nova-empresa__label night-field-label" for="contato">CONTATO</label>
            <input
              id="contato"
              v-model="contato"
              type="text"
              class="nova-empresa__input"
              placeholder="(00) 00000-0000"
              inputmode="tel"
              autocomplete="tel"
              @input="onContatoInput"
            />
          </div>
        </div>

        <div class="nova-empresa__row">
          <div class="nova-empresa__field nova-empresa__field--wide">
            <label class="nova-empresa__label night-field-label" for="endereco">ENDEREÇO</label>
            <input
              id="endereco"
              v-model="endereco"
              type="text"
              class="nova-empresa__input"
              placeholder="Rua, avenida, logradouro"
            />
          </div>
          <div class="nova-empresa__field nova-empresa__field--narrow">
            <label class="nova-empresa__label night-field-label" for="numero">NÚMERO</label>
            <input
              id="numero"
              v-model="numero"
              type="text"
              class="nova-empresa__input"
              placeholder="0000"
            />
          </div>
        </div>

        <div class="nova-empresa__row nova-empresa__row--thirds">
          <div class="nova-empresa__field">
            <label class="nova-empresa__label night-field-label" for="bairro">BAIRRO</label>
            <input
              id="bairro"
              v-model="bairro"
              type="text"
              class="nova-empresa__input"
              placeholder="Bairro"
            />
          </div>
          <div class="nova-empresa__field">
            <label class="nova-empresa__label night-field-label" for="cidade">CIDADE</label>
            <input
              id="cidade"
              v-model="cidade"
              type="text"
              class="nova-empresa__input"
              placeholder="Cidade"
            />
          </div>
          <div class="nova-empresa__field">
            <label class="nova-empresa__label night-field-label" for="estado">ESTADO</label>
            <input
              id="estado"
              v-model="estado"
              type="text"
              class="nova-empresa__input"
              placeholder="Estado"
            />
          </div>
        </div>

        <div class="nova-empresa__row">
          <div class="nova-empresa__field nova-empresa__field--wide">
            <label class="nova-empresa__label night-field-label" for="complemento">COMPLEMENTO</label>
            <input
              id="complemento"
              v-model="complemento"
              type="text"
              class="nova-empresa__input"
              placeholder="Complemento"
            />
          </div>
          <div class="nova-empresa__field nova-empresa__field--narrow">
            <label class="nova-empresa__label night-field-label" for="cep">CEP</label>
            <input
              id="cep"
              v-model="cep"
              type="text"
              class="nova-empresa__input"
              placeholder="00000-000"
            />
          </div>
        </div>

        <button type="submit" class="nova-empresa__submit" :disabled="fetching">
          {{ fetching ? 'Salvando…' : 'SALVAR ALTERAÇÕES' }}
        </button>
      </form>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.nova-empresa {
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
      .nova-empresa__field {
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
    -webkit-text-fill-color: #ffffff;

    &::placeholder {
      color: #f7f7f7;
      opacity: 0.6;
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      color: #f7f7f7;
      -webkit-text-fill-color: #f7f7f7;
    }

    &:-webkit-autofill,
    &:-webkit-autofill:hover,
    &:-webkit-autofill:focus {
      -webkit-text-fill-color: #ffffff !important;
      caret-color: #ffffff;
      -webkit-box-shadow: 0 0 0 1000px rgba(121, 121, 121, 0.3) inset !important;
      transition: background-color 99999s ease-in-out 0s;
    }
  }

  &__submit {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: auto;
    min-width: 295px;
    max-width: 100%;
    height: 46px;
    margin: 8px auto 0;
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
