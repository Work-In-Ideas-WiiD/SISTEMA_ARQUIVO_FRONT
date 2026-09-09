<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import LandingHeader from '@/pages/Landing/components/LandingHeader.vue'
import LandingFooter from '@/pages/Landing/components/LandingFooter.vue'
import { setPageSeo } from '@/utils/seo'
import { trackContactClick, trackCtaClick } from '@/utils/tracking'

onMounted(() => {
  setPageSeo({
    title: 'Sobre Nós — WiiDocs | Plataforma de Gestão Documental Corporativa',
    description:
      'Conheça a história, a missão e os pilares do WiiDocs, uma solução corporativa desenvolvida pela Work In Ideas para simplificar a gestão de arquivos, contratos e clientes.',
    canonicalUrl: typeof window !== 'undefined' ? `${window.location.origin}/sobre` : 'https://wiidocs.com.br/sobre'
  })
})
</script>

<template>
  <div class="institutional_page">
    <LandingHeader />

    <main class="institutional_main">
      <div class="institutional_container">
        <!-- Breadcrumbs -->
        <nav class="breadcrumbs" aria-label="Navegação estrutural">
          <RouterLink to="/" class="breadcrumb_link">Início</RouterLink>
          <span class="breadcrumb_sep">/</span>
          <span class="breadcrumb_current">Sobre Nós</span>
        </nav>

        <header class="page_header">
          <span class="page_badge">INSTITUCIONAL</span>
          <h1 class="page_title">Inovando a Governança Documental Corporativa</h1>
          <p class="page_subtitle">
            O WiiDocs nasceu para transformar arquivos desorganizados e processos lentos em produtividade, conformidade legal e agilidade operacional.
          </p>
        </header>

        <div class="content_grid">
          <section class="content_section">
            <h2>Quem Somos</h2>
            <p>
              O <strong>WiiDocs</strong> é uma plataforma SaaS desenvolvida pela <strong>Work In Ideas (WiiD)</strong>,
              empresa de tecnologia especializada na criação de ferramentas inteligentes para o ambiente corporativo e jurídico.
            </p>
            <p>
              Identificamos que empresas de diversos setores sofriam diariamente com a perda de contratos importantes,
              dificuldade de localização de arquivos e falta de um canal seguro para compartilhamento de documentos com seus próprios clientes.
              Desenvolvemos o WiiDocs para ser a resposta definitiva a essa demanda: um sistema rápido, moderno, seguro e sem complexidade desnecessária.
            </p>
          </section>

          <section class="content_section">
            <h2>Nossa Missão & Valores</h2>
            <div class="values_cards">
              <div class="value_card">
                <h3>Segurança Inegociável</h3>
                <p>Criptografia de ponta a ponta e total conformidade com a LGPD para garantir o sigilo absoluto dos dados de cada empresa e cliente.</p>
              </div>
              <div class="value_card">
                <h3>Eficiência Operacional</h3>
                <p>Redução drástica do tempo gasto procurando documentos. Localize qualquer arquivo em questão de segundos com filtros intuitivos.</p>
              </div>
              <div class="value_card">
                <h3>Experiência sem Atrito</h3>
                <p>Interface Dark Mode limpa, direta ao ponto e veloz, eliminando a curva de aprendizado e tornando o uso diário fluido para qualquer colaborador.</p>
              </div>
            </div>
          </section>

          <section class="content_section">
            <h2>Infraestrutura & Tecnologia</h2>
            <p>
              Construído com tecnologia de ponta em nuvem, o WiiDocs garante disponibilidade 24/7,
              backups distribuídos e proteção contra perda de dados. Nossas conexões utilizam certificados SSL/TLS de 256 bits,
              assegurando que o tráfego de arquivos seja sempre protegido contra interceptações não autorizadas.
            </p>
          </section>

          <section class="content_section">
            <h2>Fale Conosco</h2>
            <p>
              Quer saber mais sobre como o WiiDocs pode se adequar à realidade da sua organização ou necessita de um plano customizado?
            </p>
            <div class="contact_box">
              <p><strong>E-mail:</strong> <a href="mailto:contato@wi-id.com" @click="trackContactClick('email', 'sobre_nos', 'contato@wi-id.com')">contato@wi-id.com</a></p>
              <p><strong>E-mail de desenvolvimento:</strong> <a href="mailto:desenvolvimento@wi-id.com" @click="trackContactClick('email', 'sobre_nos', 'desenvolvimento@wi-id.com')">desenvolvimento@wi-id.com</a></p>
              <p><strong>WhatsApp:</strong> <a href="https://wa.me/5562983398612" target="_blank" rel="noopener noreferrer" @click="trackContactClick('whatsapp', 'sobre_nos', '5562983398612')">(62) 98339-8612</a></p>
              <p><strong>Empresa Responsável:</strong> Work In Ideas (WiiD)</p>
            </div>
          </section>
        </div>

        <div class="page_cta">
          <h2>Pronto para começar?</h2>
          <p>Experimente o WiiDocs e descubra o padrão moderno de gestão de arquivos corporativos.</p>
          <RouterLink to="/cadastro" class="cta_btn" @click="trackCtaClick('criar_conta', 'sobre_nos')">CRIAR UMA CONTA</RouterLink>
        </div>
      </div>
    </main>

    <LandingFooter />
  </div>
