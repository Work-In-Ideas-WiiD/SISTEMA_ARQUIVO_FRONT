<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  pageCount: number
  currentPage: number
}>()

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
  <div v-if="pageCount > 0" class="paginator">
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
}

@media only screen and (max-width: 500px) {
  .paginator {
    .page_btn:not(.active) {
      display: none;
    }
  }
}
</style>
