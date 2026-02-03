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
