import type { NightConfirmOptions } from '@/composables/useNightConfirm'

export function opcoesSubstituirArquivo(nome: string): NightConfirmOptions {
  return {
    title: 'Substituir arquivo',
    body: `Já existe "${nome}" neste local. Deseja substituí-lo pelo novo arquivo? A versão anterior será descartada.`,
    confirmLabel: 'SUBSTITUIR',
    danger: true
  }
}
