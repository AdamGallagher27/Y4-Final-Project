import { addRowToCollection, deleteRow, getAllCollectionRows, updateCollectionRow } from '../../../utils/api'

// this is used to mock the response
global.fetch = jest.fn()

const mockApiUrl = 'http://localhost:3000/'
const mockModelId = 'test-model-123'
const mockErrorResponse = { message: 'Error occurred' }

describe('getAllCollectionRows', () => {
  beforeEach(() => {
    // reset mock fetch
    (fetch as jest.Mock).mockClear()
    jest.spyOn(console, 'error').mockImplementation(() => {}) 
  })

  it('should make a successful GET request and return all rows for collection', async () => {
    // for some reason this line needs the semi colon
    const mockResponse = { body: [{ id: '1', name: 'Test Item' }] };

    // mock the response
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    })

    const response = await getAllCollectionRows(mockModelId)

    expect(fetch).toHaveBeenCalledWith(
      `${mockApiUrl}api/collections/${mockModelId}`,
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
          'Ignore': 'ignore',
        }),
      })
    )

    expect(response).toEqual(mockResponse.body)
  })

  it('should handle non-OK response correctly', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: async () => ({ message: 'Error occurred' }),
    })

    const response = await getAllCollectionRows(mockModelId)

    expect(response).toBeUndefined()
    expect(console.error).toHaveBeenCalledWith('Network response was not ok')
  })
})

describe('addRowToCollection', () => {
  const mockBody = { name: 'Test Item', description: 'Test Description' }
  const mockResponse = { body: { encryptedData: 'data', signiture: 'sign' } }

  beforeEach(() => {
    // reset mock fetch
    (fetch as jest.Mock).mockClear()
    jest.spyOn(console, 'error').mockImplementation(() => {}) 
  })

  it('should make a successful POST request and return encrypted item', async () => {
    // mock the response
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    })

    const response = await addRowToCollection(mockModelId, mockBody)

    expect(fetch).toHaveBeenCalledWith(
      `${mockApiUrl}api/collections/${mockModelId}`,
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
        }),
        body: JSON.stringify(mockBody),
      })
    )

    expect(response).toEqual(mockResponse.body)
  })

  it('should handle non-OK response correctly', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: async () => ({ message: 'Error occurred' }),
    })

    const response = await addRowToCollection(mockModelId, mockBody)

    expect(response).toBeUndefined()
  })
})

describe('updateCollectionRow', () => {
  const mockBody = { id: '1', name: 'Updated Item', description: 'Updated Description' }
  const mockApiUrl = 'http://localhost:3000/'

  beforeEach(() => {
    // reset mock fetch
    (fetch as jest.Mock).mockClear()
    jest.spyOn(console, 'error').mockImplementation(() => {})  // mock console.error
  })

  it('should make a successful PUT request and return the updated row', async () => {
    const mockResponse = { body: { id: '1', name: 'Updated Item', description: 'Updated Description' } };

    // mock the response
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    })

    const response = await updateCollectionRow(mockModelId, mockBody)

    expect(fetch).toHaveBeenCalledWith(
      `${mockApiUrl}api/collections/${mockModelId}/${mockBody.id}`,
      expect.objectContaining({
        method: 'PUT',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
          'Ignore': 'ignore',
        }),
        body: JSON.stringify(mockBody),
      })
    )

    expect(response).toEqual(mockResponse)
  })

  it('should handle non-OK response correctly', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: async () => ({ message: 'Error occurred' }),
    })

    const response = await updateCollectionRow(mockModelId, mockBody)

    expect(response).toEqual(mockErrorResponse)  
    expect(console.error).toHaveBeenCalledWith('Network response was not ok')
  })
})

describe('deleteRow', () => {
  const mockRowId = '1'

  beforeEach(() => {
    // reset mock fetch
    (fetch as jest.Mock).mockClear()
    jest.spyOn(console, 'error').mockImplementation(() => {})  // mock console.error
  })

  it('should make a successful DELETE request and return response data', async () => {
    const mockResponse = { message: 'Item deleted successfully' };

    // mock the response
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    })

    const response = await deleteRow(mockModelId, mockRowId)

    expect(fetch).toHaveBeenCalledWith(
      `${mockApiUrl}api/collections/${mockModelId}/${mockRowId}`,
      expect.objectContaining({
        method: 'DELETE',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
          'Ignore': 'ignore',
        }),
      })
    )

    expect(response).toEqual(mockResponse)
  })

  it('should handle non-OK response correctly', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: async () => ({ message: 'Error occurred' }),
    })

    const response = await deleteRow(mockModelId, mockRowId)

    expect(response).toEqual(mockErrorResponse)  
    expect(console.error).toHaveBeenCalledWith('Network response was not ok')
  })
})