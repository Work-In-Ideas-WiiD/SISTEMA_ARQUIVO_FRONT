<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import CustomButton from '@/components/CustomButton/CustomButton.vue'
import { postAdministrador } from '@/services/http/administradores'

const router = useRouter()
const toast = useToast()

const nome = ref('')
const email = ref('')
const contato = ref('')
const cpf = ref('')
const fetching = ref(false)

async function handleSubmit() {
  if (fetching.value) return
  
  if (!nome.value || !email.value || !cpf.value || !contato.value) {
    toast.error('Preencha todos os campos')
    return
  }
  
  try {
    fetching.value = true
    await postAdministrador({
      nome: nome.value,
      email: email.value,
      cpf: cpf.value,
      contato: contato.value
    })
    toast.success('Administrador cadastrado')
    setTimeout(() => {
      router.push('/dashboard/admins')
    }, 2000)
  } catch (error) {
    toast.error('Erro ao cadastrar administrador')
    console.error(error)
  } finally {
    fetching.value = false
  }
}

function goBack() {
  router.push('/dashboard/admins')
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
        <div class="form_group">
          <label>Nome do administrador</label>
          <input v-model="nome" type="text" />
        </div>
        
        <div class="form_group">
          <label>E-mail</label>
          <input v-model="email" type="email" />
        </div>
        
        <div class="form_group">
          <label>Contato</label>
          <input v-model="contato" type="text" placeholder="(00) 00000-0000" />
        </div>
        
        <div class="form_group">
          <label>CPF</label>
          <input v-model="cpf" type="text" placeholder="000.000.000-00" />
        </div>
        
        <div class="btn_container">
          <CustomButton
            title="Adicionar administrador"
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
    max-width: 600px;

    form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

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
    }
  }
}
</style>
