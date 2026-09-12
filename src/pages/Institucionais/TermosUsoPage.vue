<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import LandingHeader from '@/pages/Landing/components/LandingHeader.vue'
import LandingFooter from '@/pages/Landing/components/LandingFooter.vue'
import { setPageSeo } from '@/utils/seo'

onMounted(() => {
  setPageSeo({
    title: 'Termos de Uso — AkiDocs | Condições de Prestação de Serviços SaaS',
    description: 'Leia os Termos de Uso do AkiDocs. Conheça as condições de contratação B2B, licença de software em nuvem, responsabilidades e direitos das partes.',
    canonicalUrl: 'https://akidocs.com.br/termos-de-uso'
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
          <h1 class="page_title">Termos de Uso da Plataforma AkiDocs</h1>
          <p class="page_subtitle">Última atualização: 11 de setembro de 2026</p>
        </header>

        <article class="legal_content">
          <section class="legal_section intro_section">
            <p>Estes Termos de Uso regulam a contratação e utilização da plataforma AkiDocs, operada pela Work in Ideas, bem como os direitos e responsabilidades das empresas-clientes e dos usuários vinculados às respectivas contas.</p>
            <p>Ao contratar, acessar ou utilizar o AkiDocs, a empresa-cliente declara estar de acordo com estes Termos de Uso, com a Política de Privacidade, com o Acordo de Nível de Serviço — SLA e com os demais documentos contratuais aplicáveis.</p>
          </section>
          <section class="legal_section">
            <h2>1. SOBRE O AKIDOCS</h2>
            <p>O AkiDocs é uma plataforma B2B destinada ao gerenciamento, armazenamento, organização e compartilhamento de arquivos em nuvem.</p>
            <p>A plataforma permite, de acordo com o plano contratado:</p>
            <ul>
              <li>criação e administração da conta empresarial;</li>
              <li>cadastro de usuários;</li>
              <li>cadastro de funcionários;</li>
              <li>cadastro de clientes;</li>
              <li>cadastro de funcionários vinculados aos clientes;</li>
              <li>criação de grupos, setores e estruturas de acesso;</li>
              <li>armazenamento de arquivos;</li>
              <li>organização de arquivos e pastas;</li>
              <li>compartilhamento entre usuários autorizados;</li>
              <li>gerenciamento de permissões;</li>
              <li>exportação de dados;</li>
              <li>demais funcionalidades disponibilizadas pela plataforma.</li>
            </ul>
            <p>O AkiDocs é destinado prioritariamente à utilização profissional e empresarial.</p>
          </section>
          <section class="legal_section">
            <h2>2. EMPRESA-CLIENTE</h2>
            <p>Para fins destes Termos, considera-se empresa-cliente a pessoa jurídica que contrata o AkiDocs e assume a administração principal da conta.</p>
            <p>O cadastro empresarial poderá exigir informações como:</p>
            <ul>
              <li>razão social;</li>
              <li>nome empresarial ou nome fantasia;</li>
              <li>CNPJ;</li>
              <li>dados do responsável;</li>
              <li>e-mail;</li>
              <li>telefone;</li>
              <li>informações de cobrança;</li>
              <li>demais informações necessárias à contratação.</li>
            </ul>
            <p>A empresa-cliente declara que todas as informações fornecidas são verdadeiras, completas e atualizadas.</p>
          </section>
          <section class="legal_section">
            <h2>3. REPRESENTAÇÃO DA EMPRESA</h2>
            <p>A pessoa responsável pela contratação declara possuir poderes ou autorização suficiente para representar a empresa-cliente perante o AkiDocs.</p>
            <p>Caso o cadastro ou contratação seja realizado por funcionário, preposto ou representante, a responsabilidade pela autorização desse usuário será da empresa-cliente.</p>
          </section>
          <section class="legal_section">
            <h2>4. CONTAS E USUÁRIOS</h2>
            <p>A empresa-cliente poderá cadastrar usuários conforme os limites estabelecidos pelo plano contratado.</p>
            <p>Os usuários poderão possuir diferentes níveis de acesso e permissões.</p>
            <p>A empresa-cliente é responsável por:</p>
            <ul>
              <li>determinar quem poderá acessar sua organização;</li>
              <li>definir permissões;</li>
              <li>criar e administrar grupos;</li>
              <li>remover usuários;</li>
              <li>revisar acessos;</li>
              <li>manter os dados dos usuários atualizados.</li>
            </ul>
            <p>O número de usuários administrativos poderá ser limitado conforme o plano contratado.</p>
          </section>
          <section class="legal_section">
            <h2>5. CREDENCIAIS E SEGURANÇA DE ACESSO</h2>
            <p>Cada usuário deverá utilizar suas próprias credenciais.</p>
            <p>É proibido compartilhar credenciais pessoais entre diferentes usuários quando isso comprometer a identificação individual do acesso.</p>
            <p>A empresa-cliente e seus usuários são responsáveis pela proteção de suas credenciais.</p>
            <p>A empresa-cliente deverá comunicar ao AkiDocs, tão logo tenha conhecimento, qualquer suspeita de:</p>
            <ul>
              <li>comprometimento de senha;</li>
              <li>acesso indevido;</li>
              <li>utilização não autorizada da conta;</li>
              <li>fraude;</li>
              <li>comprometimento de dispositivo;</li>
              <li>comportamento anormal relacionado à conta.</li>
            </ul>
            <p>O AkiDocs poderá utilizar mecanismos adicionais de validação de acesso, inclusive por e-mail ou telefone.</p>
          </section>
          <section class="legal_section">
            <h2>6. RESPONSABILIDADE PELOS USUÁRIOS CADASTRADOS</h2>
            <p>A empresa-cliente é responsável pelos usuários que cadastrar ou autorizar dentro de sua organização.</p>
            <p>Isso inclui usuários pertencentes:</p>
            <ul>
              <li>à própria empresa;</li>
              <li>aos seus departamentos;</li>
              <li>aos seus clientes;</li>
              <li>aos funcionários de seus clientes;</li>
              <li>a terceiros autorizados.</li>
            </ul>
            <p>Atos realizados por usuários devidamente autenticados serão considerados, em princípio, atos realizados dentro do ambiente administrado pela empresa-cliente.</p>
            <p>Cabe à empresa-cliente remover acessos quando deixarem de ser necessários.</p>
          </section>
          <section class="legal_section">
            <h2>7. ARQUIVOS E CONTEÚDOS</h2>
            <p>A empresa-cliente mantém a titularidade e responsabilidade sobre os arquivos inseridos no AkiDocs.</p>
            <p>A Work in Ideas não adquire propriedade sobre os documentos armazenados na plataforma.</p>
            <p>O AkiDocs atua somente como infraestrutura tecnológica necessária ao armazenamento e disponibilização dos arquivos aos usuários autorizados.</p>
            <p>Os arquivos são armazenados de forma criptografada.</p>
            <p>A equipe da Work in Ideas não possui acesso ao conteúdo legível dos arquivos armazenados pelos clientes.</p>
            <p>O AkiDocs não realiza leitura, interpretação ou análise do conteúdo dos documentos.</p>
          </section>
          <section class="legal_section">
            <h2>8. RESPONSABILIDADE PELO CONTEÚDO</h2>
            <p>A empresa-cliente é integralmente responsável pelos dados, arquivos e documentos que decidir armazenar ou compartilhar por meio do AkiDocs.</p>
            <p>Cabe à empresa-cliente garantir que possui:</p>
            <ul>
              <li>direito de utilizar o conteúdo;</li>
              <li>autorização para armazená-lo;</li>
              <li>autorização ou fundamento jurídico para compartilhá-lo;</li>
              <li>base legal adequada para o tratamento de dados pessoais;</li>
              <li>autorização necessária quando existirem direitos de terceiros.</li>
            </ul>
            <p>O AkiDocs não realiza análise prévia do conteúdo enviado.</p>
          </section>
          <section class="legal_section">
            <h2>9. CONTEÚDOS PROIBIDOS</h2>
            <p>É proibida a utilização do AkiDocs para armazenar, distribuir ou compartilhar conteúdo cuja utilização seja manifestamente ilícita.</p>
            <p>Isso inclui, sem limitação:</p>
            <ul>
              <li>conteúdo obtido de forma criminosa;</li>
              <li>malware ou código malicioso;</li>
              <li>material utilizado para fraude;</li>
              <li>conteúdo destinado à prática de crimes;</li>
              <li>material cuja posse ou distribuição seja proibida por lei;</li>
              <li>conteúdo que viole direitos de terceiros de maneira ilícita;</li>
              <li>arquivos utilizados deliberadamente para comprometer a segurança da plataforma.</li>
            </ul>
            <p>A Work in Ideas poderá adotar medidas técnicas para preservar a segurança da plataforma quando houver indícios concretos de utilização abusiva ou ilícita.</p>
          </section>
          <section class="legal_section">
            <h2>10. CONFIDENCIALIDADE</h2>
            <p>A estrutura do AkiDocs foi desenvolvida para permitir que a própria empresa-cliente determine quais usuários possuem acesso aos seus arquivos.</p>
            <p>A empresa-cliente é responsável pela definição adequada dessas permissões.</p>
            <p>A Work in Ideas adotará medidas técnicas e administrativas compatíveis com a natureza do serviço para proteger os dados tratados pela plataforma.</p>
          </section>
          <section class="legal_section">
            <h2>11. DADOS PESSOAIS</h2>
            <p>Quando uma empresa-cliente utiliza o AkiDocs para cadastrar funcionários, clientes, usuários ou documentos contendo dados pessoais:</p>
            <ul>
              <li>a empresa-cliente atua, em regra, como Controladora; e</li>
              <li>a Work in Ideas atua, em regra, como Operadora.</li>
            </ul>
            <p>A empresa-cliente é responsável por definir a finalidade e possuir fundamento jurídico adequado para o tratamento.</p>
            <p>A Work in Ideas realizará as operações necessárias à prestação do serviço conforme as instruções recebidas e as funcionalidades da plataforma.</p>
            <p>Os detalhes relacionados ao tratamento de dados pessoais constam da Política de Privacidade e, quando aplicável, do respectivo Acordo ou Anexo de Tratamento de Dados.</p>
          </section>
          <section class="legal_section">
            <h2>12. DADOS PESSOAIS SENSÍVEIS E INFORMAÇÕES CONFIDENCIAIS</h2>
            <p>A empresa-cliente poderá armazenar documentos contendo dados pessoais sensíveis ou informações sujeitas a sigilo profissional.</p>
            <p>O AkiDocs não identifica previamente o conteúdo dos documentos armazenados.</p>
            <p>Cabe à empresa-cliente avaliar se possui fundamento jurídico e autorização adequada para inserir essas informações na plataforma.</p>
          </section>
          <section class="legal_section">
            <h2>13. INFRAESTRUTURA</h2>
            <p>O AkiDocs utiliza serviços de infraestrutura fornecidos, entre outros, por:</p>
            <ul>
              <li>DigitalOcean;</li>
              <li>Amazon Web Services — AWS;</li>
              <li>Cloudflare.</li>
            </ul>
            <p>A infraestrutura principal destinada ao armazenamento e processamento dos dados e arquivos é configurada para utilização de recursos localizados no Brasil, em São Paulo.</p>
            <p>O processamento de pagamentos é realizado por meio do PagSeguro.</p>
          </section>
          <section class="legal_section">
            <h2>14. DISPONIBILIDADE DO SERVIÇO</h2>
            <p>Os compromissos relacionados à disponibilidade, suporte, manutenção, RPO, RTO e demais níveis de serviço são definidos no Acordo de Nível de Serviço — SLA do AkiDocs.</p>
            <p>Atualmente, o compromisso de disponibilidade mensal previsto no SLA é de:</p>
            <p>99,5%.</p>
            <p>As hipóteses excluídas do cálculo e as formas de compensação seguem as regras estabelecidas no SLA.</p>
          </section>
          <section class="legal_section">
            <h2>15. MANUTENÇÕES</h2>
            <p>O AkiDocs poderá realizar manutenções para:</p>
            <ul>
              <li>atualizar a plataforma;</li>
              <li>corrigir erros;</li>
              <li>melhorar funcionalidades;</li>
              <li>corrigir vulnerabilidades;</li>
              <li>atualizar infraestrutura;</li>
              <li>preservar a segurança;</li>
              <li>manter a continuidade do serviço.</li>
            </ul>
            <p>Manutenções programadas que possam causar indisponibilidade relevante observarão, sempre que possível, os prazos de comunicação definidos no SLA.</p>
            <p>Manutenções emergenciais poderão ocorrer sem aviso prévio quando necessárias para proteger a plataforma ou os dados armazenados.</p>
          </section>
          <section class="legal_section">
            <h2>16. SUPORTE</h2>
            <p>O suporte técnico do AkiDocs é realizado exclusivamente pela plataforma oficial de tickets:</p>
            <p><a href="https://suporte.akidocs.com.br" target="_blank" rel="noopener noreferrer">suporte.akidocs.com.br</a></p>
            <p>Para obter suporte, a empresa-cliente deverá abrir um ticket descrevendo a solicitação.</p>
            <p>Os níveis, horários e prazos de atendimento seguem as condições previstas no SLA vigente.</p>
            <p>Solicitações realizadas fora do sistema oficial de tickets não serão consideradas formalmente abertas para efeitos dos prazos do SLA.</p>
          </section>
          <section class="legal_section">
            <h2>17. PLANOS E LIMITES</h2>
            <p>As funcionalidades disponíveis poderão variar conforme o plano contratado.</p>
            <p>Cada plano poderá estabelecer limites relacionados a:</p>
            <ul>
              <li>número de usuários;</li>
              <li>número de administradores;</li>
              <li>capacidade de armazenamento;</li>
              <li>funcionalidades;</li>
              <li>recursos adicionais;</li>
              <li>outros critérios comerciais.</li>
            </ul>
            <p>Os limites aplicáveis serão informados no momento da contratação ou na descrição vigente do plano.</p>
          </section>
          <section class="legal_section">
            <h2>18. ALTERAÇÃO DE PLANO</h2>
            <p>A empresa-cliente poderá solicitar alteração de plano conforme as opções comerciais disponibilizadas.</p>
            <p>Alterações poderão produzir efeitos sobre:</p>
            <ul>
              <li>valor da assinatura;</li>
              <li>quantidade de usuários;</li>
              <li>armazenamento;</li>
              <li>funcionalidades;</li>
              <li>limites de utilização.</li>
            </ul>
            <p>As condições da alteração serão apresentadas antes da confirmação.</p>
          </section>
          <section class="legal_section">
            <h2>19. PAGAMENTOS</h2>
            <p>Os pagamentos das assinaturas são processados pelo PagSeguro.</p>
            <p>A empresa-cliente é responsável por fornecer informações válidas para cobrança e manter sua situação financeira regular.</p>
            <p>O AkiDocs poderá receber do PagSeguro informações operacionais relacionadas à cobrança, incluindo sua situação de aprovação, pagamento, atraso ou falha.</p>
          </section>
          <section class="legal_section">
            <h2>20. INADIMPLÊNCIA</h2>
            <p>Em caso de inadimplência, o AkiDocs poderá:</p>
            <ul>
              <li>comunicar a empresa-cliente;</li>
              <li>restringir determinadas funcionalidades;</li>
              <li>suspender novos uploads;</li>
              <li>limitar operações;</li>
              <li>suspender temporariamente o acesso ao serviço.</li>
            </ul>
            <p>A suspensão decorrente de inadimplência não representa exclusão automática dos arquivos.</p>
            <p>As condições comerciais de cobrança, vencimento, suspensão e eventual cancelamento poderão ser detalhadas na contratação.</p>
          </section>
          <section class="legal_section">
            <h2>21. CANCELAMENTO</h2>
            <p>A empresa-cliente poderá solicitar o encerramento da contratação conforme os procedimentos disponibilizados pelo AkiDocs.</p>
            <p>Após o encerramento, os arquivos e dados permanecerão disponíveis exclusivamente para a empresa-cliente durante:</p>
            <p>90 dias.</p>
            <p>Esse período destina-se principalmente à consulta e exportação.</p>
            <p>Durante essa etapa, funcionalidades destinadas à criação de novos conteúdos poderão ser restringidas.</p>
          </section>
          <section class="legal_section">
            <h2>22. EXPORTAÇÃO APÓS ENCERRAMENTO</h2>
            <p>Durante o período de encerramento, a empresa-cliente poderá realizar o download de seus arquivos preservando a estrutura de pastas utilizada na plataforma.</p>
            <p>Também poderá exportar, em formato de planilha, os dados cadastrais disponíveis, incluindo, conforme aplicável:</p>
            <ul>
              <li>dados da empresa;</li>
              <li>funcionários;</li>
              <li>clientes;</li>
              <li>funcionários dos clientes.</li>
            </ul>
          </section>
          <section class="legal_section">
            <h2>23. EXCLUSÃO APÓS ENCERRAMENTO</h2>
            <p>Após o período de 90 dias, os dados e arquivos serão removidos dos sistemas ativos.</p>
            <p>Eventuais cópias residuais existentes em backups serão eliminadas de acordo com o ciclo regular de retenção dos backups.</p>
            <p>Atualmente, os backups são mantidos por até:</p>
            <p>30 dias.</p>
            <p>Após a conclusão desse ciclo, os dados não poderão ser recuperados por meio da plataforma.</p>
          </section>
          <section class="legal_section">
            <h2>24. EXCLUSÃO DE ARQUIVOS DURANTE O USO</h2>
            <p>Arquivos excluídos durante a utilização regular do AkiDocs são enviados para a lixeira.</p>
            <p>Os arquivos permanecem na lixeira por até:</p>
            <p>30 dias.</p>
            <p>Após esse período, a lixeira é esvaziada automaticamente.</p>
            <p>O conteúdo deixa de estar disponível nos sistemas ativos e eventuais cópias residuais existentes em backups são eliminadas conforme o ciclo de retenção de até 30 dias.</p>
          </section>
          <section class="legal_section">
            <h2>25. BACKUPS</h2>
            <p>O AkiDocs realiza backups diários destinados à continuidade e integridade operacional da plataforma.</p>
            <p>Os backups são mantidos por até 30 dias.</p>
            <p>Os backups possuem finalidade de recuperação de infraestrutura e continuidade do serviço.</p>
            <p>Eles não constituem serviço permanente de arquivamento ou garantia individual de recuperação de documentos que tenham sido deliberadamente excluídos.</p>
          </section>
          <section class="legal_section">
            <h2>26. RESPONSABILIDADE DA EMPRESA-CLIENTE SOBRE BACKUPS PRÓPRIOS</h2>
            <p>Embora o AkiDocs mantenha mecanismos internos de backup e continuidade, a empresa-cliente deverá avaliar a necessidade de manter cópias próprias de documentos considerados críticos para sua operação.</p>
            <p>O AkiDocs não deverá ser utilizado como substituto único de obrigações legais, regulatórias ou profissionais de arquivamento quando determinada atividade exigir mecanismos específicos de conservação.</p>
          </section>
          <section class="legal_section">
            <h2>27. PROPRIEDADE INTELECTUAL DA PLATAFORMA</h2>
            <p>O software, marca, interface, design, estrutura, código-fonte, documentação, funcionalidades e demais elementos próprios do AkiDocs são protegidos pela legislação aplicável.</p>
            <p>A contratação do serviço concede apenas direito limitado de utilização da plataforma durante a vigência da contratação.</p>
            <p>Nenhum direito de propriedade intelectual sobre o AkiDocs é transferido à empresa-cliente.</p>
          </section>
          <section class="legal_section">
            <h2>28. PROPRIEDADE DOS ARQUIVOS DO CLIENTE</h2>
            <p>A Work in Ideas não reivindica direitos de propriedade sobre os arquivos armazenados pela empresa-cliente.</p>
            <p>A empresa-cliente mantém os direitos e responsabilidades existentes sobre seus próprios documentos.</p>
          </section>
          <section class="legal_section">
            <h2>29. USOS PROIBIDOS DA PLATAFORMA</h2>
            <p>A empresa-cliente e seus usuários não poderão:</p>
            <ul>
              <li>tentar acessar dados pertencentes a outra organização;</li>
              <li>explorar vulnerabilidades;</li>
              <li>contornar mecanismos de autenticação;</li>
              <li>realizar ataques contra a infraestrutura;</li>
              <li>distribuir malware;</li>
              <li>automatizar acessos de forma abusiva;</li>
              <li>causar degradação proposital do serviço;</li>
              <li>utilizar credenciais de terceiros sem autorização;</li>
              <li>utilizar o serviço para atividade ilícita;</li>
              <li>tentar obter acesso ao código-fonte ou infraestrutura por meios não autorizados.</li>
            </ul>
          </section>
          <section class="legal_section">
            <h2>30. PROTEÇÃO CONTRA ABUSO</h2>
            <p>A Work in Ideas poderá adotar medidas destinadas a preservar a segurança, disponibilidade e integridade da plataforma quando forem identificados comportamentos que representem risco.</p>
            <p>Essas medidas poderão incluir:</p>
            <ul>
              <li>limitação temporária de operações;</li>
              <li>bloqueio preventivo de acesso;</li>
              <li>revogação de sessões;</li>
              <li>exigência de nova autenticação;</li>
              <li>suspensão temporária de determinado usuário.</li>
            </ul>
            <p>Sempre que razoavelmente possível, a empresa-cliente será informada sobre medidas relevantes aplicadas à sua conta.</p>
          </section>
          <section class="legal_section">
            <h2>31. SUSPENSÃO DA CONTA</h2>
            <p>O AkiDocs poderá suspender temporariamente uma conta quando houver:</p>
            <ul>
              <li>risco de segurança;</li>
              <li>indício concreto de comprometimento;</li>
              <li>uso manifestamente ilícito;</li>
              <li>violação material destes Termos;</li>
              <li>inadimplência;</li>
              <li>risco relevante à infraestrutura;</li>
              <li>determinação legal ou judicial.</li>
            </ul>
            <p>Quando a situação puder ser corrigida, o AkiDocs poderá permitir a regularização antes do cancelamento definitivo.</p>
          </section>
          <section class="legal_section">
            <h2>32. ENCERRAMENTO POR VIOLAÇÃO</h2>
            <p>Violações graves ou reiteradas destes Termos poderão resultar no encerramento da contratação.</p>
            <p>Quando juridicamente e tecnicamente possível, a empresa-cliente será comunicada previamente e poderá receber oportunidade razoável para corrigir a irregularidade.</p>
            <p>Essa regra não impede suspensão ou bloqueio imediato quando necessário para preservar a segurança, atender determinação legal ou impedir dano relevante.</p>
          </section>
          <section class="legal_section">
            <h2>33. INCIDENTES DE SEGURANÇA</h2>
            <p>O AkiDocs mantém procedimento de resposta a incidentes que compreende, conforme aplicável:</p>
            <ul>
              <li>identificação;</li>
              <li>contenção;</li>
              <li>preservação de evidências;</li>
              <li>análise dos dados potencialmente afetados;</li>
              <li>correção ou mitigação;</li>
              <li>comunicação aos clientes envolvidos;</li>
              <li>colaboração para cumprimento das obrigações legais.</li>
            </ul>
            <p>Quando a Work in Ideas atuar como Operadora, o cliente Controlador será informado sem demora injustificada assim que houver elementos suficientes para caracterização inicial do incidente.</p>
          </section>
          <section class="legal_section">
            <h2>34. LIMITAÇÕES TÉCNICAS</h2>
            <p>A empresa-cliente reconhece que nenhum sistema conectado à internet pode garantir funcionamento absolutamente ininterrupto, ausência integral de falhas ou segurança absoluta.</p>
            <p>O AkiDocs compromete-se a adotar controles técnicos e administrativos razoáveis e compatíveis com a natureza dos serviços prestados.</p>
            <p>Os compromissos específicos de disponibilidade estão definidos no SLA.</p>
          </section>
          <section class="legal_section">
            <h2>35. RESPONSABILIDADE POR SERVIÇOS DE TERCEIROS</h2>
            <p>O funcionamento do AkiDocs depende parcialmente de fornecedores especializados.</p>
            <p>A Work in Ideas selecionará e administrará esses fornecedores de maneira compatível com suas obrigações.</p>
            <p>Falhas exclusivamente atribuíveis a fornecedores e fora do controle razoável da Work in Ideas serão avaliadas conforme as regras do SLA.</p>
            <p>A utilização de fornecedores não afasta a responsabilidade da Work in Ideas por atos diretamente imputáveis à sua própria conduta.</p>
          </section>
          <section class="legal_section">
            <h2>36. LIMITAÇÃO DE RESPONSABILIDADE</h2>
            <p>Dentro dos limites permitidos pela legislação aplicável, a Work in Ideas não será responsável por prejuízos decorrentes exclusivamente de:</p>
            <ul>
              <li>uso indevido da plataforma pelo cliente;</li>
              <li>permissões configuradas incorretamente pela empresa-cliente;</li>
              <li>compartilhamento indevido de credenciais;</li>
              <li>ações realizadas por usuários autorizados pelo cliente;</li>
              <li>conteúdo armazenado pelo cliente;</li>
              <li>atos ilícitos praticados utilizando a conta da empresa;</li>
              <li>falhas em equipamentos ou conexão pertencentes ao cliente;</li>
              <li>integração ou software externo não fornecido pelo AkiDocs;</li>
              <li>eventos de força maior ou caso fortuito.</li>
            </ul>
            <p>Nenhuma disposição destes Termos deverá ser interpretada como exclusão de responsabilidade em hipóteses nas quais a legislação não permita sua limitação.</p>
          </section>
          <section class="legal_section">
            <h2>37. DANOS INDIRETOS</h2>
            <p>Dentro dos limites permitidos pela legislação e pelas condições específicas da contratação, a Work in Ideas não responderá por lucros cessantes, perda de oportunidades ou danos indiretos decorrentes de fatos que não lhe sejam diretamente imputáveis.</p>
            <p>Essa disposição não afasta responsabilidades que não possam ser legalmente excluídas ou limitadas.</p>
          </section>
          <section class="legal_section">
            <h2>38. CRÉDITOS DE SLA</h2>
            <p>Quando aplicável, eventual compensação decorrente de descumprimento da disponibilidade será calculada de acordo com o SLA vigente.</p>
            <p>Os créditos previstos no SLA serão aplicados conforme as faixas, condições e limites previstos naquele documento.</p>
          </section>
          <section class="legal_section">
            <h2>39. COMUNICAÇÕES OPERACIONAIS</h2>
            <p>A Work in Ideas poderá utilizar os dados de contato cadastrados para enviar comunicações relacionadas ao AkiDocs, incluindo:</p>
            <ul>
              <li>segurança;</li>
              <li>autenticação;</li>
              <li>pagamentos;</li>
              <li>alterações relevantes;</li>
              <li>manutenção;</li>
              <li>funcionamento da plataforma;</li>
              <li>solicitações realizadas pelo usuário;</li>
              <li>comunicações contratuais;</li>
              <li>outras informações necessárias à prestação do serviço.</li>
            </ul>
            <p>E-mail e telefone não serão utilizados pelo AkiDocs para campanhas promocionais ou publicidade, salvo se futuramente houver autorização e condições específicas para essa finalidade.</p>
          </section>
          <section class="legal_section">
            <h2>40. ALTERAÇÕES DA PLATAFORMA</h2>
            <p>O AkiDocs poderá modificar, aprimorar, substituir ou descontinuar funcionalidades para:</p>
            <ul>
              <li>evolução tecnológica;</li>
              <li>segurança;</li>
              <li>desempenho;</li>
              <li>cumprimento regulatório;</li>
              <li>melhoria da experiência;</li>
              <li>adequação comercial.</li>
            </ul>
            <p>Alterações que afetem de maneira material a utilização contratada serão comunicadas quando razoavelmente necessário.</p>
          </section>
          <section class="legal_section">
            <h2>41. ALTERAÇÕES DOS TERMOS</h2>
            <p>Estes Termos poderão ser atualizados para refletir:</p>
            <ul>
              <li>evolução do serviço;</li>
              <li>alterações legais;</li>
              <li>alterações regulatórias;</li>
              <li>novas funcionalidades;</li>
              <li>mudanças comerciais;</li>
              <li>mudanças de infraestrutura.</li>
            </ul>
            <p>A versão vigente permanecerá disponível nos canais oficiais do AkiDocs.</p>
            <p>Alterações materiais que afetem direitos ou obrigações relevantes poderão ser comunicadas diretamente às empresas-clientes.</p>
          </section>
          <section class="legal_section">
            <h2>42. LEGISLAÇÃO APLICÁVEL</h2>
            <p>Estes Termos são regidos pela legislação brasileira.</p>
            <p>Aplicam-se, conforme a situação, as normas relativas a contratos, internet, proteção de dados pessoais, propriedade intelectual e demais normas aplicáveis à prestação dos serviços.</p>
          </section>
          <section class="legal_section">
            <h2>43. SOLUÇÃO DE CONTROVÉRSIAS</h2>
            <p>As partes deverão buscar, sempre que possível, solução amigável para controvérsias decorrentes da utilização ou contratação do AkiDocs.</p>
            <p>A existência de canal de negociação não impede a adoção de medidas judiciais ou administrativas cabíveis.</p>
            <p>O foro contratualmente competente poderá ser definido no instrumento específico de contratação celebrado com a empresa-cliente.</p>
          </section>
          <section class="legal_section">
            <h2>44. INDEPENDÊNCIA DAS CLÁUSULAS</h2>
            <p>Caso determinada disposição destes Termos seja considerada inválida ou inexequível, as demais disposições permanecerão válidas.</p>
            <p>Sempre que possível, a disposição inválida será interpretada de forma que preserve a finalidade originalmente pretendida dentro dos limites legais.</p>
          </section>
          <section class="legal_section">
            <h2>45. NÃO RENÚNCIA</h2>
            <p>A ausência de exercício imediato de determinado direito pela Work in Ideas ou pela empresa-cliente não será considerada renúncia definitiva a esse direito.</p>
          </section>
          <section class="legal_section">
            <h2>46. DOCUMENTOS INTEGRANTES</h2>
            <p>Estes Termos devem ser interpretados em conjunto com:</p>
            <ul>
              <li>Política de Privacidade do AkiDocs;</li>
              <li>Acordo de Nível de Serviço — SLA;</li>
              <li>contrato ou proposta comercial;</li>
              <li>Acordo ou Anexo de Tratamento de Dados — DPA, quando aplicável;</li>
              <li>demais condições específicas expressamente pactuadas.</li>
            </ul>
            <p>Em caso de conflito entre documentos, prevalecerá a disposição específica negociada entre as partes para a matéria em questão.</p>
          </section>
          <section class="legal_section">
            <h2>47. PRIVACIDADE E PROTEÇÃO DE DADOS</h2>
            <p>O encarregado de proteção de dados da Work in Ideas é:</p>
            <p>Charles EgidioGerente de Projetos e Encarregado de Proteção de Dados — DPOE-mail: <a href="mailto:charles@wi-id.com">charles@wi-id.com</a></p>
            <p>Esse canal destina-se a questões relacionadas à privacidade, proteção de dados pessoais e direitos dos titulares.</p>
          </section>
          <section class="legal_section">
            <h2>48. SUPORTE E CONTATO OPERACIONAL</h2>
            <p>Solicitações técnicas relacionadas ao AkiDocs devem ser abertas exclusivamente pela Central de Suporte:</p>
            <p><a href="https://suporte.akidocs.com.br" target="_blank" rel="noopener noreferrer">suporte.akidocs.com.br</a></p>
            <p>Os horários, classificações e prazos de atendimento são definidos no SLA vigente.</p>
          </section>
          <section class="legal_section">
            <h2>49. ACEITAÇÃO</h2>
            <p>A contratação, ativação ou utilização do AkiDocs implica ciência e aceitação destes Termos pela empresa-cliente, sem prejuízo de condições específicas previstas em contrato, proposta comercial ou outro instrumento formalmente celebrado entre as partes.</p>
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
