import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'login',
    component: () => import('@/pages/Login/LoginPage.vue')
  },
  {
    path: '/cliente',
    name: 'login-customer',
    component: () => import('@/pages/Login/LoginCustomer.vue')
  },
  {
    path: '/assinar/:id',
    name: 'assinatura',
    component: () => import('@/pages/Assinatura/AssinaturaPage.vue')
  },
  {
    path: '/primeiroacesso',
    name: 'first-access',
    component: () => import('@/pages/FirstAccess/FirstAccessPage.vue')
  },
  {
    path: '/recuperar',
    name: 'forgot-password',
    component: () => import('@/pages/ForgotPassword/ForgotPasswordPage.vue'),
    children: [
      {
        path: 'email/:target',
        name: 'reset-password-step-1',
        component: () => import('@/pages/ForgotPassword/ResetPasswordFirstStep.vue')
      },
      {
        path: 'token/:id',
        name: 'reset-password-step-2',
        component: () => import('@/pages/ForgotPassword/ResetPasswordSecondStep.vue')
      }
    ]
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/pages/Dashboard/DashboardPage.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'dashboard-home',
        component: () => import('@/pages/Dashboard/Home/HomePage.vue')
      },
      {
        path: 'home',
        name: 'home',
        component: () => import('@/pages/Dashboard/Home/HomePage.vue')
      },
      {
        path: 'empresas',
        name: 'empresas',
        component: () => import('@/pages/Dashboard/Empresas/EmpresasPage.vue'),
        children: [
          {
            path: '',
            name: 'empresas-table',
            component: () => import('@/pages/Dashboard/Empresas/EmpresasTable.vue')
          },
          {
            path: 'novo',
            name: 'empresas-novo',
            component: () => import('@/pages/Dashboard/Empresas/NovaEmpresa.vue')
          },
          {
            path: 'editar/:id',
            name: 'empresas-editar',
            component: () => import('@/pages/Dashboard/Empresas/EditEmpresa.vue')
          }
        ]
      },
      {
        path: 'admins',
        name: 'admins',
        component: () => import('@/pages/Dashboard/Administradores/AdministradoresPage.vue'),
        children: [
          {
            path: '',
            name: 'admins-table',
            component: () => import('@/pages/Dashboard/Administradores/AdministradoresTable.vue')
          },
          {
            path: 'novo',
            name: 'admins-novo',
            component: () => import('@/pages/Dashboard/Administradores/NovoAdministrador.vue')
          },
          {
            path: 'editar/:id',
            name: 'admins-editar',
            component: () => import('@/pages/Dashboard/Administradores/EditAdmin.vue')
          }
        ]
      },
      {
        path: 'contratos',
        name: 'contratos',
        component: () => import('@/pages/Dashboard/Contratos/ContratosPage.vue'),
        children: [
          {
            path: '',
            name: 'contratos-table',
            component: () => import('@/pages/Dashboard/Contratos/ContratosTable.vue')
          },
          {
            path: 'novo',
            name: 'contratos-novo',
            component: () => import('@/pages/Dashboard/Contratos/NovoContrato.vue')
          }
        ]
      },
      {
        path: 'arquivos',
        name: 'arquivos',
        component: () => import('@/pages/Dashboard/Arquivos/ArquivosPage.vue'),
        children: [
          {
            path: '',
            name: 'arquivos-table',
            component: () => import('@/pages/Dashboard/Arquivos/ArquivosTable.vue')
          },
          {
            path: 'novo',
            name: 'arquivos-novo',
            component: () => import('@/pages/Dashboard/Arquivos/NovoArquivo.vue')
          }
        ]
      },
      {
        path: 'assinaturas',
        name: 'assinaturas',
        component: () => import('@/pages/Dashboard/Assinaturas/AssinaturasPage.vue')
      },
      {
        path: 'clientes',
        name: 'clientes',
        component: () => import('@/pages/Dashboard/Clientes/ClientesPage.vue'),
        children: [
          {
            path: '',
            name: 'clientes-table',
            component: () => import('@/pages/Dashboard/Clientes/ClientesTable.vue')
          },
          {
            path: 'novo',
            name: 'clientes-novo',
            component: () => import('@/pages/Dashboard/Clientes/NovoCliente.vue')
          },
          {
            path: 'editar/:id',
            name: 'clientes-editar',
            component: () => import('@/pages/Dashboard/Clientes/EditCliente.vue')
          },
          {
            path: 'visualizar/:id',
            name: 'clientes-visualizar',
            component: () => import('@/pages/Dashboard/Clientes/VisualizarCliente.vue')
          }
        ]
      },
      {
        path: 'perfil',
        name: 'perfil',
        component: () => import('@/pages/Dashboard/Profile/ProfilePage.vue')
      },
      {
        path: 'error',
        name: 'dashboard-error',
        component: () => import('@/pages/Dashboard/DashboardErrorPage.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard para autenticação
router.beforeEach((to, _from, next) => {
  const token = document.cookie
    .split('; ')
    .find(row => row.startsWith('ana_lucia.token='))
    ?.split('=')[1]

  if (to.meta.requiresAuth && !token) {
    next({ name: 'login' })
  } else {
    next()
  }
})

export default router
