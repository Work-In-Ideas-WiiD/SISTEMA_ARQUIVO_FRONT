export interface IFaqItem {
  question: string
  answer: string
}

export const faqs: IFaqItem[] = [
  {
    question: '1. O que é o AkiDocs?',
    answer:
      'O AkiDocs é uma plataforma de gestão documental para pequenas e médias empresas. Ela permite armazenar, organizar e compartilhar arquivos em nuvem, estruturando o acesso por empresa, setor, função, cliente, grupos e usuários. Todo o acesso é rastreável, permitindo que você tenha controle de acesso e leitura.'
  },
  {
    question: '2. Preciso instalar algum software?',
    answer:
      'Não. O AkiDocs funciona em nuvem e pode ser acessado por navegador compatível.'
  },
  {
    question: '3. Meus clientes podem acessar documentos?',
    answer:
      'Sim. O AkiDocs permite que você disponibilize documentos a todos os seus clientes autorizados sem necessidade de contratar uma licença adicional para cada acesso. Basta cadastrá-lo e compartilhar o documento com ele. Ele poderá acessar a plataforma através de seu próprio usuário e senha.'
  },
  {
    question: '4. Onde meus dados ficam hospedados?',
    answer:
      'A infraestrutura principal utilizada para armazenamento e processamento está configurada em datacenters no Brasil e no exterior, utilizando serviços corporativos fornecido por parceiros como DigitalOcean e Amazon Web Services (AWS).'
  },
  {
    question: '5. A equipe do AKiDocs lê meus arquivos?',
    answer:
      'Não. O AkiDocs não realiza leitura, interpretação ou análise do conteúdo dos seus documentos armazenados. O acesso ao conteúdo legível dos arquivos só acontece mediante à sua autorização expressa e para fins de suporte e problemas técnicos.'
  },
  {
    question: '6. Meus arquivos são armazenados com segurança e criptografia?',
    answer:
      'Os arquivos permanecem criptografados na infraestrutura utilizada pela plataforma, e o serviço adota controles de acesso e proteção da aplicação. O AkiDocs não realiza leitura, interpretação ou análise do conteúdo dos seus documentos armazenados. O acesso ao conteúdo legível dos arquivos só acontece mediante à sua autorização expressa e para fins de suporte e problemas técnicos.'
  },
  {
    question: '7. Como funcionam os backups?',
    answer:
      'Todos os dias, são realizados backups diários de todos os arquivos. Esses backups são mantidos por 30 dias, destinados à continuidade e recuperação da infraestrutura.'
  },
  {
    question: '8. O que acontece com os meus dados se eu cancelar?',
    answer:
      'Após o encerramento de sua conta, seus arquivos e dados permanecem disponíveis exclusivamente à conta principal durante 90 dias para consulta e exportação. Depois desse período, são removidos dos sistemas ativos, e eventuais cópias residuais são eliminadas conforme o ciclo normal dos backups.'
  },
  {
    question: '9. Posso levar meus dados para outro sistema?',
    answer:
      'Sim. É possível baixar os arquivos mantendo a estrutura de pastas e exportar em planilha os dados cadastrais disponibilizados pela plataforma.'
  },
  {
    question: '10. Como funciona o suporte?',
    answer:
      'Existem dois canais de atendimento: o comercial (para dúvidas, contratações e consultoria na aquisição de novos serviços) e o suporte (para problemas técnicos e dúvidas quanto à utilização do sistema). O canal de atendimento comercial está disponível de segunda à sexta (exceto feriados) das 09h00 às 18h00. O canal de suporte fica ativo 24h por dia, 7 dias por semana, através da nossa plataforma de suporte: <a href="https://suporte.akidocs.com.br" target="_blank" rel="noopener noreferrer" class="faq_inline_link">https://suporte.akidocs.com.br</a>. Através dela, você cria um ticket com a sua ocorrência e o nosso time responde em até 24h.'
  },
  {
    question: '11. Já tenho um sistema de arquivos. Posso migrar para o AkiDocs?',
    answer:
      'Sim. É possível trazer todo o seu ecossistema de arquivos para o AkiDocs. Nesses casos, contate o time comercial através do <a href="https://wa.me/5562983398612" target="_blank" rel="noopener noreferrer" class="faq_inline_link">WhatsApp</a> para que a gente possa avaliar o seu caso.'
  },
  {
    question: '12. Se eu perder todos os meus arquivos hoje, em quanto tempo vocês conseguem restaurá-los e qual será o procedimento?',
    answer:
      'Caso você tenha qualquer problema e os seus arquivos se percam, contate o <a href="https://suporte.akidocs.com.br" target="_blank" rel="noopener noreferrer" class="faq_inline_link">time de suporte</a> e seu último backup de arquivos será restaurado em até 24h.'
  },
  {
    question: '13. Se eu contratar hoje, qual é o prazo para implantação, migração dos meus arquivos e início efetivo do backup?',
    answer:
      'Se você não precisa migrar sua infraestrutura de arquivos para o AkiDocs, pode começar a utilizá-lo em minutos. Você usufrui de todos os recursos disponíveis no seu plano imediatamente (inclusive backups). Para cenários onde seja necessária a migração de arquivos, os prazos podem variar de 72h até 15 dias, conforme disponibilidade de todas as partes envolvidas.'
  },
  {
    question: '14. Existem cópias dos meus dados em locais fisicamente diferentes?',
    answer:
      'Sim. Para garantir a redundância dos nossos serviços, múltiplos backups são realizados e ficam armazenados em diferentes datacenters, localizados no Brasil e no exterior.'
  },
  {
    question: '15. Vocês podem fazer uma demonstração ou período de teste para eu validar upload, download, recuperação de arquivos, permissões e suporte antes de contratar?',
    answer:
      'Sim. Você pode se cadastrar e utilizar a plataforma como quiser pelo período de 8 dias. Se quiser uma experiência mais personalizada, também pode agendar uma apresentação com o nosso time. Um de nossos consultores irá te apresentar a plataforma por completo antes da contratação, seus recursos e como ela pode ajudar na sua operação. Para agendar uma apresentação, entre em contato com o nosso time comercial através do <a href="https://wa.me/5562983398612" target="_blank" rel="noopener noreferrer" class="faq_inline_link">WhatsApp</a>.'
  },
  {
    question: '16. O que pode fazer minha mensalidade aumentar depois da contratação e quais custos não estão incluídos na proposta?',
    answer:
      'Nossos serviços giram em torno da quantidade de usuários administrativos (aqueles que vão cadastrar arquivos, estabelecer as regras de acesso e verificar o histórico de acesso dos arquivos) e do espaço ocupado. Se você precisar de mais usuários ou espaço de armazenamento, o sistema te avisará disso. A partir daí, basta solicitar uma mudança de plano na <a href="https://suporte.akidocs.com.br" target="_blank" rel="noopener noreferrer" class="faq_inline_link">plataforma de suporte</a>. A fatura seguinte já será ajustada para o novo plano. Para cenários onde a quantidade de usuários e o espaço de armazenamento estejam além dos nossos planos, contate nosso time comercial através do <a href="https://wa.me/5562983398612" target="_blank" rel="noopener noreferrer" class="faq_inline_link">WhatsApp</a>.'
  }
]
