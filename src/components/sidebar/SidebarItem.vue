<script setup lang="ts">
import { RouterLink } from 'vue-router'

const props = defineProps<{
  title: string
  icon: string
  path: string
  isActive?: boolean
}>()

const emit = defineEmits<{
  (e: 'click'): void
}>()

function handleClick() {
  emit('click')
}
</script>

<template>
  <RouterLink
    v-if="path !== '/logout'"
    :to="path"
    :class="['sidebar-item', { active: isActive }]"
  >
    <div class="icon-wrapper">
      <svg v-if="icon === 'home'" width="25" height="25" viewBox="0 0 24 24" fill="currentColor">
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
      </svg>
      <svg v-else-if="icon === 'admin'" width="25" height="25" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-5 3c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm4 8h-8v-1c0-1.33 2.67-2 4-2s4 .67 4 2v1z"/>
      </svg>
      <svg v-else-if="icon === 'building'" width="25" height="25" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"/>
      </svg>
      <svg v-else-if="icon === 'document'" width="25" height="25" viewBox="0 0 24 24" fill="currentColor">
        <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
      </svg>
      <svg v-else-if="icon === 'files'" width="25" height="25" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20 6h-8l-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2z"/>
      </svg>
      <svg v-else-if="icon === 'pen'" width="25" height="25" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
      </svg>
      <svg v-else-if="icon === 'person'" width="25" height="25" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
      </svg>
      <svg v-else-if="icon === 'profile'" width="25" height="25" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
      </svg>
      <svg v-else-if="icon === 'logout'" width="25" height="25" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
      </svg>
    </div>
    <span class="title">{{ title }}</span>
  </RouterLink>
  <div
    v-else
    :class="['sidebar-item', { active: isActive }]"
    @click="handleClick"
  >
    <div class="icon-wrapper">
      <svg width="25" height="25" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
      </svg>
    </div>
    <span class="title">{{ title }}</span>
  </div>
</template>

<style lang="scss" scoped>
.sidebar-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 12px 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 8px 0 0 8px;
  text-decoration: none;

  .icon-wrapper {
    color: white;
  }

  .title {
    color: white;
    font-size: 1rem;
    font-weight: 400;
  }

  &:hover,
  &.active {
    background-color: var(--color-white-100);

    .icon-wrapper {
      color: var(--color-blue-700);
    }

    .title {
      color: var(--color-blue-700);
    }
  }
}
</style>
