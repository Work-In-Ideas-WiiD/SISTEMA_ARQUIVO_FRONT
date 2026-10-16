<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'
import { getEmpresaConta, putEmpresaContaDetalhe } from '@/services/http/empresas-conta'
import { NOME_EMPRESA_MAX } from '@/services/http/empresa-identidade'
import { getApiErrorMessage } from '@/utils/apiError'
import { maskCep, maskNumeroEndereco, maskUf, isValidCep } from '@/utils/formatCep'
import { useBuscaCep } from '@/composables/useBuscaCep'
import { maskCpf, maskCnpj, isValidOptionalCnpj } from '@/utils/formatCpfCnpj'
import { maskPhone } from '@/utils/formatPhone'
import { useEmpresaIdentidade } from '@/composables/useEmpresaIdentidade'

const router = useRouter()
const route = useRoute()
const toast = useToast()
const { carregar: recarregarIdentidade } = useEmpresaIdentidade()

const nome = ref('')
const cpf = ref('')
const nomeEmpresa = ref('')
const cnpj = ref('')
const email = ref('')
const contato = ref('')
const endereco = ref('')
const numero = ref('')
const bairro = ref('')
const cidade = ref('')
const estado = ref('')
const complemento = ref('')
const cep = ref('')
const principal = ref(false)
const { marcarCarregado } = useBuscaCep(cep, { endereco, bairro, cidade, estado, complemento })
const fetching = ref(false)
const loading = ref(true)

watch(cep, (v) => {
  const masked = maskCep(v)
  if (masked !== v) cep.value = masked
})
watch(numero, (v) => {
  const masked = maskNumeroEndereco(v)
  if (masked !== v) numero.value = masked
})
watch(estado, (v) => {
  const masked = maskUf(v)
  if (masked !== v) estado.value = masked
})
watch(cpf, (v) => {
  const masked = maskCpf(v)
  if (masked !== v) cpf.value = masked
})
watch(cnpj, (v) => {
  const masked = maskCnpj(v)
  if (masked !== v) cnpj.value = masked
})
watch(contato, (v) => {
  const masked = maskPhone(v)
  if (masked !== v) contato.value = masked
})

const empresaId = route.params.id as string

onMounted(async () => {
  try {
    const { data } = await getEmpresaConta(empresaId)
    principal.value = data.principal
    nome.value = data.nome_pessoa || ''
    cpf.value = data.cpf ? maskCpf(data.cpf) : ''
    nomeEmpresa.value = data.nome_empresa || data.nome || ''
    cnpj.value = data.cnpj ? maskCnpj(data.cnpj) : ''
    email.value = data.email || ''
    contato.value = data.contato ? maskPhone(data.contato) : ''
    if (data.endereco) {
      endereco.value = data.endereco.rua || ''
      numero.value = data.endereco.numero != null ? String(data.endereco.numero) : ''
      bairro.value = data.endereco.bairro || ''
      cidade.value = data.endereco.cidade || ''
      estado.value = data.endereco.estado || ''
      complemento.value = data.endereco.complemento || ''
      cep.value = data.endereco.cep ? maskCep(data.endereco.cep) : ''
      marcarCarregado(cep.value)
    }
  } catch (error) {
    toast.error(getApiErrorMessage(error, 'Erro ao carregar empresa'))
    router.push('/dashboard/minhas-empresas')
  } finally {
    loading.value = false
  }
})

async function handleSubmit() {
  if (fetching.value) return
  if (!nomeEmpresa.value.trim()) {
    toast.error('Informe o nome da empresa.')
    return
  }
  if (!isValidOptionalCnpj(cnpj.value)) {
    toast.error('CNPJ inválido.')
    return
  }
  const cpfDigits = cpf.value.replace(/\D/g, '')
  if (cpfDigits && cpfDigits.length !== 11) {
    toast.error('CPF inválido.')
    return
  }
  const contatoDigits = contato.value.replace(/\D/g, '')
  if (contatoDigits && (contatoDigits.length < 10 || contatoDigits.length > 11)) {
    toast.error('Contato inválido.')
    return
  }
  if (cep.value && !isValidCep(cep.value)) {
    toast.error('CEP inválido. Use o formato 00000-000.')
    return
  }

  try {
    fetching.value = true
    await putEmpresaContaDetalhe(empresaId, {
      nome: nome.value.trim(),
      nome_empresa: nomeEmpresa.value.trim(),
      email: email.value.trim(),
      cpf: cpfDigits || null,
      cnpj: cnpj.value.replace(/\D/g, '') || null,
      contato: contatoDigits || null,
      endereco: {
        rua: endereco.value,
        numero: numero.value,
        bairro: bairro.value,
        cidade: cidade.value,
        estado: estado.value,
        cep: cep.value.replace(/\D/g, ''),
        complemento: complemento.value || undefined
      }
    })
    if (principal.value) void recarregarIdentidade(true)
    toast.success('Empresa atualizada')
    router.push('/dashboard/minhas-empresas')
  } catch (error) {
    toast.error(getApiErrorMessage(error, 'Erro ao atualizar empresa'))
  } finally {
    fetching.value = false
  }
}
</script>

