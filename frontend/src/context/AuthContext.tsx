// src/context/AuthContext.tsx
import { createContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import api from '../api/axiosInstance'

interface User {
  id: number
  email: string
  role: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (token: string) => Promise<void>  // ← adicionado
  logout: () => void
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      setLoading(false)
      return
    }

    api.get('/perfil')
      .then(res => setUser(res.data))
      .catch(() => {
        localStorage.removeItem('token')
        setUser(null)
      })
      .finally(() => setLoading(false))
  }, [])

  // ← adicionado
  async function login(token: string) {
    localStorage.setItem('token', token)
    const res = await api.get('/perfil')
    setUser(res.data)
  }

  function logout() {
    localStorage.removeItem('token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}