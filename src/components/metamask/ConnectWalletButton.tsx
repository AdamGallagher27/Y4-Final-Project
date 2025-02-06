'use client'

//  https://metamask.io/news/developers/how-to-implement-metamask-sdk-with-nextjs/

import { useSDK } from '@metamask/sdk-react'

export const ConnectWalletButton = () => {

  const { sdk, connected, account } = useSDK()

  const connect = async () => {
    try {
      await sdk?.connect()
    } catch (err) {
      console.warn(`No accounts found`, err)
    }
  }

  const disconnect = () => {
    if (sdk) {
      sdk.terminate()
    }
  }

  return (
    <div className='relative'>
      {connected ? (
        <>connected
          <button onClick={() => disconnect()}>disconnect</button>
          {account}
        </>
      ) : (
        <button onClick={() => connect()}>connect wallet</button>
      )}
    </div>
  )
}