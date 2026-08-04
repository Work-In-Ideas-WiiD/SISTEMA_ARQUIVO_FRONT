<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import CustomButton from '@/components/CustomButton/CustomButton.vue'
import { postPlano } from '@/services/http/planos'
import { getApiErrorMessage } from '@/utils/apiError'

const router = useRouter()
const toast = useToast()

const loading = ref(false)
const form = ref({
  nome: '',
  descricao: '',
  valor_reais: '' as string | number,
  max_usuarios: '' as string | number,
  armazenamento_gb: '' as string | number,
  ativo: true
})

async function handleSubmit() {
  const valor = Number(form.value.valor_reais)
  const maxU = Number(form.value.max_usuarios)
  const gb = Number(form.value.armazenamento_gb)

  if (!form.value.nome) {
    toast.error('Nome é obrigatório')
    return
  }
  if (!Number.isFinite(valor) || valor < 0) {
    toast.error('Valor mensal inválido')
    return
  }
  if (!Number.isFinite(maxU) || maxU < 1) {
    toast.error('Máximo de usuários deve ser ao menos 1')
    return
  }
  if (!Number.isFinite(gb) || gb < 0) {
    toast.error('Armazenamento inválido')
    return
  }

  try {
    loading.value = true
    await postPlano({
      nome: form.value.nome,
      descricao: form.value.descricao || undefined,
      valor_mensal_centavos: Math.round(valor * 100),
      max_usuarios: Math.round(maxU),
      armazenamento_bytes: Math.round(gb * 1024 ** 3),
      ativo: form.value.ativo
    })
    toast.success('Plano criado com sucesso')
    router.push('/dashboard/planos')
  } catch (error) {
    console.error(error)
    toast.error(getApiErrorMessage(error, 'Erro ao criar plano'))
  } finally {
    loading.value = false
  }
}

function goBack() {
  router.push('/dashboard/planos')
}
</script>

<template>
  <section class="form_section">
    <h2 class="title dashboard_title">NOVO PLANO</h2>

    <form class="form_container" @submit.prevent="handleSubmit">
      <div class="form_group">
        <label for="nome">Nome *</label>
        <input id="nome" v-model="form.nome" type="text" placeholder="Nome do plano" required />
      </div>

      <div class="form_group">
        <label for="descricao">Descrição</label>
        <textarea id="descricao" v-model="form.descricao" placeholder="Descrição (opcional)" rows="3" />
      </div>

      <div class="form_group">
        <label for="valor">Valor mensal (R$) *</label>
        <input id="valor" v-model="form.valor_reais" type="number" step="0.01" min="0" placeholder="149.90" required />
      </div>

      <div class="form_group">
        <label for="max_usuarios">Quantidade máxima de usuários *</label>
        <input id="max_usuarios" v-model="form.max_usuarios" type="number" min="1" step="1" placeholder="10" required />
      </div>

      <div class="form_group">
        <label for="armazenamento">Armazenamento (GB) *</label>
        <input id="armazenamento" v-model="form.armazenamento_gb" type="number" min="0" step="0.1" placeholder="10" required />
      </div>

      <div class="form_group">
        <label for="ativo">Status</label>
        <select id="ativo" v-model="form.ativo">
          <option :value="true">Ativo</option>
          <option :value="false">Inativo</option>
        </select>
      </div>

      <div class="form_actions">
        <CustomButton title="CANCELAR" type="button" variant="secondary" @click="goBack" />
        <CustomButton title="SALVAR" type="submit" :loading="loading" />
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
