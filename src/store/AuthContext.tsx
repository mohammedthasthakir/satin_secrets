import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { User } from '../types'
import { authService } from '../services/auth/authService'

interface AuthContextValue {
  user: User | null
  isAuthenticated: boolean
  isAdmin: boolean
  login: (email: string, password: string) => Promise<User>
  loginAdmin: (email: string, password: string) => Promise<User>
  register: (name: string, email: string, password: string, phone?: string) => Promise<User>
  logout: () => void
  updateUser: (updates: Partial<User>) => Promise<User>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => authService.getCurrentUser())

  const login = useCallback(async (email: string, password: string) => {
    const u = authService.loginUser(email, password)
    setUser(u)
    return u
  }, [])

  const loginAdmin = useCallback(async (email: string, password: string) => {
    const u = authService.loginAdmin(email, password)
    setUser(u)
    return u
  }, [])

  const register = useCallback(async (name: string, email: string, password: string, phone?: string) => {
    const u = authService.register(name, email, password, phone)
    setUser(u)
    return u
  }, [])

  const logout = useCallback(() => {
    authService.logout()
    setUser(null)
  }, [])

  const updateUser = useCallback(async (updates: Partial<User>) => {
    const u = authService.updateUser(updates)
    setUser(u)
    return u
  }, [])

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin',
      login,
      loginAdmin,
      register,
      logout,
      updateUser,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
