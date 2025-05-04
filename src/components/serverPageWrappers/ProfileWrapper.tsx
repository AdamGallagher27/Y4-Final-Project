'use client'
import { unsetCookie } from '@/utils'
import { useSDK } from '@metamask/sdk-react'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import Title from '../generic/Title'
import PeersTable from '../generic/PeersTable'
import ConfigurePeer from '../generic/ConfigurePeer'
import { Button } from '../ui/button'

interface Props {
  configuredPeers: string[]
}
const ProfileWrapper = ({ configuredPeers }: Props) => {
  const { sdk } = useSDK()
  const router = useRouter()

  const disconnect = () => {
    if (sdk) {
      sdk.terminate()
      unsetCookie()
      return true
    }
  }

  const logoutAndRedirect = async () => {
    const disconected = disconnect()
    if(disconected) {
      router.push('/')
    }
  }

  const [peers, setPeers] = useState<string[]>(configuredPeers)

  return (
    <div className='p-4 ml-20'>
      <Title firstPartOfTitle='Profile' secondPartOfTitle='User' />
      <Button className='mt-4 ml-2 mb-4' onClick={logoutAndRedirect}>Logout</Button>

      <Title firstPartOfTitle='Profile' secondPartOfTitle='Peers' />
      {peers && <PeersTable peers={peers} />}
      <ConfigurePeer setPeers={setPeers} />
    </div>
  )
}

export default ProfileWrapper