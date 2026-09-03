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
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(2px);
  pointer-events: all;

  &__content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    padding: 40px 48px;
    border: 2px dashed rgba(255, 0, 255, 0.65);
    border-radius: 24px;
    background: rgba(33, 33, 33, 0.96);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.4);
    color: #f7f7f7;
    max-width: min(90vw, 420px);
    text-align: center;
  }

  &__icon {
    color: #ff00ff;
  }

  &__text {
    margin: 0;
    font-family: 'Source Code Pro', monospace;
    font-size: 1.125rem;
    font-weight: 600;
    color: #f7f7f7;
  }
}
</style>
