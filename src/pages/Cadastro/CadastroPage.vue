<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useAuthStore } from '@/stores/auth'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import logoAkidocs from '@/assets/imgs/login/logo-akidocs-white.png'
import iconPerson from '@/assets/imgs/login/icon-person.svg'
import iconBuilding from '@/assets/imgs/login/icon-building.svg'
import iconLock from '@/assets/imgs/login/icon-lock.svg'
import iconBackCircle from '@/assets/imgs/login/icon-back-circle.svg'
import iconChevronLeft from '@/assets/imgs/login/icon-chevron-left.svg'
import { trackEvent, trackLoginClick } from '@/utils/tracking'
import { setPageSeo } from '@/utils/seo'
import { maskCpf, maskCnpj, isValidCpf, isValidCnpj } from '@/utils/formatCpfCnpj'

const toast = useToast()
const auth = useAuthStore()

onMounted(() => {
  trackEvent('cadastro_iniciado')
  setPageSeo({
    title: 'Cadastro — AkiDocs | Crie sua Conta Corporativa',
    description: 'Crie sua conta no AkiDocs e comece a gerenciar seus arquivos e clientes na nuvem.',
    canonicalUrl: 'https://akidocs.com.br/cadastro'
  })
})

const form = ref({
  nome: '',
  nome_empresa: '',
  email: '',
  cpf: '',
  cnpj: '',
  password: '',
  password_confirmation: ''
})

type Campo = keyof typeof form.value
const erros = ref<Partial<Record<Campo, string>>>({})
const tentouEnviar = ref(false)

function onCpfInput(event: Event) {
  form.value.cpf = maskCpf((event.target as HTMLInputElement).value)
  revalidar()
}

function onCnpjInput(event: Event) {
  form.value.cnpj = maskCnpj((event.target as HTMLInputElement).value)
  revalidar()
}

function validar(): Partial<Record<Campo, string>> {
  const f = form.value
  const e: Partial<Record<Campo, string>> = {}
  const cpf = f.cpf.replace(/\D/g, '')
  const cnpj = f.cnpj.replace(/\D/g, '')

  if (f.nome.trim().length < 3) e.nome = f.nome.trim() ? 'O nome deve ter ao menos 3 letras.' : 'Informe seu nome.'
  if (f.nome_empresa.trim().length < 2) e.nome_empresa = 'Informe o nome da empresa.'
  if (!f.email.trim()) e.email = 'Informe seu e-mail.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) e.email = 'E-mail inválido.'
  if (!cpf && !cnpj) {
    e.cpf = 'Informe o CPF ou o CNPJ.'
  } else {
    if (cpf && !isValidCpf(cpf)) e.cpf = 'CPF inválido.'
    if (cnpj && !isValidCnpj(cnpj)) e.cnpj = 'CNPJ inválido.'
  }
  if (!f.password) e.password = 'Informe uma senha.'
  else if (f.password.length < 8) e.password = 'A senha deve ter ao menos 8 caracteres.'
  if (f.password && f.password_confirmation !== f.password) e.password_confirmation = 'As senhas não conferem.'
  return e
}

function revalidar() {
  if (tentouEnviar.value) erros.value = validar()
}

async function handleSubmit() {
  tentouEnviar.value = true
  erros.value = validar()
  if (Object.keys(erros.value).length) {
    toast.error('Confira os campos destacados.')
    return
  }

  const cpfDigits = form.value.cpf.replace(/\D/g, '')
  const cnpjDigits = form.value.cnpj.replace(/\D/g, '')

  try {
    await auth.signUp({
      nome: form.value.nome.trim(),
      nome_empresa: form.value.nome_empresa.trim(),
      email: form.value.email.trim(),
      password: form.value.password,
      password_confirmation: form.value.password_confirmation,
      cpf: cpfDigits || undefined,
      cnpj: cnpjDigits || undefined
    })
  } catch (err: any) {
    const doServidor = err?.response?.data?.errors as Record<string, string[]> | undefined
    if (doServidor) {
      const e: Partial<Record<Campo, string>> = {}
      for (const [campo, msgs] of Object.entries(doServidor)) {
        if (campo in form.value) e[campo as Campo] = msgs[0]
      }
      erros.value = e
    }
  }
}
</script>

