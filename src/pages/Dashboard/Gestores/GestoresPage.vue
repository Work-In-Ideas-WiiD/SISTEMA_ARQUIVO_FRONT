<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import TableEmptyMessage from '@/components/TableEmptyMessage/TableEmptyMessage.vue'
import NightConfirmModal from '@/components/NightConfirmModal/NightConfirmModal.vue'
import { useNightConfirm } from '@/composables/useNightConfirm'
import { deleteGestor, getGestores, type IGestor } from '@/services/http/gestores'
import { formatCnpjCpf } from '@/utils/formatCpfCnpj'
import { formatPhone } from '@/utils/formatPhone'
import { getApiErrorMessage } from '@/utils/apiError'
import iconChevronLeft from '@/assets/imgs/administradores/icon-chevron-left.svg'
import iconNewFolder from '@/assets/imgs/administradores/icon-new-folder.svg'
import iconEdit from '@/assets/imgs/administradores/icon-edit.svg'
import iconDelete from '@/assets/imgs/agrupamentos/delete.svg'

const router = useRouter()
const toast = useToast()
const { open: confirmOpen, options: confirmOptions, askConfirm, onConfirm, onCancel } = useNightConfirm()

const gestores = ref<IGestor[]>([])
const carregando = ref(true)
const podeAdicionar = ref(false)
const motivo = ref<'teste' | 'limite' | null>(null)

const aviso = () => {
  if (motivo.value === 'teste') return 'No teste grátis não é possível adicionar administradores. Contrate um plano para liberar.'
  if (motivo.value === 'limite') return 'Seu plano já chegou no limite de administradores.'
  return ''
}

async function carregar() {
  try {
    const { data } = await getGestores()
    gestores.value = data.data || []
    podeAdicionar.value = data.pode_adicionar
    motivo.value = data.motivo
  } catch (error) {
    toast.error(getApiErrorMessage(error, 'Erro ao carregar administradores'))
  } finally {
    carregando.value = false
  }
}

onMounted(carregar)

function novo() {
  if (!podeAdicionar.value) {
    toast.error(aviso())
    return
  }
  router.push('/dashboard/gestores/novo')
}

async function excluir(gestor: IGestor) {
  const ok = await askConfirm({
    title: 'Excluir administrador',
    body: `Excluir ${gestor.nome}? Essa pessoa deixa de acessar o sistema.`,
    confirmLabel: 'EXCLUIR',
    danger: true
  })
  if (!ok) return
  try {
    await deleteGestor(gestor.id)
    toast.success('Administrador excluído')
    carregar()
  } catch (error) {
    toast.error(getApiErrorMessage(error, 'Erro ao excluir'))
  }
}
</script>

<template>
  <main class="gestores dashboard_padding">
    <div class="gestores__heading">
      <button type="button" class="gestores__back" aria-label="Voltar" @click="router.push('/dashboard/arquivos')">
        <img :src="iconChevronLeft" width="24" height="24" alt="" />
      </button>
      <h2 class="dashboard_title">ADMINISTRADORES</h2>
    </div>

    <p v-if="aviso()" class="gestores__aviso">{{ aviso() }}</p>

    <div class="gestores__panel">
      <div class="gestores__toolbar">
        <button type="button" class="gestores__cta" :disabled="!podeAdicionar" @click="novo">
          <img :src="iconNewFolder" width="20" height="16" alt="" />
          <span>NOVO ADMINISTRADOR</span>
        </button>
      </div>

      <table class="gestores__grid">
        <thead>
          <tr>
            <th>Nome</th>
            <th>E-mail</th>
            <th>CPF</th>
            <th>Contato</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="gestor in gestores" :key="gestor.id">
            <td>{{ gestor.nome }}</td>
            <td>{{ gestor.email }}</td>
            <td>{{ gestor.cpf ? formatCnpjCpf(gestor.cpf) : '—' }}</td>
            <td>{{ gestor.contato ? formatPhone(gestor.contato) : '—' }}</td>
            <td>
              <div class="gestores__actions">
                <button type="button" aria-label="Editar" @click="router.push(`/dashboard/gestores/${gestor.id}/editar`)">
                  <img :src="iconEdit" width="24" height="24" alt="" />
                </button>
                <button type="button" aria-label="Excluir" @click="excluir(gestor)">
                  <img :src="iconDelete" width="24" height="24" alt="" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <TableEmptyMessage :show="!carregando && gestores.length === 0" theme="night" />
    </div>

    <NightConfirmModal
      :open="confirmOpen"
      :title="confirmOptions.title"
      :body="confirmOptions.body"
      :confirm-label="confirmOptions.confirmLabel"
      :cancel-label="confirmOptions.cancelLabel"
      :danger="confirmOptions.danger"
      @confirm="onConfirm"
      @cancel="onCancel"
    />
  </main>
</template>

<style lang="scss" scoped>
.gestores {
  &__heading { display: flex; align-items: center; gap: 8px; margin-bottom: 24px; }
  &__back { background: none; border: none; cursor: pointer; padding: 0; }
  &__aviso {
    margin: 0 0 16px;
    color: #e3b877;
    font-size: 14px;
  }
  &__panel {
    background: var(--night-surface, #132438);
    border: 1px solid rgba(176, 141, 87, 0.18);
    border-radius: 20px;
    padding: 24px;
  }
  &__toolbar { display: flex; justify-content: flex-end; margin-bottom: 16px; }
  &__cta {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    height: 42px;
    padding: 0 18px;
    border: none;
    border-radius: 24px;
    background: #b08d57;
    color: #fff;
    font-weight: 700;
    cursor: pointer;
    &:disabled { opacity: 0.45; cursor: not-allowed; }
  }
  &__grid {
    width: 100%;
    border-collapse: collapse;
    color: #f7f7f7;
    th, td { text-align: left; padding: 12px 8px; border-bottom: 1px solid rgba(255, 255, 255, 0.06); }
    th { font-size: 12px; letter-spacing: 0.04em; opacity: 0.7; }
  }
  &__actions {
    display: flex;
    gap: 8px;
    button { background: none; border: none; cursor: pointer; padding: 0; }
  }
}
</style>
