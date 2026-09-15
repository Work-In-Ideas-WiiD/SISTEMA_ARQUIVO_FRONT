<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    pageCount: number
    currentPage: number
    theme?: 'default' | 'night'
  }>(),
  {
    theme: 'default'
  }
)

const emit = defineEmits<{
  (e: 'pageChange', page: number): void
}>()

const pages = computed(() => {
  const arr = []
  for (let i = 1; i <= props.pageCount; i++) {
    arr.push(i)
  }
  return arr
})

function goToPage(page: number) {
  if (page >= 1 && page <= props.pageCount) {
    emit('pageChange', page)
  }
}
</script>

<template>
  <div v-if="pageCount > 1" class="paginator" :class="`paginator--${theme}`">
    <button
      class="nav_btn"
      :disabled="currentPage <= 1"
      @click="goToPage(currentPage - 1)"
    >
      &lt;
    </button>

    <button
      v-for="page in pages"
      :key="page"
      :class="['page_btn', { active: page === currentPage }]"
      @click="goToPage(page)"
    >
      {{ page }}
    </button>

    <button
      class="nav_btn"
      :disabled="currentPage >= pageCount"
      @click="goToPage(currentPage + 1)"
    >
      &gt;
    </button>
  </div>
</template>

<style lang="scss" scoped>
.paginator {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  list-style-type: none;
  padding: 10px 38px;
  width: 100%;
  background-color: rgba(207, 198, 188, 0.1);
  gap: 2px;
  min-width: 600px;

  .nav_btn,
  .page_btn {
    color: var(--color-blue-600);
    padding: 5px 10px;
    border: none;
    cursor: pointer;
    background-color: rgba(207, 198, 188, 0.2);

    &:disabled {
      color: var(--color-gray-500);
      cursor: default;
    }
  }

  .page_btn {
    background-color: transparent;

    &.active {
      background-color: var(--color-orange-500);
      color: var(--color-white-100);
      min-width: 32px;
    }
  }

  &--night {
    min-width: 0;
    background: transparent;
    justify-content: center;
    padding: 8px 16px 12px;
    gap: 4px;

    .nav_btn,
    .page_btn {
      min-width: 32px;
      height: 32px;
      padding: 0 8px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-family: 'Inter', sans-serif;
      font-size: 13px;
      font-weight: 500;
      line-height: 1;
      color: #FFFCFF;
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 6px;
      transition: all 0.15s ease;

      &:hover:not(:disabled):not(.active) {
        background: rgba(176, 141, 87, 0.15);
        border-color: rgba(176, 141, 87, 0.3);
      }

      &:disabled {
        color: rgba(247, 247, 247, 0.35);
        cursor: default;
        opacity: 0.5;
      }
    }

    .page_btn {
      background: rgba(255, 255, 255, 0.08);

      &.active {
        background: #B08D57;
        border-color: #B08D57;
        color: #ffffff;
        font-weight: 700;
        box-shadow: 0 0 10px rgba(176, 141, 87, 0.35);
      }
    }
  }
}

@media only screen and (max-width: 500px) {
  .paginator {
    .page_btn:not(.active) {
      display: none;
    }

    &--night .page_btn:not(.active) {
      display: none;
    }
  }
}
</style>
