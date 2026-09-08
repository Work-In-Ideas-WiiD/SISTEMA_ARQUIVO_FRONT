export interface IFaqItem {
  question: string
  answer: string
}

export const faqs: IFaqItem[] = [
  {
    question: 'O que é o WiiDocs?',
    answer: 'O WiiDocs é uma plataforma web corporativa completa para gestão de documentos, arquivos e contratos na nuvem. Ela centraliza arquivos por empresa, setor e função, além de disponibilizar um portal exclusivo para clientes e ferramentas de assinatura eletrônica.'
  },
  {
    question: 'Preciso instalar algum software ou servidor no meu computador?',
    answer: 'Não. O WiiDocs é 100% baseado em nuvem (SaaS). Você e sua equipe só precisam de um navegador web moderno e conexão com a internet para acessar o sistema de qualquer computador, tablet ou smartphone.'
  },
  {
    question: 'Como funciona o armazenamento de arquivos e contratos?',
    answer: 'Seus arquivos são armazenados em infraestrutura de nuvem segura com backups automáticos, alta disponibilidade e controle de cotas em GB conforme o plano contratado. Você pode enviar PDFs de contratos, minutas, planilhas e documentos diversos.'
  },
  {
    question: 'Meus clientes também podem acessar o sistema?',
    answer: 'Sim! O WiiDocs possui um Portal do Cliente exclusivo onde seus clientes acessam apenas os documentos e contratos pertinentes a eles, sem acesso a dados internos ou a outros clientes da sua organização.'
  },
  {
    question: 'Posso mudar de plano ou cancelar minha assinatura a qualquer momento?',
    answer: 'Sim, você tem total liberdade. Você pode realizar o upgrade ou downgrade do seu plano diretamente na plataforma conforme a necessidade da sua empresa, além de poder cancelar a qualquer momento sem multas rescisórias.'
  },
  {
    question: 'Os dados e contratos da minha empresa estão seguros e em conformidade com a LGPD?',
    answer: 'Sim. Todos os dados trafegam com criptografia SSL/TLS e são armazenados com segurança em repouso. O sistema segue rigorosamente as diretrizes da Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018), com controle estrito de permissões e isolamento lógico entre empresas.'
  },
  {
    question: 'Como funciona o suporte técnico?',
    answer: 'Oferecemos atendimento humanizado através de e-mail e canais de suporte técnico direto. Clientes dos planos Profissional e Empresarial contam com atendimento prioritário e tempo de resposta acelerado.'
  },
  {
    question: 'Quais são as formas de pagamento disponíveis?',
    answer: 'Aceitamos cartões de crédito com processamento seguro e criptografado diretamente no seu navegador através de operadoras certificadas (PCI-DSS compliant). Para planos anuais ou corporativos, consulte opções via faturamento bancário.'
  }
]
