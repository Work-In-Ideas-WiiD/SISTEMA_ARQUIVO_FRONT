<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <main class="forgot_password_page">
    <p class="forgot_password_page__watermark" aria-hidden="true">&lt;/DOC</p>
    <RouterView />
  </main>
</template>

<style lang="scss" scoped>
@import '@/styles/login-night-mobile.scss';

.forgot_password_page {
  --login-black: #0B1B2B;
  --login-navy: #1F3A5F;
  --login-gold: #B08D57;
  --login-gray: #FFFCFF;

  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: radial-gradient(circle at 85% 15%, rgba(176, 141, 87, 0.12) 0%, transparent 40%), linear-gradient(135deg, #0B1B2B 0%, #1F3A5F 100%);
  font-family: 'Inter', sans-serif;

  @include login-mobile-gradient;
  @include login-mobile-shell;

  &__watermark {
    position: absolute;
    z-index: 0;
    top: 80.28vh;
    right: -1.82vw;
    bottom: auto;
    margin: 0;
    font-size: clamp(90px, 24.07vh, 260px);
    font-weight: 700;
    line-height: 0.9;
    color: rgba(255, 252, 255, 0.05);
    pointer-events: none;
    user-select: none;
    white-space: nowrap;

    @include login-mobile-watermark-hidden;
  }
}

@media (min-width: 960px) and (max-width: 1080px) and (min-height: 700px) and (max-height: 820px) and (max-aspect-ratio: 16/10) {
  .forgot_password_page__watermark {
    top: auto;
    bottom: -5vh;
    right: -2vw;
    font-size: clamp(76px, 19.5vh, 180px);
  }
}
</style>
