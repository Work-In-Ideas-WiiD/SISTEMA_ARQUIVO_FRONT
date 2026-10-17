export const ARQUIVO_ALLOWED_EXTENSIONS = [
  'jpeg',
  'jpg',
  'png',
  'pdf',
  'doc',
  'docx',
  'mp4',
  'mov',
  'wmv',
  'mkv',
  'webm'
] as const

export const CONTRATO_ALLOWED_EXTENSIONS = ['pdf', 'doc', 'docx'] as const

export type UploadKind = 'arquivo' | 'contrato'

const BLOQUEADAS = [
  'php', 'phtml', 'phar', 'exe', 'dll', 'scr', 'bat', 'cmd', 'com', 'msi', 'js', 'jse',
  'vbs', 'vbe', 'ps1', 'sh', 'jar', 'html', 'htm', 'svg', 'hta', 'lnk'
]

function partesDoNome(fileName: string): string[] {
  return fileName
    .replace(/\0/g, '')
    .split('.')
    .map((parte) => parte.trim().toLowerCase())
    .filter(Boolean)
}

export function validateUploadFile(
  file: File,
  kind: UploadKind
): { ok: true } | { ok: false; message: string } {
  const partes = partesDoNome(file.name)
  const extension = partes.length > 1 ? partes[partes.length - 1] : ''
  const allowed =
    kind === 'arquivo' ? ARQUIVO_ALLOWED_EXTENSIONS : CONTRATO_ALLOWED_EXTENSIONS

  if (partes.slice(0, -1).some((parte) => BLOQUEADAS.includes(parte))) {
    return { ok: false, message: 'Este arquivo foi recusado por segurança.' }
  }

  if (!extension || !(allowed as readonly string[]).includes(extension)) {
    return {
      ok: false,
      message: `Tipo de arquivo não permitido. Use: ${allowed.join(', ')}.`
    }
  }

  return { ok: true }
}
