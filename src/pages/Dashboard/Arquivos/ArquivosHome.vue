<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import EmpresasExplorer from './EmpresasExplorer.vue'
import ArquivosTable from './ArquivosTable.vue'

const authStore = useAuthStore()

const role = computed(() => authStore.userRole)

/** Admin / CLIENTE-ADMIN: grade de empresas. Cliente final: lista de arquivos. */
const mode = computed<'explorer' | 'arquivos' | 'loading'>(() => {
  if (!role.value) return 'loading'
  if (role.value === 'administrador' || role.value === 'empresa') return 'explorer'
  return 'arquivos'
})
</script>

<template>
  <EmpresasExplorer v-if="mode === 'explorer'" />
  <ArquivosTable v-else-if="mode === 'arquivos'" />
  <p v-else class="arquivos-home-loading">Carregando…</p>
</template>

<style scoped>
.arquivos-home-loading {
  margin: 0;
  color: #f7f7f7;
  opacity: 0.7;
  font-family: var(--night-font, 'Inter', sans-serif);
}
</style>
