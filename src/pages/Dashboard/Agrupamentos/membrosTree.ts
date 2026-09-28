import type { IFuncionario } from '@/services/http/funcionarios'

export type MembroNodeType = 'empresa' | 'setor' | 'funcao' | 'funcionario'

export interface MembroNode {
  key: string
  type: MembroNodeType
  label: string
  funcionarioId?: string
  children: MembroNode[]
}

const SEM_SETOR = { id: 'sem-setor', nome: 'Sem setor' }

const byLabel = (a: MembroNode, b: MembroNode) =>
  a.label.localeCompare(b.label, 'pt-BR', { sensitivity: 'base' })

/**
 * Empresa › Setor › Função › Funcionário. Funcionário sem função fica direto no setor;
 * funcionário em vários setores/funções aparece em cada um deles.
 */
export function buildMembrosTree(empresaNome: string, funcionarios: IFuncionario[]): MembroNode {
  const root: MembroNode = { key: 'empresa', type: 'empresa', label: empresaNome, children: [] }
  const setores = new Map<string, MembroNode>()
  const funcoes = new Map<string, MembroNode>()

  for (const func of funcionarios) {
    const setoresDoFunc = func.setores?.length ? func.setores : [SEM_SETOR]

    for (const setor of setoresDoFunc) {
      let setorNode = setores.get(setor.id)
      if (!setorNode) {
        setorNode = { key: `s:${setor.id}`, type: 'setor', label: setor.nome, children: [] }
        setores.set(setor.id, setorNode)
        root.children.push(setorNode)
      }

      const pessoa = (key: string): MembroNode => ({
        key,
        type: 'funcionario',
        label: func.nome,
        funcionarioId: func.id,
        children: []
      })

      if (!func.funcoes?.length) {
        setorNode.children.push(pessoa(`s:${setor.id}:f:${func.id}`))
        continue
      }

      for (const funcao of func.funcoes) {
        const funcaoKey = `s:${setor.id}:fn:${funcao.id}`
        let funcaoNode = funcoes.get(funcaoKey)
        if (!funcaoNode) {
          funcaoNode = { key: funcaoKey, type: 'funcao', label: funcao.nome, children: [] }
          funcoes.set(funcaoKey, funcaoNode)
          setorNode.children.push(funcaoNode)
        }
        funcaoNode.children.push(pessoa(`${funcaoKey}:f:${func.id}`))
      }
    }
  }

  const sortTree = (node: MembroNode) => {
    const grupos = node.children.filter((c) => c.type !== 'funcionario').sort(byLabel)
    const pessoas = node.children.filter((c) => c.type === 'funcionario').sort(byLabel)
    node.children = [...grupos, ...pessoas]
    node.children.forEach(sortTree)
  }
  sortTree(root)

  const semSetor = root.children.findIndex((c) => c.key === `s:${SEM_SETOR.id}`)
  if (semSetor >= 0) root.children.push(...root.children.splice(semSetor, 1))

  return root
}

export function funcionarioIdsOf(node: MembroNode): string[] {
  if (node.type === 'funcionario') return node.funcionarioId ? [node.funcionarioId] : []
  return [...new Set(node.children.flatMap(funcionarioIdsOf))]
}

export function allNodeKeys(node: MembroNode): string[] {
  if (node.type === 'funcionario') return []
  return [node.key, ...node.children.flatMap(allNodeKeys)]
}
