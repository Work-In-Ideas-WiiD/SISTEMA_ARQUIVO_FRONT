<script setup lang="ts">
import { RouterView } from 'vue-router'
import UploadProgressPanel from '@/components/UploadProgress/UploadProgressPanel.vue'
import CadastroModal from '@/components/CadastroModal/CadastroModal.vue'
</script>

<template>
  <RouterView />
  <CadastroModal />
  <UploadProgressPanel />
</template>

<style scoped>
</style>

