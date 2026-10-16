<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { getGestores, postGestor, putGestor } from '@/services/http/gestores'
import { maskCpf } from '@/utils/formatCpfCnpj'
import { maskPhone, stripDigits } from '@/utils/formatPhone'
import { getApiErrorMessage } from '@/utils/apiError'
import iconChevronLeft from '@/assets/imgs/administradores/icon-chevron-left.svg'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const id = route.params.id as string | undefined
const editando = !!id
const nome = ref('')
const email = ref('')
const contato = ref('')
const cpf = ref('')
const senha = ref('')
const senha2 = ref('')
const fetching = ref(false)

onMounted(async () => {
  if (!id) return
  try {
    const { data } = await getGestores()
    const gestor = (data.data || []).find((item) => item.id === id)
    if (!gestor) {
      toast.error('Administrador não encontrado')
      router.push('/dashboard/gestores')
      return
    }
    nome.value = gestor.nome
    email.value = gestor.email
    contato.value = gestor.contato ? maskPhone(gestor.contato) : ''
    cpf.value = gestor.cpf ? maskCpf(gestor.cpf) : ''
  } catch (error) {
    toast.error(getApiErrorMessage(error, 'Erro ao carregar'))
  }
})

async function salvar() {
  if (fetching.value) return
  const cpfDigits = stripDigits(cpf.value)
  const contatoDigits = stripDigits(contato.value)
  if (!nome.value.trim() || !email.value.trim() || cpfDigits.length !== 11 || contatoDigits.length < 10) {
    toast.error('Preencha nome, e-mail, CPF e contato.')
    return
  }
  if (!editando && senha.value.length < 8) {
    toast.error('A senha precisa ter pelo menos 8 caracteres.')
    return
  }
  if (senha.value && senha.value !== senha2.value) {
    toast.error('A confirmação da senha não confere.')
    return
  }

  fetching.value = true
  try {
    const payload = {
      nome: nome.value.trim(),
      email: email.value.trim().toLowerCase(),
      cpf: cpfDigits,
      contato: contatoDigits,
      ...(senha.value ? { password: senha.value, password_confirmation: senha2.value } : {})
    }
    if (editando && id) await putGestor(id, payload)
    else await postGestor({ ...payload, password: senha.value, password_confirmation: senha2.value })
    toast.success(editando ? 'Administrador atualizado' : 'Administrador cadastrado')
    router.push('/dashboard/gestores')
  } catch (error) {
    toast.error(getApiErrorMessage(error, 'Erro ao salvar'))
  } finally {
    fetching.value = false
  }
}
</script>

<template>
  <section class="gestor-form dashboard_padding">
    <div class="gestor-form__heading">
      <button type="button" aria-label="Voltar" @click="router.push('/dashboard/gestores')">
        <img :src="iconChevronLeft" width="24" height="24" alt="" />
      </button>
      <h2 class="dashboard_title">{{ editando ? 'EDITAR ADMINISTRADOR' : 'NOVO ADMINISTRADOR' }}</h2>
    </div>
    <form class="gestor-form__panel" @submit.prevent="salvar">
      <label>Nome*<input v-model="nome" type="text" maxlength="255" /></label>
      <label>E-mail*<input v-model="email" type="email" maxlength="255" /></label>
      <label>Contato*<input :value="contato" type="text" maxlength="15" inputmode="tel" placeholder="(00) 00000-0000" @input="contato = maskPhone(($event.target as HTMLInputElement).value)" /></label>
      <label>CPF*<input :value="cpf" type="text" maxlength="14" inputmode="numeric" placeholder="000.000.000-00" @input="cpf = maskCpf(($event.target as HTMLInputElement).value)" /></label>
      <label>{{ editando ? 'Nova senha' : 'Senha*' }}<input v-model="senha" type="password" autocomplete="new-password" /></label>
      <label>Confirmar senha<input v-model="senha2" type="password" autocomplete="new-password" /></label>
      <button type="submit" :disabled="fetching">{{ fetching ? 'Salvando…' : 'SALVAR' }}</button>
    </form>
  </section>
</template>

<style lang="scss" scoped>
.gestor-form {
  &__heading { display: flex; align-items: center; gap: 8px; margin-bottom: 24px; button { background: none; border: none; cursor: pointer; } }
  &__panel {
    display: flex;
    flex-direction: column;
    gap: 16px;
    max-width: 560px;
    background: #132438;
    border: 1px solid rgba(176, 141, 87, 0.18);
    border-radius: 20px;
    padding: 32px;
    label { display: flex; flex-direction: column; gap: 8px; color: #f7f7f7; font-size: 13px; font-weight: 700; text-transform: uppercase; }
    input {
      height: 48px; border-radius: 30px; border: 1px solid rgba(255,255,255,0.12);
      background: rgba(255,255,255,0.06); color: #fff; padding: 0 18px; font-weight: 400; text-transform: none;
    }
    button {
      margin-top: 8px; height: 46px; border: none; border-radius: 30px; background: #b08d57; color: #fff; font-weight: 700; cursor: pointer;
      &:disabled { opacity: 0.7; }
    }
  }
}
</style>
