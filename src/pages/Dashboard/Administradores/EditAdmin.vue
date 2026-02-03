<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'
import CustomButton from '@/components/CustomButton/CustomButton.vue'
import { getAdministrador, patchAdministrador } from '@/services/http/administradores'

const router = useRouter()
const route = useRoute()
const toast = useToast()

const nome = ref('')
const email = ref('')
const contato = ref('')
const cpf = ref('')
const fetching = ref(false)
const loading = ref(true)

const adminId = route.params.id as string

onMounted(async () => {
  try {
    const { data } = await getAdministrador(adminId)
    nome.value = data.nome || ''
    email.value = data.email || ''
    contato.value = data.contato || ''
    cpf.value = data.cpf || ''
  } catch (error) {
    toast.error('Erro ao carregar administrador')
    router.push('/dashboard/admins')
  } finally {
    loading.value = false
  }
})

async function handleSubmit() {
  if (fetching.value) return
  
  if (!nome.value || !cpf.value || !contato.value) {
    toast.error('Preencha todos os campos')
    return
  }
  
  try {
    fetching.value = true
    await patchAdministrador({
      nome: nome.value,
      cpf: cpf.value,
      contato: contato.value
    }, adminId)
    toast.success('Administrador atualizado')
    setTimeout(() => {
      router.push('/dashboard/admins')
    }, 2000)
  } catch (error) {
    toast.error('Erro ao atualizar administrador')
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
      <h2 class="dashboard_title">EDITAR ADMINISTRADOR</h2>
    </div>
    
    <div v-if="loading" class="loading_container">
      <p>Carregando...</p>
    </div>

    <div v-else class="form_wrapper">
      <form @submit.prevent="handleSubmit">
        <div class="form_group">
          <label>Nome do administrador</label>
          <input v-model="nome" type="text" />
        </div>
        
        <div class="form_group">
          <label>E-mail</label>
          <input v-model="email" type="text" disabled />
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
            title="Salvar alterações"
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

        &:disabled {
          background: #f5f5f5;
          color: #888;
        }

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
