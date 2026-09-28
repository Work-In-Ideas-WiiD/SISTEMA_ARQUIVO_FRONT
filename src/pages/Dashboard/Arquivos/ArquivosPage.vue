<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <main class="page dashboard_padding arquivos-shell">
    <RouterView />
  </main>
</template>

<style lang="scss" scoped>
.page {
  width: 100%;
  max-width: 100%;
  min-width: 0;
  overflow-x: clip;
  box-sizing: border-box;
}

.arquivos-shell {
  display: flex;
  flex-direction: column;
  height: 100vh;
  height: 100dvh;
  min-height: 0;
  overflow: hidden;

  :deep(> *) {
    flex: 1 1 auto;
    min-height: 0;
  }
}

/* Tablet: o layout já reserva o espaço do menu inferior (padding do container). */
@media (min-width: 769px) and (max-width: 900px) {
  .arquivos-shell.dashboard_padding {
    height: auto;
    flex: 1 1 auto;
    padding-top: 20px;
    padding-bottom: 12px;
  }
}

/* Figma mobile: laterais 18px, fundo #212121 em tela cheia */
@media (max-width: 768px) {
  .arquivos-shell.dashboard_padding {
    height: auto;
    min-height: 100%;
    min-height: 100dvh;
    overflow: visible;
    padding-top: 20px;
    padding-left: 18px;
    padding-right: 18px;
    padding-bottom: 106px;
    background-color: #212121;
    box-sizing: border-box;

    :deep(> *) {
      flex: 0 0 auto;
      min-height: 0;
    }
  }
}
</style>
