<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'
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

const id = route.params.id as string

const historico = computed(() => item.value?.historico_status || [])
const pagamentos = computed(() => item.value?.pagamentos || [])

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

async function runAction(tipo: 'cancelar' | 'suspender' | 'reativar') {
  const labels = {
    cancelar: 'cancelar esta assinatura? Esta ação não pode ser desfeita no gateway.',
    suspender: 'suspender esta assinatura?',
    reativar: 'reativar esta assinatura?'
  }

  if (!confirm(`Tem certeza que deseja ${labels[tipo]}`)) return

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
  } catch (error) {
    console.error(error)
    toast.error(getApiErrorMessage(error, 'Erro ao atualizar assinatura'))
  } finally {
    acting.value = false
  }
}
</script>

<template>
  <section class="new_form">
    <div class="page_title">
      <button class="back_btn" type="button" @click="goBack">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
        </svg>
      </button>
      <h2 class="dashboard_title">ASSINATURA SaaS</h2>
    </div>

    <div v-if="loading" class="loading_container">
      <p>Carregando...</p>
    </div>

    <div v-else-if="item" class="form_wrapper">
      <form>
        <div class="input_row">
          <div class="form_group flex_3">
            <label>Cliente / Conta</label>
            <input :value="item.conta?.nome || '—'" type="text" disabled />
          </div>
          <div class="form_group flex_1">
            <label>Status</label>
            <input :value="labelStatusAssinatura(item.status)" type="text" disabled />
          </div>
        </div>

        <div class="input_row">
          <div class="form_group flex_1">
            <label>Plano</label>
            <input :value="item.plano?.nome || '—'" type="text" disabled />
          </div>
          <div class="form_group flex_1">
            <label>Valor mensal</label>
            <input :value="formatBRL(item.plano?.valor_mensal_centavos)" type="text" disabled />
          </div>
          <div class="form_group flex_1">
            <label>Limites</label>
            <input
              :value="`${item.plano?.max_usuarios ?? '—'} usuários · ${formatGB(item.plano?.armazenamento_bytes)}`"
              type="text"
              disabled
            />
          </div>
        </div>

        <div class="input_row">
          <div class="form_group flex_1">
            <label>Criação</label>
            <input :value="formatDate(item.created_at)" type="text" disabled />
          </div>
          <div class="form_group flex_1">
            <label>Início</label>
            <input :value="formatDate(item.inicio_em)" type="text" disabled />
          </div>
          <div class="form_group flex_1">
            <label>Próxima cobrança</label>
            <input :value="formatDate(item.proxima_cobranca_em)" type="text" disabled />
          </div>
        </div>

        <div class="input_row">
          <div class="form_group flex_1">
            <label>Subscription ID (gateway)</label>
            <input :value="item.gateway_subscription_id || '—'" type="text" disabled />
          </div>
          <div class="form_group flex_1">
            <label>Customer ID (gateway)</label>
            <input :value="item.gateway_customer_id || '—'" type="text" disabled />
          </div>
        </div>

        <div v-if="item.conta?.usuarios?.length" class="block">
          <h3 class="block_title">Usuários da conta</h3>
          <div class="table_mini_wrap">
            <table class="table_mini">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>E-mail</th>
                  <th>Documento</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="u in item.conta.usuarios" :key="u.id">
                  <td>{{ u.nome }}</td>
                  <td>{{ u.email }}</td>
                  <td>{{ u.cnpj || u.cpf || '—' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="block">
          <h3 class="block_title">Pagamentos / faturas</h3>
          <div v-if="!pagamentos.length" class="empty">Nenhum pagamento registrado.</div>
          <div v-else class="table_mini_wrap">
            <table class="table_mini">
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

        <div class="block">
          <h3 class="block_title">Histórico de status</h3>
          <div v-if="!historico.length" class="empty">Sem histórico.</div>
          <div v-else class="table_mini_wrap">
            <table class="table_mini">
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

        <div class="form_actions">
          <button
            type="button"
            class="action_btn"
            :disabled="acting || item.status === 'suspensa'"
            @click="runAction('suspender')"
          >
            SUSPENDER
          </button>
          <button
            type="button"
            class="action_btn"
            :disabled="acting || item.status === 'ativa'"
            @click="runAction('reativar')"
          >
            REATIVAR
          </button>
          <button
            type="button"
            class="action_btn danger"
            :disabled="acting || item.status === 'cancelada'"
            @click="runAction('cancelar')"
          >
            CANCELAR
          </button>
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
    padding: 45px 50px;
    max-width: 1050px;

    @media (max-width: 900px) {
      padding: 20px 13px;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 29px;
    }

    .input_row {
      display: flex;
      gap: 37px;

      @media (max-width: 900px) {
        flex-direction: column;
        gap: 10px;
      }
    }

    .form_group {
      display: flex;
      flex-direction: column;
      gap: 8px;

      &.flex_1 {
        flex: 1;
      }

      &.flex_3 {
        flex: 3;
      }

      label {
        font-size: 0.875rem;
        color: var(--color-blue-700);
      }

      input {
        border: 1px solid var(--color-gray-500);
        height: 51px;
        padding: 0 15px;
        font-size: 0.938rem;
        color: var(--color-blue-700);
        outline: none;
        background: #f5f5f5;
        font-family: inherit;
      }
    }

    .block {
      .block_title {
        margin: 0 0 12px;
        color: var(--color-blue-700);
        font-size: 1rem;
      }

      .empty {
        color: #777;
        font-size: 0.9rem;
      }
    }

    .table_mini_wrap {
      overflow-x: auto;
      background: #fff;
    }

    .table_mini {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.875rem;

      th,
      td {
        text-align: left;
        padding: 10px 12px;
        border-bottom: 1px solid #eee;
        color: var(--color-blue-700);
      }

      th {
        background: rgba(207, 198, 188, 0.25);
      }
    }

    .form_actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      flex-wrap: wrap;
      margin-top: 10px;

      .action_btn {
        background-color: var(--color-orange-600, #c7633b);
        color: #fff;
        border: none;
        padding: 0 20px;
        height: 44px;
        cursor: pointer;
        font-size: 0.875rem;
        font-weight: 600;

        &:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        &.danger {
          background-color: #dc3545;
        }
      }
    }
  }
}
</style>
