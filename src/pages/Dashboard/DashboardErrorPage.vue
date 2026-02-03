<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <main class="error-page dashboard_padding">
    <h2 class="dashboard_title">Erro</h2>
    <p>Ocorreu um erro inesperado.</p>
    <RouterLink to="/dashboard/home" class="back-link">
      Voltar para a Home
    </RouterLink>
  </main>
</template>

<style lang="scss" scoped>
.error-page {
  display: flex;
  flex-direction: column;
  gap: 20px;

  .back-link {
    color: var(--color-orange-500);
    text-decoration: underline;
  }
}
</style>
