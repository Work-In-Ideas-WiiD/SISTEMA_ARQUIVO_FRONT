<script setup lang="ts">
import { ref, watch } from 'vue'
import { useToast } from 'vue-toastification'
import {
  postCompartilharArquivo,
  getCompartilhamentosArquivo,
  revogarCompartilhamento,
  getCompartilhamentoAcessos,
  type ICompartilhamentoRes,
  type ICompartilhamentoAcessoRes
} from '@/services/http/arquivos'
import { getApiErrorMessage } from '@/utils/apiError'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import NightConfirmModal from '@/components/NightConfirmModal/NightConfirmModal.vue'
import { useNightConfirm } from '@/composables/useNightConfirm'

type ExpirePreset = '' | '24h' | '7d' | '30d'

const props = defineProps<{
  open: boolean
  arquivoId: string
  arquivoNome?: string
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'shared', link: string): void
}>()

const toast = useToast()
const {
  open: confirmOpen,
  options: confirmOptions,
  askConfirm,
  onConfirm,
  onCancel
} = useNightConfirm()

const email = ref('')
const expirePreset = ref<ExpirePreset>('')
const loading = ref(false)
const loadingList = ref(false)
const revokingId = ref('')
const linkGerado = ref('')
const shares = ref<ICompartilhamentoRes[]>([])
const historyOpenId = ref('')
const historyLoadingId = ref('')
const historyByShare = ref<Record<string, ICompartilhamentoAcessoRes[]>>({})
let loadSeq = 0

function resetFormState() {
  email.value = ''
  expirePreset.value = ''
  linkGerado.value = ''
  loading.value = false
  revokingId.value = ''
  historyOpenId.value = ''
  historyByShare.value = {}
  shares.value = []
}

watch(
  () => [props.open, props.arquivoId] as const,
  ([isOpen]) => {
    if (!isOpen) return
    resetFormState()
    void loadShares()
  }
)

async function loadShares(opts?: { silent?: boolean }) {
  if (!props.arquivoId) return
  const silent = opts?.silent === true
  const seq = ++loadSeq
  const arquivoId = props.arquivoId
  try {
    if (!silent) loadingList.value = true
    const { data } = await getCompartilhamentosArquivo(arquivoId)
    // Ignora resposta atrasada de outro arquivo / abertura anterior
    if (seq !== loadSeq || props.arquivoId !== arquivoId) return
    shares.value = Array.isArray(data) ? data : []
  } catch {
    if (seq !== loadSeq || props.arquivoId !== arquivoId) return
    if (!silent) shares.value = []
  } finally {
    if (seq === loadSeq) loadingList.value = false
  }
}

function resolveExpiresAt(preset: ExpirePreset): string | undefined {
  if (!preset) return undefined
  const d = new Date()
  if (preset === '24h') d.setHours(d.getHours() + 24)
  else if (preset === '7d') d.setDate(d.getDate() + 7)
  else if (preset === '30d') d.setDate(d.getDate() + 30)
  return d.toISOString()
}

async function handleSubmit() {
  if (loading.value) return
  const value = email.value.trim()
  if (!value || !value.includes('@')) {
    toast.error('Informe um e-mail válido')
    return
  }

  try {
    loading.value = true
    const { data } = await postCompartilharArquivo(
      props.arquivoId,
      value,
      resolveExpiresAt(expirePreset.value)
    )
    linkGerado.value = data.link
    email.value = ''
    expirePreset.value = ''
    toast.success('Link enviado para o e-mail informado')
    emit('shared', data.link)
    await loadShares({ silent: true })
  } catch (error) {
    toast.error(getApiErrorMessage(error, 'Erro ao compartilhar arquivo'))
  } finally {
    loading.value = false
  }
}

async function copyLink(link?: string) {
  const value = link || linkGerado.value
  if (!value) return
  try {
    await navigator.clipboard.writeText(value)
    toast.success('Link copiado')
  } catch {
    toast.error('Não foi possível copiar o link')
  }
}

