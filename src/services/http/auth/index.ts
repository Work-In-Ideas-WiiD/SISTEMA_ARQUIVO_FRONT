import { api } from '../api'
import type { ILoginResponse, IUserProps } from '@/types/auth'

export function postLogin(email: string, password: string) {
  return api.post<ILoginResponse>('/auth/login', { email, password })
}

export function postLoginCustomer(email: string, password: string, companyId: string) {
  return api.post<ILoginResponse>('/auth/login', { 
    email, 
    password, 
    empresa_id: companyId 
  })
}

export function postMe() {
  return api.post<IUserProps>('/auth/me')
}

export function postLogout() {
  return api.post('/auth/logout')
}

export function postFirstAccess(email: string) {
  return api.post('/auth/first-access', { email })
}

export function postResetPassword(token: string, id: string, password: string, passwordConfirmation: string) {
  return api.post('/auth/reset/password', { 
    token,
    id,
    password, 
    password_confirmation: passwordConfirmation 
  })
}

export function postForgotPassword(email: string, target: string) {
  return api.post('/auth/forgot-password', { email, target })
}

export function postVerifyToken(token: string) {
  return api.post('/auth/verify-token', { token })
}
