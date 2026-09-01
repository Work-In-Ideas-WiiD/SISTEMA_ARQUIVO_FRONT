<script setup lang="ts">
withDefaults(
  defineProps<{
    show: boolean
    theme?: 'default' | 'night'
    message?: string
  }>(),
  {
    theme: 'default',
    message: 'Não possui registros'
  }
)
</script>

<template>
  <div v-if="show" class="table-empty" :class="`table-empty--${theme}`">
    <p class="table-empty__text">{{ message }}</p>
  </div>
</template>

<style lang="scss" scoped>
.table-empty {
  width: 100%;
  min-width: 600px;
  background-color: rgba(207, 198, 188, 0.1);
  text-align: center;

  &__text {
    margin: 0;
    padding: 15px 16px;
    font-style: normal;
    font-weight: 400;
    font-size: 1rem;
    color: var(--color-blue-700);
  }

  &--night {
    min-width: 0;
    background: transparent;
    padding: 8px 38px 24px;
    display: flex;
    justify-content: center;

    .table-empty__text {
      width: 100%;
      max-width: 650px;
      height: 49px;
      padding: 0 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(33, 33, 33, 0.2);
      border-radius: 30px;
      font-family: 'Source Code Pro', monospace;
      font-size: 14px;
      font-weight: 300;
      line-height: 1;
      letter-spacing: 0;
      color: #f7f7f7;
    }
  }
}
</style>
