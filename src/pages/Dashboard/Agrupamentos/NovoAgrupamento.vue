<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useAuthStore } from '@/stores/auth'
import CustomButton from '@/components/CustomButton/CustomButton.vue'
import { postAgrupamento } from '@/services/http/agrupamentos'
import { getAllSetores, type ISetor } from '@/services/http/setores'
import { getAllFuncionarios, type IFuncionario } from '@/services/http/funcionarios'
import { getAllEmpresas } from '@/services/http/empresas'

const router = useRouter()
const toast = useToast()
const authStore = useAuthStore()

const loading = ref(false)
const loadingData = ref(true)
const empresas = ref<{ id: string; nome: string }[]>([])
const setoresDisponiveis = ref<ISetor[]>([])
const funcionariosDisponiveis = ref<IFuncionario[]>([])

const form = ref({
  nome: '',
  descricao: '',
  tipo: 'individual' as 'individual' | 'setor',
  funcionarios: [] as string[],
  setores: [] as string[],
  empresa_id: ''
})

const isAdmin = computed(() => authStore.userRole === 'administrador')
const showFuncionarios = computed(() => form.value.tipo === 'individual')
const showSetores = computed(() => form.value.tipo === 'setor')

// Recarrega setores e funcionários quando empresa muda
watch(() => form.value.empresa_id, async (empresaId) => {
  if (isAdmin.value && empresaId) {
    await loadSetoresFuncionarios(empresaId)
  }
})

async function loadSetoresFuncionarios(empresaId?: string) {
  try {
    const [setoresRes, funcionariosRes] = await Promise.all([
      getAllSetores(empresaId),
      getAllFuncionarios(empresaId)
    ])
    setoresDisponiveis.value = setoresRes.data
    funcionariosDisponiveis.value = funcionariosRes.data
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
      await loadSetoresFuncionarios()
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

  if (form.value.tipo === 'individual' && form.value.funcionarios.length === 0) {
    toast.error('Selecione pelo menos um funcionário')
    return
  }

  if (form.value.tipo === 'setor' && form.value.setores.length === 0) {
    toast.error('Selecione pelo menos um setor')
    return
  }

  try {
    loading.value = true
    const payload: any = {
      nome: form.value.nome,
      descricao: form.value.descricao || undefined,
      tipo: form.value.tipo,
      funcionarios: form.value.tipo === 'individual' ? form.value.funcionarios : undefined,
      setores: form.value.tipo === 'setor' ? form.value.setores : undefined
    }
    
    if (isAdmin.value) {
      payload.empresa_id = form.value.empresa_id
    }
    
    await postAgrupamento(payload)
    toast.success('Agrupamento criado com sucesso')
    router.push('/dashboard/agrupamentos')
  } catch (error) {
    console.error(error)
    toast.error('Erro ao criar agrupamento')
  } finally {
    loading.value = false
  }
}

function goBack() {
  router.push('/dashboard/agrupamentos')
}

function toggleFuncionario(id: string) {
  const index = form.value.funcionarios.indexOf(id)
  if (index > -1) {
    form.value.funcionarios.splice(index, 1)
  } else {
    form.value.funcionarios.push(id)
  }
}

function toggleSetor(id: string) {
  const index = form.value.setores.indexOf(id)
  if (index > -1) {
    form.value.setores.splice(index, 1)
  } else {
    form.value.setores.push(id)
  }
}

function onTipoChange() {
  // Limpar seleções ao trocar de tipo
  form.value.funcionarios = []
  form.value.setores = []
}
</script>

<template>
  <section class="form_section">
    <h2 class="title dashboard_title">NOVO AGRUPAMENTO</h2>
    
    <div v-if="loadingData" class="loading">Carregando...</div>
    
    <form v-else class="form_container" @submit.prevent="handleSubmit">
      <div v-if="isAdmin" class="form_group">
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

      <div class="form_group">
        <label for="nome">Nome *</label>
        <input
          id="nome"
          v-model="form.nome"
          type="text"
          placeholder="Nome do agrupamento"
          required
        />
      </div>

      <div class="form_group">
        <label for="descricao">Descrição</label>
        <textarea
          id="descricao"
          v-model="form.descricao"
          placeholder="Descrição do agrupamento (opcional)"
          rows="3"
        />
      </div>

      <div class="form_group">
        <label>Tipo de Agrupamento *</label>
        <div class="radio_group">
          <label class="radio_item">
            <input
              type="radio"
              v-model="form.tipo"
              value="individual"
              @change="onTipoChange"
            />
            <span>Individual (selecionar funcionários um a um)</span>
          </label>
          <label class="radio_item">
            <input
              type="radio"
              v-model="form.tipo"
              value="setor"
              @change="onTipoChange"
            />
            <span>Por Setor (incluir todos de um ou mais setores)</span>
          </label>
        </div>
      </div>

      <div v-if="showFuncionarios" class="form_group">
        <label>Funcionários *</label>
        <div class="checkbox_list">
          <div v-if="funcionariosDisponiveis.length === 0" class="empty_message">
            Nenhum funcionário cadastrado
          </div>
          <label
            v-for="funcionario in funcionariosDisponiveis"
            :key="funcionario.id"
            class="checkbox_item"
          >
            <input
              type="checkbox"
              :checked="form.funcionarios.includes(funcionario.id)"
              @change="toggleFuncionario(funcionario.id)"
            />
            <span>{{ funcionario.nome }}</span>
          </label>
        </div>
        <small class="helper_text">{{ form.funcionarios.length }} funcionário(s) selecionado(s)</small>
      </div>

      <div v-if="showSetores" class="form_group">
        <label>Setores *</label>
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
        <small class="helper_text">{{ form.setores.length }} setor(es) selecionado(s)</small>
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

  .form_group {
    margin-bottom: 20px;

    label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
    }

    input[type="text"], textarea {
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

  .radio_group {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .radio_item {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    padding: 12px;
    border: 1px solid rgba(207, 198, 188, 0.5);
    border-radius: 4px;
    transition: all 0.2s;

    &:hover {
      background-color: rgba(207, 198, 188, 0.2);
    }

    &:has(input:checked) {
      border-color: #C7633B;
      background-color: rgba(199, 99, 59, 0.1);
    }

    input[type="radio"] {
      cursor: pointer;
    }
  }

  .checkbox_list {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    padding: 12px;
    border: 1px solid rgba(207, 198, 188, 0.5);
    border-radius: 4px;
    max-height: 300px;
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
      cursor: pointer;
    }
  }

  .helper_text {
    display: block;
    margin-top: 8px;
    color: #666;
    font-size: 12px;
  }

  .form_actions {
    display: flex;
    gap: 16px;
    justify-content: flex-end;
    margin-top: 32px;
  }
}
</style>