<template>
  <section class="new_form dashboard_padding">
    <div class="page_title">
      <button class="back_btn" type="button" aria-label="Voltar" @click="router.push('/dashboard/minhas-empresas')">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
        </svg>
      </button>
      <h2 class="dashboard_title">EDITAR EMPRESA</h2>
    </div>

    <div v-if="loading" class="loading_container"><p>Carregando...</p></div>

    <div v-else class="form_wrapper">
      <form @submit.prevent="handleSubmit">
        <div class="input_row">
          <div class="form_group flex_3">
            <label>Nome</label>
            <input v-model="nome" maxlength="255" type="text" />
          </div>
          <div class="form_group flex_1">
            <label>CPF</label>
            <input v-model="cpf" maxlength="14" inputmode="numeric" type="text" placeholder="000.000.000-00" />
          </div>
        </div>

        <div class="input_row">
          <div class="form_group flex_3">
            <label>Nome da empresa*</label>
            <input v-model="nomeEmpresa" :maxlength="NOME_EMPRESA_MAX" type="text" />
          </div>
          <div class="form_group flex_1">
            <label>CNPJ</label>
            <input v-model="cnpj" maxlength="18" inputmode="numeric" type="text" placeholder="00.000.000/0000-00" />
          </div>
        </div>

        <div class="input_row">
          <div class="form_group flex_1">
            <label>E-mail</label>
            <input v-model="email" maxlength="255" type="email" />
          </div>
          <div class="form_group flex_1">
            <label>Contato</label>
            <input v-model="contato" maxlength="15" inputmode="tel" type="text" placeholder="(00) 00000-0000" />
          </div>
        </div>

        <div class="input_row">
          <div class="form_group flex_1">
            <label>CEP</label>
            <input v-model="cep" maxlength="9" inputmode="numeric" autocomplete="postal-code" type="text" placeholder="00000-000" />
          </div>
          <div class="form_group flex_3">
            <label>Endereço</label>
            <input v-model="endereco" maxlength="255" type="text" />
          </div>
          <div class="form_group flex_1">
            <label>Número</label>
            <input v-model="numero" maxlength="6" inputmode="numeric" type="text" />
          </div>
        </div>

        <div class="input_row">
          <div class="form_group flex_1">
            <label>Bairro</label>
            <input v-model="bairro" maxlength="255" type="text" />
          </div>
          <div class="form_group flex_1">
            <label>Cidade</label>
            <input v-model="cidade" maxlength="255" type="text" />
          </div>
          <div class="form_group flex_1">
            <label>Estado</label>
            <input v-model="estado" maxlength="2" autocomplete="address-level1" type="text" />
          </div>
        </div>

        <div class="form_group">
          <label>Complemento</label>
          <input v-model="complemento" maxlength="255" type="text" />
        </div>

        <div class="btn_container">
          <button type="submit" class="btn_salvar" :disabled="fetching">
            {{ fetching ? 'Salvando…' : 'SALVAR ALTERAÇÕES' }}
          </button>
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

  .loading_container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 200px;

    p { color: #666; font-size: 16px; }
  }

  .form_wrapper {
    background-color: var(--night-surface, #132438);
    border: 1px solid var(--night-surface-border, rgba(176, 141, 87, 0.18));
    border-radius: var(--night-radius, 20px);
    padding: 45px 50px;
    max-width: 1050px;

    @media (max-width: 900px) { padding: 20px 13px; }

    form {
      display: flex;
      flex-direction: column;
      gap: 29px;
      @media (max-width: 900px) { gap: 10px; }
    }

    .input_row {
      display: flex;
      gap: 37px;
      @media (max-width: 900px) { flex-direction: column; gap: 10px; }
    }

    .form_group {
      display: flex;
      flex-direction: column;
      gap: 8px;
      &.flex_1 { flex: 1; }
      &.flex_3 { flex: 3; }

      label {
        font-family: var(--night-font, 'Inter', sans-serif);
        font-size: 0.875rem;
        font-weight: 700;
        color: var(--night-gray, #f7f7f7);
        opacity: 0.8;
        text-transform: uppercase;
      }

      input {
        height: 51px;
        border: 1px solid rgba(255, 255, 255, 0.12);
        border-radius: 30px;
        padding: 0 20px;
        font-family: var(--night-font, 'Inter', sans-serif);
        font-size: 0.938rem;
        color: #ffffff;
        outline: none;
        background: rgba(255, 255, 255, 0.06);

        &:focus {
          border-color: #B08D57;
          box-shadow: 0 0 0 2px rgba(176, 141, 87, 0.2);
        }

        &::placeholder { color: rgba(255, 255, 255, 0.5); }
      }
    }

    .btn_container { margin-top: 20px; display: flex; justify-content: center; }

    .btn_salvar {
      min-width: 295px;
      height: 46px;
      padding: 0 28px;
      border: none;
      border-radius: 30px;
      background: var(--night-gold, #B08D57);
      color: #ffffff;
      font-weight: 700;
      text-transform: uppercase;
      cursor: pointer;

      &:disabled { opacity: 0.7; cursor: wait; }
    }
  }
}
</style>
