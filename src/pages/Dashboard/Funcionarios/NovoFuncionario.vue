<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useAuthStore } from '@/stores/auth'
import CustomButton from '@/components/CustomButton/CustomButton.vue'
import { postFuncionario } from '@/services/http/funcionarios'
import { getAllSetores, type ISetor } from '@/services/http/setores'
import { getAllFuncoes, type IFuncao } from '@/services/http/funcoes'
import { getAllEmpresas } from '@/services/http/empresas'

const router = useRouter()
const toast = useToast()
const authStore = useAuthStore()

const loading = ref(false)
const loadingData = ref(true)
const empresas = ref<{ id: string; nome: string }[]>([])
const setoresDisponiveis = ref<ISetor[]>([])
const funcoesDisponiveis = ref<IFuncao[]>([])

const form = ref({
  nome: '',
  email: '',
  cpf: '',
  telefone: '',
  data_nascimento: '',
  setores: [] as string[],
  funcoes: [] as string[],
  empresa_id: ''
})

const isAdmin = computed(() => authStore.userRole === 'administrador')

// Recarrega setores e funções quando empresa muda
watch(() => form.value.empresa_id, async (empresaId) => {
  if (isAdmin.value && empresaId) {
    await loadSetoresFuncoes(empresaId)
  }
})

async function loadSetoresFuncoes(empresaId?: string) {
  try {
    const [setoresRes, funcoesRes] = await Promise.all([
      getAllSetores(empresaId),
      getAllFuncoes(empresaId)
    ])
    setoresDisponiveis.value = setoresRes.data
    funcoesDisponiveis.value = funcoesRes.data
  } catch (error) {
    console.error(error)
  }
}

onMounted(async () => {
  try {
    if (isAdmin.value) {
      const { data } = await getAllEmpresas()
      empresas.value = data.data
    } else {
      await loadSetoresFuncoes()
    }
  } catch (error) {
    console.error(error)
    toast.error('Erro ao carregar dados')
  } finally {
    loadingData.value = false
  }
})

async function handleSubmit() {
  if (!form.value.nome) {
    toast.error('Nome é obrigatório')
    return
  }

  if (isAdmin.value && !form.value.empresa_id) {
    toast.error('Selecione uma empresa')
    return
  }

  try {
    loading.value = true
    const payload: any = {
      nome: form.value.nome,
      email: form.value.email || undefined,
      cpf: form.value.cpf || undefined,
      telefone: form.value.telefone || undefined,
      data_nascimento: form.value.data_nascimento || undefined,
      setores: form.value.setores.length > 0 ? form.value.setores : undefined,
      funcoes: form.value.funcoes.length > 0 ? form.value.funcoes : undefined
    }
    
    if (isAdmin.value) {
      payload.empresa_id = form.value.empresa_id
    }
    
    await postFuncionario(payload)
    toast.success('Funcionário criado com sucesso')
    router.push('/dashboard/funcionarios')
  } catch (error) {
    console.error(error)
    toast.error('Erro ao criar funcionário')
  } finally {
    loading.value = false
  }
}

function goBack() {
  router.push('/dashboard/funcionarios')
}

function toggleSetor(id: string) {
  const index = form.value.setores.indexOf(id)
  if (index > -1) {
    form.value.setores.splice(index, 1)
  } else {
    form.value.setores.push(id)
  }
}

function toggleFuncao(id: string) {
  const index = form.value.funcoes.indexOf(id)
  if (index > -1) {
    form.value.funcoes.splice(index, 1)
  } else {
    form.value.funcoes.push(id)
  }
}
</script>

