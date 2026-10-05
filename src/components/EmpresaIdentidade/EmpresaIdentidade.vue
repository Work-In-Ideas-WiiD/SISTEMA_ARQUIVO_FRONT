<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useAuthStore } from '@/stores/auth'
import { useEmpresaIdentidade } from '@/composables/useEmpresaIdentidade'
import { NOME_EMPRESA_MAX, postEmpresaIdentidade } from '@/services/http/empresa-identidade'
import { getApiErrorMessage } from '@/utils/apiError'
import { formatBytes } from '@/utils/formatBytes'

withDefaults(defineProps<{ compact?: boolean }>(), { compact: false })

const toast = useToast()
const authStore = useAuthStore()
const { identidade, logoUrl, atualizar } = useEmpresaIdentidade()

const logoFalhou = ref(false)
watch(logoUrl, () => (logoFalhou.value = false))

const iniciais = computed(() => {
  const partes = (identidade.value?.nome || '').trim().split(/\s+/).filter(Boolean)
  return ((partes[0]?.[0] || '') + (partes.length > 1 ? partes[partes.length - 1][0] : '')).toUpperCase() || '?'
})

const disco = computed(() => {
  const a = identidade.value?.armazenamento
  if (!a) return null
  const limite = a.limite_bytes || 0
  const pct = limite ? Math.min(100, (a.usado_bytes / limite) * 100) : 0
  return {
    texto: limite ? `${formatBytes(a.usado_bytes)} de ${formatBytes(limite)}` : `${formatBytes(a.usado_bytes)} usados`,
    pct,
    nivel: pct >= 90 ? 'critico' : pct >= 75 ? 'alerta' : 'ok'
  }
})

const teste = computed(() => {
  const dias = identidade.value?.teste_gratis?.dias_restantes
  if (!dias) return null
  return dias === 1 ? 'último dia' : `${dias} dias`
})

const codigo = computed(() => identidade.value?.codigo || identidade.value?.id.slice(0, 6).toUpperCase() || '')

async function copiarId() {
  if (!codigo.value) return
  try {
    await navigator.clipboard.writeText(codigo.value)
    toast.success('ID da empresa copiado')
  } catch {
    toast.error('Não foi possível copiar o ID')
  }
}

const editando = ref(false)
const salvando = ref(false)
const nome = ref('')
const novaFoto = ref<File | null>(null)
const removerFoto = ref(false)
const preview = ref<string | null>(null)
const inputFoto = ref<HTMLInputElement | null>(null)

function limparPreview() {
  if (preview.value) URL.revokeObjectURL(preview.value)
  preview.value = null
}

function abrirEdicao() {
  if (!identidade.value?.pode_editar) return
  nome.value = identidade.value.nome.slice(0, NOME_EMPRESA_MAX)
  novaFoto.value = null
  removerFoto.value = false
  limparPreview()
  editando.value = true
}

function fecharEdicao() {
  if (salvando.value) return
  editando.value = false
  limparPreview()
}

function escolherFoto(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  ;(e.target as HTMLInputElement).value = ''
  if (!file) return
  if (!/^image\/(jpeg|png|webp)$/.test(file.type)) {
    toast.error('A foto deve ser JPG, PNG ou WEBP.')
    return
  }
  if (file.size > 2 * 1024 * 1024) {
    toast.error('A foto deve ter no máximo 2 MB.')
    return
  }
  limparPreview()
  novaFoto.value = file
  removerFoto.value = false
  preview.value = URL.createObjectURL(file)
}

function tirarFoto() {
  limparPreview()
  novaFoto.value = null
  removerFoto.value = true
}

const fotoNoModal = computed(() => {
  if (preview.value) return preview.value
  if (removerFoto.value || logoFalhou.value) return null
  return logoUrl.value
})

async function salvar() {
  const nomeLimpo = nome.value.trim()
  if (!nomeLimpo) {
    toast.error('Informe o nome da empresa.')
    return
  }
  salvando.value = true
  try {
    const { data } = await postEmpresaIdentidade({
      nome: nomeLimpo,
      logo: novaFoto.value,
      remover_logo: removerFoto.value
    })
    atualizar(data)
    if (authStore.me.id === data.id) authStore.me.nome_empresa = data.nome
    toast.success('Identificação da empresa atualizada')
    salvando.value = false
    fecharEdicao()
  } catch (error) {
    toast.error(getApiErrorMessage(error, 'Erro ao salvar a identificação da empresa'))
  } finally {
    salvando.value = false
  }
}

onBeforeUnmount(limparPreview)
</script>

