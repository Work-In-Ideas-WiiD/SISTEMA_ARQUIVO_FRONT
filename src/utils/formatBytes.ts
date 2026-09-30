const UNIDADES = ['B', 'KB', 'MB', 'GB', 'TB']

/** Ex.: 1536 → "1,5 KB"; 21474836480 → "20 GB". */
export function formatBytes(bytes: number | null | undefined): string {
  let valor = Math.max(0, Number(bytes) || 0)
  let i = 0
  while (valor >= 1024 && i < UNIDADES.length - 1) {
    valor /= 1024
    i += 1
  }
  const casas = i === 0 || valor >= 100 ? 0 : valor >= 10 ? 1 : 2
  const texto = valor.toLocaleString('pt-BR', { maximumFractionDigits: casas })
  return `${texto} ${UNIDADES[i]}`
}