<template>
  <section class="form_section">
    <h2 class="title dashboard_title">NOVO FUNCIONÁRIO</h2>
    
    <div v-if="loadingData" class="loading">Carregando...</div>
    
    <form v-else class="form_container" @submit.prevent="handleSubmit">
      <div v-if="isAdmin" class="form_group full_width">
        <label for="empresa">Empresa *</label>
        <select
          id="empresa"
          v-model="form.empresa_id"
          required
        >
          <option value="">Selecione uma empresa</option>
          <option v-for="empresa in empresas" :key="empresa.id" :value="empresa.id">
            {{ empresa.nome }}
          </option>
        </select>
      </div>

      <div class="form_row">
        <div class="form_group">
          <label for="nome">Nome *</label>
          <input
            id="nome"
            v-model="form.nome"
            type="text"
            placeholder="Nome completo"
            required
          />
        </div>

        <div class="form_group">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            placeholder="email@exemplo.com"
          />
        </div>
      </div>

      <div class="form_row">
        <div class="form_group">
          <label for="cpf">CPF</label>
          <input
            id="cpf"
            v-model="form.cpf"
            type="text"
            placeholder="000.000.000-00"
          />
        </div>

        <div class="form_group">
          <label for="telefone">Telefone</label>
          <input
            id="telefone"
            v-model="form.telefone"
            type="text"
            placeholder="(00) 00000-0000"
          />
        </div>
      </div>

      <div class="form_row">
        <div class="form_group">
          <label for="data_nascimento">Data de Nascimento</label>
          <input
            id="data_nascimento"
            v-model="form.data_nascimento"
            type="date"
          />
        </div>
      </div>

      <div class="form_group">
        <label>Setores</label>
        <div class="checkbox_list">
          <div v-if="setoresDisponiveis.length === 0" class="empty_message">
            Nenhum setor cadastrado
          </div>
          <label
            v-for="setor in setoresDisponiveis"
            :key="setor.id"
            class="checkbox_item"
          >
            <input
              type="checkbox"
              :checked="form.setores.includes(setor.id)"
              @change="toggleSetor(setor.id)"
            />
            <span>{{ setor.nome }}</span>
          </label>
        </div>
      </div>

      <div class="form_group">
        <label>Funções</label>
        <div class="checkbox_list">
          <div v-if="funcoesDisponiveis.length === 0" class="empty_message">
            Nenhuma função cadastrada
          </div>
          <label
            v-for="funcao in funcoesDisponiveis"
            :key="funcao.id"
            class="checkbox_item"
          >
            <input
              type="checkbox"
              :checked="form.funcoes.includes(funcao.id)"
              @change="toggleFuncao(funcao.id)"
            />
            <span>{{ funcao.nome }}</span>
          </label>
        </div>
      </div>

      <div class="form_actions">
        <CustomButton
          title="CANCELAR"
          type="button"
          variant="secondary"
          @click="goBack"
        />
        <CustomButton
          title="SALVAR"
          type="submit"
          :loading="loading"
        />
      </div>
    </form>
  </section>
</template>

<style lang="scss" scoped>
.form_section {
  width: 100%;
  max-width: 800px;

  .title {
    margin-bottom: 42px;
  }

  .loading {
    padding: 40px;
    text-align: center;
  }

  .form_container {
    background-color: rgba(207, 198, 188, 0.1);
    padding: 38px;
    border-radius: 8px;
  }

  .form_row {
    display: flex;
    gap: 20px;
    
    @media (max-width: 600px) {
      flex-direction: column;
    }

    .form_group {
      flex: 1;
    }
  }

  .form_group {
    margin-bottom: 20px;

    label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
    }

    input, textarea {
      width: 100%;
      padding: 12px;
      border: 1px solid rgba(207, 198, 188, 0.5);
      border-radius: 4px;
      font-size: 14px;

      &:focus {
        outline: none;
        border-color: #C7633B;
      }
    }
  }

  .checkbox_list {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    padding: 12px;
    border: 1px solid rgba(207, 198, 188, 0.5);
    border-radius: 4px;
    max-height: 200px;
    overflow-y: auto;

    .empty_message {
      color: #888;
      font-style: italic;
    }
  }

  .checkbox_item {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    padding: 4px 8px;
    border-radius: 4px;
    transition: background-color 0.2s;

    &:hover {
      background-color: rgba(207, 198, 188, 0.2);
    }

    input[type="checkbox"] {
      width: auto;
      cursor: pointer;
    }
  }

  .form_actions {
    display: flex;
    gap: 16px;
    justify-content: flex-end;
    margin-top: 32px;
  }
}
</style>
