<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import LandingHeader from '@/pages/Landing/components/LandingHeader.vue'
import LandingFooter from '@/pages/Landing/components/LandingFooter.vue'
import { setPageSeo } from '@/utils/seo'

onMounted(() => {
  setPageSeo({
    title: 'Política de Privacidade — AkiDocs | Proteção de Dados e LGPD',
    description: 'Conheça a Política de Privacidade do AkiDocs. Entenda como tratamos dados pessoais em conformidade com a LGPD (Lei nº 13.709/2018), papéis de Controladora e Operadora.',
    canonicalUrl: 'https://akidocs.com.br/politica-de-privacidade'
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
          <span class="page_badge">PRIVACIDADE & DADOS</span>
          <h1 class="page_title">Política de Privacidade AkiDocs</h1>
          <p class="page_subtitle">Última atualização: 11 de setembro de 2026</p>
        </header>

        <article class="legal_content">
          <section class="legal_section intro_section">
            <p>A privacidade e a proteção dos dados pessoais são princípios importantes para o AkiDocs.</p>
            <p>Esta Política de Privacidade explica como os dados pessoais são tratados no contexto da plataforma AkiDocs, operada pela Work in Ideas, incluindo informações relacionadas ao cadastro, utilização da plataforma, armazenamento de arquivos, segurança, autenticação, suporte e contratação do serviço.</p>
            <p>O tratamento de dados pessoais realizado no âmbito do AkiDocs observa a Lei nº 13.709/2018 — Lei Geral de Proteção de Dados Pessoais (“LGPD”) e demais normas aplicáveis.</p>
          </section>
          <section class="legal_section">
            <h2>1. SOBRE O AKIDOCS</h2>
            <p>O AkiDocs é uma plataforma B2B de gerenciamento, armazenamento e compartilhamento seguro de arquivos em nuvem destinada a empresas.</p>
            <p>Por meio da plataforma, empresas-clientes podem, entre outras funcionalidades:</p>
            <ul>
              <li>cadastrar seus funcionários;</li>
              <li>cadastrar seus próprios clientes;</li>
              <li>cadastrar funcionários vinculados aos seus clientes;</li>
              <li>organizar usuários em grupos, setores ou outras estruturas internas;</li>
              <li>enviar e armazenar arquivos;</li>
              <li>organizar arquivos e pastas;</li>
              <li>definir permissões de acesso;</li>
              <li>compartilhar arquivos entre usuários autorizados;</li>
              <li>administrar os usuários vinculados à sua organização.</li>
            </ul>
            <p>A Work in Ideas é responsável pelo desenvolvimento e operação da plataforma AkiDocs.</p>
          </section>
          <section class="legal_section">
            <h2>2. QUEM É O CONTROLADOR E QUEM É O OPERADOR</h2>
            <p>O papel exercido pela Work in Ideas depende da finalidade do tratamento realizado.</p>
            <h3>2.1. Dados inseridos pela empresa-cliente</h3>
            <p>Quando uma empresa contrata o AkiDocs e utiliza a plataforma para cadastrar funcionários, clientes, usuários, documentos, arquivos, grupos ou permissões:</p>
            <ul>
              <li>a empresa-cliente atua como Controladora dos dados pessoais; e</li>
              <li>a Work in Ideas, por meio do AkiDocs, atua como Operadora dos dados pessoais.</li>
            </ul>
            <p>Isso significa que a empresa-cliente determina quais dados serão inseridos na plataforma, para quais finalidades serão utilizados e quem poderá acessá-los.</p>
            <p>O AkiDocs realiza as operações necessárias para disponibilizar as funcionalidades contratadas, de acordo com as instruções e configurações determinadas pela empresa-cliente.</p>
            <h3>2.2. Dados necessários à operação do AkiDocs</h3>
            <p>A Work in Ideas atua como Controladora quando determina diretamente a finalidade do tratamento, como ocorre com dados necessários para:</p>
            <ul>
              <li>contratação do serviço;</li>
              <li>cadastro da empresa-cliente;</li>
              <li>administração da assinatura;</li>
              <li>autenticação;</li>
              <li>validação de acesso;</li>
              <li>faturamento;</li>
              <li>segurança;</li>
              <li>prevenção de fraudes e abusos;</li>
              <li>registros técnicos e operacionais;</li>
              <li>comunicação operacional;</li>
              <li>atendimento e suporte;</li>
              <li>cumprimento de obrigações legais ou regulatórias.</li>
            </ul>
          </section>
          <section class="legal_section">
            <h2>3. QUAIS DADOS PODEMOS TRATAR</h2>
            <p>A natureza dos dados tratados depende da utilização da plataforma.</p>
            <h3>3.1. Dados da empresa contratante</h3>
            <p>Podem incluir:</p>
            <ul>
              <li>razão social;</li>
              <li>nome empresarial ou nome fantasia;</li>
              <li>CNPJ;</li>
              <li>nome dos responsáveis;</li>
              <li>e-mail;</li>
              <li>telefone;</li>
              <li>informações comerciais necessárias à contratação;</li>
              <li>informações relacionadas ao plano contratado;</li>
              <li>situação da assinatura e pagamentos.</li>
            </ul>
            <h3>3.2. Dados de usuários</h3>
            <p>De acordo com os cadastros realizados pela empresa-cliente, podem ser tratados dados como:</p>
            <ul>
              <li>nome;</li>
              <li>e-mail;</li>
              <li>telefone;</li>
              <li>informações de identificação do usuário;</li>
              <li>empresa à qual está vinculado;</li>
              <li>grupo, setor ou cliente ao qual está associado;</li>
              <li>perfil de acesso;</li>
              <li>permissões dentro da plataforma.</li>
            </ul>
            <p>O telefone poderá ser utilizado para mecanismos de validação, autenticação e segurança de acesso.</p>
            <p>O e-mail poderá ser utilizado para identificação, autenticação e comunicações operacionais relacionadas à utilização do AkiDocs.</p>
            <h3>3.3. Dados técnicos e de segurança</h3>
            <p>Durante a utilização do AkiDocs poderão ser registrados dados técnicos necessários ao funcionamento e à segurança da plataforma, como:</p>
            <ul>
              <li>endereço IP;</li>
              <li>data e horário dos acessos;</li>
              <li>registros de autenticação;</li>
              <li>operações realizadas na plataforma;</li>
              <li>eventos de segurança;</li>
              <li>registros técnicos relacionados à utilização da aplicação.</li>
            </ul>
            <p>Essas informações poderão ser utilizadas para segurança, auditoria, prevenção de abusos, investigação de incidentes, funcionamento da plataforma e cumprimento de obrigações legais.</p>
          </section>
          <section class="legal_section">
            <h2>4. USO DO E-MAIL E TELEFONE</h2>
            <p>O AkiDocs poderá utilizar o e-mail cadastrado pelo usuário para comunicações estritamente relacionadas à plataforma, como:</p>
            <ul>
              <li>confirmação e administração de cadastro;</li>
              <li>autenticação;</li>
              <li>recuperação de conta;</li>
              <li>avisos de segurança;</li>
              <li>informações relacionadas ao funcionamento da plataforma;</li>
              <li>alterações relevantes no serviço;</li>
              <li>informações sobre assinatura, faturamento e pagamentos;</li>
              <li>comunicações relacionadas a solicitações realizadas pelo próprio usuário;</li>
              <li>outras comunicações necessárias à prestação do serviço.</li>
            </ul>
            <p>O número de telefone poderá ser utilizado para:</p>
            <ul>
              <li>validação de acesso;</li>
              <li>confirmação de identidade;</li>
              <li>autenticação;</li>
              <li>recuperação ou proteção de conta;</li>
              <li>mecanismos de segurança da plataforma.</li>
            </ul>
            <p>O AkiDocs não utiliza o e-mail ou o número de telefone cadastrado para publicidade, campanhas promocionais ou envio de marketing.</p>
            <p>Esses dados são utilizados exclusivamente para as finalidades relacionadas ao cadastro, segurança, operação e utilização do serviço.</p>
          </section>
          <section class="legal_section">
            <h2>5. ARQUIVOS ENVIADOS À PLATAFORMA</h2>
            <p>Os arquivos enviados ao AkiDocs permanecem sob controle da empresa-cliente que utiliza a plataforma.</p>
            <p>O AkiDocs não utiliza o conteúdo dos arquivos para:</p>
            <ul>
              <li>publicidade;</li>
              <li>marketing;</li>
              <li>criação de perfis;</li>
              <li>treinamento de modelos;</li>
              <li>comercialização de informações;</li>
              <li>análise comercial do conteúdo;</li>
              <li>qualquer finalidade alheia à prestação do serviço contratado.</li>
            </ul>
            <p>Os arquivos são armazenados de forma criptografada.</p>
            <p>A plataforma realiza somente as operações técnicas necessárias para:</p>
            <ul>
              <li>inclusão;</li>
              <li>armazenamento;</li>
              <li>recuperação;</li>
              <li>disponibilização aos usuários autorizados;</li>
              <li>organização;</li>
              <li>exclusão.</li>
            </ul>
            <p>A equipe da Work in Ideas não possui acesso ao conteúdo legível dos arquivos armazenados pelos clientes.</p>
            <p>O AkiDocs não realiza leitura, interpretação, classificação ou análise do conteúdo dos documentos enviados.</p>
            <p>Consequentemente, a equipe de suporte também não presta suporte relacionado ao conteúdo interno dos arquivos.</p>
            <p>As permissões de acesso são determinadas pela própria empresa-cliente por meio dos recursos disponibilizados na plataforma.</p>
          </section>
          <section class="legal_section">
            <h2>6. RESPONSABILIDADE DA EMPRESA-CLIENTE PELOS DADOS INSERIDOS</h2>
            <p>A empresa-cliente é responsável pelos dados pessoais e documentos que decide inserir no AkiDocs.</p>
            <p>Cabe à empresa-cliente, na condição de Controladora, garantir que possui fundamento jurídico adequado para:</p>
            <ul>
              <li>cadastrar seus funcionários;</li>
              <li>cadastrar seus clientes;</li>
              <li>cadastrar funcionários de seus clientes;</li>
              <li>armazenar documentos;</li>
              <li>compartilhar informações;</li>
              <li>conceder permissões de acesso;</li>
              <li>determinar os períodos de utilização das informações.</li>
            </ul>
            <p>Essa responsabilidade abrange dados pessoais comuns, dados pessoais sensíveis, informações confidenciais e outras informações sujeitas a obrigações legais, profissionais ou contratuais.</p>
            <p>O AkiDocs fornece a infraestrutura tecnológica necessária à execução do tratamento determinado pela empresa-cliente.</p>
          </section>
          <section class="legal_section">
            <h2>7. PARA QUAIS FINALIDADES OS DADOS SÃO UTILIZADOS</h2>
            <p>Os dados tratados diretamente pela Work in Ideas são utilizados apenas para finalidades relacionadas à prestação, segurança e administração do AkiDocs, incluindo:</p>
            <ul>
              <li>criação e manutenção da conta;</li>
              <li>identificação da empresa contratante;</li>
              <li>identificação de usuários;</li>
              <li>autenticação e validação de acesso;</li>
              <li>proteção e recuperação de contas;</li>
              <li>funcionamento das funcionalidades contratadas;</li>
              <li>gerenciamento da assinatura;</li>
              <li>faturamento;</li>
              <li>processamento de pagamentos;</li>
              <li>segurança da plataforma;</li>
              <li>prevenção e investigação de acessos indevidos;</li>
              <li>manutenção de registros técnicos;</li>
              <li>suporte técnico;</li>
              <li>comunicação operacional;</li>
              <li>execução do contrato;</li>
              <li>cumprimento de obrigações legais e regulatórias;</li>
              <li>proteção dos direitos da Work in Ideas, das empresas-clientes e dos usuários.</li>
            </ul>
            <p>A Work in Ideas não comercializa dados pessoais tratados pelo AkiDocs.</p>
            <p>Os dados cadastrais não são utilizados para criação de perfis publicitários, enriquecimento de bases de marketing ou comercialização para terceiros.</p>
          </section>
          <section class="legal_section">
            <h2>8. BASES LEGAIS</h2>
            <p>O tratamento de dados pessoais realizado pela Work in Ideas poderá ocorrer, de acordo com cada situação, com fundamento nas hipóteses previstas pela LGPD, especialmente quando necessário para:</p>
            <ul>
              <li>execução de contrato ou de procedimentos relacionados ao contrato;</li>
              <li>cumprimento de obrigação legal ou regulatória;</li>
              <li>exercício regular de direitos;</li>
              <li>proteção contra fraudes e promoção da segurança;</li>
              <li>atendimento de interesses legítimos, quando aplicável e respeitados os direitos e liberdades dos titulares;</li>
              <li>consentimento, quando essa for a base legal adequada.</li>
            </ul>
            <p>O AkiDocs não utiliza consentimento de maneira genérica como fundamento para todos os tratamentos.</p>
            <p>Cada tratamento deve possuir fundamento jurídico compatível com sua finalidade.</p>
          </section>
          <section class="legal_section">
            <h2>9. PAGAMENTOS</h2>
            <p>Os pagamentos relacionados às assinaturas do AkiDocs são processados pelo PagSeguro.</p>
            <p>O PagSeguro é responsável pelo tratamento dos dados necessários ao processamento financeiro, de acordo com suas próprias obrigações legais, condições de serviço e políticas aplicáveis.</p>
            <p>O AkiDocs utiliza os dados comerciais necessários à contratação e administração da assinatura.</p>
            <p>As informações financeiras necessárias ao pagamento são tratadas pelo PagSeguro, enquanto o AkiDocs recebe informações operacionais necessárias ao gerenciamento da assinatura, como a situação da cobrança.</p>
            <p>O AkiDocs não utiliza informações relacionadas ao pagamento para finalidades diferentes da contratação e administração do serviço.</p>
          </section>
          <section class="legal_section">
            <h2>10. INFRAESTRUTURA E LOCALIZAÇÃO DOS DADOS</h2>
            <p>O AkiDocs utiliza infraestrutura de nuvem fornecida pela:</p>
            <p>DigitalOcean</p>
            <p>e pela</p>
            <p>Amazon Web Services — AWS.</p>
            <p>A infraestrutura principal utilizada para armazenamento e processamento dos dados e arquivos do AkiDocs está localizada no Brasil, em São Paulo.</p>
            <p>Os arquivos são armazenados de forma criptografada dentro da infraestrutura utilizada pela plataforma.</p>
          </section>
          <section class="legal_section">
            <h2>11. SEGURANÇA DE ACESSO E CLOUDFLARE</h2>
            <p>O AkiDocs utiliza serviços da Cloudflare como camada adicional de segurança e proteção de acesso à aplicação.</p>
            <p>A Cloudflare poderá processar informações técnicas necessárias à prestação dos serviços relacionados à segurança, gerenciamento de tráfego e prevenção ou mitigação de ataques.</p>
            <p>O AkiDocs adota controles técnicos e administrativos destinados à proteção da plataforma, incluindo, conforme aplicável:</p>
            <ul>
              <li>controle de acesso;</li>
              <li>gerenciamento de permissões;</li>
              <li>criptografia;</li>
              <li>proteção da infraestrutura;</li>
              <li>backups;</li>
              <li>registros técnicos;</li>
              <li>monitoramento;</li>
              <li>mecanismos de segurança de aplicação;</li>
              <li>procedimentos de resposta a incidentes.</li>
            </ul>
          </section>
          <section class="legal_section">
            <h2>12. PRESTADORES DE SERVIÇO E SUBPROCESSADORES</h2>
            <p>Para prestar seus serviços, o AkiDocs utiliza fornecedores especializados.</p>
            <p>Os principais fornecedores relacionados à operação são:</p>
            <p>DigitalOcean</p>
            <p>Utilizada para infraestrutura tecnológica, processamento, armazenamento e serviços necessários ao funcionamento da aplicação.</p>
            <p>Amazon Web Services — AWS</p>
            <p>Utilizada como infraestrutura de nuvem e armazenamento relacionado aos arquivos e dados da plataforma.</p>
            <p>Cloudflare</p>
            <p>Utilizada para proteção de acesso, segurança, gerenciamento de tráfego e mitigação de ataques.</p>
            <p>PagSeguro</p>
            <p>Responsável pelo processamento dos pagamentos relacionados às assinaturas.</p>
            <p>Os fornecedores recebem ou processam somente os dados necessários ao desempenho das respectivas funções.</p>
            <p>A utilização desses serviços não autoriza o uso dos dados tratados pelo AkiDocs para finalidades incompatíveis com os serviços contratados.</p>
          </section>
          <section class="legal_section">
            <h2>13. COOKIES E ANALYTICS</h2>
            <p>O AkiDocs utiliza cookies relacionados a analytics para obter informações estatísticas sobre a utilização de suas páginas e da plataforma.</p>
            <p>Esses recursos têm como finalidade auxiliar na compreensão de aspectos como:</p>
            <ul>
              <li>utilização das páginas;</li>
              <li>funcionamento da aplicação;</li>
              <li>navegação dos usuários;</li>
              <li>desempenho e experiência de utilização.</li>
            </ul>
            <p>O AkiDocs não utiliza cookies para publicidade comportamental, comercialização de dados ou criação de perfis publicitários.</p>
            <p>As informações obtidas por meio de analytics são utilizadas para análise do funcionamento e utilização do AkiDocs e para melhoria da experiência oferecida.</p>
            <p>Cookies de analytics que não sejam estritamente necessários ao funcionamento da aplicação deverão observar as escolhas realizadas pelo usuário.</p>
            <p>Quando aplicável, o usuário poderá aceitar, rejeitar ou gerenciar cookies não essenciais por meio dos mecanismos disponibilizados no site ou na aplicação.</p>
            <p>A ferramenta responsável pelo analytics poderá realizar processamento técnico utilizando sua própria infraestrutura, observadas as medidas e obrigações legalmente aplicáveis.</p>
          </section>
          <section class="legal_section">
            <h2>14. RETENÇÃO DOS ARQUIVOS</h2>
            <p>Enquanto a contratação estiver ativa, os arquivos permanecerão disponíveis conforme as configurações e permissões definidas pela empresa-cliente.</p>
            <p>Quando um arquivo é excluído pelo usuário, ele é inicialmente transferido para a lixeira do AkiDocs.</p>
            <p>Os arquivos permanecem na lixeira por até:</p>
            <p>30 dias.</p>
            <p>Após esse período, ocorre seu esvaziamento automático.</p>
            <p>O arquivo deixa então de estar disponível nos sistemas ativos.</p>
          </section>
          <section class="legal_section">
            <h2>15. BACKUPS E EXCLUSÃO DEFINITIVA</h2>
            <p>O AkiDocs realiza backups diários com a finalidade de auxiliar na proteção da integridade e continuidade dos dados e da plataforma.</p>
            <p>Os backups são mantidos por até:</p>
            <p>30 dias.</p>
            <p>Por essa razão, depois que um arquivo é removido dos sistemas ativos, poderão existir temporariamente cópias residuais dentro dos backups.</p>
            <p>Essas cópias são automaticamente eliminadas conforme o ciclo normal de retenção, atualmente limitado a 30 dias.</p>
            <p>Após o encerramento desse ciclo, o conteúdo deixa de integrar os backups mantidos pela plataforma.</p>
            <p>Os backups possuem finalidade de continuidade e recuperação da infraestrutura e não constituem uma lixeira adicional destinada à recuperação individual e permanente de arquivos deliberadamente excluídos pelo usuário.</p>
          </section>
          <section class="legal_section">
            <h2>16. ENCERRAMENTO DA CONTA</h2>
            <p>Quando uma empresa-cliente encerra sua contratação, seus dados e arquivos permanecem disponíveis exclusivamente para ela durante:</p>
            <p>90 dias.</p>
            <p>Esse período é destinado principalmente à consulta e exportação das informações.</p>
            <p>Durante essa etapa, determinadas funcionalidades poderão ser restringidas, especialmente funcionalidades destinadas à criação de novos dados.</p>
            <p>Após o término dos 90 dias:</p>
            <ul>
              <li>os dados deixam de estar disponíveis nos sistemas ativos;</li>
              <li>a conta poderá ser definitivamente removida;</li>
              <li>eventuais cópias residuais existentes nos backups serão eliminadas conforme o ciclo regular de retenção de até 30 dias.</li>
            </ul>
            <p>Após a conclusão desse processo, os dados não poderão ser recuperados por meio da plataforma.</p>
          </section>
          <section class="legal_section">
            <h2>17. PORTABILIDADE E EXPORTAÇÃO</h2>
            <p>A empresa-cliente pode obter uma cópia de seus dados antes do encerramento definitivo da conta.</p>
            <p>Os arquivos podem ser baixados preservando a estrutura de pastas existente no AkiDocs.</p>
            <p>Também é possível realizar a exportação, por meio de planilha, dos dados cadastrais mantidos na plataforma, incluindo, conforme aplicável:</p>
            <ul>
              <li>dados da empresa-cliente;</li>
              <li>dados de seus funcionários;</li>
              <li>dados de seus clientes;</li>
              <li>dados dos funcionários vinculados aos seus clientes.</li>
            </ul>
            <p>Esse recurso permite que a empresa-cliente mantenha seus arquivos e dados estruturados antes da exclusão definitiva da conta.</p>
          </section>
          <section class="legal_section">
            <h2>18. INCIDENTES DE SEGURANÇA</h2>
            <p>O AkiDocs mantém procedimento interno de resposta a incidentes de segurança.</p>
            <p>Quando identificado um incidente relevante, poderão ser adotadas, conforme a situação, as seguintes medidas:</p>
            <ul>
              <li>identificação e contenção do incidente;</li>
              <li>preservação das evidências;</li>
              <li>análise do impacto;</li>
              <li>identificação dos sistemas, dados e clientes potencialmente afetados;</li>
              <li>correção ou mitigação da vulnerabilidade;</li>
              <li>comunicação aos clientes afetados;</li>
              <li>fornecimento das informações necessárias ao cumprimento das obrigações legais aplicáveis.</li>
            </ul>
            <p>Quando a Work in Ideas estiver atuando como Operadora, o cliente Controlador será comunicado sem demora injustificada, tão logo existam elementos suficientes para a caracterização inicial do incidente.</p>
            <p>A Work in Ideas fornecerá as informações disponíveis necessárias para que o Controlador possa avaliar o ocorrido e, quando aplicável, realizar as comunicações exigidas à Autoridade Nacional de Proteção de Dados — ANPD e aos titulares afetados.</p>
            <p>Quando a Work in Ideas estiver atuando como Controladora dos dados envolvidos, realizará diretamente as comunicações que forem de sua responsabilidade.</p>
            <p>Os registros de incidentes envolvendo dados pessoais são mantidos por pelo menos 5 anos.</p>
          </section>
          <section class="legal_section">
            <h2>19. DIREITOS DOS TITULARES</h2>
            <p>Nos termos da legislação aplicável, os titulares de dados pessoais poderão exercer os direitos previstos na LGPD, quando cabíveis, incluindo:</p>
            <ul>
              <li>confirmação da existência de tratamento;</li>
              <li>acesso aos dados;</li>
              <li>correção de dados incompletos, inexatos ou desatualizados;</li>
              <li>informações sobre o tratamento;</li>
              <li>anonimização, bloqueio ou eliminação, quando aplicável;</li>
              <li>portabilidade, nos termos da regulamentação aplicável;</li>
              <li>informações sobre compartilhamento;</li>
              <li>revogação do consentimento, quando o tratamento estiver fundamentado nessa base legal;</li>
              <li>oposição ao tratamento, quando cabível;</li>
              <li>demais direitos previstos pela legislação.</li>
            </ul>
            <p>O exercício de determinados direitos poderá estar sujeito às limitações e hipóteses de conservação previstas pela legislação.</p>
          </section>
          <section class="legal_section">
            <h2>20. SOLICITAÇÕES RELACIONADAS A DADOS INSERIDOS POR EMPRESAS-CLIENTES</h2>
            <p>Quando uma solicitação estiver relacionada a dados inseridos no AkiDocs por uma empresa-cliente, essa empresa será, em regra, a Controladora responsável pelas decisões relacionadas ao tratamento.</p>
            <p>Nesses casos, o titular deverá preferencialmente direcionar sua solicitação à organização responsável pelo seu cadastro.</p>
            <p>O AkiDocs, na condição de Operador, prestará a assistência necessária à empresa Controladora para atendimento da solicitação, observadas suas obrigações legais e contratuais.</p>
          </section>
          <section class="legal_section">
            <h2>21. ENCARREGADO DE PROTEÇÃO DE DADOS — DPO</h2>
            <p>O encarregado pelo tratamento de dados pessoais da Work in Ideas é:</p>
            <p>Charles EgidioGerente de Projetos e Encarregado de Proteção de Dados — DPOE-mail: <a href="mailto:charles@wi-id.com">charles@wi-id.com</a></p>
            <p>O encarregado atua como canal de comunicação para questões relacionadas à privacidade e proteção de dados pessoais.</p>
            <p>Solicitações relacionadas ao exercício de direitos dos titulares, privacidade, proteção de dados ou tratamento de informações pessoais poderão ser encaminhadas para esse endereço.</p>
          </section>
          <section class="legal_section">
            <h2>22. SUPORTE TÉCNICO</h2>
            <p>Questões relacionadas ao funcionamento da plataforma, utilização de recursos ou suporte técnico devem ser encaminhadas exclusivamente pela plataforma oficial de atendimento do AkiDocs:</p>
            <p><a href="https://suporte.akidocs.com.br" target="_blank" rel="noopener noreferrer">suporte.akidocs.com.br</a></p>
            <p>Para receber atendimento, o cliente deverá abrir um ticket descrevendo sua solicitação.</p>
            <p>O canal do Encarregado de Proteção de Dados não substitui a plataforma regular de suporte técnico.</p>
          </section>
          <section class="legal_section">
            <h2>23. SEGURANÇA E AUDITORIA</h2>
            <p>A segurança do AkiDocs é gerenciada internamente por meio de controles técnicos e administrativos.</p>
            <p>Atualmente, o AkiDocs não declara possuir certificação independente como ISO 27001 ou SOC 2, nem auditoria independente permanente de segurança.</p>
            <p>A ausência dessas certificações não significa ausência de controles internos.</p>
            <p>A Work in Ideas mantém medidas de segurança compatíveis com a natureza do serviço prestado e poderá implementar novos controles, testes, auditorias ou certificações de acordo com a evolução da plataforma.</p>
          </section>
          <section class="legal_section">
            <h2>24. DADOS PESSOAIS SENSÍVEIS E DOCUMENTOS CONFIDENCIAIS</h2>
            <p>O AkiDocs não determina quais documentos serão armazenados pelas empresas-clientes e não analisa seu conteúdo.</p>
            <p>Por essa razão, uma empresa-cliente poderá utilizar a plataforma para armazenar documentos contendo dados pessoais sensíveis, informações profissionais confidenciais, dados submetidos a dever de sigilo ou outras informações protegidas.</p>
            <p>A responsabilidade pela existência de fundamento jurídico para o armazenamento e compartilhamento dessas informações é da empresa-cliente que determina o tratamento.</p>
            <p>O AkiDocs realizará somente o tratamento técnico necessário à prestação do serviço, conforme suas obrigações como Operador.</p>
          </section>
          <section class="legal_section">
            <h2>25. DADOS DE CRIANÇAS E ADOLESCENTES</h2>
            <p>O AkiDocs é uma solução destinada a empresas e não é direcionado ao uso independente por crianças ou adolescentes.</p>
            <p>Caso uma empresa-cliente insira documentos ou informações contendo dados pessoais de crianças ou adolescentes, será responsabilidade da empresa Controladora observar os requisitos legais aplicáveis ao tratamento dessas informações.</p>
            <p>O AkiDocs realizará apenas o processamento técnico determinado pela empresa-cliente.</p>
          </section>
          <section class="legal_section">
            <h2>26. TRANSFERÊNCIAS E INFRAESTRUTURA INTERNACIONAL</h2>
            <p>A infraestrutura principal de armazenamento e processamento dos dados e arquivos do AkiDocs é configurada para utilização de recursos localizados no Brasil, em São Paulo.</p>
            <p>Determinados fornecedores tecnológicos, serviços de segurança ou ferramentas de analytics poderão possuir infraestrutura global ou realizar operações técnicas fora da infraestrutura principal utilizada pelo AkiDocs.</p>
            <p>Quando determinada operação caracterizar transferência internacional de dados pessoais, a Work in Ideas adotará os mecanismos e salvaguardas exigidos pela legislação e regulamentação brasileiras aplicáveis.</p>
          </section>
          <section class="legal_section">
            <h2>27. NÃO COMERCIALIZAÇÃO E NÃO UTILIZAÇÃO SECUNDÁRIA DOS DADOS</h2>
            <p>Os dados pessoais coletados pelo AkiDocs destinam-se às finalidades necessárias ao cadastro, contratação, segurança e utilização da plataforma.</p>
            <p>A Work in Ideas não utiliza esses dados para finalidades comerciais alheias à prestação do AkiDocs.</p>
            <p>Em especial, a Work in Ideas:</p>
            <ul>
              <li>não vende dados pessoais;</li>
              <li>não aluga bases de dados;</li>
              <li>não comercializa listas de usuários;</li>
              <li>não utiliza dados cadastrais para publicidade comportamental;</li>
              <li>não utiliza telefone ou e-mail para campanhas promocionais;</li>
              <li>não utiliza o conteúdo dos arquivos para publicidade ou criação de perfis;</li>
              <li>não utiliza os documentos armazenados para finalidades diferentes da prestação do serviço.</li>
            </ul>
          </section>
          <section class="legal_section">
            <h2>28. ALTERAÇÕES DESTA POLÍTICA</h2>
            <p>Esta Política poderá ser atualizada sempre que necessário para refletir:</p>
            <ul>
              <li>alterações na legislação;</li>
              <li>mudanças regulatórias;</li>
              <li>evolução da plataforma;</li>
              <li>alteração de fornecedores;</li>
              <li>criação ou modificação de funcionalidades;</li>
              <li>mudanças nas práticas de segurança e privacidade.</li>
            </ul>
            <p>A versão mais recente desta Política permanecerá disponível nos canais oficiais do AkiDocs.</p>
            <p>Quando uma alteração produzir impacto material relevante sobre o tratamento de dados pessoais, poderão ser adotados meios adicionais de comunicação às empresas-clientes ou usuários afetados.</p>
          </section>
          <section class="legal_section">
            <h2>29. CONTATO</h2>
            <p>Privacidade e proteção de dados</p>
            <p>Encarregado de Proteção de Dados — DPOCharles EgidioGerente de ProjetosE-mail: <a href="mailto:charles@wi-id.com">charles@wi-id.com</a></p>
            <p>Suporte técnico e operacional</p>
            <p>Central de Suporte AkiDocs<a href="https://suporte.akidocs.com.br" target="_blank" rel="noopener noreferrer">suporte.akidocs.com.br</a></p>
          </section>
          <section class="legal_section">
            <h2>30. DISPOSIÇÕES FINAIS</h2>
            <p>Esta Política de Privacidade deve ser interpretada em conjunto com os Termos de Uso, o contrato de prestação de serviços, o Acordo de Nível de Serviço — SLA e, quando aplicável, o Acordo ou Anexo de Tratamento de Dados celebrado entre a Work in Ideas e a empresa-cliente.</p>
            <p>Caso a empresa-cliente utilize o AkiDocs para tratar dados pessoais de terceiros, permanecerá responsável pelas decisões relacionadas às finalidades e aos meios essenciais desse tratamento.</p>
            <p>A Work in Ideas, por meio do AkiDocs, executará as operações que lhe forem atribuídas na condição de Operadora, observando as instruções da empresa-cliente, as obrigações contratuais assumidas e a legislação aplicável.</p>
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
