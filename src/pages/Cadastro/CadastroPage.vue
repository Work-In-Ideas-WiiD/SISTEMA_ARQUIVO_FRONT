<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useAuthStore } from '@/stores/auth'
import CustomButton from '@/components/CustomButton/CustomButton.vue'

const router = useRouter()
const toast = useToast()
const auth = useAuthStore()

const form = ref({
  nome: '',
  nome_empresa: '',
  email: '',
  cpf: '',
  cnpj: '',
  password: '',
  password_confirmation: ''
})

async function handleSubmit() {
  if (!form.value.nome || !form.value.email || !form.value.nome_empresa) {
    toast.error('Preencha nome, e-mail e nome da empresa.')
    return
  }
  if (form.value.password.length < 8) {
    toast.error('A senha deve ter ao menos 8 caracteres.')
    return
  }
  if (form.value.password !== form.value.password_confirmation) {
    toast.error('As senhas não conferem.')
    return
  }

  try {
    await auth.signUp({
      nome: form.value.nome,
      nome_empresa: form.value.nome_empresa,
      email: form.value.email,
      password: form.value.password,
      password_confirmation: form.value.password_confirmation,
      cpf: form.value.cpf || undefined,
      cnpj: form.value.cnpj || undefined
    })
  } catch (e) {
    // erro já tratado (toast) na store
  }
}
</script>

<template>
  <main class="public_page">
    <div class="card">
      <h1 class="card_title">Criar conta</h1>
      <p class="card_subtitle">Cadastre-se para contratar um plano.</p>

      <form @submit.prevent="handleSubmit">
        <div class="form_group">
          <label for="nome">Seu nome *</label>
          <input id="nome" v-model="form.nome" type="text" placeholder="Nome completo" required />
        </div>
        <div class="form_group">
          <label for="nome_empresa">Nome da empresa *</label>
          <input id="nome_empresa" v-model="form.nome_empresa" type="text" placeholder="Empresa" required />
        </div>
        <div class="form_group">
          <label for="email">E-mail *</label>
          <input id="email" v-model="form.email" type="email" placeholder="voce@empresa.com" required />
        </div>
        <div class="form_group">
          <label for="cpf">CPF</label>
          <input id="cpf" v-model="form.cpf" type="text" placeholder="000.000.000-00" />
        </div>
        <div class="form_group">
          <label for="cnpj">CNPJ</label>
          <input id="cnpj" v-model="form.cnpj" type="text" placeholder="00.000.000/0000-00" />
        </div>
        <div class="form_group">
          <label for="password">Senha *</label>
          <input id="password" v-model="form.password" type="password" placeholder="Mínimo 8 caracteres" required />
        </div>
        <div class="form_group">
          <label for="password_confirmation">Confirmar senha *</label>
          <input id="password_confirmation" v-model="form.password_confirmation" type="password" required />
        </div>

        <div class="form_actions">
          <CustomButton title="CADASTRAR" type="submit" :loading="auth.fetching" />
        </div>
      </form>

      <p class="card_footer">
        Já tem conta?
        <a href="#" @click.prevent="router.push('/')">Entrar</a>
      </p>
    </div>
  </main>
</template>

<style lang="scss" scoped>
.public_page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-white-300, #f8f8f8);
  padding: 24px;

  .card {
    width: 100%;
    max-width: 440px;
    background: #fff;
    padding: 40px;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);

    .card_title {
      font-size: 1.6rem;
      color: var(--color-blue-700, #1e3f49);
      margin-bottom: 6px;
    }

    .card_subtitle {
      color: var(--color-gray-500, #707070);
      margin-bottom: 28px;
    }

    .form_group {
      margin-bottom: 16px;

      label {
        display: block;
        margin-bottom: 6px;
        font-weight: 500;
      }

      input {
        width: 100%;
        padding: 12px;
        border: 1px solid rgba(207, 198, 188, 0.6);
        border-radius: 4px;
        font-size: 14px;

        &:focus {
          outline: none;
          border-color: #c7633b;
        }
      }
    }

    .form_actions {
      display: flex;
      justify-content: flex-end;
      margin-top: 8px;
    }

    .card_footer {
      margin-top: 20px;
      text-align: center;
      color: var(--color-gray-500, #707070);

      a {
        color: #c7633b;
        font-weight: 600;
      }
    }
  }
}
</style>
