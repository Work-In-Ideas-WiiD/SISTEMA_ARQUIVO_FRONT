export function formatCnpjCpf(value: string): string {
  if (value == null || value == undefined || value === '') {
    return 'n/a'
  }

  const cnpjCpf = value.replace(/\D/g, '')
  
  if (cnpjCpf.length === 0) {
    return 'n/a'
  }

  if (cnpjCpf.length === 11) {
    return cnpjCpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, '$1.$2.$3-$4')
  }

  return cnpjCpf.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g, '$1.$2.$3/$4-$5')
}

/** Máscara de CPF enquanto digita (máx. 11 dígitos). */
export function maskCpf(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  return digits
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
}

/** Máscara de CNPJ enquanto digita (máx. 14 dígitos). */
export function maskCnpj(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 14)
  return digits
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2')
}

/** Valida comprimento quando preenchido (opcional no formulário). */
export function isValidOptionalCpf(value: string): boolean {
  const digits = value.replace(/\D/g, '')
  return digits.length === 0 || digits.length === 11
}

export function isValidOptionalCnpj(value: string): boolean {
  const digits = value.replace(/\D/g, '')
  return digits.length === 0 || digits.length === 14
}
