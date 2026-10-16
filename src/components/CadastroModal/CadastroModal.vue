<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useCadastroModal } from '@/composables/useCadastroModal'
import { trackEvent } from '@/utils/tracking'
import logoAkidocs from '@/assets/imgs/login/logo-akidocs-white.png'
import iconPerson from '@/assets/imgs/login/icon-person.svg'
import iconBuilding from '@/assets/imgs/login/icon-building.svg'
import iconLock from '@/assets/imgs/login/icon-lock.svg'

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()
const { aberto, fechar } = useCadastroModal()

const nome = ref('')
const nomeEmpresa = ref('')
const email = ref('')
const senha = ref('')
const enviando = ref(false)
const erros = ref<Record<string, string>>({})

watch(aberto, (visivel) => {
  if (typeof document === 'undefined') return
  document.body.style.overflow = visivel ? 'hidden' : ''
  if (visivel) {
    trackEvent('cadastro_iniciado')
    erros.value = {}
  }
})

function onKey(event: KeyboardEvent) {
  if (event.key === 'Escape' && aberto.value) fecharModal()
}

onMounted(() => {
  window.addEventListener('keydown', onKey)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKey)
  if (typeof document !== 'undefined') document.body.style.overflow = ''
})

function fecharModal() {
  if (enviando.value) return
  fechar()
  if (route.query.cadastro) {
    const query = { ...route.query }
    delete query.cadastro
    router.replace({ path: route.path, query })
  }
}

function validar() {
  const e: Record<string, string> = {}
  if (nome.value.trim().length < 3) e.nome = nome.value.trim() ? 'O nome deve ter ao menos 3 letras.' : 'Informe seu nome.'
  if (nomeEmpresa.value.trim().length < 2) e.nomeEmpresa = 'Informe o nome da empresa.'
  if (!email.value.trim()) e.email = 'Informe seu e-mail.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) e.email = 'E-mail inválido.'
  if (!senha.value) e.senha = 'Informe uma senha.'
  else if (senha.value.length < 8) e.senha = 'A senha deve ter ao menos 8 caracteres.'
  return e
}

async function enviar() {
  erros.value = validar()
  if (Object.keys(erros.value).length) return
  enviando.value = true
  try {
    await auth.signUp({
      nome: nome.value.trim(),
      nome_empresa: nomeEmpresa.value.trim(),
      email: email.value.trim(),
      password: senha.value
    })
  } catch (err: unknown) {
    const data = (err as { response?: { data?: { errors?: Record<string, string[]> } } })?.response?.data
    if (data?.errors) {
      const mapa: Record<string, string> = { nome: 'nome', nome_empresa: 'nomeEmpresa', email: 'email', password: 'senha' }
      for (const [campo, msgs] of Object.entries(data.errors)) {
        const destino = mapa[campo]
        if (destino) erros.value[destino] = msgs[0]
      }
    }
  } finally {
    enviando.value = false
  }
}
</script>

<template>
  <Teleport to="body">
    <div v-if="aberto" class="cadastro-modal" role="dialog" aria-modal="true" aria-labelledby="cadastro-titulo" @click.self="fecharModal">
      <form class="cadastro-modal__card" novalidate @submit.prevent="enviar">
        <button type="button" class="cadastro-modal__fechar" aria-label="Fechar" @click="fecharModal">×</button>
        <h2 id="cadastro-titulo" class="sr-only">Cadastro</h2>
        <img class="cadastro-modal__logo" :src="logoAkidocs" alt="AkiDocs" />

        <label class="cadastro-modal__campo" :class="{ 'is-erro': erros.nome }">
          <img :src="iconPerson" alt="" width="14" height="14" />
          <input v-model="nome" type="text" placeholder="Seu nome *" autocomplete="name" maxlength="255" />
        </label>
        <small v-if="erros.nome">{{ erros.nome }}</small>

        <label class="cadastro-modal__campo" :class="{ 'is-erro': erros.nomeEmpresa }">
          <img :src="iconBuilding" alt="" width="14" height="14" />
          <input v-model="nomeEmpresa" type="text" placeholder="Nome da empresa *" autocomplete="organization" maxlength="255" />
        </label>
        <small v-if="erros.nomeEmpresa">{{ erros.nomeEmpresa }}</small>

        <label class="cadastro-modal__campo" :class="{ 'is-erro': erros.email }">
          <img :src="iconPerson" alt="" width="14" height="14" />
          <input v-model="email" type="email" placeholder="Email *" autocomplete="email" maxlength="255" />
        </label>
        <small v-if="erros.email">{{ erros.email }}</small>

        <label class="cadastro-modal__campo" :class="{ 'is-erro': erros.senha }">
          <img :src="iconLock" alt="" width="14" height="14" />
          <input v-model="senha" type="password" placeholder="Senha (mínimo 8 caracteres) *" autocomplete="new-password" />
        </label>
        <small v-if="erros.senha">{{ erros.senha }}</small>

        <button type="submit" class="cadastro-modal__enviar" :disabled="enviando">
          {{ enviando ? 'Continuando…' : 'Continuar' }}
        </button>

        <p class="cadastro-modal__login">
          Já tem conta?
          <RouterLink to="/login" @click="fechar">Entrar.</RouterLink>
        </p>
      </form>
    </div>
  </Teleport>
</template>

<style lang="scss" scoped>
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}

.cadastro-modal {
  position: fixed;
  inset: 0;
  z-index: 80;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
  background: rgba(6, 16, 28, 0.72);

  &__card {
    position: relative;
    width: min(100%, 420px);
    max-height: calc(100vh - 48px);
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    padding: 36px 28px 28px;
    border-radius: 24px;
    background: #13283f;
    border: 1px solid rgba(176, 141, 87, 0.28);
    box-shadow: 0 24px 60px rgba(0, 0, 0, 0.45);
  }

  &__fechar {
    position: absolute;
    top: 12px;
    right: 14px;
    width: 32px;
    height: 32px;
    border: none;
    background: transparent;
    color: #fff;
    font-size: 26px;
    line-height: 1;
    cursor: pointer;
  }

  &__logo {
    width: 180px;
    height: auto;
    margin-bottom: 8px;
  }

  &__campo {
    width: 100%;
    height: 49px;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 0 18px;
    border-radius: 30px;
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.15);

    &.is-erro { border-color: #f87171; }

    input {
      flex: 1;
      height: 100%;
      border: none;
      outline: none;
      background: transparent;
      color: #fff;
      font-size: 14px;

      &::placeholder { color: rgba(255, 255, 255, 0.65); }
    }
  }

  small {
    align-self: flex-start;
    margin: -6px 0 0 18px;
    color: #fca5a5;
    font-size: 12px;
  }

  &__enviar {
    margin-top: 8px;
    min-width: 168px;
    height: 49px;
    padding: 0 28px;
    border: none;
    border-radius: 30px;
    background: #b08d57;
    color: #fff;
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;

    &:disabled { opacity: 0.7; cursor: wait; }
  }

  &__login {
    margin: 4px 0 0;
    color: rgba(255, 252, 255, 0.8);
    font-size: 14px;

    a { color: #fff; font-weight: 600; }
  }
}
</style>
