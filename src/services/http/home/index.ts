import { api } from '../api'
import type { IGetStatsRes } from '@/types/home'

export function getStats() {
  return api.get<IGetStatsRes>('/home/stats')
}

export function getHomeContratos() {
  return api.get('/home/contratos')
}
