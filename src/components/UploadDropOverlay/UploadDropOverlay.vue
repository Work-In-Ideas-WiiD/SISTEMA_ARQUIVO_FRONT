<script setup lang="ts">
defineProps<{
  visible: boolean
}>()
</script>

<template>
  <Teleport to="body">
    <div v-if="visible" class="drop_overlay" aria-live="polite">
      <div class="drop_overlay__content">
        <svg
          class="drop_overlay__icon"
          width="56"
          height="56"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11zM8 15.01l1.41 1.41L11 14.84V19h2v-4.16l1.59 1.59L16 15.01 12.01 11 8 15.01z"
          />
        </svg>
        <p class="drop_overlay__text">Solte seu arquivo aqui</p>
      </div>
    </div>
  </Teleport>
</template>

<style lang="scss" scoped>
.drop_overlay {
  position: fixed;
  inset: 0;
  z-index: 9998;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(30, 63, 73, 0.72);
  backdrop-filter: blur(2px);
  pointer-events: all;

  &__content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    padding: 40px 48px;
    border: 2px dashed var(--color-orange-500);
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.96);
    color: var(--color-blue-700);
    max-width: min(90vw, 420px);
    text-align: center;
  }

  &__icon {
    color: var(--color-orange-500);
  }

  &__text {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
  }
}
</style>
