<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useUploadProgressStore, type UploadItem } from '@/stores/uploadProgress'

const uploadStore = useUploadProgressStore()
const { items, hasItems } = storeToRefs(uploadStore)

function statusLabel(item: UploadItem): string {
  if (item.status === 'uploading') return 'Enviando…'
  if (item.status === 'success') return 'Concluído'
  return item.errorMessage || 'Erro no envio'
}

function dismiss(id: string) {
  uploadStore.removeUpload(id)
}
</script>

<template>
  <Teleport to="body">
    <aside
      v-if="hasItems"
      class="upload_progress_panel"
      aria-label="Progresso de uploads"
    >
      <div class="upload_progress_panel__scroll">
        <article
          v-for="item in items"
          :key="item.id"
          class="upload_item"
          :class="`upload_item--${item.status}`"
        >
          <div class="upload_item__header">
            <p class="upload_item__name" :title="item.fileName">
              {{ item.fileName }}
            </p>
            <button
              v-if="item.status !== 'uploading'"
              type="button"
              class="upload_item__close"
              aria-label="Fechar"
              @click="dismiss(item.id)"
            >
              ×
            </button>
          </div>

          <div class="upload_item__bar" role="progressbar" :aria-valuenow="item.progress" aria-valuemin="0" aria-valuemax="100">
            <div
              class="upload_item__bar_fill"
              :style="{ width: `${item.progress}%` }"
            />
          </div>

          <div class="upload_item__footer">
            <span class="upload_item__status">{{ statusLabel(item) }}</span>
            <span v-if="item.status === 'uploading'" class="upload_item__percent">
              {{ item.progress }}%
            </span>
          </div>
        </article>
      </div>
    </aside>
  </Teleport>
</template>

<style lang="scss" scoped>
.upload_progress_panel {
  position: fixed;
  z-index: 9997;
  right: 16px;
  bottom: 16px;
  width: min(30vw, 420px);
  max-height: 20vh;
  background: #fff;
  border: 1px solid rgba(207, 198, 188, 0.7);
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  overflow: hidden;

  &__scroll {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 8px;
    max-height: 20vh;
    overflow-y: auto;
    padding: 10px;
  }
}

.upload_item {
  min-width: 0;
  padding: 8px;
  border-radius: 6px;
  background: var(--color-white-300, #f8f8f8);
  border: 1px solid rgba(207, 198, 188, 0.45);

  &--success {
    border-color: var(--color-green-400, #5c7866);
  }

  &--error {
    border-color: var(--color-red-500, #d64646);
  }

  &__header {
    display: flex;
    align-items: flex-start;
    gap: 6px;
    margin-bottom: 6px;
  }

  &__name {
    margin: 0;
    flex: 1;
    font-size: 0.75rem;
    color: var(--color-blue-700);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__close {
    border: none;
    background: transparent;
    color: var(--color-gray-500);
    cursor: pointer;
    line-height: 1;
    font-size: 1rem;
    padding: 0;
  }

  &__bar {
    height: 6px;
    border-radius: 999px;
    background: rgba(207, 198, 188, 0.45);
    overflow: hidden;
  }

  &__bar_fill {
    height: 100%;
    border-radius: inherit;
    background: var(--color-orange-500);
    transition: width 0.15s ease;
  }

  &--success &__bar_fill {
    background: var(--color-green-400, #5c7866);
  }

  &--error &__bar_fill {
    background: var(--color-red-500, #d64646);
  }

  &__footer {
    display: flex;
    justify-content: space-between;
    gap: 8px;
    margin-top: 6px;
  }

  &__status,
  &__percent {
    font-size: 0.6875rem;
    color: var(--color-gray-500);
  }

  &--success &__status {
    color: var(--color-green-400, #5c7866);
  }

  &--error &__status {
    color: var(--color-red-500, #d64646);
  }
}

@media (max-width: 768px) {
  .upload_progress_panel {
    left: 12px;
    right: 12px;
    bottom: 12px;
    width: auto;
    max-width: none;

    &__scroll {
      grid-template-columns: 1fr;
    }
  }
}
</style>