</template>

<style lang="scss" scoped>
.institutional_page {
  background-color: #212121;
  color: #f7f7f7;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  font-family: 'Inter', sans-serif;
}

.institutional_main {
  flex: 1;
  padding: 120px 24px 80px;
}

.institutional_container {
  max-width: 920px;
  margin: 0 auto;
}

.breadcrumbs {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'Source Code Pro', monospace;
  font-size: 12px;
  margin-bottom: 28px;
}

.breadcrumb_link {
  color: rgba(247, 247, 247, 0.6);
  text-decoration: none;

  &:hover {
    color: #ff00ff;
  }
}

.breadcrumb_sep {
  color: rgba(247, 247, 247, 0.3);
}

.breadcrumb_current {
  color: #ff00ff;
}

.page_header {
  margin-bottom: 48px;
}

.page_badge {
  display: inline-block;
  font-family: 'Source Code Pro', monospace;
  font-size: 11px;
  font-weight: 700;
  color: #ff00ff;
  letter-spacing: 1px;
  padding: 6px 14px;
  background: rgba(255, 0, 255, 0.1);
  border: 1px solid rgba(255, 0, 255, 0.25);
  border-radius: 20px;
  margin-bottom: 16px;
}

.page_title {
  margin: 0 0 16px;
  font-family: 'Source Code Pro', monospace;
  font-size: clamp(28px, 3.2vw, 42px);
  font-weight: 800;
  color: #f7f7f7;
  line-height: 1.2;
}

.page_subtitle {
  margin: 0;
  font-size: 18px;
  line-height: 1.6;
  color: rgba(247, 247, 247, 0.75);
}

.content_grid {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.content_section {
  h2 {
    font-family: 'Source Code Pro', monospace;
    font-size: 22px;
    font-weight: 700;
    color: #f7f7f7;
    margin: 0 0 16px;
    border-bottom: 1px solid rgba(247, 247, 247, 0.1);
    padding-bottom: 12px;
  }

  p {
    font-size: 16px;
    line-height: 1.7;
    color: rgba(247, 247, 247, 0.75);
    margin: 0 0 16px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  strong {
    color: #f7f7f7;
  }
}

.values_cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-top: 24px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.value_card {
  background: rgba(121, 121, 121, 0.12);
  border: 1px solid rgba(247, 247, 247, 0.08);
  border-radius: 18px;
  padding: 24px;

  h3 {
    margin: 0 0 10px;
    font-family: 'Source Code Pro', monospace;
    font-size: 16px;
    font-weight: 700;
    color: #ff00ff;
  }

  p {
    margin: 0;
    font-size: 14px;
    line-height: 1.6;
    color: rgba(247, 247, 247, 0.7);
  }
}

.contact_box {
  background: rgba(121, 121, 121, 0.15);
  border: 1px solid rgba(247, 247, 247, 0.1);
  border-radius: 16px;
  padding: 24px;
  margin-top: 20px;

  p {
    margin: 0 0 10px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  a {
    color: #ff00ff;
    text-decoration: underline;

    &:hover {
      color: #ffffff;
    }
  }
}

.page_cta {
  margin-top: 64px;
  padding: 48px 32px;
  background: radial-gradient(circle at 50% 50%, rgba(255, 0, 255, 0.12) 0%, rgba(33, 33, 33, 0.9) 100%);
  border: 1px solid rgba(255, 0, 255, 0.3);
  border-radius: 24px;
  text-align: center;

  h2 {
    font-family: 'Source Code Pro', monospace;
    font-size: 24px;
    font-weight: 800;
    margin: 0 0 12px;
    color: #f7f7f7;
  }

  p {
    font-size: 15px;
    color: rgba(247, 247, 247, 0.75);
    margin: 0 0 24px;
  }
}

.cta_btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 14px 32px;
  background: #f7f7f7;
  color: #212121;
  font-family: 'Source Code Pro', monospace;
  font-size: 14px;
  font-weight: 800;
  border-radius: 30px;
  text-decoration: none;
  transition: all 0.2s ease;

  &:hover {
    background: #ffffff;
    box-shadow: 0 0 20px rgba(255, 0, 255, 0.5);
    transform: translateY(-2px);
  }
}
</style>
