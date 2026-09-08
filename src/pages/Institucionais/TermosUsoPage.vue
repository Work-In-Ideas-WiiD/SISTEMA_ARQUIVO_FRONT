<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import LandingHeader from '@/pages/Landing/components/LandingHeader.vue'
import LandingFooter from '@/pages/Landing/components/LandingFooter.vue'
import { setPageSeo } from '@/utils/seo'

onMounted(() => {
  setPageSeo({
    title: 'Termos de Uso — WiiDocs | Condições de Prestação de Serviços SaaS',
    description:
      'Leia os Termos de Uso do WiiDocs. Conheça as condições de contratação, licença de software, responsabilidades e direitos ao utilizar nossa plataforma.',
    canonicalUrl: typeof window !== 'undefined' ? `${window.location.origin}/termos-de-uso` : 'https://wiidocs.com.br/termos-de-uso'
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
          <span class="breadcrumb_current">Termos de Uso</span>
        </nav>

        <header class="page_header">
          <span class="page_badge">TERMOS & CONDIÇÕES</span>
          <h1 class="page_title">Termos de Uso do Serviço</h1>
          <p class="page_subtitle">
            Última atualização: 08 de março de 2026.
          </p>
        </header>

        <article class="legal_content">
          <section class="legal_section">
            <h2>1. Aceitação dos Termos</h2>
            <p>
              Estes Termos de Uso regem a utilização da plataforma web <strong>WiiDocs</strong>,
              fornecida pela <strong>Work In Ideas (WiiD)</strong>. Ao criar uma conta, contratar um plano ou utilizar qualquer
              funcionalidade do sistema, você ("Usuário" ou "Contratante") concorda de maneira plena e expressa com as regras aqui estipuladas.
            </p>
          </section>

          <section class="legal_section">
            <h2>2. Objeto e Licença de Uso SaaS</h2>
            <p>
              O WiiDocs é um software disponibilizado como serviço (SaaS - Software as a Service).
              Concedemos à sua empresa uma licença limitada, revogável, não exclusiva e intransferível de uso do software,
              destinada ao gerenciamento de documentos, minutas de contratos, equipes e clientes pela internet.
            </p>
            <p>
              A concessão desta licença não implica em venda de código-fonte, cessão de direitos autorais ou transferência de propriedade intelectual sobre a plataforma.
            </p>
          </section>

          <section class="legal_section">
            <h2>3. Cadastro e Segurança da Conta</h2>
            <p>
              O Usuário é o único responsável pela veracidade e precisão das informações cadastradas no momento da criação da conta,
              bem como pelo sigilo de suas senhas de acesso. Todas as ações executadas através das credenciais corporativas cadastradas
              serão de responsabilidade exclusiva do Usuário Contratante.
            </p>
          </section>

          <section class="legal_section">
            <h2>4. Planos, Pagamentos e Renovação</h2>
            <ul>
              <li><strong>Contratação:</strong> Os planos disponíveis, limites de usuários e cotas de armazenamento são detalhados na página de contratação e no painel administrativo do cliente.</li>
              <li><strong>Cobrança:</strong> As assinaturas são cobradas na periodicidade contratada (mensal ou anual), de forma antecipada, via cartão de crédito ou meio autorizado.</li>
              <li><strong>Renovação Automática:</strong> Para evitar a interrupção dos serviços e do acesso aos documentos, as assinaturas renovam-se automaticamente ao término de cada período, salvo solicitação prévia de cancelamento.</li>
              <li><strong>Inadimplência:</strong> Em caso de não processamento do pagamento, o acesso às funcionalidades de upload e edição poderá ser suspenso temporariamente até a regularização financeira.</li>
            </ul>
          </section>

          <section class="legal_section">
            <h2>5. Propriedade Intelectual dos Dados do Cliente</h2>
            <p>
              <strong>O Contratante é e permanecerá como o único e exclusivo proprietário de todos os arquivos, contratos, minutas e informações enviadas para a plataforma WiiDocs.</strong>
            </p>
            <p>
              O WiiDocs não reivindica quaisquer direitos de propriedade sobre o conteúdo dos seus documentos, utilizando-os apenas e tão somente para a execução técnica dos serviços de armazenamento e processamento contratados.
            </p>
          </section>

          <section class="legal_section">
            <h2>6. Uso Aceitável e Vedações</h2>
            <p>É expressamente proibido ao Usuário:</p>
            <ul>
              <li>Utilizar a plataforma para hospedar, disseminar ou transmitir arquivos com conteúdo ilícito, pornográfico, difamatório ou que viole direitos autorais de terceiros;</li>
              <li>Tentar descompilar, realizar engenharia reversa ou violar as medidas de segurança do código-fonte e da infraestrutura do WiiDocs;</li>
              <li>Submeter o sistema a cargas artificiais abusivas ou ataques de negação de serviço (DDoS);</li>
              <li>Sublocar ou revender o acesso ao sistema sem expressa autorização por escrito da WiiD.</li>
            </ul>
          </section>

          <section class="legal_section">
            <h2>7. Nível de Serviço (SLA) e Disponibilidade</h2>
            <p>
              Empregamos nossos melhores esforços técnicos e operacionais para manter a disponibilidade da plataforma em patamares iguais ou superiores a 99,5% do tempo.
              Manutenções preventivas programadas serão notificadas previamente sempre que possível e realizadas preferencialmente em horários de menor tráfego.
            </p>
          </section>

          <section class="legal_section">
            <h2>8. Cancelamento e Retirada de Dados</h2>
            <p>
              O Usuário pode cancelar sua assinatura a qualquer momento através do painel da conta ou entrando em contato com o suporte.
              Após a solicitação de cancelamento, a assinatura permanecerá ativa até o encerramento do ciclo já pago.
            </p>
            <p>
              Garantimos ao Contratante o direito de realizar o download de todos os seus arquivos antes da exclusão definitiva da conta de nossos servidores.
            </p>
          </section>

          <section class="legal_section">
            <h2>9. Foro e Legislação Aplicável</h2>
            <p>
              Estes Termos de Uso são regidos e interpretados de acordo com a legislação da República Federativa do Brasil.
              Fica eleito o Foro da Comarca de São Paulo/SP para dirimir eventuais controvérsias decorrentes deste contrato,
              com renúncia expressa a qualquer outro, por mais privilegiado que seja.
            </p>
          </section>

          <section class="legal_section">
            <h2>10. Canais Oficiais de Contato</h2>
            <p>
              Para suporte, esclarecimento de dúvidas sobre estes termos ou solicitações corporativas, utilize nossos canais oficiais:
            </p>
            <div class="contact_box">
              <p><strong>E-mail:</strong> <a href="mailto:contato@wi-id.com">contato@wi-id.com</a></p>
              <p><strong>E-mail de desenvolvimento:</strong> <a href="mailto:desenvolvimento@wi-id.com">desenvolvimento@wi-id.com</a></p>
              <p><strong>WhatsApp:</strong> <a href="https://wa.me/5562983398612" target="_blank" rel="noopener noreferrer">(62) 98339-8612</a></p>
              <p><strong>Empresa Responsável:</strong> Work In Ideas (WiiD)</p>
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
