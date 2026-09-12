<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import LandingHeader from '@/pages/Landing/components/LandingHeader.vue'
import LandingFooter from '@/pages/Landing/components/LandingFooter.vue'
import { setPageSeo } from '@/utils/seo'
import { trackContactClick, trackCtaClick } from '@/utils/tracking'

onMounted(() => {
  setPageSeo({
    title: 'Sobre Nós — AkiDocs | Gestão Segura de Documentos Corporativos na Nuvem',
    description:
      'Conheça o AkiDocs, desenvolvido pela Work in Ideas (12+ anos de mercado, Goiânia-GO). Plataforma web para armazenamento, organização e compartilhamento seguro de arquivos para empresas.',
    canonicalUrl: typeof window !== 'undefined' ? `${window.location.origin}/sobre` : 'https://akidocs.com.br/sobre'
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
          <h1 class="page_title">Todos os seus documentos, Aki!</h1>
          <p class="page_subtitle">
            O AkiDocs é uma plataforma corporativa B2B desenvolvida pela Work in Ideas para simplificar o armazenamento, a organização e o compartilhamento seguro de arquivos em nuvem para empresas e clientes.
          </p>
        </header>

        <div class="content_grid">
          <section class="content_section">
            <h2>Quem Somos</h2>
            <p>
              O <strong>AkiDocs</strong> é operado pela <strong>Work in Ideas Informática Ltda</strong> (CNPJ: <strong>17.808.481/0001-69</strong>),
              empresa de tecnologia com <strong>mais de 12 anos de experiência</strong> no mercado, sediada em Goiânia, Goiás.
            </p>
            <p>
              Desenvolvemos soluções digitais de alto impacto para empresas que buscam modernizar a governança de informações, eliminar o caos de anexos espalhados em aplicativos de mensagens e e-mails, e estabelecer um ambiente seguro e controlado para seus documentos e clientes.
            </p>
          </section>

          <section class="content_section">
            <h2>Nossos Pilares de Engenharia & Governança</h2>
            <div class="values_cards">
              <div class="value_card">
                <h3>Segurança e Privacidade</h3>
                <p>Criptografia em trânsito (HTTPS/TLS 1.2+) e em repouso (AES-256). Isolamento lógico de dados por empresa e estrita conformidade com a LGPD.</p>
              </div>
              <div class="value_card">
                <h3>Privacidade de Conteúdo</h3>
                <p>O AkiDocs não lê, não analisa, não monitora e não comercializa o conteúdo dos seus arquivos. Os dados pertencem exclusivamente à sua organização.</p>
              </div>
              <div class="value_card">
                <h3>Confiabilidade & Disponibilidade</h3>
                <p>SLA de 99,5% de disponibilidade mensal, rotinas diárias de backup com retenção de 30 dias, RPO de até 24h e RTO de até 8h para continuidade de negócios.</p>
              </div>
            </div>
          </section>

          <section class="content_section">
            <h2>Infraestrutura em Nuvem</h2>
            <p>
              O AkiDocs utiliza provedores de infraestrutura e serviços em nuvem reconhecidos globalmente por seus rígidos padrões de segurança e certificações internacionais (como ISO 27001 e SOC 2):
            </p>
            <ul class="infra_list">
              <li><strong>DigitalOcean & AWS:</strong> Hospedagem corporativa em servidores dedicados e armazenamento distribuído de objetos em nuvem.</li>
              <li><strong>Cloudflare:</strong> Rede global de distribuição (CDN), proteção contra ataques de negação de serviço (DDoS) e comunicação criptografada via HTTPS/TLS.</li>
              <li><strong>PagSeguro:</strong> Processamento seguro de pagamentos e assinaturas com certificação PCI-DSS.</li>
            </ul>
          </section>

          <section class="content_section">
            <h2>Conformidade LGPD & Governança de Dados</h2>
            <p>
              Nos termos da Lei Geral de Proteção de Dados (Lei nº 13.709/2018):
            </p>
            <ul class="infra_list">
              <li><strong>Sua empresa atua como Controladora:</strong> define quais arquivos e dados de colaboradores ou clientes são inseridos na plataforma.</li>
              <li><strong>A Work in Ideas atua como Operadora:</strong> realiza o processamento e armazenamento estritamente sob as diretrizes contratadas.</li>
            </ul>
            <p>
              Nomeamos Encarregado pelo Tratamento de Dados Pessoais (DPO) dedicado para atender a quaisquer dúvidas ou solicitações sobre privacidade:
            </p>
            <div class="contact_box dpo_box">
              <p><strong>Encarregado de Dados (DPO):</strong> Charles Egidio</p>
              <p><strong>Canal do DPO:</strong> <a href="mailto:charles@wi-id.com" @click="trackContactClick('email', 'sobre_dpo', 'charles@wi-id.com')">charles@wi-id.com</a></p>
            </div>
          </section>

          <section class="content_section">
            <h2>Canais de Atendimento & Suporte</h2>
            <p>
              Estamos à disposição para atender sua equipe, esclarecer dúvidas contratuais ou estruturar integrações customizadas:
            </p>
            <div class="contact_box">
              <p><strong>Central Oficial de Suporte:</strong> <a href="https://suporte.akidocs.com.br" target="_blank" rel="noopener noreferrer">suporte.akidocs.com.br</a></p>
              <p><strong>Contato Comercial & Institucional:</strong> <a href="mailto:contato@wi-id.com" @click="trackContactClick('email', 'sobre_contato', 'contato@wi-id.com')">contato@wi-id.com</a></p>
              <p><strong>WhatsApp / Telefone:</strong> <a href="https://wa.me/5562983398612" target="_blank" rel="noopener noreferrer" @click="trackContactClick('whatsapp', 'sobre_whatsapp', '5562983398612')">(62) 98339-8612</a></p>
              <p><strong>Endereço:</strong> Av. T-1, 2266 — Setor Bueno, Goiânia - GO, CEP 74215-022</p>
              <p><strong>Razão Social:</strong> Work in Ideas Informática Ltda — CNPJ: 17.808.481/0001-69</p>
            </div>
          </section>
        </div>

        <div class="page_cta">
          <h2>Pronto para organizar seus documentos?</h2>
          <p>Experimente o AkiDocs gratuitamente por 8 dias com todos os recursos liberados, sem compromisso.</p>
          <RouterLink to="/contratar" class="cta_btn" @click="trackCtaClick('testar_gratis', 'sobre_nos')">TESTAR GRÁTIS POR 8 DIAS</RouterLink>
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

  @media (max-width: 768px) {
    padding: 100px 16px 60px;
  }
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
  font-size: 13px;
  color: rgba(247, 247, 247, 0.5);
  margin-bottom: 32px;
}

.breadcrumb_link {
  color: rgba(247, 247, 247, 0.7);
  text-decoration: none;
  transition: color 0.2s ease;

  &:hover {
    color: #ff00ff;
  }
}

.breadcrumb_sep {
  color: rgba(247, 247, 247, 0.3);
}

.breadcrumb_current {
  color: #00f0ff;
  font-weight: 600;
}

.page_header {
  margin-bottom: 48px;
  border-bottom: 1px solid rgba(247, 247, 247, 0.1);
  padding-bottom: 32px;
}

.page_badge {
  display: inline-block;
  font-family: 'Source Code Pro', monospace;
  font-size: 11px;
  font-weight: 700;
  color: #00f0ff;
  letter-spacing: 1.5px;
  padding: 6px 14px;
  background: rgba(0, 240, 255, 0.08);
  border: 1px solid rgba(0, 240, 255, 0.25);
  border-radius: 20px;
  margin-bottom: 16px;
}

.page_title {
  margin: 0 0 16px;
  font-family: 'Source Code Pro', monospace;
  font-size: clamp(28px, 3.5vw, 42px);
  font-weight: 800;
  color: #f7f7f7;
  line-height: 1.25;
  letter-spacing: -0.5px;
}

.page_subtitle {
  margin: 0;
  font-size: 17px;
  line-height: 1.65;
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
    font-size: 20px;
    font-weight: 700;
    color: #f7f7f7;
    margin: 0 0 16px;
    border-bottom: 1px solid rgba(247, 247, 247, 0.1);
    padding-bottom: 12px;
  }

  p {
    font-size: 15px;
    line-height: 1.75;
    color: rgba(247, 247, 247, 0.78);
    margin: 0 0 16px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  strong {
    color: #f7f7f7;
    font-weight: 600;
  }
}

.infra_list {
  margin: 0 0 16px 24px;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;

  li {
    font-size: 15px;
    line-height: 1.65;
    color: rgba(247, 247, 247, 0.78);

    strong {
      color: #f7f7f7;
    }
  }
}

.values_cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-top: 20px;

  @media (max-width: 860px) {
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
    color: #00f0ff;
  }

  p {
    margin: 0;
    font-size: 14px;
    line-height: 1.6;
    color: rgba(247, 247, 247, 0.72);
  }
}

.contact_box {
  background: rgba(121, 121, 121, 0.15);
  border: 1px solid rgba(247, 247, 247, 0.1);
  border-radius: 16px;
  padding: 24px;
  margin-top: 16px;

  p {
    margin: 0 0 10px;
    font-size: 14px;
    line-height: 1.6;
    color: rgba(247, 247, 247, 0.8);

    &:last-child {
      margin-bottom: 0;
    }
  }

  a {
    color: #00f0ff;
    text-decoration: underline;
    text-underline-offset: 3px;

    &:hover {
      color: #ff00ff;
    }
  }

  &.dpo_box {
    background: rgba(0, 240, 255, 0.04);
    border-color: rgba(0, 240, 255, 0.2);
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
