<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import iconChevronLeft from '@/assets/imgs/administradores/icon-chevron-left.svg'
import { postAdministrador } from '@/services/http/administradores'
import { maskCpf } from '@/utils/formatCpfCnpj'
import { maskPhone, stripDigits } from '@/utils/formatPhone'

const router = useRouter()
const toast = useToast()

const nome = ref('')
const email = ref('')
const contato = ref('')
const cpf = ref('')
const fetching = ref(false)

function onCpfInput(event: Event) {
  cpf.value = maskCpf((event.target as HTMLInputElement).value)
}

function onContatoInput(event: Event) {
  contato.value = maskPhone((event.target as HTMLInputElement).value)
}

async function handleSubmit() {
  if (fetching.value) return

  const cpfDigits = stripDigits(cpf.value)
  const contatoDigits = stripDigits(contato.value)

  if (!nome.value.trim() || !email.value.trim() || !cpfDigits || !contatoDigits) {
    toast.error('Preencha todos os campos')
    return
  }

  if (cpfDigits.length !== 11) {
    toast.error('CPF inválido')
    return
  }

  if (contatoDigits.length < 10 || contatoDigits.length > 11) {
    toast.error('Contato inválido')
    return
  }

  try {
    fetching.value = true
    await postAdministrador({
      nome: nome.value.trim(),
      email: email.value.trim().toLowerCase(),
      cpf: cpfDigits,
      contato: contatoDigits
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
  <section class="admin-form-night">
    <div class="admin-form-night__heading">
      <button
        type="button"
        class="admin-form-night__back"
        aria-label="Voltar para Administradores"
        @click="goBack"
      >
        <img :src="iconChevronLeft" width="24" height="24" alt="" />
      </button>
      <h2 class="admin-form-night__title dashboard_title">NOVO CADASTRO</h2>
    </div>

    <div class="admin-form-night__panel">
      <form class="admin-form-night__form" @submit.prevent="handleSubmit">
        <div class="admin-form-night__field">
          <label class="admin-form-night__label night-field-label" for="nome">NOME DO ADMINISTRADOR</label>
          <input
            id="nome"
            v-model="nome"
            type="text"
            class="admin-form-night__input"
            placeholder="Nome completo"
          />
        </div>

        <div class="admin-form-night__field">
          <label class="admin-form-night__label night-field-label" for="email">E-MAIL</label>
          <input
            id="email"
            v-model="email"
            type="email"
            class="admin-form-night__input"
            placeholder="contato@email.com"
          />
        </div>

        <div class="admin-form-night__field">
          <label class="admin-form-night__label night-field-label" for="contato">CONTATO</label>
          <input
            id="contato"
            v-model="contato"
            type="text"
            class="admin-form-night__input"
            placeholder="(00) 00000-0000"
            inputmode="tel"
            autocomplete="tel"
            @input="onContatoInput"
          />
        </div>

        <div class="admin-form-night__field">
          <label class="admin-form-night__label night-field-label" for="cpf">CPF</label>
          <input
            id="cpf"
            v-model="cpf"
            type="text"
            class="admin-form-night__input"
            placeholder="000.000.000-00"
            inputmode="numeric"
            autocomplete="off"
            @input="onCpfInput"
          />
        </div>

        <button type="submit" class="admin-form-night__submit" :disabled="fetching">
          {{ fetching ? 'Salvando…' : 'ADICIONAR ADMINISTRADOR' }}
        </button>
      </form>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@import '@/styles/admin-form-night.scss';
</style>
