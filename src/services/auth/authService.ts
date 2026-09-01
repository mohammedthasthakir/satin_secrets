import { ls, KEYS } from '../storage/localStorage'
import type { User } from '../../types'

const ADMIN_CREDENTIALS = { email: 'admin@satinsecrets.com', password: 'Admin@123' }

const ADMIN_USER: User = {
  id: 'admin-001',
  name: 'Admin',
  email: ADMIN_CREDENTIALS.email,
  role: 'admin',
  loyaltyPoints: 0,
  createdAt: '2024-01-01T00:00:00Z',
}

export const authService = {
  loginUser(email: string, password: string): User {
    const users: User[] = ls.get<User[]>(KEYS.USERS) ?? []
    const stored = ls.get<{ email: string; password: string }[]>('ss_passwords') ?? []
    const match = stored.find(u => u.email === email && u.password === password)
    if (!match) throw new Error('Invalid email or password')
    const user = users.find(u => u.email === email)
    if (!user) throw new Error('User not found')
    ls.set(KEYS.AUTH, user)
    return user
  },

  loginAdmin(email: string, password: string): User {
    if (email !== ADMIN_CREDENTIALS.email || password !== ADMIN_CREDENTIALS.password) {
      throw new Error('Invalid admin credentials')
    }
    ls.set(KEYS.AUTH, ADMIN_USER)
    return ADMIN_USER
  },

  register(name: string, email: string, password: string, phone?: string): User {
    const users: User[] = ls.get<User[]>(KEYS.USERS) ?? []
    if (users.find(u => u.email === email)) throw new Error('Email already registered')
    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      phone,
      role: 'user',
      loyaltyPoints: 100,
      createdAt: new Date().toISOString(),
    }
    users.push(newUser)
    ls.set(KEYS.USERS, users)
    const passwords = ls.get<{ email: string; password: string }[]>('ss_passwords') ?? []
    passwords.push({ email, password })
    ls.set('ss_passwords', passwords)
    ls.set(KEYS.AUTH, newUser)
    return newUser
  },

  logout(): void {
    ls.remove(KEYS.AUTH)
  },

  getCurrentUser(): User | null {
    return ls.get<User>(KEYS.AUTH)
  },

  updateUser(updates: Partial<User>): User {
    const current = ls.get<User>(KEYS.AUTH)
    if (!current) throw new Error('Not authenticated')
    const updated = { ...current, ...updates }
    ls.set(KEYS.AUTH, updated)
    const users: User[] = ls.get<User[]>(KEYS.USERS) ?? []
    const idx = users.findIndex(u => u.id === current.id)
    if (idx !== -1) { users[idx] = updated; ls.set(KEYS.USERS, users) }
    return updated
  },
}
