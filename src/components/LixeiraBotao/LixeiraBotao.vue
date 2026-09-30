<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import iconLixeira from '@/assets/imgs/arquivos/lixeira-dourada.svg'

const props = defineProps<{ empresaId?: string | null }>()

const router = useRouter()
const authStore = useAuthStore()

/** Só quem pode enviar arquivos pode excluir e ver a lixeira. */
const visivel = computed(() => authStore.userRole === 'administrador' || authStore.userRole === 'empresa')

function abrir() {
  router.push({
    name: 'arquivos-lixeira',
    query: props.empresaId ? { empresa: props.empresaId } : {}
  })
}
</script>

<template>
  <button
    v-if="visivel"
    type="button"
    class="lixeira-btn"
    title="Lixeira"
    aria-label="Abrir a lixeira"
    @click="abrir"
  >
    <img :src="iconLixeira" width="20" height="20" alt="" />
  </button>
</template>

<style lang="scss" scoped>
.lixeira-btn {
  flex-shrink: 0;
  margin-left: auto;
  width: 40px;
  height: 40px;
  padding: 0;
  display: grid;
  place-items: center;
  border-radius: 12px;
  border: 1px solid rgba(176, 141, 87, 0.45);
  background: rgba(176, 141, 87, 0.1);
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease;

  &:hover,
  &:focus-visible {
    background: rgba(176, 141, 87, 0.25);
    border-color: #b08d57;
    outline: none;
  }
}
</style>
