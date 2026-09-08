<script setup lang="ts">
import { onMounted } from 'vue'
import LandingHeader from './components/LandingHeader.vue'
import HeroSection from './components/HeroSection.vue'
import BenefitsSection from './components/BenefitsSection.vue'
import FeaturesSection from './components/FeaturesSection.vue'
import HowItWorksSection from './components/HowItWorksSection.vue'
import DifferentialsSection from './components/DifferentialsSection.vue'
import PricingSection from './components/PricingSection.vue'
import FAQSection from './components/FAQSection.vue'
import { faqs } from './components/faqData'
import FinalCTASection from './components/FinalCTASection.vue'
import LandingFooter from './components/LandingFooter.vue'
import { setPageSeo } from '@/utils/seo'
import { initUtmTracking } from '@/utils/tracking'

onMounted(() => {
  // 1. Captura e armazena parâmetros de tráfego pago (UTM)
  initUtmTracking()

  // 2. Configura SEO Técnico, Open Graph e Schema.org JSON-LD
  setPageSeo({
    title: 'WiiDocs — Gestão Inteligente de Documentos, Contratos e Clientes na Nuvem',
    description:
      'Plataforma web corporativa para gestão segura de arquivos, minutas e contratos na nuvem. Organize empresas, setores, equipes e acelere assinaturas digitais com conformidade LGPD.',
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'WiiDocs',
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'All Web Browsers',
        description:
          'Sistema em nuvem para gerenciamento centralizado de arquivos, minutas de contratos, clientes e fluxos de assinaturas digitais com segurança LGPD.',
        offers: {
          '@type': 'AggregateOffer',
          priceCurrency: 'BRL',
          lowPrice: '71.92',
          highPrice: '349.90',
          offerCount: '3'
        }
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((f) => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: f.answer
          }
        }))
      },
      {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'WiiDocs',
        url: typeof window !== 'undefined' ? window.location.origin : 'https://wiidocs.com.br',
        logo: typeof window !== 'undefined' ? `${window.location.origin}/logo_ana_login.png` : 'https://wiidocs.com.br/logo_ana_login.png',
        contactPoint: [
          {
            '@type': 'ContactPoint',
            contactType: 'customer service',
            email: 'contato@wi-id.com',
            telephone: '+55-62-98339-8612'
          },
          {
            '@type': 'ContactPoint',
            contactType: 'technical support',
            email: 'desenvolvimento@wi-id.com'
          }
        ]
      }
    ]
  })

  // 3. Smooth scroll se houver hash na rota (ex: /#planos)
  if (window.location.hash) {
    setTimeout(() => {
      const target = document.querySelector(window.location.hash)
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' })
      }
    }, 150)
  }
})
</script>

<template>
  <div class="landing_page_wrapper">
    <LandingHeader />

    <main class="landing_main_content">
      <HeroSection />
      <BenefitsSection />
      <FeaturesSection />
      <HowItWorksSection />
      <DifferentialsSection />
      <PricingSection />
      <FAQSection />
      <FinalCTASection />
    </main>

    <LandingFooter />
  </div>
</template>

<style lang="scss" scoped>
.landing_page_wrapper {
  background-color: #212121;
  color: #f7f7f7;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  position: relative;
  font-family: 'Inter', sans-serif;
}

.landing_main_content {
  flex: 1;
}
</style>