async function askRevogar(share: ICompartilhamentoRes) {
  const ok = await askConfirm({
    title: 'Revogar compartilhamento?',
    body: `O link enviado para ${share.email} deixará de funcionar imediatamente.`,
    confirmLabel: 'REVOGAR',
    cancelLabel: 'VOLTAR',
    danger: true
  })
  if (!ok) return

  try {
    revokingId.value = share.id
    await revogarCompartilhamento(share.id)
    toast.success('Compartilhamento revogado')
    if (linkGerado.value === share.link) {
      linkGerado.value = ''
    }
    if (historyOpenId.value === share.id) {
      historyOpenId.value = ''
    }
    await loadShares({ silent: true })
  } catch (error) {
    toast.error(getApiErrorMessage(error, 'Erro ao revogar'))
  } finally {
    revokingId.value = ''
  }
}

async function toggleHistorico(share: ICompartilhamentoRes) {
  if (historyOpenId.value === share.id) {
    historyOpenId.value = ''
    return
  }
  historyOpenId.value = share.id
  if (historyByShare.value[share.id]) return

  try {
    historyLoadingId.value = share.id
    const { data } = await getCompartilhamentoAcessos(share.id)
    historyByShare.value = {
      ...historyByShare.value,
      [share.id]: Array.isArray(data) ? data : []
    }
  } catch (error) {
    toast.error(getApiErrorMessage(error, 'Erro ao carregar acessos'))
    historyOpenId.value = ''
  } finally {
    historyLoadingId.value = ''
  }
}

function statusLabel(status: string) {
  if (status === 'ativo') return 'Ativo'
  if (status === 'revogado') return 'Revogado'
  if (status === 'expirado') return 'Expirado'
  return status
}

function acessoStatusLabel(status: string) {
  const map: Record<string, string> = {
    token_enviado: 'Código enviado',
    autorizado: 'Código validado',
    download: 'Arquivo aberto',
    negado: 'Negado',
    expirado: 'Expirado',
    revogado: 'Revogado',
    link_invalido: 'Link inválido'
  }
  return map[status] || status
}

function formatDate(value?: string | null) {
  if (!value) return '—'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Sao_Paulo'
  })
}

function close() {
  if (loading.value || revokingId.value || confirmOpen.value) return
  emit('close')
}

