<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useAuthStore } from '@/stores/auth'
import CustomButton from '@/components/CustomButton/CustomButton.vue'
import { postArquivo } from '@/services/http/arquivos'
import { getAllEmpresas } from '@/services/http/empresas'
import { postAddEmpresaToArquivo } from '@/services/http/administradores'
import { getAllSetores, type ISetor } from '@/services/http/setores'
import { getAllFuncoes, type IFuncao } from '@/services/http/funcoes'
import { getApiErrorMessage } from '@/utils/apiError'

const router = useRouter()
const toast = useToast()
const authStore = useAuthStore()

const isAdmin = computed(() => authStore.userRole === 'administrador')

const nome = ref('')
const empresaId = ref('')
const empresas = ref<{ id: string; nome: string }[]>([])
const arquivo = ref<File | null>(null)
const fetching = ref(false)

const setoresDisponiveis = ref<ISetor[]>([])
const funcoesDisponiveis = ref<IFuncao[]>([])
const setoresSelecionados = ref<string[]>([])
const funcoesSelecionadas = ref<string[]>([])

onMounted(async () => {
  try {
    if (isAdmin.value) {
      const { data } = await getAllEmpresas()
      empresas.value = data.data
    }
  } catch (error) {
    console.error(error)
    toast.error('Erro ao carregar empresas')
  }
})

watch(empresaId, async (id) => {
  setoresSelecionados.value = []
  funcoesSelecionadas.value = []
  setoresDisponiveis.value = []
  funcoesDisponiveis.value = []

  if (id) {
    await loadSetoresFuncoes(id)
  }
})

async function loadSetoresFuncoes(empresa: string) {
  try {
    const [setoresRes, funcoesRes] = await Promise.all([
      getAllSetores(empresa),
      getAllFuncoes(empresa)
    ])
    setoresDisponiveis.value = setoresRes.data
    funcoesDisponiveis.value = funcoesRes.data
  } catch (error) {
    console.error(error)
    toast.error('Erro ao carregar setores/funções')
  }
}

function onFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    arquivo.value = target.files[0]
  }
}

function toggleSetor(id: string) {
  const idx = setoresSelecionados.value.indexOf(id)
  if (idx >= 0) {
    setoresSelecionados.value.splice(idx, 1)
  } else {
    setoresSelecionados.value.push(id)
  }
}

function toggleFuncao(id: string) {
  const idx = funcoesSelecionadas.value.indexOf(id)
  if (idx >= 0) {
    funcoesSelecionadas.value.splice(idx, 1)
  } else {
    funcoesSelecionadas.value.push(id)
  }
}

async function handleSubmit() {
  if (fetching.value) return

  if (!nome.value || !arquivo.value) {
    toast.error('Preencha o nome e selecione um arquivo')
    return
  }

  if (isAdmin.value && !empresaId.value) {
    toast.error('Selecione uma empresa')
    return
  }

  try {
    fetching.value = true
    const formData = new FormData()
    formData.append('descricao', nome.value)
    formData.append('file', arquivo.value)
    formData.append('empresa_id', empresaId.value)

    setoresSelecionados.value.forEach((id) => {
      formData.append('setores[]', id)
    })
    funcoesSelecionadas.value.forEach((id) => {
      formData.append('funcoes[]', id)
    })

    const { data: arquivoRes } = await postArquivo(formData)

    await postAddEmpresaToArquivo([empresaId.value], arquivoRes.id)

    toast.success('Arquivo cadastrado')
    setTimeout(() => {
      router.push('/dashboard/arquivos')
    }, 1500)
  } catch (error) {
    toast.error(getApiErrorMessage(error, 'Erro ao cadastrar arquivo'))
    console.error(error)
  } finally {
    fetching.value = false
  }
}

