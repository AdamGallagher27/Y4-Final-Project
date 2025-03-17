import { addNewSingle, deleteSingle, getAllSingles, updateSingle } from '../../../utils/api'

global.fetch = jest.fn()

const mockApiUrl = 'http://localhost:3000/'
const mockSingle = { id: 'single-123', value: 'Value' }
const mockResponse = { singles: [{ id: 'single-123', value: 'Value' }] }

describe('addNewSingle', () => {

  beforeEach(() => {
    (fetch as jest.Mock).mockClear()
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  it('should make a successful POST request', async () => {

    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    })

    const response = await addNewSingle(mockSingle)

    expect(fetch).toHaveBeenCalledWith(
      `${mockApiUrl}api/single/${mockSingle.id}`,
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
          'Ignore': 'ignore',
        }),
        body: JSON.stringify({ value: mockSingle.value }),
      })
    )

    expect(response).toEqual(mockResponse.singles)
  })

  it('should handle non-OK response correctly', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: async () => ({ message: 'Error occurred' }),
    })

    const response = await addNewSingle(mockSingle)

    expect(response).toBeUndefined()
    expect(console.error).toHaveBeenCalledWith('Network response was not ok')
  })
})

describe('getAllSingles', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear()
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  it('should make a successful GET request and return all singles', async () => {

    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    })

    const response = await getAllSingles()

    expect(fetch).toHaveBeenCalledWith(
      `${mockApiUrl}api/single`,
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
          'Ignore': 'ignore',
        }),
      })
    )

    expect(response).toEqual(mockResponse.singles)
  })

  it('should handle non-OK response correctly', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: async () => ({ message: 'Error occurred' }),
    })

    const response = await getAllSingles()

    expect(response).toBeUndefined()
    expect(console.error).toHaveBeenCalledWith('Network response was not ok')
  })
})

describe('updateSingle', () => {
  const mockUpdatedSingle = { id: 'single-123', value: 'Updated Value' }
  const mockUpdatedResponse = { singles: [{ id: 'single-123', value: 'Updated Value' }] }

  beforeEach(() => {
    (fetch as jest.Mock).mockClear()
    jest.spyOn(console, 'error').mockImplementation(() => {}) 
  })

  it('should make a successful PUT request and return updated singles', async () => {

    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockUpdatedResponse,
    })

    const response = await updateSingle(mockUpdatedSingle)

    expect(fetch).toHaveBeenCalledWith(
      `${mockApiUrl}api/single/${mockUpdatedSingle.id}`,
      expect.objectContaining({
        method: 'PUT',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
          'Ignore': 'ignore',
        }),
        body: JSON.stringify({ value: mockUpdatedSingle.value }),
      })
    )

    expect(response).toEqual(mockUpdatedResponse.singles)
  })

  it('should handle non-OK response correctly', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: async () => ({ message: 'Error occurred' }),
    })

    const response = await updateSingle(mockUpdatedSingle)

    expect(response).toBeUndefined()
    expect(console.error).toHaveBeenCalledWith('Network response was not ok')
  })

})

describe('deleteSingle', () => {
  const mockSingleId = 'single-123'
  const mockResponse = { message: 'Single deleted successfully' }

  beforeEach(() => {
    (fetch as jest.Mock).mockClear()
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  it('should make a successful DELETE request and return the response data', async () => {

    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    })

    const response = await deleteSingle(mockSingleId)

    expect(fetch).toHaveBeenCalledWith(
      `${mockApiUrl}api/single/${mockSingleId}`,
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

    expect(console.error).toHaveBeenCalledWith('Network response was not ok')
  })
})
