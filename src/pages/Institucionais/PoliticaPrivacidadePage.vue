<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import LandingHeader from '@/pages/Landing/components/LandingHeader.vue'
import LandingFooter from '@/pages/Landing/components/LandingFooter.vue'
import { setPageSeo } from '@/utils/seo'
import { trackContactClick } from '@/utils/tracking'

onMounted(() => {
  setPageSeo({
    title: 'Política de Privacidade — WiiDocs | Proteção de Dados e LGPD',
    description:
      'Conheça a Política de Privacidade do WiiDocs. Entenda como tratamos, armazenamos e protegemos seus dados pessoais em total conformidade com a LGPD.',
    canonicalUrl: typeof window !== 'undefined' ? `${window.location.origin}/politica-de-privacidade` : 'https://wiidocs.com.br/politica-de-privacidade'
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
          <span class="breadcrumb_current">Política de Privacidade</span>
        </nav>

        <header class="page_header">
          <span class="page_badge">LEGAL & LGPD</span>
          <h1 class="page_title">Política de Privacidade</h1>
          <p class="page_subtitle">
            Última atualização: 08 de março de 2026.
          </p>
        </header>

        <article class="legal_content">
          <section class="legal_section">
            <h2>1. Apresentação e Identificação</h2>
            <p>
              Esta Política de Privacidade descreve como a <strong>Work In Ideas (WiiD)</strong>,
              desenvolvedora da plataforma <strong>WiiDocs</strong>, coleta, utiliza, armazena, compartilha e protege
              os dados pessoais de seus usuários no âmbito da prestação dos serviços de gestão documental corporativa.
            </p>
            <p>
              Ao utilizar a plataforma WiiDocs, você declara ter ciência dos termos aqui estabelecidos, os quais foram redigidos
              em estrita consonância com a <strong>Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018 - LGPD)</strong>
              e demais normas vigentes sobre segurança da informação.
            </p>
          </section>

          <section class="legal_section">
            <h2>2. Dados Pessoais Coletados</h2>
            <p>Para a operação adequada do sistema, podemos coletar as seguintes categorias de dados:</p>
            <ul>
              <li><strong>Dados Cadastrais da Empresa e do Administrador:</strong> Razão Social, Nome Fantasia, CNPJ, Nome Completo do responsável, CPF, e-mail corporativo, número de telefone de contato e endereço comercial.</li>
              <li><strong>Dados de Colaboradores e Usuários do Sistema:</strong> Nome completo, e-mail corporativo, cargo, função e setor de vinculação.</li>
              <li><strong>Dados de Clientes Cadastrados:</strong> Razão social ou nome civil, dados de contato e documentos associados para consulta autorizada no Portal do Cliente.</li>
              <li><strong>Dados de Pagamento:</strong> Processados de forma tokenizada e criptografada por gateways de pagamento certificados (PCI-DSS compliant). O WiiDocs não armazena o número integral ou o código CVV de cartões em seus servidores.</li>
              <li><strong>Dados Técnicos e Registros de Acesso:</strong> Endereço IP, data e hora de login, logs de upload, download e alterações documentais, tipo de navegador e identificadores de sessão para fins de segurança e auditoria.</li>
            </ul>
          </section>

          <section class="legal_section">
            <h2>3. Finalidade do Tratamento de Dados</h2>
            <p>Os dados pessoais coletados são utilizados exclusivamente para as seguintes finalidades:</p>
            <ul>
              <li>Criar, autenticar e gerenciar contas de acesso administrativo e de clientes;</li>
              <li>Disponibilizar o serviço de armazenamento, catalogação e download de contratos e arquivos;</li>
              <li>Executar fluxos de assinaturas digitais e validações jurídicas de documentos;</li>
              <li>Emitir faturas, processar cobranças e manter o controle de planos e assinaturas ativas;</li>
              <li>Garantir a segurança da informação, prevenindo fraudes e acessos não autorizados;</li>
              <li>Prestar suporte técnico, esclarecer dúvidas e atender chamados de atendimento;</li>
              <li>Cumprir obrigações legais, regulatórias ou ordens de autoridades competentes.</li>
            </ul>
          </section>

          <section class="legal_section">
            <h2>4. Armazenamento, Segurança e Criptografia</h2>
            <p>
              Adotamos práticas técnicas e organizacionais rígidas para assegurar a inviolabilidade dos seus dados:
            </p>
            <ul>
              <li><strong>Criptografia em Trânsito e em Repouso:</strong> Toda comunicação entre seu navegador e a plataforma é protegida via protocolo HTTPS com criptografia SSL/TLS de 256 bits.</li>
              <li><strong>Isolamento Lógico:</strong> Os dados de cada empresa contratante são mantidos isolados logicamente, impedindo qualquer acesso cruzado de informações entre diferentes organizações.</li>
              <li><strong>Controle Rigoroso de Acesso:</strong> Somente usuários com credenciais válidas e permissões específicas têm acesso aos arquivos aos quais foram previamente vinculados.</li>
              <li><strong>Backups Periódicos:</strong> Rotinas diárias e redundantes de backup para garantia da continuidade dos negócios e prevenção de perdas acidentais.</li>
            </ul>
          </section>

          <section class="legal_section">
            <h2>5. Compartilhamento de Dados com Terceiros</h2>
            <p>
              O WiiDocs não comercializa, não aluga e não cede seus dados pessoais para fins publicitários de terceiros.
              O compartilhamento de dados ocorre unicamente nas seguintes hipóteses estritas:
            </p>
            <ul>
              <li>Provedores de infraestrutura de nuvem e servidores de alta disponibilidade;</li>
              <li>Gateways de pagamento autorizados para viabilizar as transações financeiras;</li>
              <li>Autoridades judiciais, policiais ou governamentais, mediante ordem formal ou dever legal.</li>
            </ul>
          </section>

          <section class="legal_section">
            <h2>6. Direitos do Titular de Dados (Art. 18 da LGPD)</h2>
            <p>Conforme previsto na LGPD, você possui os seguintes direitos em relação aos seus dados pessoais:</p>
            <ul>
              <li>Confirmação da existência de tratamento e acesso facilitado aos dados;</li>
              <li>Correção de dados incompletos, inexatos ou desatualizados;</li>
              <li>Anonimização, bloqueio ou eliminação de dados desnecessários ou tratados em desconformidade com a lei;</li>
              <li>Portabilidade dos dados para outro fornecedor de serviço, mediante requisição expressa;</li>
              <li>Eliminação dos dados pessoais tratados com o seu consentimento, ressalvadas as hipóteses de guarda legal;</li>
              <li>Informação sobre entidades públicas e privadas com as quais houve compartilhamento;</li>
              <li>Revogação do consentimento nos termos da legislação aplicável.</li>
            </ul>
          </section>

          <section class="legal_section">
            <h2>7. Uso de Cookies e Tecnologias Conexas</h2>
            <p>
              Utilizamos cookies estritamente necessários para manter a autenticação ativa do usuário,
              preservar preferências de visualização (como Dark Mode) e cookies de métricas (como Google Analytics)
              para compreender padrões agregados de navegação e aprimorar a performance da plataforma.
              Você pode configurar seu navegador para recusar cookies, ciente de que certas funcionalidades de login podem ser impactadas.
            </p>
          </section>

          <section class="legal_section">
            <h2>8. Encarregado de Proteção de Dados (DPO) e Contato</h2>
            <p>
              Para exercer seus direitos como titular de dados pessoais ou esclarecer dúvidas sobre esta Política de Privacidade,
              entre em contato com o nosso Encarregado de Proteção de Dados através do canal oficial:
            </p>
            <div class="contact_box">
              <p><strong>Encarregado (DPO):</strong> Gestão de Privacidade WiiDocs</p>
              <p><strong>E-mail:</strong> <a href="mailto:contato@wi-id.com" @click="trackContactClick('email', 'politica_privacidade', 'contato@wi-id.com')">contato@wi-id.com</a></p>
              <p><strong>E-mail de desenvolvimento:</strong> <a href="mailto:desenvolvimento@wi-id.com" @click="trackContactClick('email', 'politica_privacidade', 'desenvolvimento@wi-id.com')">desenvolvimento@wi-id.com</a></p>
              <p><strong>WhatsApp:</strong> <a href="https://wa.me/5562983398612" target="_blank" rel="noopener noreferrer" @click="trackContactClick('whatsapp', 'politica_privacidade', '5562983398612')">(62) 98339-8612</a></p>
              <p><strong>Empresa Controladora:</strong> Work In Ideas (WiiD)</p>
            </div>
          </section>
        </article>

        <div class="back_to_home">
          <RouterLink to="/" class="back_link">
            &larr; Voltar para a página inicial
          </RouterLink>
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
  max-width: 900px;
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
  margin: 0 0 12px;
  font-family: 'Source Code Pro', monospace;
  font-size: clamp(28px, 3.2vw, 42px);
  font-weight: 800;
  color: #f7f7f7;
  line-height: 1.2;
}

.page_subtitle {
  margin: 0;
  font-family: 'Source Code Pro', monospace;
  font-size: 14px;
  color: rgba(247, 247, 247, 0.6);
}

.legal_content {
  display: flex;
  flex-direction: column;
  gap: 36px;
}

.legal_section {
  h2 {
    font-family: 'Source Code Pro', monospace;
    font-size: 20px;
    font-weight: 700;
    color: #f7f7f7;
    margin: 0 0 16px;
    border-bottom: 1px solid rgba(247, 247, 247, 0.1);
    padding-bottom: 10px;
  }

  p {
    font-size: 15px;
    line-height: 1.7;
    color: rgba(247, 247, 247, 0.75);
    margin: 0 0 14px;
  }

  ul {
    margin: 0 0 16px 20px;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 10px;

    li {
      font-size: 15px;
      line-height: 1.6;
      color: rgba(247, 247, 247, 0.75);

      strong {
        color: #f7f7f7;
      }
    }
  }

  strong {
    color: #f7f7f7;
  }
}

.contact_box {
  background: rgba(121, 121, 121, 0.15);
  border: 1px solid rgba(247, 247, 247, 0.1);
  border-radius: 16px;
  padding: 24px;
  margin-top: 16px;

  p {
    margin: 0 0 8px;

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

.back_to_home {
  margin-top: 56px;
  padding-top: 24px;
  border-top: 1px solid rgba(247, 247, 247, 0.1);
}

.back_link {
  font-family: 'Source Code Pro', monospace;
  font-size: 14px;
  font-weight: 600;
  color: #ff00ff;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
}
</style>
