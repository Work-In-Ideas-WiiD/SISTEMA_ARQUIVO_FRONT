<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'
import CustomButton from '@/components/CustomButton/CustomButton.vue'
import { getFuncionario, patchFuncionario } from '@/services/http/funcionarios'
import { getAllSetores, type ISetor } from '@/services/http/setores'
import { getAllFuncoes, type IFuncao } from '@/services/http/funcoes'

const router = useRouter()
const route = useRoute()
const toast = useToast()

const loading = ref(false)
const fetching = ref(true)
const setoresDisponiveis = ref<ISetor[]>([])
const funcoesDisponiveis = ref<IFuncao[]>([])

const form = ref({
  nome: '',
  email: '',
  cpf: '',
  telefone: '',
  data_nascimento: '',
  setores: [] as string[],
  funcoes: [] as string[]
})

onMounted(async () => {
  try {
    const [funcionarioRes, setoresRes, funcoesRes] = await Promise.all([
      getFuncionario(route.params.id as string),
      getAllSetores(),
      getAllFuncoes()
    ])
    
    const funcionario = funcionarioRes.data
    form.value.nome = funcionario.nome
    form.value.email = funcionario.email || ''
    form.value.cpf = funcionario.cpf || ''
    form.value.telefone = funcionario.telefone || ''
    form.value.data_nascimento = funcionario.data_nascimento || ''
    form.value.setores = funcionario.setores?.map((s: ISetor) => s.id) || []
    form.value.funcoes = funcionario.funcoes?.map((f: IFuncao) => f.id) || []
    
    setoresDisponiveis.value = setoresRes.data
    funcoesDisponiveis.value = funcoesRes.data
  } catch (error) {
    console.error(error)
    toast.error('Erro ao carregar funcionário')
    router.push('/dashboard/funcionarios')
  } finally {
    fetching.value = false
  }
})

async function handleSubmit() {
  if (!form.value.nome) {
    toast.error('Nome é obrigatório')
    return
  }

  try {
    loading.value = true
    await patchFuncionario(form.value, route.params.id as string)
    toast.success('Funcionário atualizado com sucesso')
    router.push('/dashboard/funcionarios')
  } catch (error) {
    console.error(error)
    toast.error('Erro ao atualizar funcionário')
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
    <h2 class="title dashboard_title">EDITAR FUNCIONÁRIO</h2>
    
    <div v-if="fetching" class="loading">Carregando...</div>
    
    <form v-else class="form_container" @submit.prevent="handleSubmit">
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
