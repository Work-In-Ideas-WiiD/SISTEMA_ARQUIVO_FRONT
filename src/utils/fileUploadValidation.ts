export const ARQUIVO_ALLOWED_EXTENSIONS = [
  'jpeg',
  'jpg',
  'png',
  'mp4',
  'mov',
  'wmv',
  'mkv',
  'webm'
] as const

export const CONTRATO_ALLOWED_EXTENSIONS = ['pdf', 'doc', 'docx'] as const

export type UploadKind = 'arquivo' | 'contrato'

function getExtension(fileName: string): string {
  const parts = fileName.split('.')
  if (parts.length < 2) return ''
  return parts[parts.length - 1].toLowerCase()
}

export function validateUploadFile(
  file: File,
  kind: UploadKind
): { ok: true } | { ok: false; message: string } {
  const extension = getExtension(file.name)
  const allowed =
    kind === 'arquivo' ? ARQUIVO_ALLOWED_EXTENSIONS : CONTRATO_ALLOWED_EXTENSIONS

  if (!extension || !(allowed as readonly string[]).includes(extension)) {
    return {
      ok: false,
      message: `Tipo de arquivo não permitido. Use: ${allowed.join(', ')}.`
    }
  }

  return { ok: true }
}
