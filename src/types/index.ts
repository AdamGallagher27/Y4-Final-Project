interface Property {
  name: string
  type: string
}

// Model and Collection are esssentially the same thing this just 
// makes it more readible in the code
interface Collection {
  name: string
  properties: Property[]
  items?: Item[]
}

interface Model {
  modelId: string
  name: string
  properties: Property[]
}

interface Single {
  singleId: string
  name: string
}

interface Item {
  id: string
  [key: string]: any
}

interface EncryptedItem {
  id?: string
  encryptedData: string
  signiture: string
}

interface Acknowledgment {
  err?: string
  ok?: { '': number } 
}

interface User {
  email: string
  password: string
}