<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'
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
  <section class="new_form">
    <div class="page_title">
      <button class="back_btn" @click="goBack">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
        </svg>
      </button>
      <h2 class="dashboard_title">CLIENTE</h2>
    </div>
    
    <div v-if="loading" class="loading_container">
      <p>Carregando...</p>
    </div>

    <div v-else class="form_wrapper">
      <form>
        <div class="input_row">
          <div class="form_group flex_3">
            <label>Nome</label>
            <input v-model="nome" type="text" disabled />
          </div>
          <div class="form_group flex_1">
            <label>CPF</label>
            <input v-model="cpf" type="text" disabled />
          </div>
        </div>

        <div class="input_row">
          <div class="form_group flex_3">
            <label>Nome da empresa</label>
            <input v-model="nome_empresa" type="text" disabled />
          </div>
          <div class="form_group flex_1">
            <label>CNPJ</label>
            <input v-model="cnpj" type="text" disabled />
          </div>
        </div>

        <div class="input_row">
          <div class="form_group flex_1">
            <label>E-mail</label>
            <input v-model="email" type="email" disabled />
          </div>
          <div class="form_group flex_1">
            <label>Celular</label>
            <input v-model="contato" type="text" disabled />
          </div>
        </div>

        <div class="input_row">
          <div class="form_group flex_3">
            <label>Endereço</label>
            <input v-model="endereco" type="text" disabled />
          </div>
          <div class="form_group flex_1">
            <label>Número</label>
            <input v-model="numero" type="text" disabled />
          </div>
        </div>

        <div class="input_row">
          <div class="form_group flex_1">
            <label>Bairro</label>
            <input v-model="bairro" type="text" disabled />
          </div>
          <div class="form_group flex_1">
            <label>Cidade</label>
            <input v-model="cidade" type="text" disabled />
          </div>
          <div class="form_group flex_1">
            <label>Estado</label>
            <input v-model="estado" type="text" disabled />
          </div>
        </div>

        <div class="input_row">
          <div class="form_group flex_3">
            <label>Complemento</label>
            <input v-model="complemento" type="text" disabled />
          </div>
          <div class="form_group flex_1">
            <label>CEP</label>
            <input v-model="cep" type="text" disabled />
          </div>
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
    background-color: rgba(207, 198, 188, 0.1);
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
        font-size: 0.875rem;
        color: var(--color-blue-700);
      }

      input {
        height: 51px;
        border: 1px solid var(--color-gray-500);
        padding: 0 15px;
        font-size: 0.938rem;
        color: var(--color-blue-700);
        outline: none;
        background: white;

        &:disabled {
          background: #f5f5f5;
          color: var(--color-blue-700);
        }

        &::placeholder {
          color: var(--color-gray-500);
        }
      }
    }
  }
}
</style>
