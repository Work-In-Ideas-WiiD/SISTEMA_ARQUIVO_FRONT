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

/* Figma mobile: laterais 18px, fundo #212121 em tela cheia */
@media (max-width: 768px) {
  .arquivos-shell.dashboard_padding {
    min-height: 100%;
    min-height: 100dvh;
    padding-top: 20px;
    padding-left: 18px;
    padding-right: 18px;
    padding-bottom: 106px;
    background-color: #212121;
    box-sizing: border-box;
  }
}
</style>
