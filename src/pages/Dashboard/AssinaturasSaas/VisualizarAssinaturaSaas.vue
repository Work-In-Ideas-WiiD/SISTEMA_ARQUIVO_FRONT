<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'
import iconChevronLeft from '@/assets/imgs/administradores/icon-chevron-left.svg'
import {
  getAssinaturaSaas,
  cancelarAssinaturaSaas,
  suspenderAssinaturaSaas,
  reativarAssinaturaSaas,
  labelStatusAssinatura,
  type IAssinaturaSaas
} from '@/services/http/assinaturasSaas'
import { getApiErrorMessage } from '@/utils/apiError'

const router = useRouter()
const route = useRoute()
const toast = useToast()

const loading = ref(true)
const acting = ref(false)
const item = ref<IAssinaturaSaas | null>(null)
const confirmOpen = ref(false)
const confirmTipo = ref<'cancelar' | 'suspender' | 'reativar' | null>(null)

const id = route.params.id as string

const historico = computed(() => item.value?.historico_status || [])
const pagamentos = computed(() => item.value?.pagamentos || [])

const confirmCopy = computed(() => {
  const tipo = confirmTipo.value
  if (tipo === 'suspender') {
    return {
      title: 'Suspender assinatura',
      body: 'A cobrança fica pausada no PagBank e o cliente perde o acesso ao sistema até reativar.',
      confirmLabel: 'SUSPENDER',
      danger: false
    }
  }
  if (tipo === 'cancelar') {
    return {
      title: 'Cancelar assinatura',
      body: 'A assinatura será cancelada no PagBank. O cliente perde o acesso. Esta ação não pode ser desfeita no gateway.',
      confirmLabel: 'CANCELAR ASSINATURA',
      danger: true
    }
  }
  if (tipo === 'reativar') {
    return {
      title: 'Reativar assinatura',
      body: 'A assinatura volta a ficar ativa no PagBank e o acesso do cliente é liberado novamente.',
      confirmLabel: 'REATIVAR',
      danger: false
    }
  }
  return { title: '', body: '', confirmLabel: 'CONFIRMAR', danger: false }
})

onMounted(() => load())

async function load() {
  try {
    loading.value = true
    const { data } = await getAssinaturaSaas(id)
    item.value = data
  } catch (error) {
    console.error(error)
    toast.error(getApiErrorMessage(error, 'Erro ao carregar assinatura'))
    router.push('/dashboard/assinaturas-saas')
  } finally {
    loading.value = false
  }
}

function goBack() {
  router.push('/dashboard/assinaturas-saas')
}

function formatDate(value?: string | null) {
  if (!value) return '—'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value
  return d.toLocaleString('pt-BR')
}

