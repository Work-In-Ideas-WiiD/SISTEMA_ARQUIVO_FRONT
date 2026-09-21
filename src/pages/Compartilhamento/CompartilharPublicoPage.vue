<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'
import {
  getCompartilhamentoPublico,
  solicitarTokenCompartilhamento,
  validarTokenCompartilhamento
} from '@/services/http/arquivos'
import { getApiErrorMessage } from '@/utils/apiError'
import { openFile } from '@/utils/openFile'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import logoAkidocs from '@/assets/imgs/login/logo-akidocs-white.png'
import iconBackCircle from '@/assets/imgs/login/icon-back-circle.svg'
import iconChevronLeft from '@/assets/imgs/login/icon-chevron-left.svg'
import iconLock from '@/assets/imgs/login/icon-lock.svg'

const route = useRoute()
const toast = useToast()

const publicToken = String(route.params.token || '')
const loading = ref(true)
const errorMsg = ref('')
const arquivoNome = ref('')
const emailHint = ref('')
const step = ref<'info' | 'otp' | 'done'>('info')
const sending = ref(false)
const validating = ref(false)
const otp = ref('')
const fileUrl = ref('')

onMounted(async () => {
  try {
    const { data } = await getCompartilhamentoPublico(publicToken)
    arquivoNome.value = data.arquivo_nome
    emailHint.value = data.email_hint
  } catch (error) {
    errorMsg.value = getApiErrorMessage(error, 'Link inválido ou indisponível')
  } finally {
    loading.value = false
  }
})

async function pedirCodigo() {
  if (sending.value) return
  try {
    sending.value = true
    const { data } = await solicitarTokenCompartilhamento(publicToken)
    emailHint.value = data.email_hint
    step.value = 'otp'
    toast.success(data.message)
  } catch (error) {
    toast.error(getApiErrorMessage(error, 'Não foi possível enviar o código'))
  } finally {
    sending.value = false
  }
}

async function validar() {
  if (validating.value) return
  const code = otp.value.replace(/\D/g, '')
  if (code.length !== 6) {
    toast.error('Informe o código de 6 dígitos')
    return
  }

  try {
    validating.value = true
    const { data } = await validarTokenCompartilhamento(publicToken, code)
    fileUrl.value = data.arquivo.url
    arquivoNome.value = data.arquivo.nome || arquivoNome.value
    step.value = 'done'
    toast.success('Acesso liberado')
  } catch (error) {
    toast.error(getApiErrorMessage(error, 'Código inválido'))
  } finally {
    validating.value = false
  }
}

function abrirArquivo() {
  if (fileUrl.value) openFile(fileUrl.value)
}

function onOtpInput(event: Event) {
  const raw = (event.target as HTMLInputElement).value.replace(/\D/g, '').slice(0, 6)
  otp.value = raw
}
</script>

<template>
  <main class="share_page">
    <p class="share_page__watermark" aria-hidden="true">&lt;/DOC</p>

    <RouterLink class="back_btn" to="/" aria-label="Voltar para a página inicial">
      <img class="back_btn__circle" :src="iconBackCircle" alt="" width="66" height="66" />
      <img class="back_btn__icon" :src="iconChevronLeft" alt="" width="40" height="40" />
    </RouterLink>

    <div class="share_form">
      <img class="share_form__logo" :src="logoAkidocs" alt="Logotipo AkiDocs" />

      <h1 class="share_form__title">Arquivo compartilhado</h1>

      <div v-if="loading" class="share_form__state">
        <LoadingSpinner theme="night" size="md" />
      </div>

      <div v-else-if="errorMsg" class="share_form__state share_form__state--error">
        {{ errorMsg }}
      </div>

      <template v-else>
        <p class="share_form__file">{{ arquivoNome }}</p>
        <p class="share_form__subtitle">
          Acesso vinculado ao e-mail <strong>{{ emailHint }}</strong>.
          Sem cadastro na plataforma.
        </p>

        <div v-if="step === 'info'" class="share_form__actions">
          <button
            type="button"
            class="share_btn"
            :disabled="sending"
            @click="pedirCodigo"
          >
            <LoadingSpinner v-if="sending" theme="night" />
            <span v-else>RECEBER CÓDIGO</span>
          </button>
        </div>

        <form v-else-if="step === 'otp'" class="share_form__otp" @submit.prevent="validar">
          <p class="share_form__hint">
            Digite o código de 6 dígitos enviado para {{ emailHint }}.
          </p>

          <label class="share_field">
            <span class="share_field__icon" aria-hidden="true">
              <img :src="iconLock" alt="" width="12" height="13" />
            </span>
            <input
              :value="otp"
              type="text"
              inputmode="numeric"
              maxlength="6"
              placeholder="Código"
              autocomplete="one-time-code"
              @input="onOtpInput"
            />
          </label>

          <div class="share_form__actions">
            <button type="submit" class="share_btn" :disabled="validating">
              <LoadingSpinner v-if="validating" theme="night" />
              <span v-else>VALIDAR</span>
            </button>
            <button
              type="button"
              class="share_btn share_btn--outline"
              :disabled="sending"
              @click="pedirCodigo"
            >
              <LoadingSpinner v-if="sending" theme="night" />
              <span v-else>REENVIAR</span>
            </button>
          </div>
        </form>

        <div v-else class="share_form__done">
          <p class="share_form__hint">Acesso autorizado. Você pode abrir o arquivo agora.</p>
          <button type="button" class="share_btn" @click="abrirArquivo">
            ABRIR ARQUIVO
          </button>
        </div>
      </template>
    </div>
  </main>