<template>
  <div v-if="identidade" class="emp-id" :class="{ 'emp-id--compact': compact }">
    <button
      type="button"
      class="emp-id__foto"
      :class="{ 'is-editavel': identidade.pode_editar }"
      :disabled="!identidade.pode_editar"
      :title="identidade.pode_editar ? 'Alterar foto e nome da empresa' : identidade.nome"
      @click="abrirEdicao"
    >
      <img v-if="logoUrl && !logoFalhou" :src="logoUrl" alt="" @error="logoFalhou = true" />
      <span v-else>{{ iniciais }}</span>
    </button>

    <div class="emp-id__texto">
      <p class="emp-id__nome" :title="identidade.nome">{{ identidade.nome }}</p>
      <button type="button" class="emp-id__codigo" title="Copiar ID da empresa" @click="copiarId">
        ID: <span>{{ codigo }}</span>
      </button>
      <div
        v-if="disco && !compact"
        class="emp-id__disco"
        :class="`is-${disco.nivel}`"
        :title="`Espaço ocupado no plano: ${disco.texto}`"
      >
        <div
          class="emp-id__disco-barra"
          role="progressbar"
          :aria-valuenow="Math.round(disco.pct)"
          aria-valuemin="0"
          aria-valuemax="100"
          aria-label="Espaço ocupado no plano"
        >
          <span :style="{ width: `${Math.max(disco.pct, disco.pct > 0 ? 2 : 0)}%` }" />
        </div>
        <span class="emp-id__disco-texto">{{ disco.texto }}</span>
      </div>
    </div>

    <button
      v-if="identidade.pode_editar"
      type="button"
      class="emp-id__editar"
      aria-label="Editar identificação da empresa"
      title="Editar foto e nome"
      @click="abrirEdicao"
    >
      <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
        <path
          fill="currentColor"
          d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zm17.71-10.21a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
        />
      </svg>
    </button>

    <div v-if="teste && !compact" class="emp-id__teste">
      <span>Teste grátis: {{ teste }}</span>
      <RouterLink to="/contratar">Contratar</RouterLink>
    </div>

    <Teleport to="body">
      <div v-if="editando" class="emp-id-overlay" @click.self="fecharEdicao">
        <div class="emp-id-modal" role="dialog" aria-modal="true" aria-labelledby="emp-id-modal-title">
          <h3 id="emp-id-modal-title" class="emp-id-modal__title">Identificação da empresa</h3>
          <p class="emp-id-modal__sub">Aparece no menu para todos que acessam a plataforma.</p>

          <div class="emp-id-modal__foto-row">
            <div class="emp-id-modal__foto">
              <img v-if="fotoNoModal" :src="fotoNoModal" alt="" />
              <span v-else>{{ iniciais }}</span>
            </div>
            <div class="emp-id-modal__foto-acoes">
              <button type="button" class="emp-id-modal__btn" :disabled="salvando" @click="inputFoto?.click()">
                {{ fotoNoModal ? 'TROCAR FOTO' : 'ADICIONAR FOTO' }}
              </button>
              <button
                v-if="fotoNoModal"
                type="button"
                class="emp-id-modal__link"
                :disabled="salvando"
                @click="tirarFoto"
              >
                Remover foto
              </button>
              <small>JPG, PNG ou WEBP, até 2 MB.</small>
            </div>
            <input
              ref="inputFoto"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              hidden
              @change="escolherFoto"
            />
          </div>

          <label class="emp-id-modal__label" for="emp-id-nome">NOME DA EMPRESA</label>
          <input
            id="emp-id-nome"
            v-model="nome"
            class="emp-id-modal__input"
            type="text"
            :maxlength="NOME_EMPRESA_MAX"
            :disabled="salvando"
            @keydown.enter.prevent="salvar"
          />
          <small class="emp-id-modal__contador">{{ nome.length }}/{{ NOME_EMPRESA_MAX }}</small>

          <div class="emp-id-modal__actions">
            <button type="button" class="emp-id-modal__btn" :disabled="salvando" @click="fecharEdicao">
              CANCELAR
            </button>
            <button
              type="button"
              class="emp-id-modal__btn emp-id-modal__btn--primary"
              :disabled="salvando"
              @click="salvar"
            >
              {{ salvando ? 'SALVANDO…' : 'SALVAR' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style lang="scss" scoped>
.emp-id {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  margin: 0 var(--sidebar-nav-pad, 40px) 22px;
  padding: 10px 12px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(176, 141, 87, 0.18);
  font-family: 'Inter', sans-serif;
  min-width: 0;
  flex-shrink: 0;

  &--compact {
    margin: 0;
    padding: 0;
    background: none;
    border: 0;
    gap: 10px;

    .emp-id__foto {
      width: 34px;
      height: 34px;
      font-size: 12px;
    }

    .emp-id__nome {
      font-size: 13px;
    }
  }
}

.emp-id__foto {
  flex-shrink: 0;
  width: 46px;
  height: 46px;
  padding: 0;
  border-radius: 50%;
  overflow: hidden;
  border: 1px solid rgba(176, 141, 87, 0.5);
  background: rgba(176, 141, 87, 0.18);
  color: #d9b77e;
  font: inherit;
  font-size: 15px;
  font-weight: 700;
  display: grid;
  place-items: center;
  cursor: default;

  &.is-editavel {
    cursor: pointer;
  }

  &:disabled {
    opacity: 1;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.emp-id__texto {
  min-width: 0;
  flex: 1;
}

.emp-id__nome {
  margin: 0;
  color: #fffcff;
  font-size: 15px;
  font-weight: 700;
  line-height: 1.25;
  overflow: hidden;
  overflow-wrap: anywhere;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.emp-id-modal__contador {
  display: block;
  margin-top: 4px;
  text-align: right;
  color: rgba(255, 252, 255, 0.45);
  font-size: 11px;
}

.emp-id__disco {
  margin-top: 7px;

  &-barra {
    height: 4px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.12);
    overflow: hidden;

    span {
      display: block;
      height: 100%;
      border-radius: inherit;
      background: #b08d57;
      transition: width 0.3s ease;
    }
  }

  &-texto {
    display: block;
    margin-top: 4px;
    color: rgba(255, 252, 255, 0.6);
    font-size: 11px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &.is-alerta .emp-id__disco-barra span {
    background: #e0a84f;
  }

  &.is-critico .emp-id__disco-barra span {
    background: #e57373;
  }
}

.emp-id__teste {
  flex-basis: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding-top: 8px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  font-size: 11px;
  white-space: nowrap;

  span {
    color: #d9b77e;
    font-weight: 600;
  }

  a {
    color: #fffcff;
    font-weight: 600;
    text-decoration: underline;

    &:hover {
      color: #d9b77e;
    }
  }
}

.emp-id__codigo {
  display: flex;
  gap: 4px;
  max-width: 100%;
  margin-top: 2px;
  padding: 0;
  border: 0;
  background: none;
  color: rgba(255, 252, 255, 0.55);
  font: inherit;
  font-size: 11px;
  cursor: copy;
  text-align: left;

  span {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &:hover {
    color: #d9b77e;
  }
}

.emp-id__editar {
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: transparent;
  color: rgba(255, 252, 255, 0.75);
  display: grid;
  place-items: center;
  cursor: pointer;

  &:hover {
    color: #d9b77e;
    border-color: #b08d57;
  }
}

.emp-id-overlay {
  position: fixed;
  inset: 0;
  z-index: 1200;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.emp-id-modal {
  width: min(440px, 100%);
  padding: 24px;
  box-sizing: border-box;
  background: var(--night-surface, #132438);
  border: 1px solid var(--night-surface-border, rgba(176, 141, 87, 0.25));
  border-radius: 16px;
  font-family: var(--night-font, 'Inter', sans-serif);
}

.emp-id-modal__title {
  margin: 0;
  color: #fffcff;
  font-size: 18px;
  font-weight: 700;
}

.emp-id-modal__sub {
  margin: 4px 0 18px;
  color: rgba(255, 252, 255, 0.6);
  font-size: 12px;
}

.emp-id-modal__foto-row {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 18px;
}

.emp-id-modal__foto {
  flex-shrink: 0;
  width: 84px;
  height: 84px;
  border-radius: 50%;
  overflow: hidden;
  border: 1px solid rgba(176, 141, 87, 0.5);
  background: rgba(176, 141, 87, 0.18);
  color: #d9b77e;
  font-size: 26px;
  font-weight: 700;
  display: grid;
  place-items: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.emp-id-modal__foto-acoes {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;

  small {
    color: rgba(255, 252, 255, 0.5);
    font-size: 11px;
  }
}

.emp-id-modal__link {
  padding: 0;
  border: 0;
  background: none;
  color: #e08a8a;
  font: inherit;
  font-size: 12px;
  cursor: pointer;
}

.emp-id-modal__label {
  display: block;
  margin-bottom: 6px;
  color: rgba(255, 252, 255, 0.75);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.04em;
}

.emp-id-modal__input {
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

.emp-id-modal__actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.emp-id-modal__btn {
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
</style>
