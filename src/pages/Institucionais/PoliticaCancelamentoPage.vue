<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import LandingHeader from '@/pages/Landing/components/LandingHeader.vue'
import LandingFooter from '@/pages/Landing/components/LandingFooter.vue'
import { setPageSeo } from '@/utils/seo'

onMounted(() => {
  setPageSeo({
    title: 'Política de Cancelamento de Planos Anuais | AkiDocs',
    description: 'Regras e condições transparentes para cancelamento de planos anuais no AkiDocs: vigência de 12 meses, multa compensatória de 20% do saldo residual e 90 dias de acesso para exportação.',
    canonicalUrl: 'https://akidocs.com.br/politica-de-cancelamento'
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
          <span class="breadcrumb_current">Política de Cancelamento</span>
        </nav>

        <header class="page_header">
          <span class="page_badge">CONDIÇÕES COMERCIAIS</span>
          <h1 class="page_title">Política de Cancelamento — Planos Anuais</h1>
          <p class="page_subtitle">Última atualização: 11 de setembro de 2026</p>
        </header>

        <article class="legal_content">
          <section class="legal_section intro_section">
            <p>Esta Política estabelece as condições aplicáveis ao cancelamento dos planos anuais da plataforma AkiDocs.</p>
          </section>
          <section class="legal_section">
            <h2>1. VIGÊNCIA DO PLANO ANUAL</h2>
            <p>Os planos anuais possuem período de contratação de 12 meses, contado a partir da data de ativação da assinatura.</p>
            <p>A contratação do plano anual representa compromisso de permanência durante o respectivo período, em contrapartida às condições comerciais e valores oferecidos para essa modalidade.</p>
          </section>
          <section class="legal_section">
            <h2>2. SOLICITAÇÃO DE CANCELAMENTO</h2>
            <p>A empresa-cliente poderá solicitar o cancelamento do plano anual a qualquer momento.</p>
            <p>A solicitação deverá ser realizada por meio da plataforma oficial de suporte:</p>
            <p><a href="https://suporte.akidocs.com.br" target="_blank" rel="noopener noreferrer">suporte.akidocs.com.br</a></p>
            <p>O cancelamento será considerado solicitado na data de abertura do respectivo ticket.</p>
          </section>
          <section class="legal_section">
            <h2>3. CANCELAMENTO AO FINAL DO PERÍODO CONTRATADO</h2>
            <p>Caso a empresa-cliente solicite apenas a não renovação da assinatura, sem encerramento antecipado, não haverá cobrança de multa.</p>
            <p>O serviço permanecerá ativo até o término do período anual já contratado.</p>
            <p>Ao término desse período, a assinatura não será renovada.</p>
          </section>
          <section class="legal_section">
            <h2>4. CANCELAMENTO ANTECIPADO</h2>
            <p>Quando a empresa-cliente solicitar o encerramento do plano antes do término dos 12 meses contratados, será aplicada multa compensatória correspondente a:</p>
            <p>20% do valor das mensalidades ainda restantes até o final do período anual contratado.</p>
            <p>A multa incidirá somente sobre o saldo contratual ainda não vencido.</p>
            <p>Exemplo</p>
            <p>Plano anual equivalente a:</p>
            <p>R$ 200,00 por mês</p>
            <p>Cancelamento após o 8º mês:</p>
            <p>Restam 4 meses:</p>
            <p>4 × R$ 200,00 = R$ 800,00</p>
            <p>Multa de 20%:</p>
            <p>R$ 160,00</p>
            <p>Nesse exemplo, o valor devido pelo cancelamento antecipado será de R$ 160,00, além de eventuais valores já vencidos e não pagos.</p>
          </section>
          <section class="legal_section">
            <h2>5. PLANOS ANUAIS PAGOS ANTECIPADAMENTE</h2>
            <p>Quando o plano anual tiver sido integralmente pago antecipadamente, o valor correspondente ao período não utilizado poderá ser objeto de restituição proporcional, descontados:</p>
            <ul>
              <li>valores vencidos ou pendentes;</li>
              <li>a multa de cancelamento antecipado prevista nesta Política;</li>
              <li>outros valores comprovadamente devidos nos termos da contratação.</li>
            </ul>
            <p>O reembolso será calculado considerando o período restante após a data efetiva de encerramento.</p>
          </section>
          <section class="legal_section">
            <h2>6. PLANOS ANUAIS COM PAGAMENTO MENSAL</h2>
            <p>Quando o compromisso anual for contratado com pagamento parcelado mensalmente, o cancelamento antecipado interromperá a cobrança das parcelas futuras após o encerramento, permanecendo devidos:</p>
            <ul>
              <li>valores vencidos;</li>
              <li>valores referentes ao período efetivamente utilizado;</li>
              <li>multa de 20% sobre o saldo das parcelas restantes.</li>
            </ul>
            <p>Não será exigido o pagamento integral de todas as mensalidades vincendas apenas em razão do cancelamento antecipado.</p>
          </section>
          <section class="legal_section">
            <h2>7. CANCELAMENTO SEM MULTA POR RESPONSABILIDADE DO AKIDOCS</h2>
            <p>Não será aplicada multa de cancelamento antecipado quando o encerramento ocorrer em razão de:</p>
            <ul>
              <li>descumprimento material e não corrigido das obrigações assumidas pelo AkiDocs;</li>
              <li>indisponibilidade recorrente que caracterize descumprimento relevante do SLA;</li>
              <li>descontinuação definitiva de funcionalidade essencial ao serviço contratado, sem alternativa razoavelmente equivalente;</li>
              <li>encerramento definitivo da plataforma;</li>
              <li>outra hipótese em que o cancelamento decorra de inadimplemento contratual diretamente imputável à Work in Ideas.</li>
            </ul>
            <p>Nessas situações, eventuais valores pagos antecipadamente referentes ao período futuro não utilizado serão restituídos proporcionalmente, quando aplicável.</p>
          </section>
          <section class="legal_section">
            <h2>8. VALORES EM ABERTO</h2>
            <p>O cancelamento da assinatura não elimina valores já vencidos.</p>
            <p>Permanecerão devidos:</p>
            <ul>
              <li>mensalidades vencidas;</li>
              <li>cobranças pendentes;</li>
              <li>valores relativos a serviços efetivamente utilizados;</li>
              <li>multa de cancelamento antecipado, quando aplicável.</li>
            </ul>
          </section>
          <section class="legal_section">
            <h2>9. DATA EFETIVA DO CANCELAMENTO</h2>
            <p>Salvo quando acordado de outra forma, o cancelamento antecipado produzirá efeitos após o processamento da solicitação pela equipe do AkiDocs.</p>
            <p>A empresa-cliente será informada sobre a data efetiva de encerramento por meio do ticket de suporte.</p>
          </section>
          <section class="legal_section">
            <h2>10. ACESSO AOS DADOS APÓS O CANCELAMENTO</h2>
            <p>Após o encerramento da contratação, os arquivos e dados da empresa-cliente permanecerão disponíveis exclusivamente para ela pelo período de:</p>
            <p>90 dias.</p>
            <p>Esse período destina-se à consulta e exportação dos dados.</p>
            <p>Durante esse prazo, poderão ser limitadas funcionalidades relacionadas a:</p>
            <ul>
              <li>novos uploads;</li>
              <li>criação de usuários;</li>
              <li>criação de novos arquivos;</li>
              <li>alterações que não sejam necessárias à retirada dos dados.</li>
            </ul>
          </section>
          <section class="legal_section">
            <h2>11. EXPORTAÇÃO DOS DADOS</h2>
            <p>Durante o período de 90 dias, a empresa-cliente poderá:</p>
            <ul>
              <li>realizar o download de todos os seus arquivos;</li>
              <li>manter a estrutura de pastas utilizada no AkiDocs;</li>
              <li>exportar por planilha seus dados cadastrais;</li>
              <li>exportar os dados de funcionários;</li>
              <li>exportar os dados de clientes;</li>
              <li>exportar os dados de funcionários vinculados aos clientes.</li>
            </ul>
            <p>A empresa-cliente é responsável por concluir a exportação antes do término desse prazo.</p>
          </section>
          <section class="legal_section">
            <h2>12. EXCLUSÃO DEFINITIVA</h2>
            <p>Após os 90 dias posteriores ao encerramento:</p>
            <ul>
              <li>os dados serão removidos dos sistemas ativos;</li>
              <li>os arquivos deixarão de estar acessíveis;</li>
              <li>eventuais cópias residuais permanecerão apenas durante o ciclo normal de backups.</li>
            </ul>
            <p>Os backups são mantidos por até 30 dias, sendo posteriormente substituídos ou eliminados conforme a política de retenção da plataforma.</p>
          </section>
          <section class="legal_section">
            <h2>13. RENOVAÇÃO</h2>
            <p>A eventual renovação do plano anual observará as condições comerciais vigentes e o que estiver previsto na contratação.</p>
            <p>A empresa-cliente poderá solicitar a não renovação antes do início de um novo período anual, sem incidência da multa prevista para cancelamento antecipado.</p>
          </section>
          <section class="legal_section">
            <h2>14. ALTERAÇÃO DE PLANO</h2>
            <p>Quando disponível, a empresa-cliente poderá optar por migrar para outro plano AkiDocs em vez de cancelar a contratação.</p>
            <p>Eventuais ajustes de valores, créditos ou período contratual serão informados antes da conclusão da alteração.</p>
          </section>
          <section class="legal_section">
            <h2>15. SITUAÇÕES EXCEPCIONAIS</h2>
            <p>A Work in Ideas poderá avaliar, a seu critério e mediante justificativa, situações excepcionais que envolvam pedido de dispensa ou redução da multa.</p>
            <p>A concessão excepcional em determinado caso não altera esta Política nem constitui obrigação de concessão em situações futuras.</p>
          </section>
          <section class="legal_section">
            <h2>16. RELAÇÃO COM OS DEMAIS DOCUMENTOS</h2>
            <p>Esta Política deve ser interpretada em conjunto com:</p>
            <ul>
              <li>os Termos de Uso;</li>
              <li>o contrato ou proposta comercial;</li>
              <li>o Acordo de Nível de Serviço — SLA;</li>
              <li>a Política de Privacidade;</li>
              <li>o DPA, quando aplicável.</li>
            </ul>
            <p>Em caso de condição específica expressamente negociada com determinada empresa-cliente, prevalecerá o instrumento contratual específico para aquela contratação.</p>
          </section>
          <section class="legal_section">
            <h2>17. CONTATO PARA CANCELAMENTO</h2>
            <p>Pedidos de cancelamento, não renovação ou alteração do plano deverão ser realizados exclusivamente por meio da Central de Suporte:</p>
            <p><a href="https://suporte.akidocs.com.br" target="_blank" rel="noopener noreferrer">suporte.akidocs.com.br</a></p>
          </section>
        </article>

        <div class="back_to_home">
          <RouterLink to="/" class="back_link">← Voltar para a página inicial</RouterLink>
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
  margin: 0 0 12px;
  font-family: 'Source Code Pro', monospace;
  font-size: clamp(26px, 3.5vw, 40px);
  font-weight: 800;
  color: #f7f7f7;
  line-height: 1.25;
  letter-spacing: -0.5px;
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

.intro_section {
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(247, 247, 247, 0.08);
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
    letter-spacing: -0.2px;
  }

  h3 {
    font-family: 'Source Code Pro', monospace;
    font-size: 16px;
    font-weight: 600;
    color: #00f0ff;
    margin: 20px 0 12px;
  }

  p {
    font-size: 15px;
    line-height: 1.75;
    color: rgba(247, 247, 247, 0.78);
    margin: 0 0 14px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  ul {
    margin: 0 0 16px 24px;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;

    li {
      font-size: 15px;
      line-height: 1.65;
      color: rgba(247, 247, 247, 0.78);

      strong {
        color: #f7f7f7;
      }
    }
  }

  strong {
    color: #f7f7f7;
    font-weight: 600;
  }

  a {
    color: #00f0ff;
    text-decoration: underline;
    text-underline-offset: 3px;
    transition: color 0.2s ease;

    &:hover {
      color: #ff00ff;
    }
  }
}

.code_callout {
  font-family: 'Source Code Pro', monospace;
  font-size: 14px;
  background: rgba(0, 240, 255, 0.08);
  border: 1px solid rgba(0, 240, 255, 0.25);
  border-radius: 8px;
  padding: 12px 18px;
  margin: 14px 0;
  color: #00f0ff;
  overflow-x: auto;
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
  color: #00f0ff;
  text-decoration: none;
  transition: all 0.2s ease;

  &:hover {
    color: #ff00ff;
    text-decoration: underline;
  }
}
</style>
