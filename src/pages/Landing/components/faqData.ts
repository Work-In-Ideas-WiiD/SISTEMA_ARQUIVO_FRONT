export interface IFaqItem {
  question: string
  answer: string
}

export const faqs: IFaqItem[] = [
  {
    question: 'O que é o AkiDocs?',
    answer:
      'O AkiDocs é uma plataforma SaaS B2B de gestão documental. Ela permite armazenar, organizar e compartilhar arquivos em nuvem, estruturando o acesso por empresa, setor, função, cliente, grupos e usuários.'
  },
  {
    question: 'O AkiDocs gerencia contratos?',
    answer:
      'Não. O AkiDocs gerencia arquivos. Contratos podem ser armazenados e compartilhados como qualquer outro documento, mas a plataforma não possui atualmente um módulo específico de gestão de contratos.'
  },
  {
    question: 'O AkiDocs possui assinatura eletrônica?',
    answer:
      'Não. A assinatura de documentos não faz parte das funcionalidades atuais da plataforma.'
  },
  {
    question: 'Preciso instalar algum software?',
    answer:
      'Não. O AkiDocs funciona em nuvem e pode ser acessado por navegador compatível.'
  },
  {
    question: 'Meus clientes podem acessar documentos?',
    answer:
      'Sim. O AkiDocs permite disponibilizar documentos aos clientes autorizados, com acessos ilimitados para clientes e sem necessidade de contratar uma licença adicional para cada acesso.'
  },
  {
    question: 'Qual o limite de tamanho por arquivo?',
    answer: 'Cada arquivo pode ter até 150 MB.'
  },
  {
    question: 'Qual o limite de banda?',
    answer: 'O limite de banda é de 1 TB.'
  },
  {
    question: 'Existe teste grátis?',
    answer: 'Sim. Todos os planos podem ser testados gratuitamente por 8 dias.'
  },
  {
    question: 'Onde meus dados ficam hospedados?',
    answer:
      'A infraestrutura principal utilizada para armazenamento e processamento está configurada em datacenters no Brasil, em São Paulo, utilizando serviços como DigitalOcean e Amazon Web Services (AWS).'
  },
  {
    question: 'O AkiDocs utiliza criptografia de ponta a ponta?',
    answer:
      'Não utilizamos essa expressão para descrever a arquitetura do AkiDocs. Os arquivos permanecem criptografados na infraestrutura utilizada pela plataforma, e o serviço adota controles de acesso e proteção da aplicação.'
  },
  {
    question: 'A equipe do AkiDocs lê meus arquivos?',
    answer:
      'Não. O AkiDocs não realiza leitura, interpretação ou análise do conteúdo dos documentos armazenados. Conforme a arquitetura definida para o serviço, a equipe da Work in Ideas não possui acesso ao conteúdo legível dos arquivos.'
  },
  {
    question: 'Como funcionam os backups?',
    answer:
      'São realizados backups diários, mantidos por até 30 dias, destinados à continuidade e recuperação da infraestrutura.'
  },
  {
    question: 'O que acontece com os dados se eu cancelar?',
    answer:
      'Após o encerramento, os arquivos e dados permanecem disponíveis exclusivamente para a empresa-cliente durante 90 dias para consulta e exportação. Depois desse período, são removidos dos sistemas ativos, e eventuais cópias residuais são eliminadas conforme o ciclo normal dos backups.'
  },
  {
    question: 'Posso levar meus dados para outro sistema?',
    answer:
      'Sim. É possível baixar os arquivos mantendo a estrutura de pastas e exportar em planilha os dados cadastrais disponibilizados pela plataforma.'
  },
  {
    question: 'Qual é o SLA?',
    answer:
      'O compromisso de disponibilidade mensal é de 99,5%, conforme critérios, exclusões e compensações definidos no SLA oficial do AkiDocs.'
  },
  {
    question: 'Como funciona o suporte?',
    answer:
      'O suporte técnico é realizado exclusivamente pela plataforma oficial de tickets em suporte.akidocs.com.br. Os horários, prioridades e prazos de primeira resposta estão definidos no SLA.'
  }
]
