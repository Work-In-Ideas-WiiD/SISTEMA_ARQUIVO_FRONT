<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'
import CustomButton from '@/components/CustomButton/CustomButton.vue'
import { getSetor, patchSetor } from '@/services/http/setores'

const router = useRouter()
const route = useRoute()
const toast = useToast()

const loading = ref(false)
const fetching = ref(true)
const form = ref({
  nome: '',
  descricao: ''
})

onMounted(async () => {
  try {
    const { data } = await getSetor(route.params.id as string)
    form.value.nome = data.nome
    form.value.descricao = data.descricao || ''
  } catch (error) {
    console.error(error)
    toast.error('Erro ao carregar setor')
    router.push('/dashboard/setores')
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
    await patchSetor(form.value, route.params.id as string)
    toast.success('Setor atualizado com sucesso')
    router.push('/dashboard/setores')
  } catch (error) {
    console.error(error)
    toast.error('Erro ao atualizar setor')
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
    <h2 class="title dashboard_title">EDITAR SETOR</h2>
    
    <div v-if="fetching" class="loading">Carregando...</div>
    
    <form v-else class="form_container" @submit.prevent="handleSubmit">
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

  .form_actions {
    display: flex;
    gap: 16px;
    justify-content: flex-end;
    margin-top: 32px;
  }
}
</style>
