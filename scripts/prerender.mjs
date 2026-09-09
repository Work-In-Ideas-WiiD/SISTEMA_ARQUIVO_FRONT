import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'
import { renderToString } from 'vue/server-renderer'
import { createSSRApp } from 'vue'
import { createMemoryHistory, createRouter } from 'vue-router'
import { createPinia } from 'pinia'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')
const distDir = path.resolve(rootDir, 'dist')

const routes = [
  {
    path: '/',
    outputPath: 'index.html',
    componentPath: '/src/pages/Landing/LandingPage.vue',
    title: 'WiiDocs — Gestão Inteligente de Documentos, Contratos e Clientes na Nuvem',
    description:
      'Plataforma web corporativa para gestão segura de arquivos, minutas e contratos na nuvem. Organize empresas, setores, equipes e acelere assinaturas digitais com conformidade LGPD.',
    canonical: 'https://wiidocs.com.br/'
  },
  {
    path: '/sobre',
    outputPath: 'sobre/index.html',
    componentPath: '/src/pages/Institucionais/SobrePage.vue',
    title: 'Sobre Nós — WiiDocs | Plataforma de Gestão Documental Corporativa',
    description:
      'Conheça a história, a missão e os pilares do WiiDocs, uma solução corporativa desenvolvida pela Work In Ideas para simplificar a gestão de arquivos, contratos e clientes.',
    canonical: 'https://wiidocs.com.br/sobre'
  },
  {
    path: '/sobre-nos',
    outputPath: 'sobre-nos/index.html',
    componentPath: '/src/pages/Institucionais/SobrePage.vue',
    title: 'Sobre Nós — WiiDocs | Plataforma de Gestão Documental Corporativa',
    description:
      'Conheça a história, a missão e os pilares do WiiDocs, uma solução corporativa desenvolvida pela Work In Ideas para simplificar a gestão de arquivos, contratos e clientes.',
    canonical: 'https://wiidocs.com.br/sobre'
  },
  {
    path: '/politica-de-privacidade',
    outputPath: 'politica-de-privacidade/index.html',
    componentPath: '/src/pages/Institucionais/PoliticaPrivacidadePage.vue',
    title: 'Política de Privacidade — WiiDocs | Proteção de Dados e LGPD',
    description:
      'Conheça a Política de Privacidade do WiiDocs. Entenda como tratamos, armazenamos e protegemos seus dados pessoais em total conformidade com a LGPD.',
    canonical: 'https://wiidocs.com.br/politica-de-privacidade'
  },
  {
    path: '/termos-de-uso',
    outputPath: 'termos-de-uso/index.html',
    componentPath: '/src/pages/Institucionais/TermosUsoPage.vue',
    title: 'Termos de Uso — WiiDocs | Condições de Prestação de Serviços SaaS',
    description:
      'Leia os Termos de Uso do WiiDocs. Conheça as condições de contratação, licença de software, responsabilidades e direitos ao utilizar nossa plataforma.',
    canonical: 'https://wiidocs.com.br/termos-de-uso'
  },
  {
    path: '/login',
    outputPath: 'login/index.html',
    componentPath: '/src/pages/Login/LoginPage.vue',
    title: 'Login — WiiDocs | Acesso à Plataforma',
    description:
      'Acesse sua conta no WiiDocs para gerenciar contratos, documentos e clientes na nuvem com total segurança.',
    canonical: 'https://wiidocs.com.br/login'
  },
  {
    path: '/cadastro',
    outputPath: 'cadastro/index.html',
    componentPath: '/src/pages/Cadastro/CadastroPage.vue',
    title: 'Cadastro — WiiDocs | Crie sua Conta Corporativa',
    description:
      'Crie sua conta no WiiDocs e comece a gerenciar seus documentos corporativos, clientes e contratos na nuvem.',
    canonical: 'https://wiidocs.com.br/cadastro'
  },
  {
    path: '/cliente',
    outputPath: 'cliente/index.html',
    componentPath: '/src/pages/Login/LoginCustomer.vue',
    title: 'Portal do Cliente — WiiDocs | Acesso a Documentos',
    description:
      'Área exclusiva para clientes acessarem seus arquivos, contratos e documentos compartilhados na plataforma WiiDocs.',
    canonical: 'https://wiidocs.com.br/cliente'
  }
]

