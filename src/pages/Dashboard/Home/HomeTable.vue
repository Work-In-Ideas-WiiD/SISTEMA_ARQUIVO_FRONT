<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import CustomButton from '@/components/CustomButton/CustomButton.vue'
import TableEmptyMessage from '@/components/TableEmptyMessage/TableEmptyMessage.vue'
import { getHomeContratos } from '@/services/http/home'

interface IAssinante {
  tipo: 'empresa' | 'cliente'
  has_signed: boolean
  dados: {
    nome: string
    email: string
    documento: string
    contato: string
  }
}

interface IHomeContrato {
  id: string
  descricao: string
  path: string
  status: string
  created_at: string
  updated_at: string
  url: string
  assinantes: IAssinante[]
}

const router = useRouter()
const toast = useToast()

const contracts = ref<IHomeContrato[]>([])
const noContent = ref(false)

onMounted(() => {
  getData()
})

async function getData() {
  try {
    const { data } = await getHomeContratos()
    contracts.value = data
    noContent.value = data.length === 0
  } catch (error) {
    console.error(error)
    toast.error('Ocorreu um erro ao obter dados.')
  }
}

function checkSignature(item: IHomeContrato, param: 'cliente' | 'empresa'): string {
  if (item.assinantes.length === 0) {
    return 'Pendente'
  }
  const assinante = item.assinantes.find(a => a.tipo === param && a.has_signed)
  return assinante ? 'Assinado' : 'Pendente'
}

function checkName(item: IHomeContrato, param: 'cliente' | 'empresa'): string {
  if (item.assinantes.length === 0) {
    return 'n/a'
  }
  const assinante = item.assinantes.find(a => a.tipo === param)
  return assinante?.dados.nome || 'n/a'
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('pt-BR')
}

function navigateTo() {
  router.push('/dashboard/contratos')
}
</script>

<template>
  <section class="table_section">
    <div class="table_header">
      <label class="table_title">CONTRATOS</label>
      <CustomButton title="VER TUDO" @click="navigateTo" />
    </div>
    <div class="table_wrapper">
      <table class="table_style">
        <thead>
          <tr>
            <th>Nome do contrato</th>
            <th>Nome da empresa</th>
            <th>Nome do cliente</th>
            <th>Status - Empresa</th>
            <th>Status - Cliente</th>
            <th>Data do envio</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in contracts" :key="item.id">
            <td>{{ item.descricao }}</td>
            <td>{{ checkName(item, 'empresa') }}</td>
            <td>{{ checkName(item, 'cliente') }}</td>
            <td>
              <span :class="['status_badge', checkSignature(item, 'empresa').toLowerCase()]">
                {{ checkSignature(item, 'empresa') }}
              </span>
            </td>
            <td>
              <span :class="['status_badge', checkSignature(item, 'cliente').toLowerCase()]">
                {{ checkSignature(item, 'cliente') }}
              </span>
            </td>
            <td>{{ formatDate(item.updated_at) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <TableEmptyMessage :show="noContent" />
  </section>
</template>

<style lang="scss" scoped>
.table_section {
  width: 100%;
  overflow: auto;

  .table_header {
    min-width: 600px;
    padding: 38px 38px 42px 38px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    background-color: rgba(207, 198, 188, 0.1);
    margin-bottom: 1px;
    gap: 30px;

    .table_title {
      font-style: normal;
      font-weight: 400;
      font-size: 1.25rem;
      color: var(--color-blue-700);
    }
  }

  .table_wrapper {
    overflow-x: auto;
  }

  .status_badge {
    padding: 5px 15px;
    border-radius: 3px;
    font-size: 0.75rem;
    text-transform: uppercase;
    font-weight: 600;

    &.pendente {
      background-color: var(--color-orange-500);
      color: white;
    }

    &.assinado {
      background-color: var(--color-green-400);
      color: white;
    }
  }
}
</style>
