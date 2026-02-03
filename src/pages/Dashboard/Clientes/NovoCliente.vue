<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import CustomButton from '@/components/CustomButton/CustomButton.vue'
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
  <section class="new_form">
    <div class="page_title">
      <button class="back_btn" @click="goBack">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
        </svg>
      </button>
      <h2 class="dashboard_title">NOVO CADASTRO</h2>
    </div>
    
    <div class="form_wrapper">
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
          <div class="form_group flex_2">
            <label>E-mail</label>
            <input v-model="email" type="email" />
          </div>
          <div class="form_group flex_1">
            <label>Celular</label>
            <input v-model="contato" type="text" placeholder="(00) 00000-0000" />
          </div>
        </div>

        <div class="input_row">
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

        <div class="input_row">
          <div class="form_group flex_2">
            <label>Complemento</label>
            <input v-model="complemento" type="text" />
          </div>
          <div class="form_group flex_1">
            <label>CEP</label>
            <input v-model="cep" type="text" placeholder="00000-000" />
          </div>
        </div>
        
        <div class="btn_container">
          <CustomButton
            title="Salvar"
            variation="2"
            :loading="fetching"
            @click="handleSubmit"
          />
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

  .form_wrapper {
    background-color: rgba(207, 198, 188, 0.1);
    padding: 40px;

    form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .input_row {
      display: flex;
      gap: 20px;

      @media (max-width: 768px) {
        flex-direction: column;
      }
    }

    .flex_1 { flex: 1; }
    .flex_2 { flex: 2; }
    .flex_3 { flex: 3; }

    .form_group {
      display: flex;
      flex-direction: column;
      gap: 8px;

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

        &::placeholder {
          color: var(--color-gray-500);
        }
      }
    }

    .btn_container {
      margin-top: 20px;
      display: flex;
      justify-content: center;
    }
  }
}
</style>
