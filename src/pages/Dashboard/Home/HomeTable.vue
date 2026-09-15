<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import TableEmptyMessage from '@/components/TableEmptyMessage/TableEmptyMessage.vue'
import { getClientes, type IGetClientesDataRes } from '@/services/http/clientes'
import { formatCnpjCpf } from '@/utils/formatCpfCnpj'
import { formatPhone } from '@/utils/formatPhone'

const router = useRouter()
const toast = useToast()

const clients = ref<IGetClientesDataRes[]>([])
const noContent = ref(false)

onMounted(() => {
  getData()
})

async function getData() {
  try {
    const { data } = await getClientes(1)
    clients.value = data.data.slice(0, 10)
    noContent.value = data.data.length === 0
  } catch (error) {
    console.error(error)
    toast.error('Ocorreu um erro ao obter dados.')
  }
}

function getDocumentId(item: IGetClientesDataRes): string {
  if (item.cnpj && item.cnpj.trim() !== '') return formatCnpjCpf(item.cnpj)
  if (item.cpf && item.cpf.trim() !== '') return formatCnpjCpf(item.cpf)
  return 'n/a'
}

function getContato(item: IGetClientesDataRes): string {
  return formatPhone(item.contato)
}

function navigateTo() {
  router.push('/dashboard/clientes')
}
</script>

<template>
  <section class="home-table">
    <div class="home-table__panel">
      <div class="home-table__header">
        <h3 class="home-table__title">CLIENTES</h3>
        <button type="button" class="home-table__cta" @click="navigateTo">VER TUDO</button>
      </div>

      <div class="home-table__scroll">
        <table class="home-table__grid">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Nome da empresa</th>
              <th>CPF/CNPJ</th>
              <th>E-mail</th>
              <th>Celular</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in clients" :key="item.id">
              <td :title="item.nome">{{ item.nome }}</td>
              <td :title="item.nome_empresa || 'n/a'">{{ item.nome_empresa || 'n/a' }}</td>
              <td :title="getDocumentId(item)">{{ getDocumentId(item) }}</td>
              <td :title="item.email || 'n/a'">{{ item.email || 'n/a' }}</td>
              <td :title="getContato(item)">{{ getContato(item) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <TableEmptyMessage
        :show="noContent"
        theme="night"
        message="Nenhum cliente encontrado."
      />
    </div>
  </section>
</template>

<style lang="scss" scoped>
.home-table {
  width: 100%;
  max-width: 100%;
  min-width: 0;
  flex-shrink: 0;

  &__panel {
    background: var(--night-surface, #132438);
    border: 1px solid var(--night-surface-border, rgba(176, 141, 87, 0.15));
    border-radius: var(--night-radius, 20px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
    overflow: hidden;
  }

  &__scroll {
    width: 100%;
    max-width: 100%;
    min-width: 0;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    padding-bottom: 16px;
  }

  &__grid {
    width: 100%;
    min-width: 0;
    border-collapse: collapse;
    table-layout: fixed;

    th {
      padding: 24px 16px 18px;
      text-align: left;
      font-family: 'Inter', sans-serif;
      font-size: 15px;
      font-weight: 700;
      line-height: 1;
      letter-spacing: 0.02em;
      color: #FFFCFF;
      opacity: 0.85;
      text-transform: uppercase;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    th:first-child,
    td:first-child {
      padding-left: 38px;
    }

    th:last-child,
    td:last-child {
      padding-right: 38px;
    }

    td {
      height: 60px;
      padding: 0 16px;
      text-align: left;
      vertical-align: middle;
      font-family: 'Inter', sans-serif;
      font-size: 14px;
      font-weight: 400;
      line-height: 1;
      letter-spacing: 0;
      color: #FFFCFF;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    th:nth-child(1),
    td:nth-child(1) {
      width: 22%;
    }

    th:nth-child(2),
    td:nth-child(2) {
      width: 20%;
    }

    th:nth-child(3),
    td:nth-child(3) {
      width: 16%;
    }

    th:nth-child(4),
    td:nth-child(4) {
      width: 24%;
    }

    th:nth-child(5),
    td:nth-child(5) {
      width: 18%;
    }

    tbody tr:nth-child(odd) {
      background: var(--night-row, rgba(33, 33, 33, 0.5));
    }

    @media (max-width: 1440px) {
      th {
        font-size: 14px;
        padding: 18px 10px 14px;
      }

      th:first-child,
      td:first-child {
        padding-left: 24px;
      }

      th:last-child,
      td:last-child {
        padding-right: 24px;
      }

      td {
        padding: 0 10px;
        font-size: 12px;
      }
    }

    @media (max-width: 1100px) {
      th {
        font-size: 12px;
        padding: 14px 8px 12px;
      }

      th:first-child,
      td:first-child {
        padding-left: 16px;
      }

      th:last-child,
      td:last-child {
        padding-right: 16px;
      }

      td {
        padding: 0 8px;
        font-size: 11px;
        height: 52px;
      }
    }
  }

  &__header {
    padding: 28px 38px 8px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;

    @media (max-width: 1100px) {
      padding: 20px 16px 8px;
      flex-wrap: wrap;
    }
  }

  &__title {
    margin: 0;
    font-family: 'Inter', sans-serif;
    font-weight: 700;
    font-size: 20px;
    line-height: 1;
    letter-spacing: 0.02em;
    color: #FFFCFF;
    text-transform: uppercase;
  }

  &__cta {
    width: 146.5px;
    min-width: 146.5px;
    height: 46px;
    padding: 0;
    border: none;
    border-radius: 30px;
    background: #B08D57;
    color: #ffffff;
    font-family: 'Inter', sans-serif;
    font-size: 15px;
    font-weight: 700;
    line-height: 1;
    letter-spacing: 0.03em;
    text-transform: uppercase;
    cursor: pointer;
    white-space: nowrap;
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 14px rgba(176, 141, 87, 0.25);
    transition: all 0.2s ease;

    &:hover {
      background: #C29F68;
      transform: translateY(-1px);
      box-shadow: 0 6px 18px rgba(176, 141, 87, 0.35);
    }

    @media (max-width: 1100px) {
      width: 120px;
      min-width: 120px;
      height: 40px;
      font-size: 13px;
    }
  }
}
</style>
