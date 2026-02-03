<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useAuthStore } from '@/stores/auth'
import CustomButton from '@/components/CustomButton/CustomButton.vue'
import { postSetor } from '@/services/http/setores'
import { getAllEmpresas } from '@/services/http/empresas'

const router = useRouter()
const toast = useToast()
const authStore = useAuthStore()

const loading = ref(false)
const empresas = ref<{ id: string; nome: string }[]>([])
const form = ref({
  nome: '',
  descricao: '',
  empresa_id: ''
})

const isAdmin = computed(() => authStore.userRole === 'administrador')

onMounted(async () => {
  if (isAdmin.value) {
    try {
      const { data } = await getAllEmpresas()
      empresas.value = data.data
    } catch (error) {
      console.error('Erro ao carregar empresas', error)
    }
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
      descricao: form.value.descricao || undefined
    }
    
    if (isAdmin.value) {
      payload.empresa_id = form.value.empresa_id
    }
    
    await postSetor(payload)
    toast.success('Setor criado com sucesso')
    router.push('/dashboard/setores')
  } catch (error) {
    console.error(error)
    toast.error('Erro ao criar setor')
  } finally {
    loading.value = false
  }
}

function goBack() {
  router.push('/dashboard/setores')
}
</script>

<template>
  <section class="form_section">
    <h2 class="title dashboard_title">NOVO SETOR</h2>
    
    <form class="form_container" @submit.prevent="handleSubmit">
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
          placeholder="Nome do setor"
          required
        />
      </div>

      <div class="form_group">
        <label for="descricao">Descrição</label>
        <textarea
          id="descricao"
          v-model="form.descricao"
          placeholder="Descrição do setor (opcional)"
          rows="3"
        />
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
  max-width: 600px;

  .title {
    margin-bottom: 42px;
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

    input, textarea, select {
      width: 100%;
      padding: 12px;
      border: 1px solid rgba(207, 198, 188, 0.5);
      border-radius: 4px;
      font-size: 14px;
      background-color: white;

      &:focus {
        outline: none;
        border-color: #C7633B;
      }
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