function novoCompartilhamento() {
  linkGerado.value = ''
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="night-confirm"
      @click.self="!confirmOpen && close()"
    >
      <div class="night-confirm__modal" role="dialog" aria-modal="true">
        <h3>Compartilhar arquivo</h3>
        <p v-if="arquivoNome" class="night-confirm__file">{{ arquivoNome }}</p>
        <p>
          Enviaremos um link por e-mail. Ao abrir, a pessoa recebe um código para
          acessar o arquivo — sem precisar criar conta.
        </p>

        <form
          v-if="!linkGerado"
          class="night-confirm__form"
          @submit.prevent="handleSubmit"
        >
          <label class="night-confirm__field">
            <span class="sr-only">E-mail do destinatário</span>
            <input
              v-model="email"
              type="email"
              placeholder="E-mail do destinatário"
              required
              autocomplete="email"
              :disabled="loading"
            />
          </label>

          <div class="night-confirm__expire">
            <span class="night-confirm__expire-label">Validade do link</span>
            <div class="night-confirm__expire-options" role="group" aria-label="Validade do link">
              <button
                type="button"
                class="night-confirm__chip"
                :class="{ 'night-confirm__chip--active': expirePreset === '' }"
                :disabled="loading"
                @click="expirePreset = ''"
              >
                Sem prazo
              </button>
              <button
                type="button"
                class="night-confirm__chip"
                :class="{ 'night-confirm__chip--active': expirePreset === '24h' }"
                :disabled="loading"
                @click="expirePreset = '24h'"
              >
                24 horas
              </button>
              <button
                type="button"
                class="night-confirm__chip"
                :class="{ 'night-confirm__chip--active': expirePreset === '7d' }"
                :disabled="loading"
                @click="expirePreset = '7d'"
              >
                7 dias
              </button>
              <button
                type="button"
                class="night-confirm__chip"
                :class="{ 'night-confirm__chip--active': expirePreset === '30d' }"
                :disabled="loading"
                @click="expirePreset = '30d'"
              >
                30 dias
              </button>
            </div>
          </div>

          <div class="night-confirm__actions">
            <button
              type="button"
              class="night-confirm__btn night-confirm__btn--ghost"
              :disabled="loading"
              @click="close"
            >
              VOLTAR
            </button>
            <button
              type="submit"
              class="night-confirm__btn night-confirm__btn--primary"
              :disabled="loading"
            >
              <LoadingSpinner v-if="loading" theme="night" />
              <span v-else>COMPARTILHAR</span>
            </button>
          </div>
        </form>

        <div v-else class="night-confirm__done">
          <p class="night-confirm__ok">Compartilhamento criado. Link:</p>
          <label class="night-confirm__field">
            <span class="sr-only">Link do compartilhamento</span>
            <input type="text" :value="linkGerado" readonly />
          </label>
          <div class="night-confirm__actions">
            <button
              type="button"
              class="night-confirm__btn night-confirm__btn--ghost"
              @click="novoCompartilhamento"
            >
              VOLTAR
            </button>
            <button
              type="button"
              class="night-confirm__btn night-confirm__btn--primary"
              @click="copyLink()"
            >
              COPIAR
            </button>
          </div>
        </div>

        <div class="night-confirm__list">
          <h4>Compartilhamentos</h4>

          <div v-if="loadingList && !shares.length" class="night-confirm__list-empty">
            <LoadingSpinner theme="night" />
          </div>
          <p v-else-if="!shares.length" class="night-confirm__list-empty">
            Nenhum compartilhamento neste arquivo.
          </p>

          <ul v-else class="night-confirm__shares" :class="{ 'night-confirm__shares--busy': revokingId }">
            <li v-for="share in shares" :key="share.id" class="night-confirm__share-block">
              <div class="night-confirm__share">
                <div class="night-confirm__share-info">
                  <strong>{{ share.email }}</strong>
                  <span
                    class="night-confirm__badge"
                    :class="`night-confirm__badge--${share.status}`"
                  >
                    {{ statusLabel(share.status) }}
                  </span>
                  <small>Criado em {{ formatDate(share.created_at) }}</small>
                  <small v-if="share.expires_at">
                    Expira em {{ formatDate(share.expires_at) }}
                  </small>
                  <small v-else-if="share.status === 'ativo'">Sem prazo de expiração</small>
                </div>
                <div class="night-confirm__share-actions">
                  <button
                    type="button"
                    class="night-confirm__mini night-confirm__mini--ghost"
                    title="Ver acessos"
                    @click="toggleHistorico(share)"
                  >
                    {{ historyOpenId === share.id ? 'OCULTAR' : 'ACESSOS' }}
                  </button>
                  <button
                    v-if="share.status === 'ativo'"
                    type="button"
                    class="night-confirm__mini night-confirm__mini--ghost"
                    title="Copiar link"
                    @click="copyLink(share.link)"
                  >
                    COPIAR
                  </button>
                  <button
                    v-if="share.status === 'ativo'"
                    type="button"
                    class="night-confirm__mini night-confirm__mini--danger"
                    :disabled="revokingId === share.id"
                    @click="askRevogar(share)"
                  >
                    <LoadingSpinner v-if="revokingId === share.id" theme="night" size="sm" />
                    <span v-else>REVOGAR</span>
                  </button>
                </div>
              </div>

              <div v-if="historyOpenId === share.id" class="night-confirm__history">
                <div v-if="historyLoadingId === share.id" class="night-confirm__list-empty">
                  <LoadingSpinner theme="night" size="sm" />
                </div>
                <p
                  v-else-if="!(historyByShare[share.id] || []).length"
                  class="night-confirm__list-empty"
                >
                  Nenhum acesso registrado ainda.
                </p>
                <ul v-else class="night-confirm__history-list">
                  <li
                    v-for="acesso in historyByShare[share.id]"
                    :key="acesso.id"
                    class="night-confirm__history-item"
                  >
                    <div class="night-confirm__history-row">
                      <span
                        class="night-confirm__badge"
                        :class="{
                          'night-confirm__badge--ativo':
                            acesso.status === 'autorizado' ||
                            acesso.status === 'token_enviado' ||
                            acesso.status === 'download',
                          'night-confirm__badge--revogado':
                            acesso.status === 'negado' || acesso.status === 'revogado',
                          'night-confirm__badge--expirado':
                            acesso.status === 'expirado' || acesso.status === 'link_invalido'
                        }"
                      >
                        {{ acessoStatusLabel(acesso.status) }}
                      </span>
                      <small>{{ formatDate(acesso.tentado_em) }}</small>
                    </div>
                    <small v-if="acesso.motivo_falha">{{ acesso.motivo_falha }}</small>
                    <small v-if="acesso.ip">IP {{ acesso.ip }}</small>
                  </li>
                </ul>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <NightConfirmModal
      :open="confirmOpen"
      :title="confirmOptions.title"
      :body="confirmOptions.body"
      :confirm-label="confirmOptions.confirmLabel"
      :cancel-label="confirmOptions.cancelLabel"
      :danger="confirmOptions.danger"
      @confirm="onConfirm"
      @cancel="onCancel"
    />
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
  white-space: nowrap;
  border: 0;
}

