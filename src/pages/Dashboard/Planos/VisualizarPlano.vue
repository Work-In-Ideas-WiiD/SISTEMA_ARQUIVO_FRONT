<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'
import { getPlano } from '@/services/http/planos'

const router = useRouter()
const route = useRoute()
const toast = useToast()

const nome = ref('')
const descricao = ref('')
const valor = ref('')
const maxUsuarios = ref('')
const armazenamento = ref('')
const status = ref('')
const loading = ref(true)

const planoId = route.params.id as string

function formatBRL(centavos: number) {
  return (centavos / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function formatGB(bytes: number) {
  return `${(bytes / 1024 ** 3).toLocaleString('pt-BR', { maximumFractionDigits: 2 })} GB`
}

onMounted(async () => {
  try {
    const { data } = await getPlano(planoId)
    nome.value = data.nome || ''
    descricao.value = data.descricao || ''
    valor.value = formatBRL(data.valor_mensal_centavos)
    maxUsuarios.value = String(data.max_usuarios)
    armazenamento.value = formatGB(data.armazenamento_bytes)
    status.value = data.ativo ? 'Ativo' : 'Inativo'
  } catch (error) {
    console.error(error)
    toast.error('Erro ao carregar plano')
    router.push('/dashboard/planos')
  } finally {
    loading.value = false
  }
})

function goToEditar() {
  router.push(`/dashboard/planos/editar/${planoId}`)
}

function goBack() {
  router.push('/dashboard/planos')
}
</script>

<template>
  <section class="new_form">
    <div class="page_title">
      <button class="back_btn" @click="goBack">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
        </svg>
      </button>
      <h2 class="dashboard_title">PLANO</h2>
    </div>

    <div v-if="loading" class="loading_container">
      <p>Carregando...</p>
    </div>

    <div v-else class="form_wrapper">
      <form>
        <div class="input_row">
          <div class="form_group flex_3">
            <label>Nome</label>
            <input v-model="nome" type="text" disabled />
          </div>
          <div class="form_group flex_1">
            <label>Status</label>
            <input v-model="status" type="text" disabled />
          </div>
        </div>

        <div class="input_row">
          <div class="form_group flex_1">
            <label>Descrição</label>
            <textarea v-model="descricao" rows="3" disabled />
          </div>
        </div>

        <div class="input_row">
          <div class="form_group flex_1">
            <label>Valor mensal</label>
            <input v-model="valor" type="text" disabled />
          </div>
          <div class="form_group flex_1">
            <label>Máx. usuários</label>
            <input v-model="maxUsuarios" type="text" disabled />
          </div>
          <div class="form_group flex_1">
            <label>Armazenamento</label>
            <input v-model="armazenamento" type="text" disabled />
          </div>
        </div>

        <div class="form_actions">
          <button type="button" class="edit_btn" @click="goToEditar">EDITAR</button>
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

      @media (max-width: 900px) {
        gap: 10px;
      }
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

      input,
      textarea {
        border: 1px solid var(--color-gray-500);
        padding: 15px;
        font-size: 0.938rem;
        color: var(--color-blue-700);
        outline: none;
        background: white;
        font-family: inherit;
        resize: vertical;

        &:disabled {
          background: #f5f5f5;
          color: var(--color-blue-700);
        }
      }

      input {
        height: 51px;
        padding: 0 15px;
      }
    }

    .form_actions {
      display: flex;
      justify-content: flex-end;
      margin-top: 10px;

      .edit_btn {
        background-color: var(--color-orange-600, #c7633b);
        color: #fff;
        border: none;
        padding: 0 28px;
        height: 44px;
        cursor: pointer;
        font-size: 0.875rem;
        font-weight: 600;
      }
    }
  }
}
</style>
