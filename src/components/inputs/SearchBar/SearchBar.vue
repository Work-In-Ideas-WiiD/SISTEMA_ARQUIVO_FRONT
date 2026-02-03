<script setup lang="ts">
defineProps<{
  modelValue: string
  placeholder?: string
  fetching?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'search'): void
}>()

function onInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

function onSubmit() {
  emit('search')
}
</script>

<template>
  <div class="searchbar">
    <div v-if="fetching" class="loader"></div>
    <button v-else type="submit" class="search_btn" @click="onSubmit">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="11" cy="11" r="8"></circle>
        <path d="m21 21-4.35-4.35"></path>
      </svg>
    </button>
    <input
      type="text"
      :value="modelValue"
      :placeholder="placeholder"
      @input="onInput"
    />
  </div>
</template>

<style lang="scss" scoped>
.searchbar {
  display: flex;
  flex-direction: row;
  gap: 17px;
  padding-left: 20px;
  align-items: center;
  background-color: var(--color-white-100);
  height: 49px;
  width: 100%;
  max-width: 468px;

  .search_btn {
    display: flex;
    background-color: transparent;
    border: none;
    color: var(--color-blue-700);
    cursor: pointer;
  }

  .loader {
    width: 24px;
    height: 24px;
    border: 3px solid #f3f3f3;
    border-top: 3px solid var(--color-blue-700);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  input {
    color: var(--color-blue-700);
    font-size: 0.875rem;
    height: 100%;
    border: none;
    outline: none;
    width: 100%;
  }

  input::placeholder {
    color: var(--color-blue-700);
    font-size: 0.875rem;
  }
}
</style>
