<script setup lang="ts">
withDefaults(
  defineProps<{
    theme?: 'default' | 'night'
    size?: 'sm' | 'md' | 'lg'
  }>(),
  {
    theme: 'default',
    size: 'sm'
  }
)
</script>

<template>
  <div
    class="spinner"
    :class="[`spinner--${theme}`, `spinner--${size}`]"
    role="status"
    aria-label="Carregando"
  >
    <div v-if="theme === 'night'" class="spinner__ring" />
    <svg
      v-else
      class="spinner__arc"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      aria-hidden="true"
    >
      <path d="M21 12a9 9 0 11-6.219-8.56" />
    </svg>
  </div>
</template>

<style lang="scss" scoped>
.spinner {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  &__arc {
    animation: rotate 1s linear infinite;
    color: var(--color-gray-500);
  }

  &__ring {
    border-radius: 50%;
    animation: rotate 0.9s linear infinite;
  }

  &--sm &__ring {
    width: 24px;
    height: 24px;
    border: 3px solid rgba(121, 121, 121, 0.3);
    border-top-color: var(--night-pink, #ff00ff);
  }

  &--md &__ring {
    width: 36px;
    height: 36px;
    border: 3px solid rgba(121, 121, 121, 0.3);
    border-top-color: var(--night-pink, #ff00ff);
  }

  &--lg &__ring {
    width: 48px;
    height: 48px;
    border: 4px solid rgba(121, 121, 121, 0.3);
    border-top-color: var(--night-pink, #ff00ff);
  }

  &--default.spinner--sm &__arc {
    width: 24px;
    height: 24px;
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
