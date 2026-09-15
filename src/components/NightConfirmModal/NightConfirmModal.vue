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
    background: #0B1B2B;
    border: 1px solid rgba(176, 141, 87, 0.25);
    border-radius: 20px;
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.5);

    h3 {
      margin: 0 0 10px;
      font-family: 'Inter', sans-serif;
      font-size: 18px;
      font-weight: 700;
      color: #FFFCFF;
    }

    p {
      margin: 0 0 24px;
      font-family: 'Inter', sans-serif;
      font-size: 14px;
      font-weight: 400;
      line-height: 1.5;
      color: rgba(255, 252, 255, 0.75);
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
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    font-weight: 700;
    line-height: 1;
    letter-spacing: 0.02em;
    text-transform: uppercase;
    white-space: nowrap;
    cursor: pointer;
    transition: all 0.2s ease;

    &:disabled {
      opacity: 0.45;
      cursor: not-allowed;
    }

    &--ghost {
      border: 1px solid rgba(255, 252, 255, 0.3);
      background: transparent;
      color: #FFFCFF;

      &:hover:not(:disabled) {
        border-color: rgba(255, 252, 255, 0.6);
        background: rgba(255, 255, 255, 0.05);
      }
    }

    &--primary {
      border: none;
      background: #B08D57;
      color: #ffffff;
      box-shadow: 0 4px 14px rgba(176, 141, 87, 0.25);

      &:hover:not(:disabled) {
        background: #C29F68;
        transform: translateY(-1px);
        box-shadow: 0 6px 18px rgba(176, 141, 87, 0.35);
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
