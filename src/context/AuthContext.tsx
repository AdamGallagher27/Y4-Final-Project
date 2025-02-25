'use client'

import { AuthContextInterface } from '@/types'
import { createContext, useContext, useState, ReactNode } from 'react'

const AuthContext = createContext<AuthContextInterface | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const [walletAddress, setWalletAddress] = useState<string | null>(null)

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, walletAddress, setWalletAddress }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('No context provided')
  }
  return context
}
