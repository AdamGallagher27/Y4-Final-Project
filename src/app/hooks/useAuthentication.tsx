import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const useAuthentication = () => {
  const { isLoggedIn } = useAuth()
	const router = useRouter()

  useEffect(() => {
		!isLoggedIn && router.push('/')
	})
}

export default useAuthentication