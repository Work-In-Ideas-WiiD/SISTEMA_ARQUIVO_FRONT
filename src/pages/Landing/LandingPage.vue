<script setup lang="ts">
import { onMounted } from 'vue'
import LandingHeader from './components/LandingHeader.vue'
import HeroSection from './components/HeroSection.vue'
import BenefitsSection from './components/BenefitsSection.vue'
import FeaturesSection from './components/FeaturesSection.vue'
import HowItWorksSection from './components/HowItWorksSection.vue'
import DifferentialsSection from './components/DifferentialsSection.vue'
import SecuritySection from './components/SecuritySection.vue'
import ContinuitySection from './components/ContinuitySection.vue'
import PricingSection from './components/PricingSection.vue'
import FreeTrialHighlight from './components/FreeTrialHighlight.vue'
import FAQSection from './components/FAQSection.vue'
import { faqs } from './components/faqData'
import AboutSection from './components/AboutSection.vue'
import FinalCTASection from './components/FinalCTASection.vue'
import LandingFooter from './components/LandingFooter.vue'
import { setPageSeo } from '@/utils/seo'
import { initUtmTracking } from '@/utils/tracking'

onMounted(() => {
  // 1. Captura e armazena parâmetros de tráfego pago (UTM)
  initUtmTracking()

  // 2. Configura SEO Técnico, Open Graph e Schema.org JSON-LD
  setPageSeo({
    title: 'AkiDocs — Gestão Segura de Documentos e Arquivos na Nuvem',
    description:
      'Plataforma web corporativa para gestão segura e centralizada de arquivos e documentos na nuvem. Organize clientes, setores e equipes com armazenamento estruturado, controle de acesso e conformidade com a LGPD.',
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'AkiDocs',
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'All Web Browsers',
        description:
          'Plataforma web corporativa para gerenciamento centralizado de arquivos, clientes e permissões por setor com segurança e conformidade LGPD.',
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
        name: 'AkiDocs',
        legalName: 'Work in Ideas Informática Ltda',
        taxID: '17.808.481/0001-69',
        url: typeof window !== 'undefined' ? window.location.origin : 'https://akidocs.com.br',
        logo: typeof window !== 'undefined' ? `${window.location.origin}/logo-akidocs-white.png` : 'https://akidocs.com.br/logo-akidocs-white.png',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Av. T-1, 2266 — Setor Bueno',
          addressLocality: 'Goiânia',
          addressRegion: 'GO',
          postalCode: '74215-022',
          addressCountry: 'BR'
        },
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
            url: 'https://suporte.akidocs.com.br'
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
      <SecuritySection />
      <ContinuitySection />
      <PricingSection />
      <FreeTrialHighlight />
      <FAQSection />
      <AboutSection />
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
