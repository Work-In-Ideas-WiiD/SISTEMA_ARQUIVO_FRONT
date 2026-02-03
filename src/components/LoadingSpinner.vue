<script setup lang="ts">
</script>

<template>
  <div class="spinner">
    <svg class="rotating" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M21 12a9 9 0 11-6.219-8.56" />
    </svg>
  </div>
</template>

<style lang="scss" scoped>
.spinner {
  display: flex;
  align-items: center;
  justify-content: center;

  .rotating {
    animation: rotate 1s linear infinite;
    color: var(--color-gray-500);
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
