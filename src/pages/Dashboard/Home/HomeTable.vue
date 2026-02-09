<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import CustomButton from '@/components/CustomButton/CustomButton.vue'
import TableEmptyMessage from '@/components/TableEmptyMessage/TableEmptyMessage.vue'
import { getClientes, type IGetClientesDataRes } from '@/services/http/clientes'
import { formatCnpjCpf } from '@/utils/formatCpfCnpj'

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
    clients.value = data.data
    noContent.value = data.data.length === 0
  } catch (error) {
    console.error(error)
    toast.error('Ocorreu um erro ao obter dados.')
  }
}

function getDocumentId(item: IGetClientesDataRes): string {
  if (item.cnpj) return formatCnpjCpf(item.cnpj)
  if (item.cpf) return formatCnpjCpf(item.cpf)
  return 'n/a'
}

function navigateTo() {
  router.push('/dashboard/clientes')
}
</script>

<template>
  <section class="table_section">
    <div class="table_header">
      <label class="table_title">CLIENTES</label>
      <CustomButton title="VER TUDO" @click="navigateTo" />
    </div>
    <div class="table_wrapper">
      <table class="table_style">
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
            <td>{{ item.nome }}</td>
            <td>{{ item.nome_empresa || 'n/a' }}</td>
            <td>{{ getDocumentId(item) }}</td>
            <td>{{ item.email || 'n/a' }}</td>
            <td>{{ item.contato || 'n/a' }}</td>
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
}
</style>
