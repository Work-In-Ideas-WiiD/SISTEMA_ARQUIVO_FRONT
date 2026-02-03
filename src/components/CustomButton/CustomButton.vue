<script setup lang="ts">
defineProps<{
  title: string
  icon?: 'folder' | 'person'
  variation?: '1' | '2' | '3'
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: 'click'): void
}>()
</script>

<template>
  <button
    :class="['custom_button', `variation_${variation || '1'}`]"
    type="button"
    @click="emit('click')"
  >
    <svg v-if="icon === 'folder'" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20 6h-8l-2-2H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm0 12H4V8h16v10zm-8-1h2v-4h3l-4-4-4 4h3z"/>
    </svg>
    <svg v-else-if="icon === 'person'" width="23" height="23" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
    </svg>
    <div v-if="loading" class="loader"></div>
    <span v-else>{{ title }}</span>
  </button>
</template>

<style lang="scss" scoped>
.custom_button {
  font-size: 1rem;
  font-weight: 400;
  text-transform: uppercase;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: center;
  white-space: nowrap;

  .loader {
    width: 24px;
    height: 24px;
    border: 3px solid rgba(255, 255, 255, 0.3);
    border-top: 3px solid #fff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
}

.variation_1 {
  padding: 13px 18px;
  color: var(--color-white-100);
  background-color: var(--color-orange-500);
  filter: drop-shadow(0px 3px 6px rgba(0, 0, 0, 0.161));
  outline: none;
  border: none;

  &:active {
    opacity: 0.9;
  }

  &:hover {
    background-color: var(--color-orange-600);
  }
}

.variation_2 {
  width: 100%;
  padding: 16px 17px;
  color: var(--color-blue-700);
  background-color: var(--color-green-200);
  max-width: 440px;
  filter: drop-shadow(0px 3px 6px rgba(0, 0, 0, 0.161));
  outline: none;
  border: none;
  justify-content: center;

  &:active {
    opacity: 0.8;
  }

  &:hover {
    opacity: 0.9;
  }
}

.variation_3 {
  padding: 16px 17px;
  color: var(--color-blue-700);
  background-color: var(--color-green-200);
  max-width: 182px;
  width: 100%;
  filter: drop-shadow(0px 3px 6px rgba(0, 0, 0, 0.161));
  outline: none;
  border: none;
  justify-content: center;

  &:active {
    opacity: 0.8;
  }

  &:hover {
    opacity: 0.9;
  }
}
</style>