function goBack() {
  router.push('/dashboard/arquivos')
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
      <h2 class="dashboard_title">NOVO ARQUIVO</h2>
    </div>

    <div class="form_wrapper">
      <form @submit.prevent="handleSubmit">
        <div class="form_group">
          <label>Nome</label>
          <input v-model="nome" type="text" placeholder="Nome do arquivo" />
        </div>

        <div class="form_group">
          <label for="empresa">Empresa *</label>
          <select id="empresa" v-model="empresaId" required>
            <option value="">Selecione uma empresa</option>
            <option v-for="emp in empresas" :key="emp.id" :value="emp.id">
              {{ emp.nome }}
            </option>
          </select>
        </div>

        <div class="form_group">
          <label>Setor <span class="optional">(opcional)</span></label>
          <div class="checkbox_list">
            <div v-if="!empresaId" class="empty_message">
              Selecione uma empresa primeiro
            </div>
            <div v-else-if="setoresDisponiveis.length === 0" class="empty_message">
              Nenhum setor cadastrado
            </div>
            <label
              v-for="setor in setoresDisponiveis"
              :key="setor.id"
              class="checkbox_item"
            >
              <input
                type="checkbox"
                :checked="setoresSelecionados.includes(setor.id)"
                @change="toggleSetor(setor.id)"
              />
              <span>{{ setor.nome }}</span>
            </label>
          </div>
        </div>

        <div class="form_group">
          <label>Função <span class="optional">(opcional)</span></label>
          <div class="checkbox_list">
            <div v-if="!empresaId" class="empty_message">
              Selecione uma empresa primeiro
            </div>
            <div v-else-if="funcoesDisponiveis.length === 0" class="empty_message">
              Nenhuma função cadastrada
            </div>
            <label
              v-for="funcao in funcoesDisponiveis"
              :key="funcao.id"
              class="checkbox_item"
            >
              <input
                type="checkbox"
                :checked="funcoesSelecionadas.includes(funcao.id)"
                @change="toggleFuncao(funcao.id)"
              />
              <span>{{ funcao.nome }}</span>
            </label>
          </div>
        </div>

        <div class="upload_area">
          <label class="upload_label">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z" />
            </svg>
            <span>{{ arquivo ? arquivo.name : 'Upload do arquivo' }}</span>
            <input type="file" hidden @change="onFileChange" />
          </label>
        </div>

        <div class="btn_container">
          <CustomButton
            title="Adicionar arquivo"
            variation="2"
            :loading="fetching"
            @click="handleSubmit"
          />
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

  .form_wrapper {
    background-color: rgba(207, 198, 188, 0.1);
    padding: 40px;
    max-width: 600px;

    form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .form_group {
      display: flex;
      flex-direction: column;
      gap: 8px;

      label {
        font-size: 0.875rem;
        color: var(--color-blue-700);

        .optional {
          font-weight: 400;
          color: var(--color-gray-500, #888);
        }
      }

      input,
      select {
        height: 51px;
        border: 1px solid var(--color-gray-500);
        padding: 0 15px;
        font-size: 0.938rem;
        color: var(--color-blue-700);
        outline: none;
        background: white;

        &::placeholder {
          color: var(--color-gray-500);
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
      background: #fff;

      .empty_message {
        color: #888;
        font-style: italic;
        font-size: 0.875rem;
      }
    }

    .checkbox_item {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.875rem;
      color: var(--color-blue-700);

      &:hover {
        background-color: rgba(207, 198, 188, 0.2);
      }

      input[type='checkbox'] {
        width: auto;
        height: auto;
        cursor: pointer;
      }
    }

    .upload_area {
      display: flex;
      justify-content: center;
      padding: 20px 0;

      .upload_label {
        display: flex;
        align-items: center;
        gap: 10px;
        color: var(--color-orange-500);
        cursor: pointer;
        font-size: 0.938rem;

        &:hover {
          opacity: 0.8;
        }
      }
    }

    .btn_container {
      margin-top: 20px;
    }
  }
}
</style>
