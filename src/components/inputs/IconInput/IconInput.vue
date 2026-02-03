<script setup lang="ts">
defineProps<{
  modelValue: string
  type?: string
  icon?: 'login' | 'password' | 'building'
  placeholder?: string
  autocomplete?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

function onInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <div class="input_container">
    <svg v-if="icon === 'login'" class="icon" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
    </svg>
    <svg v-else-if="icon === 'password'" class="icon" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
    </svg>
    <svg v-else-if="icon === 'building'" class="icon" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"/>
    </svg>
    <input
      :type="type || 'text'"
      :value="modelValue"
      :placeholder="placeholder"
      :autocomplete="autocomplete"
      @input="onInput"
    />
  </div>
</template>

<style lang="scss" scoped>
.input_container {
  display: flex;
  flex-direction: row;
  background-color: var(--color-white-100);
  align-items: center;
  width: 100%;
  height: 51px;
  gap: 13px;
  padding: 0 21px;
  border: 1px solid var(--color-gray-500);

  .icon {
    background-color: transparent;
    color: var(--color-blue-700);
  }

  input {
    border: none;
    height: 100%;
    color: var(--color-blue-700);
    outline: none;
    font-size: 0.938rem;
    flex: 1;
  }

  input::placeholder {
    color: var(--color-gray-500);
    font-size: 0.938rem;
  }
}
</style>
