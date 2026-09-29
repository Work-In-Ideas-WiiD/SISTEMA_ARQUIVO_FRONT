<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import TableEmptyMessage from '@/components/TableEmptyMessage/TableEmptyMessage.vue'
import NightConfirmModal from '@/components/NightConfirmModal/NightConfirmModal.vue'
import { useNightConfirm } from '@/composables/useNightConfirm'
import { useDebouncedSearch } from '@/composables/useDebouncedSearch'
import { useEmpresaIdentidade } from '@/composables/useEmpresaIdentidade'
import {
  deleteEmpresaConta,
  getEmpresasConta,
  postEmpresaConta,
  putEmpresaConta,
  type IEmpresaConta
} from '@/services/http/empresas-conta'
import { NOME_EMPRESA_MAX, urlLogoEmpresa } from '@/services/http/empresa-identidade'
import { formatCnpjCpf, isValidOptionalCnpj, maskCnpj } from '@/utils/formatCpfCnpj'
import { getApiErrorMessage } from '@/utils/apiError'
import iconSearch from '@/assets/imgs/administradores/icon-search.svg'
import iconChevronLeft from '@/assets/imgs/administradores/icon-chevron-left.svg'
import iconNewFolder from '@/assets/imgs/administradores/icon-new-folder.svg'
import iconEdit from '@/assets/imgs/administradores/icon-edit.svg'
import iconDelete from '@/assets/imgs/agrupamentos/delete.svg'
import iconFiles from '@/assets/imgs/dashboard/icon-menu-files.svg'

const router = useRouter()
const toast = useToast()
const { identidade, carregar: recarregarIdentidade } = useEmpresaIdentidade()
const { open: confirmOpen, options: confirmOptions, askConfirm, onConfirm, onCancel } = useNightConfirm()

const empresas = ref<IEmpresaConta[]>([])
const carregando = ref(true)
const search = ref('')

async function getData() {
  try {
    const { data } = await getEmpresasConta(search.value.trim())
    empresas.value = data
  } catch (error) {
    toast.error(getApiErrorMessage(error, 'Erro ao carregar empresas'))
  } finally {
    carregando.value = false
  }
}

const debouncedSearch = useDebouncedSearch(() => void getData())

onMounted(getData)

function iniciais(nome: string) {
  const partes = nome.trim().split(/\s+/).filter(Boolean)
  return ((partes[0]?.[0] || '') + (partes.length > 1 ? partes[partes.length - 1][0] : '')).toUpperCase() || '?'
}

function logo(e: IEmpresaConta) {
  return urlLogoEmpresa({ id: e.id, logo_versao: e.logo_versao ? String(e.logo_versao) : null })
}

const modalAberto = ref(false)
const salvando = ref(false)
const editando = ref<IEmpresaConta | null>(null)
const nome = ref('')
const cnpj = ref('')

function abrirModal(empresa: IEmpresaConta | null = null) {
  editando.value = empresa
  nome.value = (empresa?.nome || '').slice(0, NOME_EMPRESA_MAX)
  cnpj.value = empresa?.cnpj ? maskCnpj(empresa.cnpj) : ''
  modalAberto.value = true
}

function fecharModal() {
  if (!salvando.value) modalAberto.value = false
}

async function salvar() {
  const nomeLimpo = nome.value.trim()
  if (!nomeLimpo) {
    toast.error('Informe o nome da empresa.')
    return
  }
  if (!isValidOptionalCnpj(cnpj.value)) {
    toast.error('CNPJ inválido.')
    return
  }
  salvando.value = true
  try {
    const payload = { nome: nomeLimpo, cnpj: cnpj.value.replace(/\D/g, '') || null }
    if (editando.value) {
      await putEmpresaConta(editando.value.id, payload)
      if (editando.value.principal) void recarregarIdentidade(true)
      toast.success('Empresa atualizada')
    } else {
      await postEmpresaConta(payload)
      toast.success('Empresa cadastrada')
    }
    salvando.value = false
    fecharModal()
    getData()
  } catch (error) {
    toast.error(getApiErrorMessage(error, 'Erro ao salvar a empresa'))
  } finally {
    salvando.value = false
  }
}

