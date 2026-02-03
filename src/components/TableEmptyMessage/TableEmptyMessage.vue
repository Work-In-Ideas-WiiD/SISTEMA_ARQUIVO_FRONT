<script setup lang="ts">
defineProps<{
  show: boolean
}>()
</script>

<template>
  <div v-if="show" class="container">
    <h2>Não possui registros</h2>
  </div>
</template>

<style lang="scss" scoped>
.container {
  width: 100%;
  min-width: 600px;
  background-color: rgba(207, 198, 188, 0.1);
  text-align: center;

  h2 {
    padding-top: 15px;
    padding-bottom: 15px;
    font-style: normal;
    font-weight: 400;
    font-size: 1rem;
    color: var(--color-blue-700);
  }
}
</style>