</template>

<style lang="scss" scoped>
@import '@/styles/login-night-mobile.scss';

.share_page {
  --login-black: #0B1B2B;
  --login-navy: #1F3A5F;
  --login-gold: #B08D57;
  --login-gray: #FFFCFF;

  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: radial-gradient(circle at 85% 15%, rgba(176, 141, 87, 0.12) 0%, transparent 40%),
    linear-gradient(135deg, #0B1B2B 0%, #1F3A5F 100%);
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

.back_btn {
  position: absolute;
  z-index: 3;
  top: clamp(24px, 17.2vh, 186px);
  left: clamp(16px, 24vw, 461px);
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
    width: 40px;
    height: 40px;
    transform: rotate(90deg);
    object-fit: contain;
    display: block;

    @include login-mobile-back-btn-icon;
  }
}

.share_form {
  position: relative;
  z-index: 2;
  width: min(100%, 358px);
  max-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: clamp(12px, 2.2vh, 24px) 16px clamp(16px, 4.4vh, 48px);

  &__logo {
    width: min(180px, 70%);
    height: auto;
    margin-bottom: clamp(20px, 3vh, 32px);
  }

  &__title {
    margin: 0;
    font-family: 'Inter', sans-serif;
    font-size: 20px;
    font-weight: 700;
    line-height: normal;
    color: #FFFCFF;
    text-align: center;
  }

  &__file {
    margin: clamp(12px, 1.6vh, 17px) 0 0;
    font-family: 'Inter', sans-serif;
    font-size: 16px;
    font-weight: 700;
    color: #B08D57;
    text-align: center;
    word-break: break-word;
  }

  &__subtitle,
  &__hint {
    margin: clamp(8px, 1.2vh, 12px) 0 0;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    font-weight: 400;
    line-height: 1.45;
    color: rgba(255, 252, 255, 0.85);
    text-align: center;

    strong {
      color: #FFFCFF;
      font-weight: 600;
    }
  }

  &__state {
    margin-top: clamp(24px, 4vh, 40px);
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    color: rgba(255, 252, 255, 0.85);
    text-align: center;

    &--error {
      color: #ff8f8f;
    }
  }

  &__otp,
  &__done,
  &__actions {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  &__actions {
    margin-top: clamp(28px, 4.5vh, 48px);
    gap: 12px;
  }
}

.share_field {
  width: 100%;
  margin-top: clamp(20px, 2.8vh, 29px);
  display: flex;
  align-items: center;
  gap: 12px;
  height: 49px;
  padding: 0 22px;
  border-radius: 30px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  transition: all 0.2s ease;
  overflow: hidden;
  cursor: text;

  &:focus-within {
    border-color: #B08D57;
    box-shadow: 0 0 0 3px rgba(176, 141, 87, 0.25);
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
    font-size: 16px;
    font-weight: 600;
    letter-spacing: 0.2em;
    text-align: center;

    &::placeholder {
      color: rgba(255, 255, 255, 0.65);
      letter-spacing: normal;
      font-weight: 400;
    }

    @include login-input-autofill(#fff);
  }
}

.share_btn {
  width: 168px;
  height: 49px;
  border: none;
  border-radius: 30px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #B08D57;
  color: #ffffff;
  box-shadow: 0 4px 14px rgba(176, 141, 87, 0.3);
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;

  &:hover:not(:disabled) {
    background: #C29F68;
    transform: translateY(-1px);
    box-shadow: 0 6px 18px rgba(176, 141, 87, 0.4);
  }

  &:disabled {
    opacity: 0.7;
    cursor: wait;
  }

  &--outline {
    background: transparent;
    border: 1px solid rgba(255, 252, 255, 0.3);
    box-shadow: none;
    color: #FFFCFF;

    &:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.05);
      border-color: rgba(255, 252, 255, 0.6);
      transform: none;
      box-shadow: none;
    }
  }
}

@media (max-height: 820px) and (min-width: 769px) {
  .back_btn {
    top: clamp(16px, 2.5vh, 48px);
    left: clamp(16px, 4vw, 48px);
    width: 56px;
    height: 56px;

    &__icon {
      width: 32px;
      height: 32px;
    }
  }

  .share_field {
    height: 44px;
  }

  .share_btn {
    height: 44px;
  }
}

@media (max-width: 768px) {
  .share_form {
    width: 100%;
    max-width: 358px;
    min-height: 100dvh;
    margin: 0 auto;
    padding: 69px 18px 40px;
    box-sizing: border-box;
    align-items: stretch;
  }

  .share_form__actions {
    margin-top: auto;
  }

  .share_btn {
    margin-left: auto;
    margin-right: auto;
  }
}
</style>