<template>
  <main class="login_page">
    <h1 class="sr-only">Cadastro de Empresa — AkiDocs</h1>
    <p class="login_page__watermark" aria-hidden="true">&lt;/DOC</p>

    <RouterLink class="back_btn" to="/" aria-label="Voltar para a página inicial">
      <img class="back_btn__circle" :src="iconBackCircle" alt="Círculo do botão voltar" width="66" height="66" />
      <img class="back_btn__icon" :src="iconChevronLeft" alt="Ícone de seta para voltar" width="40" height="40" />
    </RouterLink>

    <form class="login_form" novalidate @submit.prevent="handleSubmit">
      <img class="login_form__logo" :src="logoAkidocs" alt="Logotipo AkiDocs" />

      <div class="login_form__fields">
        <div class="login_campo">
          <label class="login_field" :class="{ 'login_field--erro': erros.nome }">
            <span class="login_field__icon" aria-hidden="true">
              <img :src="iconPerson" alt="Ícone de usuário para nome completo" width="13.27" height="13.27" />
            </span>
            <input
              v-model="form.nome"
              type="text"
              placeholder="Seu nome *"
              autocomplete="name"
              maxlength="255"
              :aria-invalid="!!erros.nome"
              @input="revalidar"
            />
          </label>
          <small v-if="erros.nome" class="login_campo__erro">{{ erros.nome }}</small>
        </div>

        <div class="login_campo">
          <label class="login_field" :class="{ 'login_field--erro': erros.nome_empresa }">
            <span class="login_field__icon" aria-hidden="true">
              <img :src="iconBuilding" alt="Ícone de identificação da empresa" width="11" height="13" />
            </span>
            <input
              v-model="form.nome_empresa"
              type="text"
              placeholder="Nome da empresa *"
              autocomplete="organization"
              maxlength="255"
              :aria-invalid="!!erros.nome_empresa"
              @input="revalidar"
            />
          </label>
          <small v-if="erros.nome_empresa" class="login_campo__erro">{{ erros.nome_empresa }}</small>
        </div>

        <div class="login_campo">
          <label class="login_field" :class="{ 'login_field--erro': erros.email }">
            <span class="login_field__icon" aria-hidden="true">
              <img :src="iconPerson" alt="Ícone de identificação para e-mail" width="13.27" height="13.27" />
            </span>
            <input
              v-model="form.email"
              type="email"
              placeholder="Email *"
              autocomplete="email"
              maxlength="255"
              :aria-invalid="!!erros.email"
              @input="revalidar"
            />
          </label>
          <small v-if="erros.email" class="login_campo__erro">{{ erros.email }}</small>
        </div>

        <div class="login_campo">
          <label class="login_field" :class="{ 'login_field--erro': erros.cpf }">
            <span class="login_field__icon" aria-hidden="true">
              <img :src="iconPerson" alt="Ícone de identificação para CPF" width="13.27" height="13.27" />
            </span>
            <input
              :value="form.cpf"
              type="text"
              inputmode="numeric"
              placeholder="CPF **"
              maxlength="14"
              autocomplete="off"
              :aria-invalid="!!erros.cpf"
              @input="onCpfInput"
            />
          </label>
          <small v-if="erros.cpf" class="login_campo__erro">{{ erros.cpf }}</small>
        </div>

        <div class="login_campo">
          <label class="login_field" :class="{ 'login_field--erro': erros.cnpj }">
            <span class="login_field__icon" aria-hidden="true">
              <img :src="iconBuilding" alt="Ícone de identificação para CNPJ" width="11" height="13" />
            </span>
            <input
              :value="form.cnpj"
              type="text"
              inputmode="numeric"
              placeholder="CNPJ **"
              maxlength="18"
              autocomplete="off"
              :aria-invalid="!!erros.cnpj"
              @input="onCnpjInput"
            />
          </label>
          <small v-if="erros.cnpj" class="login_campo__erro">{{ erros.cnpj }}</small>
        </div>

        <div class="login_campo">
          <label class="login_field" :class="{ 'login_field--erro': erros.password }">
            <span class="login_field__icon" aria-hidden="true">
              <img :src="iconLock" alt="Ícone de cadeado para senha" width="11.77" height="13.45" />
            </span>
            <input
              v-model="form.password"
              type="password"
              placeholder="Senha (mínimo 8 caracteres) *"
              autocomplete="new-password"
              :aria-invalid="!!erros.password"
              @input="revalidar"
            />
          </label>
          <small v-if="erros.password" class="login_campo__erro">{{ erros.password }}</small>
        </div>

        <div class="login_campo">
          <label class="login_field" :class="{ 'login_field--erro': erros.password_confirmation }">
            <span class="login_field__icon" aria-hidden="true">
              <img :src="iconLock" alt="Ícone de cadeado para confirmação de senha" width="11.77" height="13.45" />
            </span>
            <input
              v-model="form.password_confirmation"
              type="password"
              placeholder="Confirmar senha *"
              autocomplete="new-password"
              :aria-invalid="!!erros.password_confirmation"
              @input="revalidar"
            />
          </label>
          <small v-if="erros.password_confirmation" class="login_campo__erro">{{ erros.password_confirmation }}</small>
        </div>

        <p class="login_form__legenda">* Obrigatório &nbsp;·&nbsp; ** Preencha o CPF ou o CNPJ</p>
      </div>

      <div class="login_form__actions">
        <button type="submit" class="login_btn login_btn--primary" :disabled="auth.fetching">
          <LoadingSpinner v-if="auth.fetching" />
          <span v-else>CADASTRAR</span>
        </button>
      </div>

      <RouterLink class="login_form__first_access" to="/login" @click="trackLoginClick('cadastro_page')">
        Já tem conta? <span>Entrar.</span>
      </RouterLink>
    </form>
  </main>
