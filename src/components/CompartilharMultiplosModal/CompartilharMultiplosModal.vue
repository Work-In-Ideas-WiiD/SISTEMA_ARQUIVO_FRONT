<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useToast } from 'vue-toastification'
import { postCompartilharArquivo, type IGetArquivosDataRes } from '@/services/http/arquivos'
import { getApiErrorMessage } from '@/utils/apiError'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

type ExpirePreset = '' | '24h' | '7d' | '30d'

interface Resultado {
  id: string
  nome: string
  link?: string
  erro?: string
}

const props = defineProps<{
  open: boolean
  arquivos: IGetArquivosDataRes[]
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const toast = useToast()
const email = ref('')
const expirePreset = ref<ExpirePreset>('')
const loading = ref(false)
const resultados = ref<Resultado[]>([])

const linhas = computed<Resultado[]>(() =>
  resultados.value.length
    ? resultados.value
    : props.arquivos.map((a) => ({ id: a.id, nome: a.descricao }))
)

const presets: { value: ExpirePreset; label: string }[] = [
  { value: '', label: 'Sem prazo' },
  { value: '24h', label: '24 horas' },
  { value: '7d', label: '7 dias' },
  { value: '30d', label: '30 dias' }
]

function resolveExpiresAt(preset: ExpirePreset): string | undefined {
  if (!preset) return undefined
  const d = new Date()
  if (preset === '24h') d.setHours(d.getHours() + 24)
  else if (preset === '7d') d.setDate(d.getDate() + 7)
  else if (preset === '30d') d.setDate(d.getDate() + 30)
  return d.toISOString()
}

async function handleSubmit() {
  if (loading.value) return
  const value = email.value.trim()
  if (!value || !value.includes('@')) {
    toast.error('Informe um e-mail válido')
    return
  }
  loading.value = true
  const expiresAt = resolveExpiresAt(expirePreset.value)
  const out: Resultado[] = []
  for (const arquivo of props.arquivos) {
    try {
      const { data } = await postCompartilharArquivo(arquivo.id, value, expiresAt)
      out.push({ id: arquivo.id, nome: arquivo.descricao, link: data.link })
    } catch (error) {
      out.push({
        id: arquivo.id,
        nome: arquivo.descricao,
        erro: getApiErrorMessage(error, 'Erro ao compartilhar')
      })
    }
  }
  resultados.value = out
  loading.value = false
  const ok = out.filter((r) => r.link).length
  if (ok === out.length) toast.success(`${ok} arquivo(s) compartilhado(s) com ${value}`)
  else if (ok > 0) toast.warning(`${ok} de ${out.length} arquivos compartilhados`)
  else toast.error('Nenhum arquivo foi compartilhado')
}

async function copiarTodos() {
  const texto = resultados.value
    .filter((r) => r.link)
    .map((r) => `${r.nome}: ${r.link}`)
    .join('\n')
  if (!texto) return
  try {
    await navigator.clipboard.writeText(texto)
    toast.success('Links copiados')
  } catch {
    toast.error('Não foi possível copiar os links')
  }
}

function close() {
  if (loading.value) return
  emit('close')
}

watch(
  () => props.open,
  (open) => {
    if (typeof document !== 'undefined') document.body.style.overflow = open ? 'hidden' : ''
    if (!open) return
    email.value = ''
    expirePreset.value = ''
    resultados.value = []
  },
  { immediate: true }
)
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="night-confirm" @click.self="close">
      <div class="night-confirm__modal share-multi" role="dialog" aria-modal="true">
        <h3 class="night-confirm__title">Compartilhar arquivos</h3>
        <p class="share-multi__sub">{{ arquivos.length }} arquivos selecionados</p>

        <ul class="share-multi__files">
          <li v-for="r in linhas" :key="r.id">
            <span class="share-multi__name">{{ r.nome }}</span>
            <small v-if="r.link" class="share-multi__ok">Link enviado</small>
            <small v-else-if="r.erro" class="share-multi__err">{{ r.erro }}</small>
          </li>
        </ul>

        <form v-if="!resultados.length" class="share-multi__form" @submit.prevent="handleSubmit">
          <p class="share-multi__hint">
            Cada arquivo terá seu próprio link, enviado para o mesmo e-mail.
          </p>
          <input
            v-model="email"
            class="share-multi__input"
            type="email"
            placeholder="E-mail do destinatário"
            required
            autocomplete="email"
            :disabled="loading"
          />
          <span class="share-multi__label">Validade do link</span>
          <div class="share-multi__chips" role="group" aria-label="Validade do link">
            <button
              v-for="p in presets"
              :key="p.value"
              type="button"
              class="share-multi__chip"
              :class="{ 'share-multi__chip--active': expirePreset === p.value }"
              :disabled="loading"
              @click="expirePreset = p.value"
            >
              {{ p.label }}
            </button>
          </div>
          <div class="night-confirm__actions">
            <button
              type="button"
              class="night-confirm__btn night-confirm__btn--ghost"
              :disabled="loading"
              @click="close"
            >
              VOLTAR
            </button>
            <button type="submit" class="night-confirm__btn" :disabled="loading">
              <LoadingSpinner v-if="loading" theme="night" />
              <span v-else>COMPARTILHAR</span>
            </button>
          </div>
        </form>

        <div v-else class="night-confirm__actions">
          <button type="button" class="night-confirm__btn night-confirm__btn--ghost" @click="close">
            FECHAR
          </button>
          <button type="button" class="night-confirm__btn" @click="copiarTodos">
            COPIAR LINKS
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style lang="scss" scoped>
.night-confirm {
  position: fixed;
  inset: 0;
  z-index: 1200;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.night-confirm__modal {
  background: var(--night-surface, #132438);
  border: 1px solid var(--night-surface-border, rgba(176, 141, 87, 0.25));
  border-radius: 16px;
  padding: 24px;
  box-sizing: border-box;
}

.night-confirm__title {
  margin: 0;
  color: #fffcff;
  font-size: 18px;
  font-weight: 700;
}

.night-confirm__actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 16px;
}

.night-confirm__btn {
  border: 0;
  border-radius: 999px;
  padding: 10px 18px;
  min-width: 120px;
  background: #b08d57;
  color: #0b1b2b;
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &--ghost {
    background: transparent;
    color: #fffcff;
    border: 1px solid rgba(255, 255, 255, 0.2);
  }
}

.share-multi {
  width: min(480px, 100%);
  max-height: min(88vh, 720px);
  display: flex;
  flex-direction: column;
  font-family: var(--night-font, 'Inter', sans-serif);
}

.share-multi__sub {
  margin: 4px 0 10px;
  color: #b08d57;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.share-multi__files {
  list-style: none;
  margin: 0;
  padding: 8px 12px;
  max-height: 200px;
  overflow-y: auto;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.08);
  scrollbar-width: thin;

  li {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 5px 0;
    font-size: 13px;
    color: #fffcff;
  }
}

.share-multi__name {
  flex: 1 1 auto;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.share-multi__ok {
  color: #7fd8a4;
}

.share-multi__err {
  color: #ff8a8a;
}

.share-multi__form {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 12px;
}

.share-multi__hint {
  margin: 0;
  color: #f7f7f7;
  opacity: 0.7;
  font-size: 12px;
}

.share-multi__input {
  height: 42px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(0, 0, 0, 0.25);
  color: #fffcff;
  padding: 0 12px;
  font-size: 14px;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #b08d57;
  }
}

.share-multi__label {
  margin-top: 4px;
  color: #f7f7f7;
  font-size: 12px;
  opacity: 0.8;
}

.share-multi__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.share-multi__chip {
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  background: transparent;
  color: #fffcff;
  padding: 6px 12px;
  font-size: 12px;
  cursor: pointer;
  font-family: inherit;

  &--active {
    background: rgba(176, 141, 87, 0.2);
    border-color: #b08d57;
    color: #b08d57;
  }
}
</style>
