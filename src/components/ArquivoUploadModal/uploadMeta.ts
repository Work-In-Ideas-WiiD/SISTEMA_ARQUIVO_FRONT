export interface ArquivoUploadPayload {
  file: File
  nome: string
  categoria_id: string
  mes: number | null
  ano: number | null
}

export const MESES = [
  { value: 1, label: 'Janeiro' },
  { value: 2, label: 'Fevereiro' },
  { value: 3, label: 'Março' },
  { value: 4, label: 'Abril' },
  { value: 5, label: 'Maio' },
  { value: 6, label: 'Junho' },
  { value: 7, label: 'Julho' },
  { value: 8, label: 'Agosto' },
  { value: 9, label: 'Setembro' },
  { value: 10, label: 'Outubro' },
  { value: 11, label: 'Novembro' },
  { value: 12, label: 'Dezembro' }
] as const

export function dateFromFile(file: File): { mes: number; ano: number } {
  const d = new Date(file.lastModified || Date.now())
  return { mes: d.getMonth() + 1, ano: d.getFullYear() }
}

export function yearOptions(around = new Date().getFullYear()): number[] {
  const years: number[] = []
  for (let y = around + 2; y >= around - 30; y -= 1) years.push(y)
  return years
}
