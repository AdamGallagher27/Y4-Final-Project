interface CollectionProperty {
  name: string
  type: string
}

interface Collection {
  name: string
  properties: CollectionProperty[]
  items?: any
}

interface Acknowledgment {
  err?: string, 
  ok?: { '': number } 
}