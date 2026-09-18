<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'
import { getCliente, patchCliente } from '@/services/http/clientes'
import { getApiErrorMessage } from '@/utils/apiError'

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

async function handleSubmit() {
  if (fetching.value) return
  
  if (!nome.value || !contato.value) {
    toast.error('Preencha os campos obrigatórios')
    return
  }
  
  try {
    fetching.value = true
    await patchCliente({
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
    }, clienteId)
    toast.success('Cliente atualizado')
    setTimeout(() => {
      router.push('/dashboard/clientes')
    }, 2000)
  } catch (error) {
    toast.error(getApiErrorMessage(error, 'Erro ao atualizar cliente'))
  } finally {
    fetching.value = false
  }
}

function goBack() {
  router.push('/dashboard/clientes')
}
</script>

<template>
  <section class="new_form">
    <div class="page_title">
      <button class="back_btn" @click="goBack">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
        </svg>
      </button>
      <h2 class="dashboard_title">EDITAR CLIENTE</h2>
    </div>
    
    <div v-if="loading" class="loading_container">
      <p>Carregando...</p>
    </div>

    <div v-else class="form_wrapper">
      <form @submit.prevent="handleSubmit">
        <div class="input_row">
          <div class="form_group flex_3">
            <label>Nome</label>
            <input v-model="nome" type="text" />
          </div>
          <div class="form_group flex_1">
            <label>CPF</label>
            <input v-model="cpf" type="text" placeholder="000.000.000-00" />
          </div>
        </div>

        <div class="input_row">
          <div class="form_group flex_3">
            <label>Nome da empresa</label>
            <input v-model="nome_empresa" type="text" />
          </div>
          <div class="form_group flex_1">
            <label>CNPJ</label>
            <input v-model="cnpj" type="text" placeholder="00.000.000/0000-00" />
          </div>
        </div>

        <div class="input_row">
          <div class="form_group flex_1">
            <label>E-mail</label>
            <input v-model="email" type="email" />
          </div>
          <div class="form_group flex_1">
            <label>Contato</label>
            <input v-model="contato" type="text" placeholder="(00) 00000-0000" />
          </div>
        </div>

        <div class="input_row">
          <div class="form_group flex_1">
            <label>CEP</label>
            <input v-model="cep" type="text" placeholder="00000-000" />
          </div>
          <div class="form_group flex_3">
            <label>Endereço</label>
            <input v-model="endereco" type="text" />
          </div>
          <div class="form_group flex_1">
            <label>Número</label>
            <input v-model="numero" type="text" />
          </div>
        </div>

        <div class="input_row">
          <div class="form_group flex_1">
            <label>Bairro</label>
            <input v-model="bairro" type="text" />
          </div>
          <div class="form_group flex_1">
            <label>Cidade</label>
            <input v-model="cidade" type="text" />
          </div>
          <div class="form_group flex_1">
            <label>Estado</label>
            <input v-model="estado" type="text" />
          </div>
        </div>

        <div class="form_group">
          <label>Complemento</label>
          <input v-model="complemento" type="text" />
        </div>

        <div class="btn_container">
          <button type="submit" class="btn_salvar" :disabled="fetching">
            {{ fetching ? 'Salvando…' : 'SALVAR ALTERAÇÕES' }}
          </button>
        </div>
      </form>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.new_form {
  width: 100%;

  .page_title {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-bottom: 42px;

    .back_btn {
      background: none;
      border: none;
      cursor: pointer;
      color: var(--color-orange-500);
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .loading_container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 200px;
    
    p {
      color: #666;
      font-size: 16px;
    }
  }

  .form_wrapper {
    background-color: var(--night-surface, #132438);
    border: 1px solid var(--night-surface-border, rgba(176, 141, 87, 0.18));
    border-radius: var(--night-radius, 20px);
    padding: 45px 50px;
    max-width: 1050px;

    @media (max-width: 900px) {
      padding: 20px 13px;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 29px;

      @media (max-width: 900px) {
        gap: 10px;
      }
    }

    .input_row {
      display: flex;
      gap: 37px;

      @media (max-width: 900px) {
        flex-direction: column;
        gap: 10px;
      }
    }

    .form_group {
      display: flex;
      flex-direction: column;
      gap: 8px;

      &.flex_1 {
        flex: 1;
      }

      &.flex_3 {
        flex: 3;
      }

      label {
        font-family: var(--night-font, 'Inter', sans-serif);
        font-size: 0.875rem;
        font-weight: 700;
        color: var(--night-gray, #f7f7f7);
        opacity: 0.8;
        text-transform: uppercase;
      }

      input, select {
        height: 51px;
        border: 1px solid rgba(255, 255, 255, 0.12);
        border-radius: 30px;
        padding: 0 20px;
        font-family: var(--night-font, 'Inter', sans-serif);
        font-size: 0.938rem;
        color: #ffffff;
        outline: none;
        background: rgba(255, 255, 255, 0.06);
        transition: all 0.2s ease;

        &:focus {
          border-color: #B08D57;
          box-shadow: 0 0 0 2px rgba(176, 141, 87, 0.2);
        }

        &:disabled {
          background: rgba(255, 255, 255, 0.03);
          color: rgba(255, 255, 255, 0.5);
        }

        &::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }
      }
    }

    .btn_container {
      margin-top: 20px;
      display: flex;
      justify-content: center;
    }

    .btn_salvar {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: auto;
      min-width: 295px;
      max-width: 100%;
      height: 46px;
      padding: 0 28px;
      border: none;
      border-radius: 30px;
      background: var(--night-gold, #B08D57);
      color: #ffffff;
      font-family: var(--night-font, 'Inter', sans-serif);
      font-size: 16px;
      font-weight: 700;
      line-height: 1;
      text-transform: uppercase;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover:not(:disabled) {
        background: #C29F68;
        box-shadow: 0 4px 12px rgba(176, 141, 87, 0.3);
      }

      &:disabled {
        opacity: 0.7;
        cursor: wait;
      }
    }
  }
}
</style>
