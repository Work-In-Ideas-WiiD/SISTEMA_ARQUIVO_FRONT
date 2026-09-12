<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import LandingHeader from '@/pages/Landing/components/LandingHeader.vue'
import LandingFooter from '@/pages/Landing/components/LandingFooter.vue'
import { setPageSeo } from '@/utils/seo'

onMounted(() => {
  setPageSeo({
    title: 'SLA — Acordo de Nível de Serviço | AkiDocs',
    description: 'Conheça o SLA do AkiDocs: disponibilidade mensal de 99,5%, RPO de 24 horas, RTO de 8 horas, retenção de backups por 30 dias e classificação de incidentes.',
    canonicalUrl: 'https://akidocs.com.br/sla'
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
          <span class="breadcrumb_current">SLA — Nível de Serviço</span>
        </nav>

        <header class="page_header">
          <span class="page_badge">NÍVEL DE SERVIÇO</span>
          <h1 class="page_title">Acordo de Nível de Serviço (SLA)</h1>
          <p class="page_subtitle">Versão 1.0 — Aplicável aos serviços contratados da plataforma AkiDocs</p>
        </header>

        <article class="legal_content">
          <section class="legal_section intro_section">
            <p>Este Acordo de Nível de Serviço (“SLA”) estabelece os níveis de disponibilidade, suporte, continuidade, manutenção e resposta a incidentes aplicáveis à plataforma AkiDocs, operada pela Work in Ideas.</p>
            <p>Este SLA integra as condições comerciais e contratuais aplicáveis à contratação do AkiDocs.</p>
          </section>
          <section class="legal_section">
            <h2>1. OBJETO</h2>
            <p>O presente SLA tem como objetivo estabelecer os níveis mínimos de serviço aplicáveis à disponibilização do AkiDocs, incluindo:</p>
            <ul>
              <li>disponibilidade da plataforma;</li>
              <li>manutenção da infraestrutura;</li>
              <li>atendimento de suporte;</li>
              <li>classificação e tratamento de incidentes;</li>
              <li>backup e recuperação;</li>
              <li>continuidade do serviço;</li>
              <li>compensações aplicáveis em caso de descumprimento dos níveis de disponibilidade aqui estabelecidos.</li>
            </ul>
          </section>
          <section class="legal_section">
            <h2>2. DISPONIBILIDADE DA PLATAFORMA</h2>
            <p>O AkiDocs buscará manter uma disponibilidade mensal mínima de:</p>
            <p>99,5% ao mês.</p>
            <p>A disponibilidade será calculada mensalmente segundo a seguinte fórmula:</p>
            <div class="code_callout">Disponibilidade (%) = [(Tempo total do período - Tempo de indisponibilidade) ÷ Tempo total do período] × 100</div>
            <p>Para fins deste SLA, considera-se indisponibilidade a impossibilidade generalizada de utilização de funções essenciais da plataforma por falha atribuível ao AkiDocs.</p>
            <p>São consideradas funções essenciais:</p>
            <ul>
              <li>autenticação de usuários;</li>
              <li>acesso aos arquivos autorizados;</li>
              <li>upload de arquivos;</li>
              <li>download de arquivos;</li>
              <li>navegação pelas pastas;</li>
              <li>gerenciamento básico de usuários e permissões.</li>
            </ul>
            <p>Problemas isolados que afetem apenas determinado usuário, equipamento, conexão ou arquivo não serão considerados indisponibilidade geral da plataforma.</p>
          </section>
          <section class="legal_section">
            <h2>3. EVENTOS NÃO COMPUTADOS COMO INDISPONIBILIDADE</h2>
            <p>Não serão contabilizados para fins do cálculo de disponibilidade:</p>
            <ul>
              <li>manutenções programadas;</li>
              <li>manutenções emergenciais necessárias para preservar segurança ou integridade do sistema;</li>
              <li>indisponibilidade causada pela conexão de internet, equipamentos ou ambiente tecnológico do cliente;</li>
              <li>erros decorrentes de configuração realizada pelo próprio cliente;</li>
              <li>indisponibilidade provocada por uso inadequado da plataforma;</li>
              <li>suspensão do serviço decorrente de inadimplência ou violação contratual;</li>
              <li>eventos de força maior ou caso fortuito;</li>
              <li>ataques cibernéticos de grande escala que não possam razoavelmente ser evitados pelas medidas de segurança adotadas;</li>
            </ul>
            <p>indisponibilidades de fornecedores externos fora do controle razoável da Work in Ideas, desde que não decorrentes de configuração inadequada, negligência ou falha de gestão imputável ao AkiDocs.</p>
          </section>
          <section class="legal_section">
            <h2>4. MANUTENÇÕES PROGRAMADAS</h2>
            <p>Sempre que possível, manutenções programadas que possam causar indisponibilidade relevante serão comunicadas com antecedência mínima de:</p>
            <p>48 horas.</p>
            <p>Preferencialmente, as intervenções serão realizadas fora dos horários comerciais.</p>
            <p>A janela preferencial de manutenção será:</p>
            <p>das 22h00 às 06h00, horário de Brasília.</p>
            <p>Manutenções que não causem indisponibilidade perceptível poderão ser realizadas sem comunicação prévia.</p>
            <h3>4.1. Manutenções emergenciais</h3>
            <p>Manutenções emergenciais poderão ser realizadas sem o prazo mínimo de aviso quando necessárias para:</p>
            <ul>
              <li>corrigir vulnerabilidades;</li>
              <li>impedir vazamento ou perda de dados;</li>
              <li>preservar a disponibilidade do serviço;</li>
              <li>mitigar ataques;</li>
              <li>corrigir falhas críticas de infraestrutura.</li>
            </ul>
            <p>Nessas situações, o AkiDocs comunicará os clientes afetados assim que razoavelmente possível.</p>
          </section>
          <section class="legal_section">
            <h2>5. SUPORTE TÉCNICO</h2>
            <p>O suporte técnico do AkiDocs é prestado exclusivamente por meio da plataforma oficial de tickets, disponível em:</p>
            <p><a href="https://suporte.akidocs.com.br" target="_blank" rel="noopener noreferrer">suporte.akidocs.com.br</a></p>
            <p>Para solicitar atendimento, a empresa-cliente deverá abrir um ticket na plataforma de suporte, descrevendo a ocorrência, dúvida ou solicitação e fornecendo, sempre que possível, as informações necessárias para sua análise.</p>
            <p>O atendimento regular ocorre em dias úteis, no seguinte horário:</p>
            <p>segunda a sexta-feira, das 09h00 às 18h00, horário de Brasília, exceto feriados nacionais.</p>
            <p>Os prazos estabelecidos neste SLA serão contabilizados a partir da abertura do ticket e representam o prazo para primeira resposta ou início da análise, e não necessariamente o prazo para solução definitiva.</p>
            <p>Chamados enviados por outros meios não serão considerados, para fins de SLA, como solicitações formais de suporte até que sejam registrados na plataforma oficial de tickets.</p>
            <p>As solicitações serão classificadas de acordo com sua severidade e impacto, conforme os critérios definidos na seção seguinte.</p>
          </section>
          <section class="legal_section">
            <h2>6. CLASSIFICAÇÃO DOS INCIDENTES</h2>
            <p>Os chamados serão classificados de acordo com seu impacto.</p>
            <p>P1 — Crítico</p>
            <p>Situação em que:</p>
            <ul>
              <li>toda a plataforma está indisponível;</li>
              <li>os usuários não conseguem acessar o serviço;</li>
              <li>existe risco confirmado ou altamente provável de comprometimento relevante de dados;</li>
              <li>funções essenciais estão indisponíveis para a generalidade dos clientes.</li>
            </ul>
            <p>Primeira resposta: até 2 horas úteis.</p>
            <p>Objetivo de mitigação ou restauração: até 8 horas úteis, sempre que tecnicamente possível.</p>
            <p>P2 — Alto</p>
            <p>Situação em que uma funcionalidade relevante encontra-se indisponível ou severamente prejudicada, mas a plataforma continua parcialmente operacional.</p>
            <p>Exemplos:</p>
            <ul>
              <li>upload indisponível para múltiplos usuários;</li>
              <li>falha relevante de permissões;</li>
              <li>parte significativa da plataforma inacessível;</li>
              <li>degradação severa de desempenho.</li>
            </ul>
            <p>Primeira resposta: até 4 horas úteis.</p>
            <p>Objetivo de mitigação: até 1 dia útil.</p>
            <p>P3 — Médio</p>
            <p>Problema que afeta determinada funcionalidade, usuário ou operação, mas possui alternativa de utilização ou não impede o funcionamento geral da plataforma.</p>
            <p>Primeira resposta: até 1 dia útil.</p>
            <p>Objetivo de solução ou encaminhamento: até 3 dias úteis.</p>
            <p>P4 — Baixo</p>
            <p>Solicitações relacionadas a:</p>
            <ul>
              <li>dúvidas;</li>
              <li>orientações;</li>
              <li>melhorias;</li>
              <li>alterações não urgentes;</li>
              <li>comportamento visual;</li>
              <li>funcionalidades não críticas.</li>
            </ul>
            <p>Primeira resposta: até 2 dias úteis.</p>
            <p>A solução poderá ser incorporada ao ciclo regular de desenvolvimento quando envolver melhoria ou alteração do produto.</p>
          </section>
          <section class="legal_section">
            <h2>7. BACKUP E CONTINUIDADE</h2>
            <p>O AkiDocs realiza backups diários dos dados necessários à continuidade operacional da plataforma.</p>
            <p>Os backups são mantidos por até:</p>
            <p>30 dias.</p>
            <p>A política de backup busca preservar a integridade e possibilitar a recuperação da plataforma em situações de falha relevante.</p>
          </section>
          <section class="legal_section">
            <h2>8. RPO — OBJETIVO DE PONTO DE RECUPERAÇÃO</h2>
            <p>Considerando a política de backups diários, o AkiDocs estabelece como objetivo máximo de perda de dados em cenário de desastre:</p>
            <p>RPO de até 24 horas.</p>
            <p>O RPO representa o intervalo máximo estimado entre o último estado recuperável e a ocorrência do incidente.</p>
            <p>Esse parâmetro se aplica a cenários excepcionais de recuperação de desastre e não significa que haverá perda de dados em uma ocorrência normal.</p>
          </section>
          <section class="legal_section">
            <h2>9. RTO — OBJETIVO DE TEMPO DE RECUPERAÇÃO</h2>
            <p>Para incidentes graves que exijam restauração da infraestrutura ou recuperação a partir de backup, o AkiDocs estabelece:</p>
            <p>RTO objetivo de até 8 horas úteis.</p>
            <p>O RTO representa um objetivo operacional e não uma garantia absoluta, especialmente em situações envolvendo:</p>
            <ul>
              <li>falhas de infraestrutura de terceiros;</li>
              <li>incidentes de grande escala;</li>
              <li>corrupção extensa de dados;</li>
              <li>ataques cibernéticos complexos;</li>
              <li>eventos de força maior.</li>
            </ul>
            <p>O AkiDocs empregará esforços razoáveis para restabelecer o serviço no menor prazo possível.</p>
          </section>
          <section class="legal_section">
            <h2>10. SEGURANÇA E PROTEÇÃO DOS ARQUIVOS</h2>
            <p>Os arquivos armazenados pelo AkiDocs permanecem criptografados na infraestrutura utilizada pela plataforma.</p>
            <p>A plataforma executa operações técnicas de:</p>
            <ul>
              <li>inclusão;</li>
              <li>armazenamento;</li>
              <li>recuperação;</li>
              <li>disponibilização autorizada;</li>
              <li>exclusão.</li>
            </ul>
            <p>O AkiDocs e sua equipe não possuem acesso ao conteúdo legível dos arquivos armazenados pelos clientes e não realizam leitura, interpretação ou suporte sobre o conteúdo desses documentos.</p>
            <p>O acesso aos arquivos ocorre de acordo com as permissões definidas pela empresa-cliente.</p>
          </section>
          <section class="legal_section">
            <h2>11. INFRAESTRUTURA</h2>
            <p>O AkiDocs utiliza infraestrutura de serviços de nuvem e segurança fornecida, entre outros, por:</p>
            <ul>
              <li>DigitalOcean;</li>
              <li>Amazon Web Services — AWS;</li>
              <li>Cloudflare.</li>
            </ul>
            <p>A infraestrutura principal destinada ao armazenamento e processamento dos dados da plataforma é configurada para utilização de datacenters situados no Brasil, em São Paulo.</p>
            <p>O processamento de pagamentos é realizado pelo PagSeguro, nos termos das condições aplicáveis aos serviços do respectivo fornecedor.</p>
          </section>
          <section class="legal_section">
            <h2>12. RETENÇÃO E EXCLUSÃO</h2>
            <p>Arquivos excluídos pelo cliente são inicialmente transferidos para a lixeira da plataforma.</p>
            <p>A lixeira é automaticamente esvaziada após o período de:</p>
            <p>30 dias.</p>
            <p>Após seu esvaziamento, os arquivos deixam de estar disponíveis nos sistemas ativos.</p>
            <p>Eventuais cópias residuais existentes em backups são eliminadas conforme o ciclo de retenção dos backups, atualmente limitado a 30 dias.</p>
          </section>
          <section class="legal_section">
            <h2>13. ENCERRAMENTO DO SERVIÇO</h2>
            <p>Após o encerramento da contratação, os dados e arquivos da empresa-cliente permanecerão disponíveis exclusivamente para ela durante:</p>
            <p>90 dias.</p>
            <p>Esse período é destinado à consulta e exportação dos dados.</p>
            <p>Durante esse prazo, poderão ser aplicadas restrições à inclusão de novos dados ou utilização de funcionalidades que não sejam necessárias à exportação.</p>
            <p>Após o período de 90 dias:</p>
            <ul>
              <li>os dados serão removidos dos sistemas ativos;</li>
              <li>eventuais cópias residuais serão eliminadas conforme o ciclo regular dos backups.</li>
            </ul>
          </section>
          <section class="legal_section">
            <h2>14. EXPORTAÇÃO DOS DADOS</h2>
            <p>Durante a vigência da contratação e/ou período disponibilizado para encerramento, conforme as funcionalidades disponíveis, a empresa-cliente poderá exportar seus dados.</p>
            <p>Os arquivos poderão ser baixados preservando a estrutura de pastas existente na plataforma.</p>
            <p>Também será possível exportar em formato de planilha os dados cadastrais disponíveis, incluindo, conforme aplicável:</p>
            <ul>
              <li>dados da empresa;</li>
              <li>funcionários;</li>
              <li>clientes;</li>
              <li>funcionários dos clientes cadastrados.</li>
            </ul>
          </section>
          <section class="legal_section">
            <h2>15. INCIDENTES DE SEGURANÇA</h2>
            <p>Na ocorrência de incidente de segurança relevante, o AkiDocs adotará procedimento que poderá compreender:</p>
            <ul>
              <li>identificação do incidente;</li>
              <li>contenção;</li>
              <li>preservação das evidências;</li>
              <li>análise do impacto;</li>
              <li>identificação dos dados e clientes afetados;</li>
              <li>correção ou mitigação da vulnerabilidade;</li>
              <li>comunicação aos clientes afetados;</li>
              <li>colaboração para cumprimento das obrigações legais aplicáveis.</li>
            </ul>
            <p>Quando o AkiDocs atuar como operador de dados pessoais, o cliente controlador será comunicado sem demora injustificada, tão logo existam elementos suficientes para a caracterização inicial do incidente.</p>
            <p>Serão fornecidas ao controlador as informações disponíveis e necessárias à avaliação do evento e, quando aplicável, à comunicação à Autoridade Nacional de Proteção de Dados — ANPD e aos titulares.</p>
            <p>Os registros de incidentes envolvendo dados pessoais serão mantidos pelo período mínimo aplicável, adotando-se atualmente prazo de pelo menos:</p>
            <p>5 anos.</p>
          </section>
          <section class="legal_section">
            <h2>16. CRÉDITOS POR INDISPONIBILIDADE</h2>
            <p>Caso a disponibilidade mensal fique abaixo do compromisso de 99,5%, a empresa-cliente poderá solicitar crédito sobre a mensalidade do serviço afetado, de acordo com a seguinte tabela:</p>
            <p>Disponibilidade mensal</p>
            <p>Crédito</p>
            <p>De 99,0% a menos de 99,5%</p>
            <p>5%</p>
            <p>De 98,0% a menos de 99,0%</p>
            <p>10%</p>
            <p>Abaixo de 98,0%</p>
            <p>20%</p>
            <p>O crédito:</p>
            <ul>
              <li>será calculado sobre a mensalidade do período afetado;</li>
              <li>deverá ser solicitado em até 30 dias após o encerramento do mês em que ocorreu a indisponibilidade;</li>
              <li>será aplicado em cobrança futura;</li>
              <li>não será convertido em dinheiro;</li>
              <li>será limitado ao valor correspondente a uma mensalidade do serviço.</li>
            </ul>
            <p>Os créditos previstos nesta cláusula constituem a compensação contratual específica relacionada ao descumprimento do compromisso de disponibilidade, sem prejuízo de direitos que não possam ser afastados pela legislação aplicável.</p>
          </section>
          <section class="legal_section">
            <h2>17. LIMITES DO SLA</h2>
            <p>Este SLA não representa garantia de funcionamento absolutamente ininterrupto ou livre de falhas.</p>
            <p>Sistemas de tecnologia dependem de infraestrutura, redes, software, serviços de terceiros e outros componentes sujeitos a falhas.</p>
            <p>A obrigação do AkiDocs consiste na manutenção dos níveis de serviço aqui estabelecidos e na adoção de medidas técnicas e administrativas razoáveis e compatíveis com a natureza do serviço.</p>
          </section>
          <section class="legal_section">
            <h2>18. RESPONSABILIDADES DA EMPRESA-CLIENTE</h2>
            <p>São responsabilidades da empresa-cliente:</p>
            <ul>
              <li>manter seus usuários e dados cadastrais atualizados;</li>
              <li>utilizar senhas seguras;</li>
              <li>impedir compartilhamento indevido de credenciais;</li>
              <li>administrar corretamente grupos e permissões;</li>
              <li>remover acessos de funcionários, clientes ou terceiros que não devam mais utilizar a plataforma;</li>
              <li>utilizar a plataforma de acordo com a legislação;</li>
              <li>possuir base legal adequada para os dados pessoais nela inseridos;</li>
              <li>manter meios locais ou próprios de contingência quando exigidos pelas particularidades de sua atividade;</li>
              <li>comunicar ao AkiDocs qualquer suspeita de comprometimento de conta ou acesso não autorizado.</li>
            </ul>
          </section>
          <section class="legal_section">
            <h2>19. RESPONSABILIDADE POR SERVIÇOS DE TERCEIROS</h2>
            <p>O AkiDocs utiliza fornecedores de infraestrutura e serviços especializados necessários à operação da plataforma.</p>
            <p>A Work in Ideas realizará a seleção e gestão desses fornecedores de forma compatível com os requisitos técnicos e de segurança do serviço.</p>
            <p>Falhas exclusivamente atribuíveis a terceiros poderão ser consideradas na apuração deste SLA quando estiverem fora do controle razoável da Work in Ideas.</p>
            <p>Isso não afasta a responsabilidade da Work in Ideas por falhas decorrentes de configuração inadequada, negligência, ausência de medidas razoáveis de contingência ou outros atos que lhe sejam diretamente imputáveis.</p>
          </section>
          <section class="legal_section">
            <h2>20. AUDITORIA E CERTIFICAÇÕES</h2>
            <p>Atualmente, o AkiDocs não declara possuir certificação independente como SOC 2 ou ISO 27001.</p>
            <p>A segurança é administrada por meio de controles técnicos e administrativos internos, incluindo:</p>
            <ul>
              <li>controle de acesso;</li>
              <li>criptografia;</li>
              <li>proteção de infraestrutura;</li>
              <li>backups;</li>
              <li>monitoramento;</li>
              <li>registro de incidentes;</li>
              <li>procedimentos de resposta a incidentes.</li>
            </ul>
            <p>Qualquer certificação ou auditoria independente futura somente será divulgada após sua efetiva obtenção ou realização.</p>
          </section>
          <section class="legal_section">
            <h2>21. ENCARREGADO DE PROTEÇÃO DE DADOS</h2>
            <p>O encarregado de proteção de dados da Work in Ideas é:</p>
            <p>Charles EgidioGerente de Projetos e Encarregado de Proteção de DadosE-mail: <a href="mailto:charles@wi-id.com">charles@wi-id.com</a></p>
            <p>Solicitações relacionadas à proteção de dados pessoais poderão ser encaminhadas por esse canal.</p>
          </section>
          <section class="legal_section">
            <h2>22. REVISÃO DO SLA</h2>
            <p>O presente SLA poderá ser atualizado em razão de:</p>
            <ul>
              <li>mudanças na infraestrutura;</li>
              <li>evolução técnica do serviço;</li>
              <li>alteração de fornecedores;</li>
              <li>mudanças regulatórias;</li>
              <li>aprimoramento das práticas de segurança.</li>
            </ul>
            <p>Alterações que reduzam de maneira material níveis de serviço contratados deverão observar as condições previstas no contrato celebrado com a empresa-cliente.</p>
          </section>
          <section class="legal_section">
            <h2>23. DISPOSIÇÕES FINAIS</h2>
            <p>Este SLA deve ser interpretado em conjunto com:</p>
            <ul>
              <li>o contrato de prestação de serviços do AkiDocs;</li>
              <li>os Termos de Uso aplicáveis;</li>
              <li>a Política de Privacidade;</li>
              <li>o acordo ou anexo de tratamento de dados pessoais, quando existente.</li>
            </ul>
            <p>Em caso de conflito entre este SLA e contrato específico celebrado entre as partes, prevalecerá o documento que expressamente discipline a obrigação em questão, observado o que tiver sido negociado entre as partes.</p>
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
