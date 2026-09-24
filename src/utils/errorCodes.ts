/**
 * Repositório de códigos de erro mascarados (espelho do ApiErrorCatalog da API).
 * Usado pelo suporte para interpretar toasts/códigos sem expor a mensagem literal.
 */
export const ERROR_CODE_CATALOG: Record<string, string> = {
  'AKI-CLI-001': 'Somente empresas podem cadastrar clientes',
  'AKI-CLI-002': 'Este endpoint não permite cadastrar clientes',
  'AKI-CLI-003': 'Erro genérico ao cadastrar cliente (falha interna)',
  'AKI-PWD-001': 'Somente administradores podem disparar recuperação de senha',
  'AKI-PWD-002': 'Recuperação de senha de cliente deve usar o login de cliente',
  'AKI-PWD-003': 'Falha ao enviar e-mail de recuperação (usuário admin/empresa)',
  'AKI-PWD-004': 'Falha ao enviar e-mail de recuperação (fluxo público)',
  'AKI-USR-001': 'Erro ao adicionar empresa ao contrato',
  'AKI-USR-002': 'Falha ao criar usuário',
  'AKI-AUTH-001': 'Não autorizado / credenciais inválidas',
  'AKI-AUTH-002': 'Não autenticado (token ausente ou expirado)',
  'AKI-AUTH-003': 'Acesso não autorizado (policy/permissão)',
  'AKI-GEN-404': 'Registro não encontrado',
  'AKI-GEN-500': 'Erro interno não catalogado',
  'AKI-GEN-403': 'Acesso negado não catalogado',
  'AKI-GEN-400': 'Requisição inválida não catalogada'
}

export function describeErrorCode(code: string): string | undefined {
  return ERROR_CODE_CATALOG[code]
}
