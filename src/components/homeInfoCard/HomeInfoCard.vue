<script setup lang="ts">
defineProps<{
  icon: 'building' | 'person' | 'document' | 'pen'
  title: string
  value: string
}>()
</script>

<template>
  <div class="card">
    <div class="icon_container">
      <svg v-if="icon === 'building'" width="25" height="25" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"/>
      </svg>
      <svg v-else-if="icon === 'person'" width="25" height="25" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
      </svg>
      <svg v-else-if="icon === 'document'" width="25" height="25" viewBox="0 0 24 24" fill="currentColor">
        <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
      </svg>
      <svg v-else-if="icon === 'pen'" width="25" height="25" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
      </svg>
    </div>
    <div class="text_wrapper">
      <label class="title">{{ title }}</label>
      <label class="value">{{ value }}</label>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.card {
  width: 290px;
  min-width: 250px;
  padding: 18px 14px 15px 14px;
  filter: drop-shadow(0px 3px 6px rgba(0, 0, 0, 0.01));
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 17px;
  background-color: rgba(207, 198, 188, 0.1);

  .icon_container {
    width: 50px;
    height: 50px;
    min-width: 50px;
    border-radius: 50%;
    background-color: var(--color-white-100);
    display: flex;
    justify-content: center;
    align-items: center;
    color: var(--color-blue-700);
  }

  .text_wrapper {
    display: flex;
    flex-direction: column;
    gap: 5px;
    justify-content: center;
    align-items: flex-start;

    .title {
      font-style: normal;
      font-weight: 400;
      font-size: 0.75rem;
      text-transform: uppercase;
      color: var(--color-blue-700);
    }

    .value {
      font-style: normal;
      font-weight: 700;
      font-size: 1.25rem;
      color: var(--color-blue-700);
    }
  }
}
</style>
