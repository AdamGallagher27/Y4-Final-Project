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
  name: string
  properties: Properties[]
}

interface Item {
  id: string
  userId: string
  // An entry into the db must have an id / userId but the rest of the params can be anything
  [key: string]: any
}

interface Acknowledgment {
  err?: string
  ok?: { '': number } 
}