</template>

<style lang="scss" scoped>
@import '@/styles/login-night-mobile.scss';

.login_page {
  --login-black: #0B1B2B;
  --login-navy: #1F3A5F;
  --login-gold: #B08D57;
  --login-gray: #FFFCFF;
  --login-input-bg: rgba(255, 255, 255, 0.08);

  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: radial-gradient(circle at 85% 15%, rgba(176, 141, 87, 0.12) 0%, transparent 40%), linear-gradient(135deg, #0B1B2B 0%, #1F3A5F 100%);
  font-family: 'Inter', sans-serif;

  @include login-mobile-gradient;
  @include login-mobile-shell;

  &__watermark {
    position: absolute;
    z-index: 0;
    top: 80.28vh;
    right: -1.82vw;
    bottom: auto;
    margin: 0;
    font-size: clamp(90px, 24.07vh, 260px);
    font-weight: 700;
    line-height: 0.9;
    color: rgba(255, 252, 255, 0.05);
    pointer-events: none;
    user-select: none;
    white-space: nowrap;

    @include login-mobile-watermark-hidden;
  }
}

@media (min-width: 960px) and (max-width: 1080px) and (min-height: 700px) and (max-height: 820px) and (max-aspect-ratio: 16/10) {
  .login_page__watermark {
    top: auto;
    bottom: -5vh;
    right: -2vw;
    font-size: clamp(76px, 19.5vh, 180px);
  }
}

.back_btn {
  position: fixed;
  z-index: 10;
  top: clamp(24px, 3.5vh, 48px);
  left: clamp(16px, 3vw, 48px);
  width: 66px;
  height: 66px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  transition: opacity 0.15s ease;

  @include login-mobile-back-btn;

  &:hover {
    opacity: 0.85;
  }

  &__circle {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: contain;
    display: block;
  }

  &__icon {
    position: relative;
    z-index: 1;
    width: 40px;
    height: 40px;
    transform: rotate(90deg);
    object-fit: contain;
    display: block;

    @include login-mobile-back-btn-icon;
  }
}

.login_form {
  position: relative;
  z-index: 2;
  width: min(100%, 358px);
  max-height: 100%;
  overflow-y: auto;
  scrollbar-width: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: clamp(12px, 2.2vh, 24px) 16px clamp(16px, 4.4vh, 48px);

  &__logo {
    width: clamp(180px, 22vw, 242px);
    max-width: 70%;
    height: auto;
    margin-bottom: clamp(20px, 3.6vh, 40px);
    object-fit: contain;
  }

  &__fields {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  &__legenda {
    margin: -4px 0 0;
    padding: 0 22px;
    font-size: 12px;
    color: rgba(255, 252, 255, 0.7);
  }

  &__actions {
    margin-top: clamp(20px, 3.7vh, 40px);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: clamp(10px, 1.4vh, 15px);
  }

  &__first_access {
    position: relative;
    z-index: 2;
    margin-top: clamp(16px, 2.6vh, 28px);
    font-size: 13px;
    font-weight: 400;
    color: var(--login-gray);
    text-align: center;

    span {
      font-weight: 600;
      text-decoration: underline;
    }

    &:hover {
      opacity: 0.85;
    }
  }
}

.login_campo {
  display: flex;
  flex-direction: column;
  gap: 4px;

  &__erro {
    padding: 0 22px;
    font-size: 12px;
    line-height: 1.3;
    color: #fca5a5;
  }
}

.login_field {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  height: 49px;
  padding: 0 22px;
  border-radius: 30px;
  background: var(--login-input-bg);
  border: 1px solid rgba(255, 255, 255, 0.15);
  transition: all 0.2s ease;
  overflow: hidden;
  cursor: text;

  &:focus-within {
    border-color: #B08D57;
    box-shadow: 0 0 0 3px rgba(176, 141, 87, 0.25);
  }

  &--erro,
  &--erro:focus-within {
    border-color: #f87171;
    box-shadow: 0 0 0 3px rgba(248, 113, 113, 0.2);
  }

  &__icon {
    @include login-field-icon;
  }

  input {
    flex: 1;
    height: 100%;
    border: none;
    outline: none;
    background: transparent;
    color: #fff;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    font-weight: 400;

    &::placeholder {
      color: rgba(255, 255, 255, 0.65);
    }

    @include login-input-autofill(#fff);
  }
}

.login_btn {
  width: 168px;
  height: 49px;
  box-sizing: border-box;
  border-radius: 30px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  font-weight: 700;
  line-height: 1;
  letter-spacing: 0.02em;
  text-decoration: none;
  border: none;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.7;
    cursor: wait;
  }

  &--primary {
    background: #B08D57;
    color: #ffffff;
    box-shadow: 0 4px 14px rgba(176, 141, 87, 0.3);

    &:hover {
      background: #C29F68;
      box-shadow: 0 6px 18px rgba(176, 141, 87, 0.4);
    }
  }
}

@media (max-width: 768px) {
  .login_form {
    width: 100%;
    max-width: 358px;
    max-height: none;
    margin: 0 auto;
    padding: 90px 18px 40px;
    box-sizing: border-box;

    &__logo {
      width: 168px;
      max-width: none;
      margin-bottom: 40px;
    }

    &__fields {
      gap: 15px;
    }

    &__actions {
      margin-top: 32px;
    }

    &__first_access {
      display: block;
      margin-top: 28px;
      font-size: 13px;
    }
  }
}

@media (max-height: 820px) {
  .login_form__logo {
    margin-bottom: 18px;
  }

  .login_form__fields {
    gap: 10px;
  }

  .login_field {
    height: 44px;
  }

  .login_btn {
    height: 44px;
  }
}

@media (max-width: 480px) {
  .login_form {
    &__logo {
      margin-bottom: 32px;
    }

    &__actions {
      margin-top: 24px;
    }
  }
}
</style>
