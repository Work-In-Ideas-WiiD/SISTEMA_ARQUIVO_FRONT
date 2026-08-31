<script setup lang="ts">
import iconBuilding from '@/assets/imgs/dashboard/icon-card-building.svg'
import iconPerson from '@/assets/imgs/dashboard/icon-card-person.svg'
import iconDocument from '@/assets/imgs/dashboard/icon-card-document.svg'
import iconPen from '@/assets/imgs/dashboard/icon-card-pen.svg'

const props = defineProps<{
  icon: 'building' | 'person' | 'document' | 'pen'
  title: string
  value: string
}>()

const iconSrc: Record<typeof props.icon, string> = {
  building: iconBuilding,
  person: iconPerson,
  document: iconDocument,
  pen: iconPen
}

const iconSize: Record<typeof props.icon, { w: number; h: number }> = {
  building: { w: 20, h: 23 },
  person: { w: 20.72, h: 20.72 },
  document: { w: 18, h: 24 },
  pen: { w: 20.99, h: 21 }
}
</script>

<template>
  <article class="card">
    <div class="card__icon" aria-hidden="true">
      <img
        :src="iconSrc[icon]"
        :width="iconSize[icon].w"
        :height="iconSize[icon].h"
        alt=""
      />
    </div>
    <div class="card__content">
      <p class="card__label">{{ title }}</p>
      <p class="card__value">{{ value }}</p>
    </div>
  </article>
</template>

<style lang="scss" scoped>
.card {
  width: 100%;
  min-width: 0;
  height: 100px;
  padding: 16px 18px;
  display: flex;
  align-items: center;
  gap: 16px;
  border-radius: 30px;
  background: rgba(121, 121, 121, 0.25);

  &__icon {
    width: 67px;
    height: 67px;
    min-width: 67px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(121, 121, 121, 0.3);
    border: none;

    img {
      display: block;
      object-fit: contain;
    }
  }

  &__content {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  &__label {
    margin: 0;
    font-family: 'Source Code Pro', monospace;
    font-weight: 700;
    font-size: 14px;
    line-height: 1.15;
    letter-spacing: 0;
    text-transform: uppercase;
    color: #f7f7f7;
    opacity: 0.7;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  &__value {
    margin: 0;
    font-family: 'Montserrat', sans-serif;
    font-weight: 700;
    font-size: 24px;
    line-height: 1;
    letter-spacing: 0;
    color: #f7f7f7;
  }

  @media (max-width: 1440px) {
    height: 92px;
    padding: 12px 14px;
    gap: 12px;

    &__icon {
      width: 56px;
      height: 56px;
      min-width: 56px;
    }

    &__label {
      font-size: 12px;
    }

    &__value {
      font-size: 20px;
    }
  }

  @media (max-width: 1280px) {
    height: 84px;
    padding: 10px 12px;
    gap: 10px;
    border-radius: 24px;

    &__icon {
      width: 48px;
      height: 48px;
      min-width: 48px;
    }

    &__label {
      font-size: 11px;
    }

    &__value {
      font-size: 18px;
    }
  }
}
</style>
