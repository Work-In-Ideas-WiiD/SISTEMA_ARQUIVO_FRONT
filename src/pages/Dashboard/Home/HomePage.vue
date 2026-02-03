<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import HomeInfoCard from '@/components/homeInfoCard/HomeInfoCard.vue'
import HomeTable from './HomeTable.vue'
import { getStats } from '@/services/http/home'
import type { IGetStatsRes } from '@/types/home'

const toast = useToast()

const stats = ref<IGetStatsRes>({
  assinaturas: '0',
  clientes: '0',
  contratos: '0',
  empresas: '0'
})

onMounted(() => {
  getData()
})

async function getData() {
  try {
    const { data } = await getStats()
    stats.value = data
  } catch (error) {
    console.error(error)
    toast.error('Ocorreu um erro ao obter dados.')
  }
}
</script>

<template>
  <main class="main dashboard_padding">
    <h2 class="title dashboard_title">home</h2>
    <section class="info_cards">
      <HomeInfoCard
        icon="building"
        title="EMPRESAS CADASTRADAS"
        :value="stats.empresas"
      />
      <HomeInfoCard
        icon="person"
        title="CLIENTES IMPACTADOS"
        :value="stats.clientes"
      />
      <HomeInfoCard
        icon="document"
        title="CONTRATOS"
        :value="stats.contratos"
      />
      <HomeInfoCard
        icon="pen"
        title="ASSINATURAS"
        :value="stats.assinaturas"
      />
    </section>
    <HomeTable />
  </main>
</template>

<style lang="scss" scoped>
.main {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  .title {
    margin-bottom: 42px;
  }

  .info_cards {
    width: 100%;
    margin-bottom: 43px;
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
  }
}
</style>
