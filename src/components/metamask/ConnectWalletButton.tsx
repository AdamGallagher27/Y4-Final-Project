'use client'

//  https://metamask.io/news/developers/how-to-implement-metamask-sdk-with-nextjs/

import { useSDK } from '@metamask/sdk-react'
import { Dispatch, SetStateAction, useEffect } from 'react'

interface Props {
  setIsLoggedIn: Dispatch<SetStateAction<boolean>>
}

export const ConnectWalletButton = ({ setIsLoggedIn }: Props) => {

  const { sdk, connected, account } = useSDK()

  const connect = async () => {
    try {
      await sdk?.connect()
      setIsLoggedIn(true)
    } catch (err) {
      console.warn(`No accounts found`, err)
      setIsLoggedIn(false)
    }
  }

  const disconnect = () => {
    if (sdk) {
      sdk.terminate()
      setIsLoggedIn(false)
    }
  }


  useEffect(() => {
    account && setIsLoggedIn(true)
  }, [account])

  return (
    <div className='relative'>
      {connected ? (
        <><p>connected </p>
          <button onClick={() => disconnect()}>disconnect </button>
          <p>wallet address : {account}</p>
        </>
      ) : (
        <button onClick={() => connect()}>connect wallet </button>
      )}


      <p>user logs in if its the first time a SEA public / private keys are generated and securily saved. the wallet address / private key are used to generate api tokens</p>
    </div>
  )
}