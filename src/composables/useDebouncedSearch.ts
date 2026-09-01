import { onUnmounted } from 'vue'

export function useDebouncedSearch(onSearch: () => void, delay = 400) {
  let timer: ReturnType<typeof setTimeout> | null = null

  function schedule() {
    if (timer) clearTimeout(timer)
    timer = setTimeout(onSearch, delay)
  }

  function flush() {
    if (timer) clearTimeout(timer)
    timer = null
    onSearch()
  }

  function cancel() {
    if (timer) clearTimeout(timer)
    timer = null
  }

  onUnmounted(cancel)

  return { schedule, flush, cancel }
}
