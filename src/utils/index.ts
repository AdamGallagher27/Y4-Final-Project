
import { Collection, EncryptedItem, Item, Property } from '../types'
import { Dispatch, SetStateAction } from 'react'
import sanitizeHtml from 'sanitize-html'

export const isOnClient = () => {
  if (typeof window !== undefined) {
    return true
  }

  return false
}

export const refreshPage = () => {
  if(isOnClient()) window.location.reload()
}


export const cleanResponse = (response: Item[]) => {
  return response.map(item => {
    // eslint-disable-next-line
    const { _, ...newObject } = item
    return newObject
  })
}

// returns the id (pointer) of an entry in gun db
export const getGunEntryId = (entry: EncryptedItem) => {
  if (entry && entry._ && entry._['#']) {
    return entry._['#']
  }
}

export const validateEmail = (email: string) => {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return regex.test(email)
}

export const validatePassword = (password: string) => {
  const regex = /^.{8,}$/
  return regex.test(password)
}

const validateFormField = (name: string, value: string, properties: Property[]) => {
  const property = properties.find((prop) => prop.name === name)

  if (!property) return

  if (property.name === 'id') return

  if (value === '') {
    return `${property.name} is required.`
  }

  if (property.type === 'number' && isNaN(Number(value))) {
    return `${property.name} must be a valid number.`
  }

  if(property.type === 'richtext' && value.length > 900) {
    return `${property.name} is too long to be added to the database`
  } 

  if (property.type === 'string') {

    if (value.length < 3) {
      return `${property.name} must be at least 3 characters long.`
    }

    const regex = /^[a-zA-Z0-9 ]+$/
    if (!regex.test(value)) {
      return `${property.name} can only contain letters, numbers, and spaces.`
    }
  }

}

export const validateForm = (
  form: { [key: string]: string }, 
  properties: Property[], 
  setErrors: Dispatch<SetStateAction<{ [key: string]: string }>>
) => {
  const formErrors: { [key: string]: string } = {}

  // by default keep has error as false then check if error exists 
  let isValid = true

  properties.forEach((property) => {
    const value = form[property.name] || ''
    const error = validateFormField(property.name, value, properties)

    if (error) {
      formErrors[property.name] = error
      isValid = false
    }
  })

  setErrors(formErrors)
  return isValid
}


export const getPillColour = (method: string) => {

  let methodColour

  if(method === 'GET') {
    methodColour = 'bg-green-500'
  }
  else if(method === 'POST') {
    methodColour = 'bg-blue-500'
  }
  else if(method === 'PUT') {
    methodColour = 'bg-blue-500'
  }
  else {
    methodColour = 'bg-red-500'
  }

  return methodColour
}

export const generatePropetiesArray = (selectedType: string) => {
  return [{
    'name': 'id',
    'type': 'string'
  }, {
    'name': 'value',
    'type': selectedType
  }]
}

// the form saves boolean values as a string
// this is my temp solution for preventing them being saved as a stringified bool
export const transformBoolStringsInForm = (form:{ [key: string]: string}) => {
  return Object.fromEntries(
    Object.entries(form).map(([key, value]) => {
      if (value === 'true') return [key, true]
      if (value === 'false') return [key, false]
      return [key, value]
    })
  )
}

// this does the opposite of the above funtion it takes an array of data and makes booleans
// a usuable string for the ui
// chatgpt
export const transformBoolToStringValue = (data: Item[]): Item[] => {
  return data.map(item => {
    const transformedValues = Object.fromEntries(
      Object.entries(item).map(([key, value]) => 
        typeof value === 'boolean' ? [key, value.toString()] : [key, value]
      )
    )

    return { ...item, ...transformedValues }
  })
}

// ensures no one is adding malicious script tags into the db
export const parseRichText = (html: string) => {
  return sanitizeHtml(html, {
    allowedTags: ['p', 'ol', 'ul', 'li', 'h2', 'strong', 'em']
  })
}

export const setCookie = (name: string, value: string) => {
	const maxAge = 60 * 60 * 24 
	document.cookie = `${name}=${value}; max-age=${maxAge}; path=/; secure; SameSite=Strict`
}

export const unsetCookie = () => {
  document.cookie = 'authenticated=;'
}