<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useAuthStore } from '@/stores/auth'
import { getEmpresa } from '@/services/http/empresas'
import {
  abrirArquivoLixeira,
  esvaziarLixeira,
  excluirItemLixeira,
  getLixeira,
  getPastaLixeira,
  restaurarItemLixeira,
  type IItemLixeira
} from '@/services/http/lixeira'
import { getApiErrorMessage } from '@/utils/apiError'
import { formatBytes } from '@/utils/formatBytes'
import { useNightConfirm } from '@/composables/useNightConfirm'
import { useEmpresaIdentidade } from '@/composables/useEmpresaIdentidade'
import NightConfirmModal from '@/components/NightConfirmModal/NightConfirmModal.vue'
import iconChevronLeft from '@/assets/imgs/administradores/icon-chevron-left.svg'
import iconFolder from '@/assets/imgs/arquivos/folder.svg'
import iconFiles from '@/assets/imgs/dashboard/icon-menu-files.svg'
import iconAbrir from '@/assets/imgs/arquivos/menu-abrir.svg'
import iconRestaurar from '@/assets/imgs/arquivos/menu-restaurar.svg'
import iconExcluir from '@/assets/imgs/arquivos/menu-excluir.svg'
import iconLixeira from '@/assets/imgs/arquivos/lixeira-dourada.svg'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const authStore = useAuthStore()
const { carregar: recarregarIdentidade } = useEmpresaIdentidade()
const { open: confirmOpen, options: confirmOptions, askConfirm, onConfirm, onCancel } = useNightConfirm()

const empresaId = computed(() => (route.query.empresa ? String(route.query.empresa) : null))
const pastaId = computed(() => (route.query.pasta ? String(route.query.pasta) : null))

const itens = ref<IItemLixeira[]>([])
const caminho = ref<{ id: string; nome: string }[]>([])
const empresaNome = ref('')
const carregando = ref(true)
const ocupado = ref<string | null>(null)

const dentroDePasta = computed(() => Boolean(pastaId.value))
const totalBytes = computed(() => itens.value.reduce((soma, i) => soma + (i.tamanho_bytes || 0), 0))

