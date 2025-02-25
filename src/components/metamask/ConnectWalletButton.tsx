'use client'

//  https://metamask.io/news/developers/how-to-implement-metamask-sdk-with-nextjs/
import { updateAuthJSON } from '@/utils'
import { useSDK } from '@metamask/sdk-react'
import { Dispatch, SetStateAction, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { Mail } from 'lucide-react'
import { Button } from '../ui/button'
import { useAuth } from '@/context/AuthContext'

interface Props {
  setIsAuthenticated: Dispatch<SetStateAction<boolean>>
}

export const ConnectWalletButton = ({ setIsAuthenticated }: Props) => {
  
  const {  setIsLoggedIn, setWalletAddress } = useAuth()
  const { sdk, connected, account } = useSDK()

  // if the account variable gets assigned wallet address
  // hit the user auth end point
  // this checks if its the first time the user has logged in before
  useEffect(() => {
    if (account) {
      updateAuthJSON(account)
      setIsLoggedIn(true)
      setWalletAddress(account) 
      setIsAuthenticated(true)
    }
    else{
      setIsLoggedIn(false)
      setWalletAddress('') 
      setIsAuthenticated(false)
    }
  }, [account])

  const connect = async () => {
    try {
      await sdk?.connect()
    } catch (err) {
      console.warn(`No accounts found`, err)
      setIsAuthenticated(false)
    }
  }

  if(connected) return

  return (
    <div className='relative'>
        <div className='flex items-center justify-center min-h-screen'>
          <Card className='w-64'>
            <CardHeader>
              <CardTitle>Connect Wallet</CardTitle>
              <CardDescription>Metamask account and extension are required</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => connect()}>
                <Mail /> Login with Metamask
              </Button>
            </CardContent>
          </Card>
        </div>
    </div>
  )
}