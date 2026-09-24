/** Máscara de CEP enquanto digita: 00000-000 (máx. 8 dígitos). */
export function maskCep(value: string | null | undefined): string {
  const digits = String(value ?? '').replace(/\D/g, '').slice(0, 8)
  if (digits.length <= 5) return digits
  return `${digits.slice(0, 5)}-${digits.slice(5)}`
}

export function isValidCep(value: string): boolean {
  return value.replace(/\D/g, '').length === 8
}

/** Número do endereço: só dígitos, até 6. */
export function maskNumeroEndereco(value: string | null | undefined): string {
  return String(value ?? '').replace(/\D/g, '').slice(0, 6)
}

/** UF: 2 letras maiúsculas. */
export function maskUf(value: string | null | undefined): string {
  return String(value ?? '')
    .replace(/[^a-zA-Z]/g, '')
    .slice(0, 2)
    .toUpperCase()
}
