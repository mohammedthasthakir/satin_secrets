// Mock API client — simulates async API calls with localStorage persistence
import { ls } from '../storage/localStorage'

const delay = (ms = 300) => new Promise(res => setTimeout(res, ms))

export async function apiGet<T>(key: string, defaultValue: T): Promise<T> {
  await delay(200)
  return ls.get<T>(key) ?? defaultValue
}

export async function apiSet<T>(key: string, value: T): Promise<T> {
  await delay(150)
  ls.set(key, value)
  return value
}

export async function apiPost<T>(endpoint: string, data: unknown): Promise<T> {
  await delay(250)
  console.info(`[API POST] ${endpoint}`, data)
  return data as T
}
