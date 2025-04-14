'use client'

//  https://metamask.io/news/developers/how-to-implement-metamask-sdk-with-nextjs/
import { useSDK } from '@metamask/sdk-react'
import { Dispatch, SetStateAction, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { Mail } from 'lucide-react'
import { Button } from '../ui/button'
import { updateAuthJSON } from '@/utils/api'
import { setCookie, unsetCookie } from '@/utils'

interface Props {
  setIsAuthenticated: Dispatch<SetStateAction<boolean>>
}

export const ConnectWalletButton = ({ setIsAuthenticated }: Props) => {
  
  const { sdk, connected, account } = useSDK()

  // if the account variable gets assigned wallet address
  // hit the user auth end point
  // this checks if its the first time the user has logged in before
  // when the user authenticates create a cookie for auth using there wallet address
  // unset the cookie if not auth
  useEffect(() => {
    if (account) {
      setCookie('authenticated', 'true')
      updateAuthJSON(account)
      setIsAuthenticated(true)
    }
    else{
      unsetCookie()
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

  if(connected) return null

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