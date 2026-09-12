<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import LandingHeader from '@/pages/Landing/components/LandingHeader.vue'
import LandingFooter from '@/pages/Landing/components/LandingFooter.vue'
import { setPageSeo } from '@/utils/seo'

onMounted(() => {
  setPageSeo({
    title: 'DPA — Acordo de Tratamento de Dados Pessoais | AkiDocs',
    description: 'Acordo de Tratamento de Dados Pessoais (DPA) da plataforma AkiDocs em estrita conformidade com a LGPD. Regula as obrigações da Operadora e da Controladora.',
    canonicalUrl: 'https://akidocs.com.br/dpa'
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
          <span class="breadcrumb_current">DPA — Acordo de Dados</span>
        </nav>

        <header class="page_header">
          <span class="page_badge">ACORDO DE PROCESSAMENTO</span>
          <h1 class="page_title">Acordo de Tratamento de Dados Pessoais (DPA)</h1>
          <p class="page_subtitle">Versão 1.0 — Última atualização: 11 de setembro de 2026</p>
        </header>

        <article class="legal_content">
          <section class="legal_section intro_section">
            <p>Este Acordo de Tratamento de Dados Pessoais (“DPA”) integra os documentos contratuais aplicáveis à utilização da plataforma AkiDocs, operada pela Work in Ideas, e disciplina o tratamento de dados pessoais realizado em nome das empresas-clientes.</p>
            <p>O presente DPA deverá ser interpretado em conjunto com o contrato ou proposta comercial, os Termos de Uso, a Política de Privacidade e o Acordo de Nível de Serviço — SLA do AkiDocs.</p>
          </section>
          <section class="legal_section">
            <h2>1. OBJETO</h2>
            <p>Este DPA estabelece as condições aplicáveis ao tratamento de dados pessoais realizado pela Work in Ideas por meio do AkiDocs em nome da empresa-cliente, nos termos da Lei nº 13.709/2018 — Lei Geral de Proteção de Dados Pessoais (“LGPD”) e demais normas aplicáveis.</p>
            <p>O tratamento regulado por este DPA decorre da utilização do AkiDocs para atividades como:</p>
            <ul>
              <li>cadastro de funcionários;</li>
              <li>cadastro de clientes;</li>
              <li>cadastro de funcionários vinculados aos clientes;</li>
              <li>criação e gerenciamento de usuários;</li>
              <li>criação de grupos, setores e estruturas de acesso;</li>
              <li>gerenciamento de permissões;</li>
              <li>armazenamento de arquivos;</li>
              <li>organização de arquivos e pastas;</li>
              <li>compartilhamento de arquivos;</li>
              <li>autenticação;</li>
              <li>registros técnicos e de segurança;</li>
              <li>exportação e exclusão de dados.</li>
            </ul>
          </section>
          <section class="legal_section">
            <h2>2. DEFINIÇÕES</h2>
            <p>Para fins deste DPA:</p>
            <p>Controladora: pessoa natural ou jurídica responsável pelas decisões referentes ao tratamento de dados pessoais.</p>
            <p>Operadora: pessoa natural ou jurídica que realiza o tratamento de dados pessoais em nome da Controladora.</p>
            <p>Titular: pessoa natural a quem se referem os dados pessoais objeto de tratamento.</p>
            <p>Dados Pessoais: informação relacionada a pessoa natural identificada ou identificável.</p>
            <p>Dados Pessoais Sensíveis: dados definidos como sensíveis pela legislação aplicável, incluindo, entre outros, informações relacionadas à saúde, biometria, origem racial ou étnica, convicção religiosa e demais categorias previstas na LGPD.</p>
            <p>Tratamento: qualquer operação realizada com dados pessoais, incluindo coleta, utilização, acesso, armazenamento, organização, compartilhamento, recuperação, eliminação ou outras operações previstas pela legislação.</p>
            <p>Suboperador: terceiro contratado pela Operadora para realizar operações de tratamento necessárias à prestação dos serviços.</p>
            <p>Incidente de Segurança: evento confirmado que comprometa a confidencialidade, integridade ou disponibilidade de dados pessoais, nos termos da legislação aplicável.</p>
          </section>
          <section class="legal_section">
            <h2>3. PAPÉIS DAS PARTES</h2>
            <h3>3.1. Empresa-cliente como Controladora</h3>
            <p>Em relação aos dados pessoais inseridos no AkiDocs pela empresa-cliente ou por usuários sob sua administração, a:</p>
            <p>empresa-cliente atua como Controladora.</p>
            <p>A empresa-cliente determina, entre outros aspectos:</p>
            <ul>
              <li>quais dados serão tratados;</li>
              <li>quais pessoas serão cadastradas;</li>
              <li>quais documentos serão armazenados;</li>
              <li>quais usuários terão acesso;</li>
              <li>quais grupos serão criados;</li>
              <li>quais arquivos poderão ser compartilhados;</li>
              <li>quais permissões serão concedidas;</li>
              <li>a finalidade do tratamento realizado por meio da plataforma.</li>
            </ul>
            <h3>3.2. Work in Ideas como Operadora</h3>
            <p>Em relação aos dados pessoais tratados em nome da empresa-cliente:</p>
            <p>a Work in Ideas, por meio do AkiDocs, atua como Operadora.</p>
            <p>A Work in Ideas realizará o tratamento necessário à execução do serviço contratado conforme:</p>
            <ul>
              <li>as instruções da Controladora;</li>
              <li>as configurações realizadas na plataforma;</li>
              <li>este DPA;</li>
              <li>os demais documentos contratuais;</li>
              <li>a legislação aplicável.</li>
            </ul>
            <h3>3.3. Work in Ideas como Controladora independente</h3>
            <p>Determinados tratamentos necessários à administração do próprio AkiDocs são realizados pela Work in Ideas na condição de Controladora.</p>
            <p>Isso inclui, conforme aplicável:</p>
            <ul>
              <li>cadastro da empresa contratante;</li>
              <li>administração da contratação;</li>
              <li>faturamento;</li>
              <li>autenticação;</li>
              <li>validação de acesso;</li>
              <li>dados de segurança;</li>
              <li>logs próprios da aplicação;</li>
              <li>suporte;</li>
              <li>cumprimento de obrigações legais;</li>
              <li>proteção dos direitos da Work in Ideas.</li>
            </ul>
            <p>Esses tratamentos são disciplinados principalmente pela Política de Privacidade do AkiDocs e não alteram a posição da Work in Ideas como Operadora em relação aos dados inseridos pela empresa-cliente.</p>
          </section>
          <section class="legal_section">
            <h2>4. INSTRUÇÕES DA CONTROLADORA</h2>
            <p>A Work in Ideas tratará os dados pessoais de acordo com as instruções documentadas da empresa-cliente.</p>
            <p>Para os fins deste DPA, consideram-se instruções documentadas:</p>
            <ul>
              <li>utilização das funcionalidades do AkiDocs;</li>
              <li>configurações realizadas por administradores autorizados;</li>
              <li>cadastro de usuários;</li>
              <li>criação de grupos;</li>
              <li>definição de permissões;</li>
              <li>upload, organização, compartilhamento e exclusão de arquivos;</li>
              <li>solicitações formalmente encaminhadas pelos canais oficiais;</li>
              <li>obrigações expressamente previstas nos documentos contratuais.</li>
            </ul>
            <p>Caso a Work in Ideas considere que determinada instrução possa representar violação da legislação aplicável, poderá comunicar essa circunstância à empresa-cliente antes de executá-la, quando juridicamente possível.</p>
          </section>
          <section class="legal_section">
            <h2>5. RESPONSABILIDADES DA CONTROLADORA</h2>
            <p>Compete à empresa-cliente:</p>
            <ul>
              <li>possuir fundamento jurídico adequado para o tratamento dos dados pessoais;</li>
              <li>fornecer informações adequadas aos titulares, quando necessário;</li>
              <li>garantir a legitimidade dos dados inseridos;</li>
              <li>determinar adequadamente as permissões de acesso;</li>
              <li>manter usuários e acessos atualizados;</li>
              <li>excluir acessos que deixem de ser necessários;</li>
              <li>atender os direitos dos titulares quando atuar como Controladora;</li>
              <li>cumprir obrigações legais ou regulatórias relacionadas à sua atividade;</li>
              <li>determinar os períodos adequados de conservação de dados dentro da plataforma;</li>
              <li>garantir que o armazenamento e compartilhamento de documentos sejam permitidos pela legislação.</li>
            </ul>
            <p>A Work in Ideas não determina quais documentos ou informações a empresa-cliente deverá armazenar.</p>
          </section>
          <section class="legal_section">
            <h2>6. NATUREZA E FINALIDADE DO TRATAMENTO</h2>
            <p>O tratamento realizado pela Work in Ideas tem como finalidade a prestação dos serviços tecnológicos do AkiDocs.</p>
            <p>As operações poderão envolver:</p>
            <ul>
              <li>recepção de dados;</li>
              <li>armazenamento;</li>
              <li>organização;</li>
              <li>disponibilização;</li>
              <li>autenticação;</li>
              <li>controle de acesso;</li>
              <li>recuperação;</li>
              <li>transmissão técnica;</li>
              <li>compartilhamento conforme instruções do cliente;</li>
              <li>geração de registros técnicos;</li>
              <li>realização de backups;</li>
              <li>exportação;</li>
              <li>exclusão.</li>
            </ul>
            <p>A Work in Ideas não utilizará os dados tratados como Operadora para:</p>
            <ul>
              <li>publicidade;</li>
              <li>marketing próprio;</li>
              <li>criação de perfis comerciais;</li>
              <li>enriquecimento de bases de dados;</li>
              <li>venda de informações;</li>
              <li>treinamento de modelos com o conteúdo dos arquivos;</li>
              <li>finalidades incompatíveis com a prestação do serviço.</li>
            </ul>
          </section>
          <section class="legal_section">
            <h2>7. CATEGORIAS DE TITULARES</h2>
            <p>Os dados tratados por meio do AkiDocs poderão se referir, conforme utilização determinada pela empresa-cliente, a:</p>
            <ul>
              <li>funcionários da empresa-cliente;</li>
              <li>administradores;</li>
              <li>colaboradores;</li>
              <li>clientes da empresa-cliente;</li>
              <li>funcionários dos clientes da empresa-cliente;</li>
              <li>prestadores de serviços;</li>
              <li>representantes;</li>
              <li>parceiros;</li>
              <li>demais pessoas cujos dados estejam legitimamente inseridos nos documentos armazenados.</li>
            </ul>
          </section>
          <section class="legal_section">
            <h2>8. CATEGORIAS DE DADOS</h2>
            <p>Dependendo do uso realizado pela empresa-cliente, poderão ser tratados:</p>
            <ul>
              <li>nomes;</li>
              <li>e-mails;</li>
              <li>telefones;</li>
              <li>dados profissionais;</li>
              <li>vínculo empresarial;</li>
              <li>informações de identificação;</li>
              <li>grupos e permissões;</li>
              <li>dados técnicos de acesso;</li>
              <li>registros de utilização;</li>
              <li>documentos e arquivos enviados pela empresa-cliente.</li>
            </ul>
            <p>Como o AkiDocs permite armazenamento de documentos sem analisar seu conteúdo, esses documentos poderão conter outras categorias de dados pessoais determinadas pela empresa-cliente.</p>
          </section>
          <section class="legal_section">
            <h2>9. DADOS PESSOAIS SENSÍVEIS</h2>
            <p>O AkiDocs poderá ser utilizado pela Controladora para armazenar documentos contendo dados pessoais sensíveis.</p>
            <p>A Work in Ideas:</p>
            <ul>
              <li>não determina a inclusão desses dados;</li>
              <li>não identifica previamente o conteúdo dos documentos;</li>
              <li>não analisa o conteúdo dos arquivos;</li>
              <li>não utiliza os dados sensíveis para finalidade própria.</li>
            </ul>
            <p>Compete à Controladora assegurar que o tratamento dessas informações possua fundamento jurídico adequado e observe as exigências aplicáveis.</p>
          </section>
          <section class="legal_section">
            <h2>10. ACESSO AO CONTEÚDO DOS ARQUIVOS</h2>
            <p>Os arquivos enviados ao AkiDocs são armazenados de forma criptografada.</p>
            <p>A plataforma realiza operações técnicas necessárias à:</p>
            <ul>
              <li>inclusão;</li>
              <li>armazenamento;</li>
              <li>recuperação;</li>
              <li>disponibilização autorizada;</li>
              <li>organização;</li>
              <li>exclusão.</li>
            </ul>
            <p>A equipe da Work in Ideas não possui acesso ao conteúdo legível dos arquivos armazenados pela empresa-cliente.</p>
            <p>A Work in Ideas não realiza leitura, interpretação ou análise dos documentos armazenados.</p>
            <p>Consequentemente, o suporte técnico do AkiDocs não realiza suporte relacionado ao conteúdo interno dos arquivos.</p>
          </section>
          <section class="legal_section">
            <h2>11. CONFIDENCIALIDADE</h2>
            <p>A Work in Ideas compromete-se a preservar a confidencialidade dos dados pessoais tratados em nome da Controladora.</p>
            <p>O acesso interno a sistemas e informações administrativas deverá ser limitado às pessoas que necessitem desse acesso para desempenho de suas funções.</p>
            <p>Funcionários, colaboradores e prestadores autorizados deverão estar sujeitos a deveres de confidencialidade compatíveis com as funções exercidas.</p>
          </section>
          <section class="legal_section">
            <h2>12. SEGURANÇA DA INFORMAÇÃO</h2>
            <p>A Work in Ideas adotará medidas técnicas e administrativas razoáveis e compatíveis com:</p>
            <ul>
              <li>a natureza dos dados tratados;</li>
              <li>a arquitetura da plataforma;</li>
              <li>os riscos associados ao tratamento;</li>
              <li>a finalidade dos serviços prestados.</li>
            </ul>
            <p>As medidas adotadas incluem, conforme aplicável:</p>
            <ul>
              <li>criptografia de arquivos;</li>
              <li>controle de acesso;</li>
              <li>autenticação;</li>
              <li>gerenciamento de permissões;</li>
              <li>proteção da infraestrutura;</li>
              <li>registros técnicos;</li>
              <li>monitoramento;</li>
              <li>proteção de rede e aplicação;</li>
              <li>backups;</li>
              <li>segregação lógica entre organizações;</li>
              <li>procedimentos de resposta a incidentes.</li>
            </ul>
          </section>
          <section class="legal_section">
            <h2>13. ISOLAMENTO ENTRE EMPRESAS-CLIENTES</h2>
            <p>Os ambientes lógicos das empresas-clientes devem permanecer segregados.</p>
            <p>Usuários pertencentes a determinada organização somente poderão acessar informações para as quais possuam autorização dentro dessa organização.</p>
            <p>O AkiDocs utilizará controles de aplicação e autorização destinados a impedir que usuários de uma empresa-cliente acessem os dados pertencentes a outra.</p>
          </section>
          <section class="legal_section">
            <h2>14. INFRAESTRUTURA</h2>
            <p>A infraestrutura principal utilizada pelo AkiDocs para armazenamento e processamento dos dados está configurada para utilização de recursos localizados no:</p>
            <p>Brasil — São Paulo.</p>
            <p>Os principais fornecedores de infraestrutura são:</p>
            <ul>
              <li>DigitalOcean;</li>
              <li>Amazon Web Services — AWS.</li>
            </ul>
            <p>O AkiDocs também utiliza serviços da Cloudflare como camada de segurança e proteção de acesso à aplicação.</p>
          </section>
          <section class="legal_section">
            <h2>15. SUBOPERADORES E PRESTADORES</h2>
            <p>A empresa-cliente autoriza a Work in Ideas a utilizar prestadores necessários à execução do AkiDocs.</p>
            <p>Atualmente, os principais prestadores são:</p>
            <p>DigitalOcean</p>
            <p>Finalidade: infraestrutura, processamento e armazenamento.</p>
            <p>Amazon Web Services — AWS</p>
            <p>Finalidade: infraestrutura de nuvem e armazenamento de dados e arquivos.</p>
            <p>Cloudflare</p>
            <p>Finalidade: proteção de acesso, segurança, processamento técnico de tráfego e mitigação de ataques.</p>
            <p>PagSeguro</p>
            <p>Finalidade: processamento das cobranças e pagamentos relacionados à assinatura.</p>
            <p>O PagSeguro poderá atuar de maneira independente em relação aos dados necessários ao processamento financeiro, de acordo com as obrigações legais e regulatórias aplicáveis à sua atividade.</p>
            <p>A Work in Ideas poderá substituir ou contratar novos fornecedores quando necessário ao funcionamento do AkiDocs, observando requisitos razoáveis de segurança e proteção de dados.</p>
          </section>
          <section class="legal_section">
            <h2>16. RESPONSABILIDADE PELOS SUBOPERADORES</h2>
            <p>Quando determinado prestador atuar como suboperador de dados tratados em nome da empresa-cliente, a Work in Ideas buscará assegurar que esse prestador esteja sujeito a obrigações de proteção de dados compatíveis com a natureza das operações realizadas.</p>
            <p>A contratação de suboperador não afasta as obrigações assumidas pela Work in Ideas perante a empresa-cliente nos limites aplicáveis à operação realizada.</p>
          </section>
          <section class="legal_section">
            <h2>17. TRANSFERÊNCIAS INTERNACIONAIS</h2>
            <p>A infraestrutura principal de armazenamento e processamento dos arquivos e dados do AkiDocs está localizada no Brasil, em São Paulo.</p>
            <p>Determinados fornecedores de segurança, analytics ou serviços tecnológicos auxiliares poderão operar infraestrutura global.</p>
            <p>Caso determinada operação configure transferência internacional de dados pessoais, deverão ser observadas as exigências previstas na LGPD e na regulamentação da ANPD, incluindo a utilização de mecanismo válido de transferência internacional quando necessário.</p>
            <p>A Work in Ideas fornecerá à Controladora as informações razoavelmente disponíveis necessárias para avaliação dessa transferência.</p>
          </section>
          <section class="legal_section">
            <h2>18. BACKUPS</h2>
            <p>O AkiDocs realiza:</p>
            <p>backups diários.</p>
            <p>Os backups são mantidos por até:</p>
            <p>30 dias.</p>
            <p>Os backups possuem finalidade de:</p>
            <ul>
              <li>continuidade do serviço;</li>
              <li>recuperação de desastre;</li>
              <li>preservação da integridade da infraestrutura.</li>
            </ul>
            <p>Não constituem mecanismo permanente de arquivamento individual de documentos.</p>
          </section>
          <section class="legal_section">
            <h2>19. EXCLUSÃO DE ARQUIVOS</h2>
            <p>Quando a empresa-cliente exclui um arquivo, ele é enviado inicialmente para a lixeira.</p>
            <p>O período máximo de permanência na lixeira é:</p>
            <p>30 dias.</p>
            <p>Após o esvaziamento da lixeira:</p>
            <ul>
              <li>o arquivo deixa de estar disponível nos sistemas ativos;</li>
              <li>eventuais cópias residuais poderão permanecer temporariamente nos backups;</li>
              <li>essas cópias serão eliminadas conforme o ciclo normal de retenção dos backups, limitado a 30 dias.</li>
            </ul>
          </section>
          <section class="legal_section">
            <h2>20. ENCERRAMENTO DO CONTRATO</h2>
            <p>Quando a empresa-cliente encerrar sua contratação, seus arquivos e dados permanecerão disponíveis exclusivamente para ela durante:</p>
            <p>90 dias.</p>
            <p>Esse período destina-se principalmente à:</p>
            <ul>
              <li>consulta;</li>
              <li>exportação;</li>
              <li>retirada dos arquivos e dados.</li>
            </ul>
            <p>Durante esse período poderão ser aplicadas restrições à criação de novos conteúdos.</p>
            <p>Após o período de 90 dias:</p>
            <ul>
              <li>os dados serão removidos dos sistemas ativos;</li>
              <li>a conta poderá ser definitivamente encerrada;</li>
              <li>cópias residuais em backups serão eliminadas conforme o ciclo de retenção de até 30 dias.</li>
            </ul>
          </section>
          <section class="legal_section">
            <h2>21. DEVOLUÇÃO E PORTABILIDADE DOS DADOS</h2>
            <p>Antes da exclusão definitiva, a Controladora poderá exportar seus dados.</p>
            <p>O AkiDocs disponibiliza:</p>
            <p>Arquivos</p>
            <p>Download dos arquivos preservando a estrutura de pastas existente na plataforma.</p>
            <p>Dados cadastrais</p>
            <p>Exportação por planilha contendo, conforme aplicável:</p>
            <ul>
              <li>dados da empresa-cliente;</li>
              <li>funcionários;</li>
              <li>clientes;</li>
              <li>funcionários vinculados aos clientes.</li>
            </ul>
            <p>A responsabilidade pela realização da exportação dentro do período disponibilizado compete à empresa-cliente.</p>
          </section>
          <section class="legal_section">
            <h2>22. SOLICITAÇÕES DE TITULARES</h2>
            <p>Quando a Work in Ideas receber diretamente uma solicitação relacionada a dados tratados exclusivamente em nome da empresa-cliente, poderá encaminhar o titular à respectiva Controladora ou comunicar a solicitação à empresa-cliente.</p>
            <p>A Work in Ideas prestará assistência razoável à Controladora quando necessário para atendimento de direitos previstos pela LGPD, considerando:</p>
            <ul>
              <li>a natureza da solicitação;</li>
              <li>as funcionalidades da plataforma;</li>
              <li>os dados efetivamente disponíveis;</li>
              <li>as respectivas responsabilidades das partes.</li>
            </ul>
          </section>
          <section class="legal_section">
            <h2>23. CORREÇÃO E EXCLUSÃO DE DADOS</h2>
            <p>Sempre que tecnicamente possível, a Controladora poderá utilizar as próprias funcionalidades do AkiDocs para:</p>
            <ul>
              <li>corrigir dados;</li>
              <li>modificar usuários;</li>
              <li>alterar permissões;</li>
              <li>excluir cadastros;</li>
              <li>excluir arquivos.</li>
            </ul>
            <p>Quando uma operação necessária ao cumprimento de obrigação legal não puder ser realizada diretamente pela Controladora, poderá ser solicitada assistência por meio dos canais oficiais.</p>
          </section>
          <section class="legal_section">
            <h2>24. INCIDENTES DE SEGURANÇA</h2>
            <p>Na ocorrência de incidente de segurança envolvendo dados tratados em nome da Controladora, a Work in Ideas adotará procedimento que poderá envolver:</p>
            <ul>
              <li>identificação;</li>
              <li>contenção;</li>
              <li>preservação de evidências;</li>
              <li>investigação;</li>
              <li>avaliação dos dados envolvidos;</li>
              <li>identificação dos clientes potencialmente afetados;</li>
              <li>correção ou mitigação;</li>
              <li>documentação;</li>
              <li>comunicação.</li>
            </ul>
          </section>
          <section class="legal_section">
            <h2>25. COMUNICAÇÃO DE INCIDENTES À CONTROLADORA</h2>
            <p>Quando a Work in Ideas atuar como Operadora e identificar incidente relevante envolvendo dados pessoais tratados em nome da empresa-cliente, a Controladora será informada:</p>
            <p>sem demora injustificada, tão logo existam elementos suficientes para a caracterização inicial do incidente.</p>
            <p>A comunicação deverá conter as informações disponíveis no momento e poderá ser complementada posteriormente conforme a investigação evolua.</p>
            <p>Sempre que disponíveis e aplicáveis, poderão ser fornecidas informações como:</p>
            <ul>
              <li>natureza do incidente;</li>
              <li>data ou período estimado;</li>
              <li>categorias de dados envolvidas;</li>
              <li>titulares potencialmente afetados;</li>
              <li>medidas de contenção adotadas;</li>
              <li>riscos identificados;</li>
              <li>medidas corretivas realizadas;</li>
              <li>informações adicionais necessárias à avaliação pela Controladora.</li>
            </ul>
          </section>
          <section class="legal_section">
            <h2>26. COMUNICAÇÃO À ANPD E AOS TITULARES</h2>
            <p>Quando a Work in Ideas atuar exclusivamente como Operadora, caberá à Controladora avaliar e realizar as comunicações obrigatórias à Autoridade Nacional de Proteção de Dados — ANPD e aos titulares.</p>
            <p>A Work in Ideas fornecerá à Controladora as informações razoavelmente disponíveis necessárias para essa avaliação.</p>
            <p>Quando a Work in Ideas atuar como Controladora em relação aos dados envolvidos no incidente, cumprirá diretamente as obrigações de comunicação que lhe forem aplicáveis.</p>
          </section>
          <section class="legal_section">
            <h2>27. REGISTRO DE INCIDENTES</h2>
            <p>A Work in Ideas manterá registros dos incidentes de segurança envolvendo dados pessoais pelo período mínimo aplicável.</p>
            <p>Atualmente, esses registros serão conservados por pelo menos:</p>
            <p>5 anos.</p>
          </section>
          <section class="legal_section">
            <h2>28. COOPERAÇÃO REGULATÓRIA</h2>
            <p>A Work in Ideas e a empresa-cliente deverão cooperar, dentro de suas respectivas responsabilidades, em caso de:</p>
            <ul>
              <li>fiscalização da ANPD;</li>
              <li>determinação de autoridade competente;</li>
              <li>solicitação legalmente válida relacionada ao tratamento;</li>
              <li>investigação de incidente;</li>
              <li>exercício de direitos dos titulares.</li>
            </ul>
            <p>Cada parte será responsável pelas obrigações que lhe forem atribuídas pela legislação.</p>
          </section>
          <section class="legal_section">
            <h2>29. SOLICITAÇÕES DE AUTORIDADES</h2>
            <p>Caso a Work in Ideas receba determinação válida de autoridade competente relativa a dados tratados em nome da Controladora, observará as obrigações legais aplicáveis.</p>
            <p>Quando juridicamente permitido, a empresa-cliente poderá ser informada da solicitação para que adote as providências cabíveis.</p>
            <p>A Work in Ideas limitará o fornecimento de informações ao necessário para cumprimento da obrigação legal ou determinação válida.</p>
          </section>
          <section class="legal_section">
            <h2>30. REGISTROS DAS OPERAÇÕES DE TRATAMENTO</h2>
            <p>Cada parte deverá manter os registros das operações de tratamento que lhe sejam exigidos pela legislação e regulamentação aplicáveis.</p>
            <p>A Work in Ideas manterá registros compatíveis com suas atividades como Operadora e, quando aplicável, Controladora.</p>
          </section>
          <section class="legal_section">
            <h2>31. RELATÓRIO DE IMPACTO À PROTEÇÃO DE DADOS</h2>
            <p>Quando a Controladora estiver legalmente obrigada a elaborar Relatório de Impacto à Proteção de Dados Pessoais relacionado ao uso do AkiDocs, a Work in Ideas fornecerá, dentro do razoavelmente disponível, informações técnicas relacionadas às operações por ela realizadas que sejam necessárias à elaboração do relatório.</p>
            <p>A elaboração, conclusão e avaliação jurídica do relatório permanecerão sob responsabilidade da Controladora quando a obrigação decorrer do tratamento por ela determinado.</p>
          </section>
          <section class="legal_section">
            <h2>32. AUDITORIA E COMPROVAÇÃO DE CONFORMIDADE</h2>
            <p>A Work in Ideas poderá fornecer à empresa-cliente informações razoavelmente necessárias para demonstrar o cumprimento das obrigações assumidas neste DPA.</p>
            <p>Atualmente, o AkiDocs não declara possuir certificação independente como:</p>
            <ul>
              <li>ISO 27001;</li>
              <li>SOC 2.</li>
            </ul>
            <p>A segurança é administrada internamente por meio de controles técnicos e administrativos.</p>
            <p>Eventuais solicitações de auditoria formuladas pela empresa-cliente deverão:</p>
            <ul>
              <li>possuir relação razoável com o tratamento realizado;</li>
              <li>preservar a segurança da infraestrutura;</li>
              <li>preservar informações confidenciais;</li>
              <li>não permitir acesso a dados pertencentes a outros clientes;</li>
              <li>ser previamente acordadas entre as partes quanto a escopo e condições.</li>
            </ul>
            <p>Nada nesta cláusula obriga a Work in Ideas a fornecer código-fonte, credenciais, chaves criptográficas ou informações cuja divulgação possa comprometer a segurança da plataforma.</p>
          </section>
          <section class="legal_section">
            <h2>33. CONFIDENCIALIDADE DAS INFORMAÇÕES DE SEGURANÇA</h2>
            <p>Informações fornecidas à Controladora sobre:</p>
            <ul>
              <li>arquitetura;</li>
              <li>vulnerabilidades;</li>
              <li>controles internos;</li>
              <li>infraestrutura;</li>
              <li>incidentes;</li>
              <li>medidas de proteção;</li>
              <li>poderão ser classificadas como confidenciais.</li>
            </ul>
            <p>A empresa-cliente deverá utilizar essas informações somente para finalidade legítima de avaliação, compliance ou cumprimento de obrigação legal.</p>
          </section>
          <section class="legal_section">
            <h2>34. ENCARREGADO DE PROTEÇÃO DE DADOS</h2>
            <p>O encarregado pelo tratamento de dados pessoais da Work in Ideas é:</p>
            <p>Charles EgidioGerente de Projetos e Encarregado de Proteção de Dados — DPOE-mail: <a href="mailto:charles@wi-id.com">charles@wi-id.com</a></p>
            <p>Questões relacionadas à privacidade e proteção de dados poderão ser encaminhadas a esse canal.</p>
            <p>Solicitações de suporte técnico deverão ser abertas exclusivamente em:</p>
            <p><a href="https://suporte.akidocs.com.br" target="_blank" rel="noopener noreferrer">suporte.akidocs.com.br</a></p>
          </section>
          <section class="legal_section">
            <h2>35. RESPONSABILIDADE DAS PARTES</h2>
            <p>Cada parte será responsável pelos atos de tratamento que estejam sob sua esfera de decisão e responsabilidade, observadas as regras da LGPD e demais normas aplicáveis.</p>
            <p>A empresa-cliente será responsável, entre outros aspectos, por:</p>
            <ul>
              <li>legalidade dos dados inseridos;</li>
              <li>definição das finalidades;</li>
              <li>bases legais;</li>
              <li>informações fornecidas aos titulares;</li>
              <li>usuários autorizados;</li>
              <li>permissões concedidas;</li>
              <li>compartilhamentos realizados por seus usuários.</li>
            </ul>
            <p>A Work in Ideas será responsável pelas obrigações atribuíveis às operações que executar na condição de Operadora, observadas as instruções legítimas da Controladora.</p>
            <p>Nenhuma disposição deste DPA afastará responsabilidade que não possa ser excluída por força da legislação.</p>
          </section>
          <section class="legal_section">
            <h2>36. VIOLAÇÃO DAS INSTRUÇÕES DA CONTROLADORA</h2>
            <p>Caso a Operadora trate dados pessoais em desacordo com instruções legítimas da Controladora e passe a determinar finalidade própria incompatível com a prestação contratada, poderá responder pelo tratamento realizado conforme o papel efetivamente exercido e as regras previstas na legislação.</p>
          </section>
          <section class="legal_section">
            <h2>37. PRAZO DE VIGÊNCIA</h2>
            <p>Este DPA permanecerá vigente enquanto a Work in Ideas realizar tratamento de dados pessoais em nome da empresa-cliente.</p>
            <p>As obrigações relacionadas a:</p>
            <ul>
              <li>confidencialidade;</li>
              <li>segurança;</li>
              <li>exclusão;</li>
              <li>responsabilidade;</li>
              <li>cooperação regulatória;</li>
              <li>continuarão aplicáveis após o encerramento enquanto existirem dados sujeitos a tratamento ou obrigações legais pendentes.</li>
            </ul>
          </section>
          <section class="legal_section">
            <h2>38. TÉRMINO DO TRATAMENTO</h2>
            <p>O tratamento realizado em nome da Controladora será considerado encerrado após:</p>
            <ul>
              <li>término da contratação;</li>
              <li>encerramento do período de 90 dias disponibilizado para exportação;</li>
              <li>exclusão dos dados dos sistemas ativos;</li>
              <li>conclusão do ciclo de retenção dos backups aplicáveis.</li>
            </ul>
            <p>Dados que devam ser conservados em razão de obrigação legal poderão ser mantidos somente pelo período e finalidade exigidos pela legislação.</p>
          </section>
          <section class="legal_section">
            <h2>39. ALTERAÇÕES DESTE DPA</h2>
            <p>Este DPA poderá ser atualizado em decorrência de:</p>
            <ul>
              <li>alteração legislativa;</li>
              <li>regulamentação da ANPD;</li>
              <li>alteração de infraestrutura;</li>
              <li>alteração de fornecedores;</li>
              <li>evolução do serviço;</li>
              <li>necessidade de aprimoramento das medidas de proteção.</li>
            </ul>
            <p>Alterações materialmente relevantes deverão observar as disposições contratuais aplicáveis e poderão ser comunicadas às empresas-clientes.</p>
          </section>
          <section class="legal_section">
            <h2>40. PREVALÊNCIA DOS DOCUMENTOS</h2>
            <p>Este DPA complementa:</p>
            <ul>
              <li>o contrato ou proposta comercial;</li>
              <li>os Termos de Uso;</li>
              <li>a Política de Privacidade;</li>
              <li>o SLA.</li>
            </ul>
            <p>Em matéria especificamente relacionada ao tratamento de dados pessoais realizado pela Work in Ideas em nome da empresa-cliente, este DPA deverá prevalecer sobre disposições gerais incompatíveis, salvo acordo específico escrito entre as partes ou obrigação legal em sentido diverso.</p>
          </section>
          <section class="legal_section">
            <h2>41. LEGISLAÇÃO APLICÁVEL</h2>
            <p>Este DPA será regido pelas leis da República Federativa do Brasil, especialmente pela:</p>
            <p>Lei nº 13.709/2018 — Lei Geral de Proteção de Dados Pessoais — LGPD.</p>
            <p>Também serão observadas as regulamentações aplicáveis emitidas pela Autoridade Nacional de Proteção de Dados — ANPD.</p>
          </section>
          <section class="legal_section">
            <h2>ANEXO I — DESCRIÇÃO DO TRATAMENTO</h2>
            <p>Controladora: Empresa-cliente contratante do AkiDocs.</p>
            <p>Operadora: Work in Ideas, por meio da plataforma AkiDocs.</p>
            <p>Objeto do tratamento: prestação de serviços de gerenciamento, armazenamento, organização e compartilhamento de arquivos em nuvem.</p>
            <p>Duração: durante a vigência da contratação, acrescida dos períodos de retenção e exclusão previstos neste DPA.</p>
            <p>Finalidades principais:</p>
            <ul>
              <li>cadastro;</li>
              <li>autenticação;</li>
              <li>gerenciamento de usuários;</li>
              <li>controle de acesso;</li>
              <li>armazenamento;</li>
              <li>organização;</li>
              <li>compartilhamento;</li>
              <li>recuperação;</li>
              <li>exportação;</li>
              <li>backup;</li>
              <li>exclusão.</li>
            </ul>
            <p>Categorias de titulares:</p>
            <ul>
              <li>funcionários;</li>
              <li>colaboradores;</li>
              <li>clientes;</li>
              <li>funcionários de clientes;</li>
              <li>prestadores;</li>
              <li>representantes;</li>
              <li>terceiros legitimamente cadastrados.</li>
            </ul>
            <p>Categorias de dados:</p>
            <ul>
              <li>dados cadastrais;</li>
              <li>dados de contato;</li>
              <li>dados profissionais;</li>
              <li>informações de acesso;</li>
              <li>permissões;</li>
              <li>metadados;</li>
              <li>arquivos e documentos determinados pela Controladora.</li>
            </ul>
            <p>Dados sensíveis: poderão existir dentro dos documentos inseridos pela Controladora, sem análise prévia de seu conteúdo pela Operadora.</p>
            <p>Periodicidade: tratamento contínuo durante a utilização da plataforma.</p>
          </section>
          <section class="legal_section">
            <h2>ANEXO II — RETENÇÃO E ELIMINAÇÃO</h2>
            <p>Situação</p>
            <p>Regra</p>
            <p>Arquivo ativo</p>
            <p>Mantido enquanto determinado pela empresa-cliente</p>
            <p>Arquivo excluído</p>
            <p>Enviado à lixeira</p>
            <p>Lixeira</p>
            <p>Até 30 dias</p>
            <p>Após lixeira</p>
            <p>Removido dos sistemas ativos</p>
            <p>Backups</p>
            <p>Diários</p>
            <p>Retenção dos backups</p>
            <p>Até 30 dias</p>
            <p>Encerramento da conta</p>
            <p>Dados disponíveis exclusivamente ao cliente por 90 dias</p>
            <p>Após os 90 dias</p>
            <p>Remoção dos sistemas ativos</p>
            <p>Cópias residuais</p>
            <p>Eliminadas conforme ciclo de backup de até 30 dias</p>
            <p>Incidentes de segurança</p>
            <p>Registros mantidos por pelo menos 5 anos</p>
          </section>
          <section class="legal_section">
            <h2>ANEXO III — SUBOPERADORES E PRESTADORES RELEVANTES</h2>
            <p>Prestador</p>
            <p>Finalidade principal</p>
            <p>DigitalOcean</p>
            <p>Infraestrutura, processamento e armazenamento</p>
            <p>Amazon Web Services — AWS</p>
            <p>Infraestrutura de nuvem e armazenamento</p>
            <p>Cloudflare</p>
            <p>Segurança, proteção de acesso e processamento técnico de tráfego</p>
            <p>PagSeguro</p>
            <p>Processamento financeiro e gestão dos pagamentos</p>
            <p>A infraestrutura principal utilizada para armazenamento e processamento dos dados do AkiDocs está configurada para recursos localizados no Brasil, em São Paulo.</p>
            <p>Serviços auxiliares que utilizem infraestrutura global serão tratados conforme as regras aplicáveis a transferências internacionais de dados pessoais.</p>
          </section>
          <section class="legal_section">
            <h2>ANEXO IV — MEDIDAS DE SEGURANÇA</h2>
            <p>A Work in Ideas mantém medidas técnicas e administrativas destinadas à proteção dos dados tratados no AkiDocs, incluindo, conforme aplicável:</p>
            <ul>
              <li>criptografia dos arquivos armazenados;</li>
              <li>controle de acesso;</li>
              <li>autenticação;</li>
              <li>segregação de usuários e empresas;</li>
              <li>gerenciamento de permissões;</li>
              <li>proteção de tráfego;</li>
              <li>camada de segurança Cloudflare;</li>
              <li>infraestrutura em nuvem;</li>
              <li>backups diários;</li>
              <li>retenção controlada dos backups;</li>
              <li>registros técnicos;</li>
              <li>monitoramento;</li>
              <li>procedimentos internos de resposta a incidentes;</li>
              <li>limitação de acesso administrativo;</li>
              <li>confidencialidade de pessoas autorizadas.</li>
            </ul>
            <p>A adoção dessas medidas não representa garantia absoluta contra incidentes, mas compromisso com a aplicação de controles proporcionais à natureza e aos riscos dos serviços prestados.</p>
          </section>
          <section class="legal_section">
            <h2>ANEXO V — CONTATOS</h2>
            <p>Operadora — AkiDocs / Work in Ideas</p>
            <p>Encarregado de Proteção de Dados — DPO:Charles EgidioGerente de ProjetosE-mail: <a href="mailto:charles@wi-id.com">charles@wi-id.com</a></p>
            <p>Suporte técnico</p>
            <p><a href="https://suporte.akidocs.com.br" target="_blank" rel="noopener noreferrer">suporte.akidocs.com.br</a></p>
            <p>As informações completas da empresa-cliente Controladora constarão da contratação, proposta comercial ou instrumento equivalente.</p>
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
