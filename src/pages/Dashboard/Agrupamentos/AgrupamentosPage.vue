<script setup lang="ts">
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'

const route = useRoute()
const isExplorer = computed(() => route.name === 'agrupamentos-table')
</script>

<template>
  <main class="page dashboard_padding" :class="{ 'agrup-shell': isExplorer }">
    <RouterView />
  </main>
</template>

<style lang="scss" scoped>
.page {
  width: 100%;
  max-width: 100%;
  min-width: 0;
  box-sizing: border-box;
}

.agrup-shell {
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

@media (max-width: 1100px) {
  .agrup-shell {
    height: auto;
    min-height: 100dvh;
    overflow: visible;
  }
}
</style>
