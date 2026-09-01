export function stripDigits(value: string): string {
  return value.replace(/\D/g, '')
}

/** Máscara de telefone BR enquanto digita (10 ou 11 dígitos). */
export function maskPhone(value: string): string {
  const digits = stripDigits(value).slice(0, 11)

  if (digits.length === 0) return ''

  if (digits.length <= 2) {
    return `(${digits}`
  }

  if (digits.length <= 6) {
    return digits.replace(/(\d{2})(\d{0,4})/, '($1) $2')
  }

  if (digits.length <= 10) {
    return digits.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3')
  }

  return digits.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3')
}

/** Exibição formatada na tabela. */
export function formatPhone(value: string | null | undefined): string {
  if (value == null || value === '') return 'n/a'

  const digits = stripDigits(value)
  if (digits.length === 0) return 'n/a'

  if (digits.length === 11) {
    return digits.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
  }

  if (digits.length === 10) {
    return digits.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
  }

  return maskPhone(digits)
}
