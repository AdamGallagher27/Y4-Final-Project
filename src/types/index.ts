export interface Property {
  name: string
  type: string
}

// Model and Collection are esssentially the same thing this just 
// makes it more readible in the code
export interface Collection {
  name: string
  properties: Property[]
  items?: Item[]
}

export interface Model {
  modelId: string
  name: string
  properties: Property[]
}

export interface Single {
  singleId: string
  name: string
}

export interface Item {
  // eslint-disable-next-line
  [key: string]: any
}

export interface EncryptedItem {
  id?: string
  encryptedData: string
  encryptedKey: string
  iv: string
  signiture: string
  // eslint-disable-next-line
  _: any
}

export interface Acknowledgment {
  err?: string
  ok?: { '': number } 
}

export interface User {
  email: string
  password: string
}

export interface RSAKeyPair {
  publicKey: string
    privateKey: string
}

export interface DecryptedData {
  // eslint-disable-next-line
  [key: string]: any
}

export interface StatusFromAPI {
  url: string
  status: number
  createdAt: string
}

export interface AuthContextInterface {
  isLoggedIn: boolean
  setIsLoggedIn: (value: boolean) => void
  walletAddress: string | null
  setWalletAddress: (value: string) => void
}
