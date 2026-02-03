/**
 * Configuração de Features do Sistema
 * 
 * Este arquivo controla quais funcionalidades estão habilitadas no sistema.
 * Para ativar uma feature, altere o valor para true.
 * 
 * IMPORTANTE: Futuramente, essas configurações podem ser carregadas
 * de um banco de dados ou API para controle por cliente.
 */

export interface IFeatureFlags {
  /**
   * Habilita o módulo de assinaturas digitais (Clicksign)
   * Quando false, oculta o menu e funcionalidades relacionadas
   */
  assinaturas: boolean

  /**
   * Habilita o envio de contratos para assinatura
   * Quando false, contratos são apenas para upload/visualização
   */
  envioParaAssinatura: boolean
}

/**
 * Configurações atuais do sistema
 * Altere os valores conforme necessário
 */
export const featureFlags: IFeatureFlags = {
  // Assinaturas desabilitadas temporariamente
  assinaturas: false,
  
  // Envio para assinatura desabilitado
  envioParaAssinatura: false
}

/**
 * Função helper para verificar se uma feature está habilitada
 */
export function isFeatureEnabled(feature: keyof IFeatureFlags): boolean {
  return featureFlags[feature] === true
}
