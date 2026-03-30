// src/components/PrivateRoute.tsx
import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { type ReactElement } from 'react'

export function PrivateRoute({ children }: { children: ReactElement }) {
  const { user, loading } = useAuth()

  if (loading) return <div>A carregar...</div>
  
  return user ? children : <Navigate to="/login" />
}