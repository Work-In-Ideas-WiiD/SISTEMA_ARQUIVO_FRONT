<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import CustomButton from '@/components/CustomButton/CustomButton.vue'
import { postContrato } from '@/services/http/contratos'
import { getEmpresas, type IGetEmpresasDataRes } from '@/services/http/empresas'
import { postAddEmpresaToContrato } from '@/services/http/administradores'

const router = useRouter()
const toast = useToast()

const nome = ref('')
const empresaId = ref('')
const empresas = ref<IGetEmpresasDataRes[]>([])
const arquivo = ref<File | null>(null)
const fetching = ref(false)

onMounted(async () => {
  try {
    const { data } = await getEmpresas(1, '')
    empresas.value = data.data
  } catch (error) {
    console.error(error)
  }
})

function onFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    arquivo.value = target.files[0]
  }
}

async function handleSubmit() {
  if (fetching.value) return
  
  if (!nome.value || !arquivo.value) {
    toast.error('Preencha todos os campos e selecione um arquivo')
    return
  }
  
  try {
    fetching.value = true
    const formData = new FormData()
    formData.append('descricao', nome.value)
    formData.append('file', arquivo.value)
    
    // Primeiro cria o contrato
    const { data: contratoRes } = await postContrato(formData)
    
    // Depois associa a empresa se selecionada
    if (empresaId.value) {
      await postAddEmpresaToContrato(empresaId.value, contratoRes.id)
    }
    
    toast.success('Contrato cadastrado')
    setTimeout(() => {
      router.push('/dashboard/contratos')
    }, 2000)
  } catch (error) {
    toast.error('Erro ao cadastrar contrato')
    console.error(error)
  } finally {
    fetching.value = false
  }
}

function goBack() {
  router.push('/dashboard/contratos')
}
</script>

<template>
  <section class="new_form">
    <div class="page_title">
      <button class="back_btn" @click="goBack">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
        </svg>
      </button>
      <h2 class="dashboard_title">NOVO CADASTRO</h2>
    </div>
    
    <div class="form_wrapper">
      <form @submit.prevent="handleSubmit">
        <div class="form_group">
          <label>Nome</label>
          <input v-model="nome" type="text" placeholder="Nome do contrato" />
        </div>

        <div class="form_group">
          <label>Empresa</label>
          <select v-model="empresaId">
            <option value="">Selecione uma empresa</option>
            <option v-for="emp in empresas" :key="emp.id" :value="emp.id">
              {{ emp.nome_empresa || emp.nome }}
            </option>
          </select>
        </div>

        <div class="upload_area">
          <label class="upload_label">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z"/>
            </svg>
            <span>{{ arquivo ? arquivo.name : 'Upload do arquivo' }}</span>
            <input type="file" @change="onFileChange" accept=".pdf,.doc,.docx" hidden />
          </label>
        </div>
        
        <div class="btn_container">
          <CustomButton
            title="Adicionar contrato"
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
      }

      input, select {
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