.night-confirm {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 20px;

  &__modal {
    width: 100%;
    max-width: 520px;
    max-height: min(90vh, 720px);
    overflow: auto;
    padding: 28px 24px;
    background: #0B1B2B;
    border: 1px solid rgba(176, 141, 87, 0.25);
    border-radius: 20px;
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.5);
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.35) transparent;

    &::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }

    &::-webkit-scrollbar-track {
      background: transparent;
    }

    &::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.35);
      border-radius: 999px;
    }

    &::-webkit-scrollbar-button {
      display: none;
      width: 0;
      height: 0;
    }

    h3 {
      margin: 0 0 10px;
      font-family: 'Inter', sans-serif;
      font-size: 18px;
      font-weight: 700;
      color: #FFFCFF;
    }

    > p {
      margin: 0 0 24px;
      font-family: 'Inter', sans-serif;
      font-size: 14px;
      font-weight: 400;
      line-height: 1.5;
      color: rgba(255, 252, 255, 0.75);
    }
  }

  &__file {
    margin: 0 0 8px !important;
    color: #B08D57 !important;
    font-weight: 600 !important;
  }

  &__form,
  &__done {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  &__ok {
    margin: 0;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    color: rgba(255, 252, 255, 0.85);
  }

  &__field {
    display: block;
    width: 100%;

    input {
      width: 100%;
      height: 46px;
      box-sizing: border-box;
      padding: 0 22px;
      border-radius: 30px;
      border: 1px solid rgba(255, 255, 255, 0.15);
      background: rgba(255, 255, 255, 0.08);
      color: #fff;
      font-family: 'Inter', sans-serif;
      font-size: 14px;
      outline: none;
      transition: all 0.2s ease;

      &::placeholder {
        color: rgba(255, 255, 255, 0.65);
      }

      &:focus {
        border-color: #B08D57;
        box-shadow: 0 0 0 3px rgba(176, 141, 87, 0.25);
      }

      &:disabled {
        opacity: 0.7;
      }
    }
  }

  &__expire {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  &__expire-label {
    font-family: 'Inter', sans-serif;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.03em;
    text-transform: uppercase;
    color: rgba(255, 252, 255, 0.55);
  }

  &__expire-options {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  &__chip {
    height: 34px;
    padding: 0 14px;
    border-radius: 20px;
    border: 1px solid rgba(255, 252, 255, 0.25);
    background: transparent;
    color: rgba(255, 252, 255, 0.85);
    font-family: 'Inter', sans-serif;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover:not(:disabled) {
      border-color: rgba(255, 252, 255, 0.5);
      background: rgba(255, 255, 255, 0.05);
    }

    &--active {
      border-color: #B08D57;
      background: rgba(176, 141, 87, 0.2);
      color: #B08D57;
    }

    &:disabled {
      opacity: 0.45;
      cursor: not-allowed;
    }
  }

  &__list {
    margin-top: 28px;
    padding-top: 20px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);

    h4 {
      margin: 0 0 14px;
      font-family: 'Inter', sans-serif;
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      color: rgba(255, 252, 255, 0.7);
    }
  }

  &__list-empty {
    margin: 0;
    display: flex;
    justify-content: center;
    font-family: 'Inter', sans-serif;
    font-size: 13px;
    color: rgba(255, 252, 255, 0.55);
  }

  &__shares {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  &__share-block {
    display: flex;
    flex-direction: column;
    gap: 0;
    border-radius: 14px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(255, 255, 255, 0.04);
    overflow: hidden;
  }

  &__share {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    padding: 12px 14px;
  }

  &__share-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 0;

    strong {
      font-family: 'Inter', sans-serif;
      font-size: 14px;
      font-weight: 600;
      color: #FFFCFF;
      word-break: break-all;
    }

    small {
      font-family: 'Inter', sans-serif;
      font-size: 12px;
      color: rgba(255, 252, 255, 0.55);
    }
  }

  &__badge {
    display: inline-flex;
    align-self: flex-start;
    padding: 2px 8px;
    border-radius: 999px;
    font-family: 'Inter', sans-serif;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.03em;

    &--ativo {
      background: rgba(176, 141, 87, 0.2);
      color: #B08D57;
    }

    &--revogado {
      background: rgba(220, 53, 69, 0.2);
      color: #ff8f8f;
    }

    &--expirado {
      background: rgba(255, 255, 255, 0.08);
      color: rgba(255, 252, 255, 0.65);
    }
  }

  &__share-actions {
    display: flex;
    flex-direction: column;
    gap: 6px;
    flex-shrink: 0;
  }

  &__history {
    padding: 0 14px 12px;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
  }

  &__history-list {
    list-style: none;
    margin: 10px 0 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
    max-height: 220px;
    overflow: auto;
  }

  &__history-item {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 8px 10px;
    border-radius: 10px;
    background: rgba(0, 0, 0, 0.2);

    small {
      font-family: 'Inter', sans-serif;
      font-size: 11px;
      color: rgba(255, 252, 255, 0.55);
      word-break: break-word;
    }
  }

  &__history-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    flex-wrap: wrap;

    small {
      color: rgba(255, 252, 255, 0.7);
    }
  }

  &__mini {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 88px;
    height: 32px;
    padding: 0 12px;
    border-radius: 20px;
    font-family: 'Inter', sans-serif;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.02em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.2s ease;

    &:disabled {
      opacity: 0.45;
      cursor: not-allowed;
    }

    &--ghost {
      border: 1px solid rgba(255, 252, 255, 0.3);
      background: transparent;
      color: #FFFCFF;

      &:hover:not(:disabled) {
        border-color: rgba(255, 252, 255, 0.6);
        background: rgba(255, 255, 255, 0.05);
      }
    }

    &--danger {
      border: none;
      background: rgba(220, 53, 69, 0.85);
      color: #fff;

      &:hover:not(:disabled) {
        opacity: 0.92;
      }
    }
  }

  &__actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    flex-wrap: wrap;
  }

  &__btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 120px;
    height: 46px;
    padding: 0 22px;
    border-radius: 30px;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    font-weight: 700;
    line-height: 1;
    letter-spacing: 0.02em;
    text-transform: uppercase;
    white-space: nowrap;
    cursor: pointer;
    transition: all 0.2s ease;

    &:disabled {
      opacity: 0.45;
      cursor: not-allowed;
    }

    &--ghost {
      border: 1px solid rgba(255, 252, 255, 0.3);
      background: transparent;
      color: #FFFCFF;

      &:hover:not(:disabled) {
        border-color: rgba(255, 252, 255, 0.6);
        background: rgba(255, 255, 255, 0.05);
      }
    }

    &--primary {
      border: none;
      background: #B08D57;
      color: #ffffff;
      box-shadow: 0 4px 14px rgba(176, 141, 87, 0.25);

      &:hover:not(:disabled) {
        background: #C29F68;
        transform: translateY(-1px);
        box-shadow: 0 6px 18px rgba(176, 141, 87, 0.35);
      }
    }
  }

  @media (max-width: 480px) {
    &__actions {
      flex-direction: column-reverse;

      .night-confirm__btn {
        width: 100%;
      }
    }

    &__share {
      flex-direction: column;
    }

    &__share-actions {
      flex-direction: row;
      flex-wrap: wrap;
      width: 100%;

      .night-confirm__mini {
        flex: 1;
      }
    }
  }
}
</style>
