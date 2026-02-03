<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <main class="main">
    <RouterView />
  </main>
</template>

<style lang="scss" scoped>
.main {
  min-height: 100vh;
  background-color: var(--color-blue-700);
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
