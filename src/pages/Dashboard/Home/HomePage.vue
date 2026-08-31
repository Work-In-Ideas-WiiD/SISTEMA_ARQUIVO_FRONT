<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useToast } from 'vue-toastification'
import { useAuthStore } from '@/stores/auth'
import HomeInfoCard from '@/components/homeInfoCard/HomeInfoCard.vue'
import HomeTable from './HomeTable.vue'
import { getStats } from '@/services/http/home'
import type { IGetStatsRes } from '@/types/home'

const toast = useToast()
const authStore = useAuthStore()

const stats = ref<IGetStatsRes>({
  assinaturas: '0',
  clientes: '0',
  contratos: '0',
  empresas: '0'
})

interface IHomeCard {
  icon: 'building' | 'person' | 'document' | 'pen'
  title: string
  key: keyof IGetStatsRes
  roles: Array<'administrador' | 'empresa' | 'cliente'>
}

const allCards: IHomeCard[] = [
  {
    icon: 'building',
    title: 'EMPRESAS CADASTRADAS',
    key: 'empresas',
    roles: ['administrador', 'empresa', 'cliente']
  },
  {
    icon: 'person',
    title: 'CLIENTES IMPACTADOS',
    key: 'clientes',
    roles: ['administrador', 'empresa', 'cliente']
  },
  {
    icon: 'document',
    title: 'CONTRATOS',
    key: 'contratos',
    roles: ['administrador', 'empresa', 'cliente']
  },
  {
    icon: 'pen',
    title: 'ASSINATURAS',
    key: 'assinaturas',
    roles: ['administrador', 'empresa', 'cliente']
  }
]

const visibleCards = computed(() => {
  const role = authStore.userRole
  if (!role) return []
  return allCards.filter((card) => card.roles.includes(role))
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
  <div class="home-page dashboard_padding">
    <h2 class="home-page__title dashboard_title">HOME</h2>

    <section class="home-page__cards">
      <HomeInfoCard
        v-for="card in visibleCards"
        :key="card.key"
        :icon="card.icon"
        :title="card.title"
        :value="stats[card.key]"
      />
    </section>

    <HomeTable />
  </div>
</template>

<style lang="scss" scoped>
.home-page {
  width: 100%;
  max-width: 100%;
  min-width: 0;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;

  &__title {
    margin-bottom: 36px;
    flex-shrink: 0;
  }

  &__cards {
    width: 100%;
    margin-bottom: 36px;
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 16px;
    flex-shrink: 0;

    /* Mantém 4 cards em 1440/1366; só quebra em telas bem estreitas */
    @media (max-width: 1280px) {
      gap: 12px;
    }

    @media (max-width: 1100px) {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 12px;
    }

    @media (max-width: 720px) {
      grid-template-columns: 1fr;
    }
  }
}
</style>
