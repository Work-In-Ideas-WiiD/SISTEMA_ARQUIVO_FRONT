<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useUploadProgressStore, type UploadItem } from '@/stores/uploadProgress'

const uploadStore = useUploadProgressStore()
const { items, hasItems } = storeToRefs(uploadStore)

const gridClass = computed(() => {
  const count = items.value.length
  if (count <= 1) return 'upload_progress_panel__scroll--one'
  if (count === 2) return 'upload_progress_panel__scroll--two'
  return 'upload_progress_panel__scroll--many'
})

function statusLabel(item: UploadItem): string {
  if (item.status === 'success') return 'Concluído'
  if (item.status === 'error') return item.errorMessage || 'Erro no envio'
  if (item.progress >= 100) return 'Processando…'
  return 'Enviando…'
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
      :class="{ 'upload_progress_panel--compact': items.length === 1 }"
      aria-label="Progresso de uploads"
    >
      <div class="upload_progress_panel__scroll" :class="gridClass">
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

          <div
            class="upload_item__bar"
            role="progressbar"
            :aria-valuenow="item.progress"
            aria-valuemin="0"
            aria-valuemax="100"
          >
            <div
              class="upload_item__bar_fill"
              :style="{ width: `${item.progress}%` }"
            />
          </div>

          <div class="upload_item__footer">
            <span class="upload_item__status" :title="statusLabel(item)">
              {{ statusLabel(item) }}
            </span>
            <span v-if="item.status === 'uploading'" class="upload_item__percent">
              {{ Math.min(item.progress, 99) }}%
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
  background: rgba(33, 33, 33, 0.98);
  border: 1px solid rgba(121, 121, 121, 0.45);
  border-radius: 16px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.4);
  overflow: hidden;

  &--compact {
    width: min(280px, 30vw);
  }

  &__scroll {
    display: grid;
    gap: 8px;
    max-height: 20vh;
    overflow-y: auto;
    padding: 10px;

    &--one {
      grid-template-columns: 1fr;
    }

    &--two {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    &--many {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }
}

.upload_item {
  min-width: 0;
  padding: 10px;
  border-radius: 12px;
  background: rgba(121, 121, 121, 0.2);
  border: 1px solid rgba(121, 121, 121, 0.35);

  &--success {
    border-color: rgba(76, 175, 80, 0.55);
  }

  &--error {
    border-color: rgba(220, 53, 69, 0.65);
    background: rgba(220, 53, 69, 0.12);
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
    font-family: 'Source Code Pro', monospace;
    font-size: 0.75rem;
    font-weight: 400;
    color: #f7f7f7;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__close {
    border: none;
    background: transparent;
    color: rgba(247, 247, 247, 0.65);
    cursor: pointer;
    line-height: 1;
    font-size: 1rem;
    padding: 0;

    &:hover {
      color: #ffffff;
    }
  }

  &__bar {
    height: 6px;
    border-radius: 999px;
    background: rgba(121, 121, 121, 0.45);
    overflow: hidden;
  }

  &__bar_fill {
    height: 100%;
    border-radius: inherit;
    background: #ff00ff;
    transition: width 0.15s ease;
  }

  &--success &__bar_fill {
    background: rgba(76, 175, 80, 0.9);
  }

  &--error &__bar_fill {
    background: rgba(220, 53, 69, 0.85);
  }

  &__footer {
    display: flex;
    justify-content: space-between;
    gap: 8px;
    margin-top: 6px;
  }

  &__status,
  &__percent {
    font-family: 'Source Code Pro', monospace;
    font-size: 0.6875rem;
    font-weight: 300;
    color: rgba(247, 247, 247, 0.65);
  }

  &__status {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &--success &__status {
    color: rgba(76, 175, 80, 0.95);
  }

  &--error &__status {
    color: rgba(255, 140, 150, 0.95);
  }
}

@media (max-width: 768px) {
  .upload_progress_panel {
    left: 12px;
    right: 12px;
    bottom: 12px;
    width: auto;
    max-width: none;

    &--compact {
      width: auto;
    }

    &__scroll {
      grid-template-columns: 1fr !important;
    }
  }
}
</style>
