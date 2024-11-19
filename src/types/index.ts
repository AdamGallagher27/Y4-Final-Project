interface CollectionProperty {
  name: String
  type: String | Boolean | Number
}

interface Collection {
  name: String
  properties: CollectionProperty[]
}

interface Acknowledgment {
  err?: string, 
  ok?: { '': number } 
}