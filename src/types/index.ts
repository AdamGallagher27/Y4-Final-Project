interface Properties {
  name: string
  type: string
}

// Model and Collection are esssentially the same thing this just 
// makes it more readible in the code
interface Collection {
  name: string
  properties: Properties[]
  items?: Item[]
}

interface Model {
  modelId: string
  name: string
  properties: Properties[]
}

interface Item {
  id: string
  [key: string]: any
}

interface Acknowledgment {
  err?: string
  ok?: { '': number } 
}