# 📁 Sistema de Arquivos - Ana Lúcia Associados

Sistema web para gerenciamento de arquivos, contratos e clientes desenvolvido em **Vue 3 + TypeScript**.

![Vue.js](https://img.shields.io/badge/Vue.js-3.5-4FC08D?style=flat-square&logo=vue.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=flat-square&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-7.2-646CFF?style=flat-square&logo=vite)
![SCSS](https://img.shields.io/badge/SCSS-Styles-CC6699?style=flat-square&logo=sass)

---

## 🚀 Funcionalidades

### 👥 Gestão de Usuários
- Administradores (CRUD completo)
- Empresas (CRUD completo)
- Clientes (CRUD + visualização detalhada)

### 🏢 Gestão Organizacional
- **Setores** - Cadastro e gerenciamento de setores por empresa
- **Funções** - Cadastro e gerenciamento de funções/cargos
- **Funcionários** - Cadastro com vinculação a setores e funções
- **Agrupamentos** - Grupos de funcionários (individual ou por setor)

### 📄 Gestão de Documentos
- Upload de contratos (PDF)
- Upload de arquivos diversos
- Associação de documentos a empresas
- Download de arquivos

### 🔐 Autenticação
- Login para administradores e clientes
- Primeiro acesso com definição de senha
- Recuperação de senha por e-mail

### ⚙️ Feature Flags
- Sistema de controle de funcionalidades
- Módulo de assinaturas digitais (desabilitado por padrão)

---

## 🛠️ Tecnologias

| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| Vue.js | 3.5 | Framework JavaScript progressivo |
| TypeScript | 5.6 | Tipagem estática |
| Vite | 7.2 | Build tool e dev server |
| Vue Router | 4.2 | Roteamento SPA |
| Pinia | 2.2 | Gerenciamento de estado |
| Axios | 1.7 | Cliente HTTP |
| SCSS | - | Pré-processador CSS |
| vue-toastification | 2.0 | Notificações toast |

---

## 📦 Instalação

```bash
# Clonar repositório
git clone https://github.com/Work-In-Ideas-WiiD/SISTEMA_ARQUIVO_FRONT.git

# Entrar na pasta
cd SISTEMA_ARQUIVO_FRONT

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com a URL da API
```

---

## 🔧 Configuração

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_API_URL=https://sua-api.com/api
```

---

## 💻 Desenvolvimento

```bash
# Iniciar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

---

## 📁 Estrutura do Projeto

```
src/
├── assets/           # Imagens e ícones
├── components/       # Componentes reutilizáveis
│   ├── CustomButton/
│   ├── homeInfoCard/
│   ├── inputs/
│   ├── sidebar/
│   ├── TableEmptyMessage/
│   └── TablePaginator/
├── config/           # Configurações (feature flags)
├── pages/            # Páginas da aplicação
│   ├── Dashboard/
│   │   ├── Administradores/
│   │   ├── Agrupamentos/
│   │   ├── Arquivos/
│   │   ├── Clientes/
│   │   ├── Contratos/
│   │   ├── Empresas/
│   │   ├── Funcionarios/
│   │   ├── Funcoes/
│   │   ├── Home/
│   │   └── Setores/
│   ├── Login/
│   └── ForgotPassword/
├── router/           # Configuração de rotas
├── services/         # Services HTTP (API)
│   └── http/
│       ├── administradores/
│       ├── agrupamentos/
│       ├── arquivos/
│       ├── clientes/
│       ├── contratos/
│       ├── empresas/
│       ├── funcionarios/
│       ├── funcoes/
│       └── setores/
├── stores/           # Pinia stores
├── styles/           # Estilos globais SCSS
├── types/            # Tipos TypeScript
└── utils/            # Funções utilitárias
```

---

## 🔒 Feature Flags

O sistema possui controle de funcionalidades via feature flags em `src/config/features.ts`:

```typescript
export const featureFlags = {
  assinaturas: false,        // Módulo de assinaturas digitais
  envioParaAssinatura: false // Envio para Clicksign
}
```

Para habilitar uma funcionalidade, altere o valor para `true`.

---

## 🌐 API

O sistema consome uma API REST Laravel. Endpoints principais:

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/auth/login` | Autenticação |
| POST | `/auth/me` | Dados do usuário logado |
| GET | `/user` | Listar usuários |
| POST | `/user` | Criar usuário |
| GET | `/contrato` | Listar contratos |
| POST | `/contrato` | Upload de contrato |
| GET | `/arquivo` | Listar arquivos |
| POST | `/arquivo` | Upload de arquivo |
| GET | `/cliente` | Listar clientes |
| GET | `/setor` | Listar setores |
| POST | `/setor` | Criar setor |
| GET | `/funcao` | Listar funções |
| POST | `/funcao` | Criar função |
| GET | `/funcionario` | Listar funcionários |
| POST | `/funcionario` | Criar funcionário |
| GET | `/agrupamento` | Listar agrupamentos |
| POST | `/agrupamento` | Criar agrupamento |

---

## 👨‍💻 Desenvolvimento

### Padrões de Código

- Componentes Vue com `<script setup lang="ts">`
- Estilos SCSS com `scoped`
- Services separados por entidade
- Tipos TypeScript para todas as interfaces

### Commits

Seguir padrão de commits semânticos:

```
feat: ✨ Nova funcionalidade
fix: 🐛 Correção de bug
refactor: ♻️ Refatoração
style: 🎨 Ajustes visuais
docs: 📝 Documentação
```

---

## 📄 Licença

Projeto privado - © Work In Ideas (WiiD)

---

## 🤝 Suporte

Em caso de dúvidas ou problemas, entre em contato com a equipe de desenvolvimento.
