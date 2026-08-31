<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useAuthStore } from '@/stores/auth'
import CustomButton from '@/components/CustomButton/CustomButton.vue'
import { patchUser } from '@/services/http/user'

const router = useRouter()
const toast = useToast()
const authStore = useAuthStore()

const nome = ref('')
const email = ref('')
const contato = ref('')
const cpf = ref('')
const cnpj = ref('')
const nomeEmpresa = ref('')
const fetching = ref(false)

const userRole = computed(() => authStore.userRole)

const nomeLabel = computed(() => {
  if (userRole.value === 'empresa') return 'Nome do responsável'
  if (userRole.value === 'cliente') return 'Nome'
  return 'Nome do administrador'
})

onMounted(() => {
  if (authStore.me) {
    nome.value = authStore.me.nome || ''
    email.value = authStore.me.email || ''
    contato.value = authStore.me.contato || ''
    cpf.value = authStore.me.cpf || ''
    cnpj.value = authStore.me.cnpj || ''
    nomeEmpresa.value = authStore.me.nome_empresa || ''
  }
})

async function handleSubmit() {
  if (fetching.value || !authStore.me?.id) return

  try {
    fetching.value = true

    const payload: Record<string, string> = {
      nome: nome.value,
      contato: contato.value,
    }

    if (cpf.value) payload.cpf = cpf.value
    if (userRole.value === 'empresa') {
      if (cnpj.value) payload.cnpj = cnpj.value
      if (nomeEmpresa.value) payload.nome_empresa = nomeEmpresa.value
    }

    await patchUser(payload, authStore.me.id)
    await authStore.refreshUserData()
    toast.success('Perfil atualizado')
    setTimeout(() => router.push('/dashboard/home'), 1500)
  } catch (error) {
    toast.error('Erro ao editar perfil')
    console.error(error)
  } finally {
    fetching.value = false
  }
}

function goBack() {
  router.push('/dashboard/home')
}
</script>

<template>
  <main class="page dashboard_padding">
    <section class="profile_section">
      <div class="page_title">
        <button class="back_btn" type="button" @click="goBack">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
          </svg>
        </button>
        <h2 class="dashboard_title">PERFIL</h2>
      </div>

      <div class="form_wrapper">
        <form @submit.prevent="handleSubmit">
          <div class="form_group">
            <label>{{ nomeLabel }}</label>
            <input v-model="nome" type="text" />
          </div>

          <div v-if="userRole === 'empresa'" class="form_group">
            <label>Nome da empresa</label>
            <input v-model="nomeEmpresa" type="text" />
          </div>

          <div class="form_group">
            <label>E-mail</label>
            <input v-model="email" type="email" disabled />
          </div>

          <div class="form_group">
            <label>Contato</label>
            <input v-model="contato" type="text" />
          </div>

          <div v-if="userRole !== 'empresa'" class="form_group">
            <label>CPF</label>
            <input v-model="cpf" type="text" />
          </div>

          <div v-if="userRole === 'empresa'" class="form_group">
            <label>CNPJ</label>
            <input v-model="cnpj" type="text" />
          </div>

          <div class="btn_container">
            <CustomButton
              title="Salvar perfil"
              variation="2"
              :loading="fetching"
              @click="handleSubmit"
            />
          </div>
        </form>
      </div>
    </section>
  </main>
</template>

<style lang="scss" scoped>
.page {
  width: 100%;
}

.profile_section {
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
      color: #ff00ff;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .form_wrapper {
    background-color: rgba(33, 33, 33, 0.5);
    padding: 40px;
    max-width: 600px;
    margin: 0 auto;
    border-radius: 8px;

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
        color: #f7f7f7;
        font-family: 'Source Code Pro', monospace;
        opacity: 0.7;
      }

      input {
        height: 51px;
        border: 1px solid rgba(247, 247, 247, 0.3);
        background: transparent;
        padding: 0 15px;
        font-size: 0.938rem;
        color: #f7f7f7;
        font-family: 'Source Code Pro', monospace;
        outline: none;

        &:disabled {
          opacity: 0.5;
        }

        &:focus {
          border-color: #ff00ff;
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
