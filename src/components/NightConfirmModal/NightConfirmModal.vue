<script setup lang="ts">
defineProps<{
  open: boolean
  title: string
  body: string
  confirmLabel?: string
  cancelLabel?: string
  danger?: boolean
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="night-confirm"
      @click.self="!loading && emit('cancel')"
    >
      <div class="night-confirm__modal" role="dialog" aria-modal="true">
        <h3>{{ title }}</h3>
        <p>{{ body }}</p>
        <div class="night-confirm__actions">
          <button
            type="button"
            class="night-confirm__btn night-confirm__btn--ghost"
            :disabled="loading"
            @click="emit('cancel')"
          >
            {{ cancelLabel || 'VOLTAR' }}
          </button>
          <button
            type="button"
            class="night-confirm__btn"
            :class="danger ? 'night-confirm__btn--danger' : 'night-confirm__btn--primary'"
            :disabled="loading"
            @click="emit('confirm')"
          >
            {{ loading ? 'AGUARDE…' : confirmLabel || 'CONFIRMAR' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style lang="scss" scoped>
.night-confirm {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 20px;

  &__modal {
    width: 100%;
    max-width: 440px;
    padding: 28px 24px;
    background: rgba(33, 33, 33, 0.98);
    border: 1px solid rgba(121, 121, 121, 0.45);
    border-radius: 24px;
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.4);

    h3 {
      margin: 0 0 10px;
      font-family: 'Source Code Pro', monospace;
      font-size: 18px;
      font-weight: 700;
      color: #f7f7f7;
    }

    p {
      margin: 0 0 24px;
      font-family: 'Source Code Pro', monospace;
      font-size: 14px;
      font-weight: 300;
      line-height: 1.45;
      color: rgba(247, 247, 247, 0.75);
    }
  }

  &__actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    flex-wrap: wrap;
  }

  &__btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 120px;
    height: 46px;
    padding: 0 22px;
    border-radius: 30px;
    font-family: 'Source Code Pro', monospace;
    font-size: 14px;
    font-weight: 700;
    line-height: 1;
    text-transform: uppercase;
    white-space: nowrap;
    cursor: pointer;

    &:disabled {
      opacity: 0.45;
      cursor: not-allowed;
    }

    &--ghost {
      border: 1px solid rgba(247, 247, 247, 0.7);
      background: transparent;
      color: #ffffff;

      &:hover:not(:disabled) {
        opacity: 0.85;
      }
    }

    &--primary {
      border: none;
      background: #ff00ff;
      color: #ffffff;

      &:hover:not(:disabled) {
        opacity: 0.92;
      }
    }

    &--danger {
      border: none;
      background: rgba(220, 53, 69, 0.85);
      color: #ffffff;

      &:hover:not(:disabled) {
        opacity: 0.92;
      }
    }
  }

  @media (max-width: 480px) {
    &__actions {
      flex-direction: column-reverse;

      .night-confirm__btn {
        width: 100%;
      }
    }
  }
}
</style>
