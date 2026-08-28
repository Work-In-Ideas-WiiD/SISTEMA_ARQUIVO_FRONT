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
.forgot_password_page {
  --login-black: #212121;
  --login-magenta: #ff00ff;
  --login-gray: #f7f7f7;

  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: linear-gradient(119deg, var(--login-black) 0%, var(--login-magenta) 90%);
  font-family: 'Source Code Pro', monospace;

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
    color: var(--login-gray);
    pointer-events: none;
    user-select: none;
    white-space: nowrap;
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