async function excluir(empresa: IEmpresaConta) {
  const ok = await askConfirm({
    title: 'Excluir empresa',
    body: `Excluir "${empresa.nome}"? Só é possível quando a empresa não tem setores, funcionários ou arquivos.`,
    confirmLabel: 'EXCLUIR',
    danger: true
  })
  if (!ok) return
  try {
    await deleteEmpresaConta(empresa.id)
    toast.success('Empresa excluída')
    getData()
  } catch (error) {
    toast.error(getApiErrorMessage(error, 'Erro ao excluir a empresa'))
  }
}

function abrirArquivos(empresa: IEmpresaConta) {
  router.push(`/dashboard/arquivos/empresa/${empresa.id}`)
}
</script>

<template>
  <main class="emp-conta dashboard_padding">
    <div class="emp-conta__heading">
      <button type="button" class="emp-conta__back" aria-label="Voltar" @click="router.push('/dashboard/arquivos')">
        <img :src="iconChevronLeft" width="24" height="24" alt="" />
      </button>
      <h2 class="emp-conta__title dashboard_title">EMPRESAS</h2>
    </div>

    <div class="emp-conta__panel">
      <form class="emp-conta__toolbar" @submit.prevent="debouncedSearch.flush()">
        <label class="emp-conta__search">
          <button type="submit" class="emp-conta__search-btn" aria-label="Pesquisar">
            <img :src="iconSearch" width="18" height="18" alt="" />
          </button>
          <input v-model="search" type="text" placeholder="Pesquisar por nome ou CNPJ…" @input="debouncedSearch.schedule()" />
        </label>

        <button type="button" class="emp-conta__cta" @click="abrirModal()">
          <img :src="iconNewFolder" width="20" height="16" alt="" />
          <span>NOVA EMPRESA</span>
        </button>
      </form>

      <p class="emp-conta__dica">
        Cada empresa tem seus próprios setores, funções, funcionários e arquivos. Todos entram pelo portal do cliente
        com o ID da sua conta<template v-if="identidade?.codigo">: <strong>{{ identidade.codigo }}</strong></template>.
        O sistema libera para cada pessoa só o que é da empresa dela.
      </p>

      <div class="emp-conta__scroll">
        <table class="emp-conta__grid">
          <thead>
            <tr>
              <th>Empresa</th>
              <th>CNPJ</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="empresa in empresas" :key="empresa.id">
              <td>
                <div class="emp-conta__empresa">
                  <span class="emp-conta__foto">
                    <img v-if="logo(empresa)" :src="logo(empresa)!" alt="" />
                    <template v-else>{{ iniciais(empresa.nome) }}</template>
                  </span>
                  <span class="emp-conta__nome" :title="empresa.nome">{{ empresa.nome }}</span>
                  <span v-if="empresa.principal" class="emp-conta__tag">PRINCIPAL</span>
                </div>
              </td>
              <td>{{ empresa.cnpj ? formatCnpjCpf(empresa.cnpj) : 'n/a' }}</td>
              <td>
                <div class="emp-conta__actions">
                  <button
                    type="button"
                    class="emp-conta__action"
                    aria-label="Abrir arquivos da empresa"
                    title="Abrir arquivos"
                    @click="abrirArquivos(empresa)"
                  >
                    <img :src="iconFiles" width="15" height="19" alt="" />
                  </button>
                  <button type="button" class="emp-conta__action" aria-label="Editar empresa" @click="abrirModal(empresa)">
                    <img :src="iconEdit" width="24" height="24" alt="" />
                  </button>
                  <button
                    v-if="!empresa.principal"
                    type="button"
                    class="emp-conta__action"
                    aria-label="Excluir empresa"
                    @click="excluir(empresa)"
                  >
                    <img :src="iconDelete" width="24" height="24" alt="" />
                  </button>
                  <span v-else class="emp-conta__action emp-conta__action--vazio" aria-hidden="true" />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <TableEmptyMessage :show="!carregando && empresas.length === 0" theme="night" />
    </div>

    <Teleport to="body">
      <div v-if="modalAberto" class="emp-conta-overlay" @click.self="fecharModal">
        <div class="emp-conta-modal" role="dialog" aria-modal="true" aria-labelledby="emp-conta-modal-title">
          <h3 id="emp-conta-modal-title" class="emp-conta-modal__title">
            {{ editando ? 'Editar empresa' : 'Nova empresa' }}
          </h3>
          <p class="emp-conta-modal__sub">As pessoas dessa empresa entram com o ID da sua conta.</p>

          <label class="emp-conta-modal__label" for="emp-conta-nome">NOME DA EMPRESA</label>
          <input
            id="emp-conta-nome"
            v-model="nome"
            class="emp-conta-modal__input"
            type="text"
            :maxlength="NOME_EMPRESA_MAX"
            :disabled="salvando"
            @keydown.enter.prevent="salvar"
          />
          <small class="emp-conta-modal__contador">{{ nome.length }}/{{ NOME_EMPRESA_MAX }}</small>

          <label class="emp-conta-modal__label" for="emp-conta-cnpj">CNPJ (OPCIONAL)</label>
          <input
            id="emp-conta-cnpj"
            :value="cnpj"
            class="emp-conta-modal__input"
            type="text"
            inputmode="numeric"
            placeholder="00.000.000/0000-00"
            :disabled="salvando"
            @input="cnpj = maskCnpj(($event.target as HTMLInputElement).value)"
            @keydown.enter.prevent="salvar"
          />

          <div class="emp-conta-modal__actions">
            <button type="button" class="emp-conta-modal__btn" :disabled="salvando" @click="fecharModal">CANCELAR</button>
            <button
              type="button"
              class="emp-conta-modal__btn emp-conta-modal__btn--primary"
              :disabled="salvando"
              @click="salvar"
            >
              {{ salvando ? 'SALVANDO…' : 'SALVAR' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

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
.emp-conta {
  width: 100%;
  min-width: 0;
  font-family: var(--night-font, 'Inter', sans-serif);

  &__heading {
    display: flex;
    align-items: center;
    gap: 1px;
    margin-bottom: 42px;
  }

  &__back {
    width: 24px;
    height: 24px;
    padding: 0;
    border: none;
    background: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    opacity: 0.7;

    &:hover {
      opacity: 1;
    }
  }

  &__title {
    margin: 0;
  }

  &__panel {
    background: var(--night-surface, #132438);
    border: 1px solid var(--night-surface-border, rgba(176, 141, 87, 0.18));
    border-radius: var(--night-radius, 20px);
    overflow: hidden;
  }

  &__toolbar {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 30px 38px 12px;
  }

  &__search {
    flex: 0 1 518px;
    min-width: 0;
    height: 49px;
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 0 20px;
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 30px;

    &:focus-within {
      border-color: #b08d57;
      box-shadow: 0 0 0 2px rgba(176, 141, 87, 0.2);
    }

    input {
      flex: 1;
      min-width: 0;
      height: 100%;
      border: none;
      outline: none;
      background: transparent;
      font: inherit;
      font-size: 14px;
      color: #fff;

      &::placeholder {
        color: #fff;
        opacity: 0.7;
      }
    }
  }

  &__search-btn {
    border: none;
    background: transparent;
    padding: 0;
    display: flex;
    cursor: pointer;
  }

  &__cta {
    flex-shrink: 0;
    height: 46px;
    margin-left: auto;
    padding: 0 22px;
    border: none;
    border-radius: 30px;
    background: #b08d57;
    color: #fff;
    display: inline-flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    font: inherit;
    font-size: 16px;
    font-weight: 700;
    white-space: nowrap;

    &:hover {
      background: #c29f68;
    }
  }

  &__dica {
    margin: 0;
    padding: 0 38px 18px;
    color: rgba(255, 252, 255, 0.6);
    font-size: 13px;
    line-height: 1.4;

    strong {
      color: #d9b77e;
    }
  }

  &__scroll {
    overflow-x: auto;
  }

  &__grid {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
    min-width: 620px;

    th {
      padding: 20px 16px 16px;
      text-align: left;
      font-size: 14px;
      font-weight: 700;
      color: #f7f7f7;
      opacity: 0.7;
      text-transform: uppercase;
    }

    td {
      height: 64px;
      padding: 0 16px;
      font-size: 14px;
      color: #f7f7f7;
      vertical-align: middle;
    }

    th:first-child,
    td:first-child {
      padding-left: 38px;
    }

    th:nth-child(2) {
      width: 190px;
    }

    td:nth-child(2) {
      white-space: nowrap;
    }

    th:last-child {
      width: 200px;
      text-align: center;
      padding-right: 38px;
    }

    td:last-child {
      padding-right: 38px;
    }

    tbody tr:nth-child(odd) {
      background: rgba(255, 255, 255, 0.02);
    }
  }

  &__empresa {
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 0;
  }

  &__foto {
    flex-shrink: 0;
    width: 38px;
    height: 38px;
    border-radius: 50%;
    overflow: hidden;
    border: 1px solid rgba(176, 141, 87, 0.5);
    background: rgba(176, 141, 87, 0.18);
    color: #d9b77e;
    font-size: 13px;
    font-weight: 700;
    display: grid;
    place-items: center;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__nome {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__tag {
    flex-shrink: 0;
    padding: 3px 8px;
    border-radius: 999px;
    background: rgba(176, 141, 87, 0.2);
    color: #d9b77e;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.04em;
  }


  &__actions {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  &__action {
    width: 40px;
    height: 40px;
    border: none;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.08);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    padding: 0;
    flex-shrink: 0;
    color: #fffcff;
    font: inherit;

    &--vazio {
      visibility: hidden;
    }

    &:hover {
      background: rgba(176, 141, 87, 0.25);
    }
  }
}

@media (max-width: 1200px) {
  .emp-conta__toolbar {
    padding: 24px 16px 12px;
  }

  .emp-conta__dica {
    padding: 0 16px 14px;
  }

  .emp-conta__cta {
    height: 44px;
    padding: 0 14px;
    font-size: 13px;
  }

  .emp-conta__grid th:first-child,
  .emp-conta__grid td:first-child {
    padding-left: 16px;
  }
}

.emp-conta-overlay {
  position: fixed;
  inset: 0;
  z-index: 1200;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.emp-conta-modal {
  width: min(440px, 100%);
  padding: 24px;
  box-sizing: border-box;
  background: var(--night-surface, #132438);
  border: 1px solid var(--night-surface-border, rgba(176, 141, 87, 0.25));
  border-radius: 16px;
  font-family: var(--night-font, 'Inter', sans-serif);

  &__title {
    margin: 0;
    color: #fffcff;
    font-size: 18px;
    font-weight: 700;
  }

  &__sub {
    margin: 4px 0 18px;
    color: rgba(255, 252, 255, 0.6);
    font-size: 12px;
  }

  &__label {
    display: block;
    margin: 12px 0 6px;
    color: rgba(255, 252, 255, 0.75);
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.04em;
  }

  &__input {
    width: 100%;
    height: 40px;
    box-sizing: border-box;
    padding: 0 12px;
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.15);
    background: rgba(0, 0, 0, 0.25);
    color: #fffcff;
    font: inherit;
    font-size: 14px;

    &:focus {
      outline: none;
      border-color: #b08d57;
    }
  }

  &__contador {
    display: block;
    margin-top: 4px;
    text-align: right;
    color: rgba(255, 252, 255, 0.45);
    font-size: 11px;
  }

  &__actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 20px;
  }

  &__btn {
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 999px;
    padding: 9px 16px;
    background: transparent;
    color: #fffcff;
    font: inherit;
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;

    &--primary {
      border-color: #b08d57;
      background: #b08d57;
      color: #0b1b2b;
    }

    &:disabled {
      opacity: 0.6;
      cursor: default;
    }
  }
}
</style>