function formatBRL(centavos?: number | null) {
  if (centavos === undefined || centavos === null) return '—'
  return (centavos / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function formatGB(bytes?: number | null) {
  if (bytes === undefined || bytes === null) return '—'
  return `${(bytes / 1024 ** 3).toLocaleString('pt-BR', { maximumFractionDigits: 2 })} GB`
}

function openConfirm(tipo: 'cancelar' | 'suspender' | 'reativar') {
  confirmTipo.value = tipo
  confirmOpen.value = true
}

function closeConfirm() {
  if (acting.value) return
  confirmOpen.value = false
  confirmTipo.value = null
}

async function confirmAction() {
  const tipo = confirmTipo.value
  if (!tipo) return

  try {
    acting.value = true
    const fn =
      tipo === 'cancelar'
        ? cancelarAssinaturaSaas
        : tipo === 'suspender'
          ? suspenderAssinaturaSaas
          : reativarAssinaturaSaas
    const { data } = await fn(id)
    item.value = data
    toast.success('Assinatura atualizada com sucesso')
    confirmOpen.value = false
    confirmTipo.value = null
  } catch (error) {
    console.error(error)
    toast.error(getApiErrorMessage(error, 'Erro ao atualizar assinatura'))
  } finally {
    acting.value = false
  }
}

function statusClass(s?: string | null) {
  return s || 'desconhecido'
}
</script>

<template>
  <section class="view-saas">
    <div class="view-saas__heading">
      <button
        type="button"
        class="view-saas__back"
        aria-label="Voltar para Assinaturas SaaS"
        @click="goBack"
      >
        <img :src="iconChevronLeft" width="24" height="24" alt="" />
      </button>
      <h2 class="view-saas__title dashboard_title">ASSINATURA SAAS</h2>
    </div>

    <div v-if="loading" class="view-saas__loading">
      <p>Carregando…</p>
    </div>

    <div v-else-if="item" class="view-saas__panel">
      <form class="view-saas__form" @submit.prevent>
        <div class="view-saas__row">
          <div class="view-saas__field view-saas__field--wide">
            <span class="view-saas__label night-field-label">CLIENTE / CONTA</span>
            <input
              :value="item.conta?.nome || '—'"
              type="text"
              class="view-saas__input"
              disabled
            />
          </div>
          <div class="view-saas__field view-saas__field--narrow">
            <span class="view-saas__label night-field-label">STATUS</span>
            <div class="view-saas__status-wrap">
              <span
                class="view-saas__status"
                :class="`view-saas__status--${statusClass(item.status)}`"
              >
                {{ labelStatusAssinatura(item.status) }}
              </span>
            </div>
          </div>
        </div>

        <div class="view-saas__row view-saas__row--thirds">
          <div class="view-saas__field">
            <span class="view-saas__label night-field-label">PLANO</span>
            <input :value="item.plano?.nome || '—'" type="text" class="view-saas__input" disabled />
          </div>
          <div class="view-saas__field">
            <span class="view-saas__label night-field-label">VALOR MENSAL</span>
            <input
              :value="formatBRL(item.plano?.valor_mensal_centavos)"
              type="text"
              class="view-saas__input"
              disabled
            />
          </div>
          <div class="view-saas__field">
            <span class="view-saas__label night-field-label">LIMITES</span>
            <input
              :value="`${item.plano?.max_usuarios ?? '—'} usuários · ${formatGB(item.plano?.armazenamento_bytes)}`"
              type="text"
              class="view-saas__input"
              disabled
            />
          </div>
        </div>

        <div class="view-saas__row view-saas__row--thirds">
          <div class="view-saas__field">
            <span class="view-saas__label night-field-label">CRIAÇÃO</span>
            <input :value="formatDate(item.created_at)" type="text" class="view-saas__input" disabled />
          </div>
          <div class="view-saas__field">
            <span class="view-saas__label night-field-label">INÍCIO</span>
            <input :value="formatDate(item.inicio_em)" type="text" class="view-saas__input" disabled />
          </div>
          <div class="view-saas__field">
            <span class="view-saas__label night-field-label">PRÓXIMA COBRANÇA</span>
            <input
              :value="formatDate(item.proxima_cobranca_em)"
              type="text"
              class="view-saas__input"
              disabled
            />
          </div>
        </div>

        <div class="view-saas__row">
          <div class="view-saas__field">
            <span class="view-saas__label night-field-label">SUBSCRIPTION ID (GATEWAY)</span>
            <input
              :value="item.gateway_subscription_id || '—'"
              type="text"
              class="view-saas__input"
              disabled
            />
          </div>
          <div class="view-saas__field">
            <span class="view-saas__label night-field-label">CUSTOMER ID (GATEWAY)</span>
            <input
              :value="item.gateway_customer_id || '—'"
              type="text"
              class="view-saas__input"
              disabled
            />
          </div>
        </div>

        <div v-if="item.conta?.usuarios?.length" class="view-saas__block">
          <h3 class="view-saas__block-title">Usuários da conta</h3>
          <div class="view-saas__table-wrap">
            <table class="view-saas__table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>E-mail</th>
                  <th>Documento</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="u in item.conta.usuarios" :key="u.id">
                  <td :title="u.nome">{{ u.nome }}</td>
                  <td :title="u.email">{{ u.email }}</td>
                  <td :title="u.cnpj || u.cpf || '—'">{{ u.cnpj || u.cpf || '—' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="view-saas__block">
          <h3 class="view-saas__block-title">Pagamentos / faturas</h3>
          <div v-if="!pagamentos.length" class="view-saas__empty">Nenhum pagamento registrado.</div>
          <div v-else class="view-saas__table-wrap">
            <table class="view-saas__table">
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Valor</th>
                  <th>Pago em</th>
                  <th>Invoice / Charge</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="p in pagamentos" :key="p.id">
                  <td>{{ p.status }}</td>
                  <td>{{ formatBRL(p.valor_centavos) }}</td>
                  <td>{{ formatDate(p.pago_em) }}</td>
                  <td>
                    <small>{{ p.gateway_invoice_id || p.gateway_charge_id || '—' }}</small>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="view-saas__block">
          <h3 class="view-saas__block-title">Histórico de status</h3>
          <div v-if="!historico.length" class="view-saas__empty">Sem histórico.</div>
          <div v-else class="view-saas__table-wrap">
            <table class="view-saas__table">
              <thead>
                <tr>
                  <th>De</th>
                  <th>Para</th>
                  <th>Origem</th>
                  <th>Quando</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="h in historico" :key="h.id">
                  <td>{{ labelStatusAssinatura(h.status_de) }}</td>
                  <td>{{ labelStatusAssinatura(h.status_para) }}</td>
                  <td>{{ h.origem }}</td>
                  <td>{{ formatDate(h.created_at) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="view-saas__actions">
          <button
            type="button"
            class="view-saas__btn view-saas__btn--ghost"
            :disabled="acting || item.status === 'suspensa'"
            @click="openConfirm('suspender')"
          >
            SUSPENDER
          </button>
          <button
            type="button"
            class="view-saas__btn view-saas__btn--primary"
            :disabled="acting || item.status === 'ativa'"
            @click="openConfirm('reativar')"
          >
            REATIVAR
          </button>
          <button
            type="button"
            class="view-saas__btn view-saas__btn--danger"
            :disabled="acting || item.status === 'cancelada'"
            @click="openConfirm('cancelar')"
          >
            CANCELAR
          </button>
        </div>
      </form>
    </div>

    <div v-if="confirmOpen" class="view-saas__overlay" @click.self="closeConfirm">
      <div class="view-saas__modal" role="dialog" aria-modal="true">
        <h3>{{ confirmCopy.title }}</h3>
        <p>{{ confirmCopy.body }}</p>
        <div class="view-saas__modal-actions">
          <button
            type="button"
            class="view-saas__btn view-saas__btn--ghost"
            :disabled="acting"
            @click="closeConfirm"
          >
            VOLTAR
          </button>
          <button
            type="button"
            class="view-saas__btn"
            :class="confirmCopy.danger ? 'view-saas__btn--danger' : 'view-saas__btn--primary'"
            :disabled="acting"
            @click="confirmAction"
          >
            {{ acting ? 'AGUARDE…' : confirmCopy.confirmLabel }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.view-saas {
  width: 100%;
  max-width: 100%;
  min-width: 0;

  &__heading {
    display: flex;
    align-items: center;
    gap: 1px;
    margin-bottom: 42px;
  }

  &__back {
    flex-shrink: 0;
    width: 24px;
    height: 24px;
    padding: 0;
    border: none;
    background: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    opacity: 0.7;

    &:hover {
      opacity: 1;
    }
  }

  &__title {
    margin: 0;
  }

  &__loading {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 200px;

    p {
      font-family: 'Source Code Pro', monospace;
      font-size: 14px;
      color: #f7f7f7;
      opacity: 0.7;
    }
  }

  &__panel {
    width: 1000px;
    max-width: 100%;
    box-sizing: border-box;
    padding: 48px 75px 40px;
    background: rgba(121, 121, 121, 0.1);
    border-radius: var(--night-radius, 30px);
  }

  &__form {
    width: 850px;
    max-width: 100%;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  &__row {
    display: flex;
    gap: 20px;

    &--thirds {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 20px;
    }
  }

  &__field {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    min-width: 0;

    &--wide {
      flex: 3;
    }

    &--narrow {
      flex: 1;
    }
  }

  &__label {
    display: block;
    width: 100%;
    margin: 0;
    padding-left: 20px;
    box-sizing: border-box;
    font-family: var(--night-font, 'Source Code Pro', monospace);
    font-size: 14px;
    font-weight: 700;
    line-height: 18px;
    color: var(--night-gray, #f7f7f7);
    opacity: 0.7;
    text-transform: uppercase;
  }

  &__input {
    width: 100%;
    height: 49px;
    box-sizing: border-box;
    padding: 0 20px;
    border: none;
    border-radius: 30px;
    background: rgba(121, 121, 121, 0.3);
    font-family: 'Source Code Pro', monospace;
    font-size: 14px;
    font-weight: 300;
    line-height: 1;
    color: #ffffff;
    outline: none;
    -webkit-text-fill-color: #ffffff;
    opacity: 1;
    cursor: default;

    &:disabled {
      opacity: 1;
      color: #ffffff;
      -webkit-text-fill-color: #ffffff;
      background: rgba(121, 121, 121, 0.3);
    }
  }

  &__status-wrap {
    width: 100%;
    min-height: 49px;
    display: flex;
    align-items: center;
    padding: 0 8px;
    box-sizing: border-box;
  }

  &__status {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 8px 14px;
    border-radius: 20px;
    font-family: 'Source Code Pro', monospace;
    font-size: 12px;
    font-weight: 700;
    line-height: 1;
    text-transform: uppercase;
    white-space: nowrap;

    &--ativa {
      background: rgba(76, 175, 80, 0.25);
      color: #8ee99a;
    }

    &--pendente,
    &--pendente_acao {
      background: rgba(255, 193, 7, 0.25);
      color: #ffd666;
    }

    &--inadimplente {
      background: rgba(220, 53, 69, 0.25);
      color: #ff8a96;
    }

    &--suspensa {
      background: rgba(121, 121, 121, 0.4);
      color: rgba(247, 247, 247, 0.8);
    }

    &--cancelada,
    &--expirada,
    &--desconhecido {
      background: rgba(121, 121, 121, 0.35);
      color: rgba(247, 247, 247, 0.65);
    }
  }

  &__block {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  &__block-title {
    margin: 0;
    padding-left: 8px;
    font-family: 'Source Code Pro', monospace;
    font-size: 16px;
    font-weight: 700;
    color: #f7f7f7;
  }

  &__empty {
    padding: 12px 8px;
    font-family: 'Source Code Pro', monospace;
    font-size: 13px;
    color: rgba(247, 247, 247, 0.65);
  }

  &__table-wrap {
    width: 100%;
    overflow-x: auto;
    border-radius: 20px;
    background: rgba(121, 121, 121, 0.18);
  }

  &__table {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;

    th,
    td {
      padding: 14px 16px;
      text-align: left;
      font-family: 'Source Code Pro', monospace;
      color: #f7f7f7;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    th {
      font-size: 13px;
      font-weight: 700;
      opacity: 0.7;
      text-transform: uppercase;
      background: rgba(33, 33, 33, 0.35);
    }

    td {
      font-size: 13px;
      font-weight: 300;
      border-top: 1px solid rgba(121, 121, 121, 0.25);
    }

    tbody tr:nth-child(odd) td {
      background: rgba(33, 33, 33, 0.28);
    }

    small {
      font-size: 11px;
      opacity: 0.8;
    }
  }

  &__actions {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 8px;
  }

  &__btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 140px;
    height: 46px;
    padding: 0 22px;
    border-radius: 30px;
    font-family: 'Source Code Pro', monospace;
    font-size: 14px;
    font-weight: 700;
    line-height: 1;
    text-transform: uppercase;
    white-space: nowrap;
    cursor: pointer;

    &:disabled {
      opacity: 0.45;
      cursor: not-allowed;
    }

    &--ghost {
      border: 1px solid rgba(247, 247, 247, 0.7);
      background: transparent;
      color: #ffffff;

      &:hover:not(:disabled) {
        opacity: 0.85;
      }
    }

    &--primary {
      border: none;
      background: #ff00ff;
      color: #ffffff;

      &:hover:not(:disabled) {
        opacity: 0.92;
      }
    }

    &--danger {
      border: none;
      background: rgba(220, 53, 69, 0.85);
      color: #ffffff;

      &:hover:not(:disabled) {
        opacity: 0.92;
      }
    }
  }

  &__overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.55);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 20px;
  }

  &__modal {
    width: 100%;
    max-width: 440px;
    padding: 28px 24px;
    background: rgba(33, 33, 33, 0.98);
    border: 1px solid rgba(121, 121, 121, 0.45);
    border-radius: 24px;
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.4);

    h3 {
      margin: 0 0 10px;
      font-family: 'Source Code Pro', monospace;
      font-size: 18px;
      font-weight: 700;
      color: #f7f7f7;
    }

    p {
      margin: 0 0 24px;
      font-family: 'Source Code Pro', monospace;
      font-size: 14px;
      font-weight: 300;
      line-height: 1.45;
      color: rgba(247, 247, 247, 0.75);
    }
  }

  &__modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    flex-wrap: wrap;
  }

  @media (max-width: 900px) {
    &__panel {
      width: 100%;
      padding: 32px 24px;
    }

    &__form {
      width: 100%;
    }

    &__row {
      flex-direction: column;
      gap: 24px;

      &--thirds {
        grid-template-columns: 1fr;
        gap: 24px;
      }
    }

    &__actions {
      justify-content: stretch;

      .view-saas__btn {
        flex: 1;
        min-width: 0;
      }
    }
  }

  @media (max-width: 768px) {
    &__heading {
      margin-bottom: 24px;
    }

    &__panel {
      padding: 28px 20px 32px;
    }

    &__actions {
      flex-direction: column-reverse;

      .view-saas__btn {
        width: 100%;
      }
    }

    &__modal-actions {
      flex-direction: column-reverse;

      .view-saas__btn {
        width: 100%;
      }
    }
  }
}
</style>
