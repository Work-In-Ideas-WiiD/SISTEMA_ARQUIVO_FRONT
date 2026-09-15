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
  font-family: var(--night-font, 'Inter', sans-serif);
  color: #f7f7f7;

  .back-link {
    color: #B08D57;
    text-decoration: underline;
    transition: color 0.2s ease;

    &:hover {
      color: #C29F68;
    }
  }
}
</style>