async function prerender() {
  console.log('🚀 Iniciando pré-renderização estática (SSG) para SEO e IAs...')

  const templatePath = path.resolve(distDir, 'index.html')
  if (!fs.existsSync(templatePath)) {
    throw new Error(`Template ${templatePath} não encontrado. Execute o build do Vite primeiro.`)
  }

  let baseTemplate = fs.readFileSync(templatePath, 'utf-8')
  // Garantir que baseTemplate tenha <div id="app"></div> vazio mesmo em execuções consecutivas
  baseTemplate = baseTemplate.replace(/<div id="app">[\s\S]*?<\/div>(?=\s*<script)/, '<div id="app"></div>')

  // Criar cópia de fallback para 404 SPA
  const fallback404Path = path.resolve(distDir, '404.html')
  fs.writeFileSync(fallback404Path, baseTemplate, 'utf-8')
  console.log('✓ Gerado fallback 404.html para navegação SPA no GitHub Pages')

  // Garantir .nojekyll
  const nojekyllPath = path.resolve(distDir, '.nojekyll')
  if (!fs.existsSync(nojekyllPath)) {
    fs.writeFileSync(nojekyllPath, '', 'utf-8')
  }

  const vite = await createServer({
    root: rootDir,
    server: { middlewareMode: true },
    ssr: {
      noExternal: ['vue-toastification']
    },
    appType: 'custom'
  })

  try {
    const { default: App } = await vite.ssrLoadModule('/src/App.vue')

    // Carregar todos os componentes das rotas
    const loadedRoutes = await Promise.all(
      routes.map(async (r) => {
        const mod = await vite.ssrLoadModule(r.componentPath)
        return {
          ...r,
          component: mod.default
        }
      })
    )

    // Configurar tabela completa de rotas no Vue Router
    const dummyComponent = { template: '<div />' }
    const routerRoutes = [
      ...loadedRoutes.map((r) => ({
        path: r.path,
        component: r.component
      })),
      { path: '/recuperar/email/:target', component: dummyComponent },
      { path: '/recuperar/token/:id', component: dummyComponent },
      { path: '/primeiroacesso', component: dummyComponent },
      { path: '/assinar/:id', component: dummyComponent },
      { path: '/contratar', component: dummyComponent }
    ]

    for (const r of loadedRoutes) {
      const router = createRouter({
        history: createMemoryHistory(),
        routes: routerRoutes
      })

      const app = createSSRApp(App)
      app.use(createPinia())
      app.use(router)

      await router.push(r.path)
      await router.isReady()

      const appHtml = await renderToString(app)

      // Injetar dados no template
      let html = baseTemplate

      // 1. Injetar conteúdo no elemento #app
      html = html.replace(
        /<div id="app"><\/div>/,
        `<div id="app">${appHtml}</div>`
      )

      // 2. Atualizar Title
      html = html.replace(/<title>.*?<\/title>/, `<title>${r.title}</title>`)

      // 3. Atualizar Meta Description
      html = html.replace(
        /<meta name="description" content=".*?" \/>/,
        `<meta name="description" content="${r.description}" />`
      )

      // 4. Atualizar Canonical
      html = html.replace(
        /<link rel="canonical" href=".*?" \/>/,
        `<link rel="canonical" href="${r.canonical}" />`
      )

      // 5. Atualizar Open Graph
      html = html.replace(
        /<meta property="og:title" content=".*?" \/>/,
        `<meta property="og:title" content="${r.title}" />`
      )
      html = html.replace(
        /<meta property="og:description" content=".*?" \/>/,
        `<meta property="og:description" content="${r.description}" />`
      )
      html = html.replace(
        /<meta property="og:url" content=".*?" \/>/,
        `<meta property="og:url" content="${r.canonical}" />`
      )

      // 6. Atualizar Twitter Cards
      html = html.replace(
        /<meta name="twitter:title" content=".*?" \/>/,
        `<meta name="twitter:title" content="${r.title}" />`
      )
      html = html.replace(
        /<meta name="twitter:description" content=".*?" \/>/,
        `<meta name="twitter:description" content="${r.description}" />`
      )

      const targetFile = path.resolve(distDir, r.outputPath)
      const targetDir = path.dirname(targetFile)
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true })
      }

      fs.writeFileSync(targetFile, html, 'utf-8')
      console.log(
        `✓ [${r.path}] -> dist/${r.outputPath} (${(html.length / 1024).toFixed(1)} KB, H1: ${html.includes('<h1') ? 'Sim' : 'Não'})`
      )
    }

    console.log('✅ Pré-renderização concluída com sucesso para todas as rotas!')
  } finally {
    await vite.close()
  }
}

prerender().catch((err) => {
  console.error('❌ Erro durante a pré-renderização:', err)
  process.exit(1)
})