function formatarData(iso: string | null): string {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function descricaoTamanho(item: IItemLixeira): string {
  if (item.tipo === 'pasta') {
    const n = item.itens || 0
    return `${formatBytes(item.tamanho_bytes)} · ${n === 1 ? '1 arquivo' : `${n} arquivos`}`
  }
  return formatBytes(item.tamanho_bytes)
}

async function carregarNomeEmpresa() {
  empresaNome.value = ''
  if (!empresaId.value) return
  if (authStore.me?.id === empresaId.value) {
    empresaNome.value = (authStore.me.nome_empresa || authStore.me.nome || '').trim()
    return
  }
  try {
    const { data } = await getEmpresa(empresaId.value)
    empresaNome.value = (data.nome_empresa || data.nome || '').trim()
  } catch {
    empresaNome.value = ''
  }
}

async function carregar() {
  carregando.value = true
  try {
    if (pastaId.value) {
      const { data } = await getPastaLixeira(pastaId.value)
      itens.value = data.itens
      caminho.value = data.caminho
    } else {
      const { data } = await getLixeira(empresaId.value)
      itens.value = data
      caminho.value = []
    }
  } catch (error) {
    toast.error(getApiErrorMessage(error, 'Erro ao carregar a lixeira'))
    itens.value = []
    if (pastaId.value) irPara(null)
  } finally {
    carregando.value = false
  }
}

function irPara(pasta: string | null) {
  router.push({
    name: 'arquivos-lixeira',
    query: {
      ...(empresaId.value ? { empresa: empresaId.value } : {}),
      ...(pasta ? { pasta } : {})
    }
  })
}

function voltar() {
  if (dentroDePasta.value) {
    const anterior = caminho.value[caminho.value.length - 2]
    irPara(anterior?.id || null)
    return
  }
  if (empresaId.value) {
    router.push({ name: 'arquivos-empresa', params: { empresaId: empresaId.value } })
    return
  }
  router.push('/dashboard/arquivos')
}

async function abrir(item: IItemLixeira) {
  if (item.tipo === 'pasta') {
    irPara(item.id)
    return
  }
  const aba = window.open('', '_blank')
  try {
    const { data } = await abrirArquivoLixeira(item.id)
    if (aba) aba.location.href = data.url
    else window.open(data.url)
  } catch (error) {
    aba?.close()
    toast.error(getApiErrorMessage(error, 'Não foi possível abrir o arquivo'))
  }
}

async function restaurar(item: IItemLixeira) {
  ocupado.value = item.id
  try {
    await restaurarItemLixeira(item.tipo, item.id)
    toast.success(item.tipo === 'pasta' ? 'Pasta restaurada' : 'Arquivo restaurado')
    await carregar()
  } catch (error) {
    toast.error(getApiErrorMessage(error, 'Erro ao restaurar'))
  } finally {
    ocupado.value = null
  }
}

async function excluir(item: IItemLixeira) {
  const pasta = item.tipo === 'pasta'
  const ok = await askConfirm({
    title: pasta ? 'Excluir pasta definitivamente' : 'Excluir arquivo definitivamente',
    body: pasta
      ? `"${item.nome}" e tudo o que está dentro dela serão apagados para sempre. Não será possível recuperar.`
      : `"${item.nome}" será apagado para sempre. Não será possível recuperar.`,
    confirmLabel: 'EXCLUIR DEFINITIVAMENTE',
    danger: true
  })
  if (!ok) return
  ocupado.value = item.id
  try {
    await excluirItemLixeira(item.tipo, item.id)
    toast.success(pasta ? 'Pasta excluída definitivamente' : 'Arquivo excluído definitivamente')
    await carregar()
    void recarregarIdentidade(true)
  } catch (error) {
    toast.error(getApiErrorMessage(error, 'Erro ao excluir'))
  } finally {
    ocupado.value = null
  }
}

async function esvaziar() {
  const ok = await askConfirm({
    title: 'Esvaziar lixeira',
    body: `Todos os itens da lixeira (${formatBytes(totalBytes.value)}) serão apagados para sempre. Não será possível recuperar.`,
    confirmLabel: 'ESVAZIAR',
    danger: true
  })
  if (!ok) return
  ocupado.value = 'todos'
  try {
    const { data } = await esvaziarLixeira(empresaId.value)
    toast.success(`Lixeira esvaziada. ${formatBytes(data.bytes)} liberados.`)
    await carregar()
    void recarregarIdentidade(true)
  } catch (error) {
    toast.error(getApiErrorMessage(error, 'Erro ao esvaziar a lixeira'))
  } finally {
    ocupado.value = null
  }
}

watch(empresaId, () => void carregarNomeEmpresa(), { immediate: true })
watch([empresaId, pastaId], () => void carregar(), { immediate: true })
</script>

<template>
  <section class="lixeira">
    <div class="lixeira__heading">
      <button type="button" class="lixeira__back" aria-label="Voltar" @click="voltar">
        <img :src="iconChevronLeft" width="24" height="24" alt="" />
      </button>
      <nav class="lixeira__crumb" aria-label="Navegação">
        <button type="button" class="lixeira__crumb-link" @click="router.push('/dashboard/arquivos')">
          Empresas
        </button>
        <template v-if="empresaId && empresaNome">
          <span class="lixeira__crumb-sep">›</span>
          <button
            type="button"
            class="lixeira__crumb-link"
            @click="router.push({ name: 'arquivos-empresa', params: { empresaId } })"
          >
            {{ empresaNome }}
          </button>
        </template>
        <span class="lixeira__crumb-sep">›</span>
        <button
          type="button"
          class="lixeira__crumb-link"
          :class="{ 'is-current': !dentroDePasta }"
          @click="irPara(null)"
        >
          Lixeira
        </button>
        <template v-for="(p, idx) in caminho" :key="p.id">
          <span class="lixeira__crumb-sep">›</span>
          <button
            type="button"
            class="lixeira__crumb-link"
            :class="{ 'is-current': idx === caminho.length - 1 }"
            @click="irPara(p.id)"
          >
            {{ p.nome }}
          </button>
        </template>
      </nav>
    </div>

    <div class="lixeira__panel">
      <div class="lixeira__panel-head">
        <div class="lixeira__titulo">
          <img :src="iconLixeira" width="26" height="26" alt="" />
          <div>
            <h3>{{ dentroDePasta ? caminho[caminho.length - 1]?.nome || 'Pasta' : 'Lixeira' }}</h3>
            <p v-if="dentroDePasta">Para restaurar ou excluir, use as opções da pasta na lixeira.</p>
            <p v-else-if="itens.length">
              {{ itens.length === 1 ? '1 item' : `${itens.length} itens` }} · {{ formatBytes(totalBytes) }}.
              Os itens da lixeira continuam ocupando espaço até serem excluídos definitivamente.
            </p>
          </div>
        </div>
        <button
          v-if="!dentroDePasta && itens.length"
          type="button"
          class="lixeira__esvaziar"
          :disabled="ocupado !== null"
          @click="esvaziar"
        >
          <img :src="iconExcluir" width="18" height="18" alt="" />
          <span>{{ ocupado === 'todos' ? 'Esvaziando…' : 'Esvaziar lixeira' }}</span>
        </button>
      </div>

      <p v-if="carregando" class="lixeira__status">Carregando…</p>
      <p v-else-if="!itens.length" class="lixeira__status">
        {{ dentroDePasta ? 'Esta pasta está vazia.' : 'A lixeira está vazia.' }}
      </p>

      <div v-else class="lixeira__scroll">
        <table class="lixeira__tabela">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Local original</th>
              <th>Excluído por</th>
              <th>Excluído em</th>
              <th>Tamanho</th>
              <th class="lixeira__col-acoes">Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in itens" :key="item.tipo + item.id">
              <td data-label="Nome">
                <button type="button" class="lixeira__nome" :title="item.nome" @click="abrir(item)">
                  <span class="lixeira__icone">
                    <img v-if="item.tipo === 'pasta'" :src="iconFolder" width="22" height="22" alt="" />
                    <img v-else :src="iconFiles" width="15" height="19" alt="" />
                  </span>
                  <span class="lixeira__nome-texto">{{ item.nome }}</span>
                  <span v-if="item.extensao" class="lixeira__ext">{{ item.extensao }}</span>
                </button>
              </td>
              <td data-label="Local original" class="lixeira__local" :title="item.local">{{ item.local }}</td>
              <td data-label="Excluído por">{{ item.excluido_nome || '—' }}</td>
              <td data-label="Excluído em" class="lixeira__nowrap">{{ formatarData(item.excluido_em) }}</td>
              <td data-label="Tamanho" class="lixeira__nowrap">{{ descricaoTamanho(item) }}</td>
              <td class="lixeira__col-acoes">
                <div class="lixeira__acoes">
                  <button
                    type="button"
                    class="lixeira__acao"
                    :title="item.tipo === 'pasta' ? 'Abrir pasta' : 'Abrir arquivo'"
                    :aria-label="`Abrir ${item.nome}`"
                    @click="abrir(item)"
                  >
                    <img :src="iconAbrir" width="18" height="18" alt="" />
                  </button>
                  <template v-if="!dentroDePasta">
                    <button
                      type="button"
                      class="lixeira__acao"
                      title="Restaurar"
                      :aria-label="`Restaurar ${item.nome}`"
                      :disabled="ocupado !== null"
                      @click="restaurar(item)"
                    >
                      <img :src="iconRestaurar" width="18" height="18" alt="" />
                    </button>
                    <button
                      type="button"
                      class="lixeira__acao lixeira__acao--perigo"
                      title="Excluir definitivamente"
                      :aria-label="`Excluir ${item.nome} definitivamente`"
                      :disabled="ocupado !== null"
                      @click="excluir(item)"
                    >
                      <img :src="iconExcluir" width="18" height="18" alt="" />
                    </button>
                  </template>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
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
  </section>
</template>

<style lang="scss" scoped>
.lixeira {
  width: 100%;
  min-width: 0;
  min-height: 0;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 18px;
  overflow: hidden;
  font-family: var(--night-font, 'Inter', sans-serif);
  color: #fffcff;
}

.lixeira__heading {
  display: flex;
  align-items: center;
  gap: 1px;
  min-width: 0;
  flex-shrink: 0;
}

.lixeira__back {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  padding: 0;
  border: none;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.lixeira__crumb {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  min-width: 0;
  font-size: 14px;
}

.lixeira__crumb-sep {
  opacity: 0.5;
}

.lixeira__crumb-link {
  border: 0;
  padding: 0;
  background: transparent;
  color: #fffcff;
  font: inherit;
  cursor: pointer;
  opacity: 0.75;

  &:hover {
    opacity: 1;
    text-decoration: underline;
  }

  &.is-current {
    opacity: 1;
    font-weight: 700;
  }
}

.lixeira__panel {
  flex: 1 1 auto;
  min-height: 0;
  display: flex;
  flex-direction: column;
  background: var(--night-surface, #132438);
  border: 1px solid var(--night-surface-border, rgba(176, 141, 87, 0.18));
  border-radius: var(--night-radius, 20px);
  padding: 24px 28px 28px;
  box-sizing: border-box;
}

.lixeira__panel-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 18px;
}

.lixeira__titulo {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  min-width: 0;

  h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 700;
    overflow-wrap: anywhere;
  }

  p {
    margin: 4px 0 0;
    color: rgba(255, 252, 255, 0.6);
    font-size: 13px;
    line-height: 1.4;
  }
}

.lixeira__esvaziar {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  border-radius: 999px;
  border: 1px solid rgba(229, 115, 115, 0.6);
  background: rgba(229, 115, 115, 0.12);
  color: #ffb4b4;
  font: inherit;
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  cursor: pointer;

  &:hover:not(:disabled) {
    background: rgba(229, 115, 115, 0.24);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.lixeira__status {
  margin: 12px 0;
  color: rgba(255, 252, 255, 0.65);
  font-size: 14px;
}

.lixeira__scroll {
  flex: 1 1 auto;
  min-height: 0;
  overflow: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(176, 141, 87, 0.45) transparent;
}

.lixeira__tabela {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;

  th {
    position: sticky;
    top: 0;
    z-index: 1;
    padding: 10px 12px;
    background: var(--night-surface, #132438);
    color: #b08d57;
    font-size: 12px;
    font-weight: 700;
    text-align: left;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  td {
    padding: 10px 12px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    vertical-align: middle;
  }

  tbody tr:hover {
    background: rgba(255, 255, 255, 0.03);
  }
}

.lixeira__nome {
  display: flex;
  align-items: center;
  gap: 10px;
  max-width: 320px;
  padding: 0;
  border: 0;
  background: transparent;
  color: #fffcff;
  font: inherit;
  font-weight: 600;
  text-align: left;
  cursor: pointer;

  &:hover .lixeira__nome-texto {
    text-decoration: underline;
  }
}

.lixeira__icone {
  flex-shrink: 0;
  width: 34px;
  height: 34px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.06);
  display: grid;
  place-items: center;
}

.lixeira__nome-texto {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.lixeira__ext {
  flex-shrink: 0;
  padding: 1px 6px;
  border-radius: 4px;
  background: rgba(176, 141, 87, 0.2);
  color: #d9b77e;
  font-size: 10px;
  font-weight: 700;
}

.lixeira__local {
  max-width: 280px;
  color: rgba(255, 252, 255, 0.75);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.lixeira__nowrap {
  white-space: nowrap;
}

.lixeira__col-acoes {
  width: 140px;
  text-align: right;
}

.lixeira__acoes {
  display: flex;
  justify-content: flex-end;
  gap: 6px;
}

.lixeira__acao {
  width: 34px;
  height: 34px;
  padding: 0;
  display: grid;
  place-items: center;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: transparent;
  cursor: pointer;

  &:hover:not(:disabled) {
    background: rgba(176, 141, 87, 0.25);
    border-color: #b08d57;
  }

  &--perigo:hover:not(:disabled) {
    background: rgba(229, 115, 115, 0.25);
    border-color: #e57373;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

@media (max-width: 900px) {
  .lixeira__panel {
    padding: 18px 16px;
  }

  .lixeira__tabela {
    thead {
      display: none;
    }

    tr {
      display: block;
      padding: 10px 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }

    td {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      padding: 4px 0;
      border: 0;

      &[data-label]:not([data-label='Nome'])::before {
        content: attr(data-label);
        color: #b08d57;
        font-size: 12px;
        font-weight: 700;
      }
    }

    .lixeira__local {
      max-width: none;
      white-space: normal;
      text-align: right;
    }

    .lixeira__col-acoes {
      width: auto;
      justify-content: flex-end;
    }
  }
}
</style>
