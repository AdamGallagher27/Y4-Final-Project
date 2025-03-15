import { addRowToCollection } from '../../utils/api'

// this is used to mock the response
global.fetch = jest.fn()

describe('addRowToCollection', () => {
  const mockModelId = 'test-model-123'
  const mockBody = { name: 'Test Item', description: 'Test Description' }
  const mockApiUrl = 'http://localhost:3000/'
  
  beforeEach(() => {
    // reset mock fetch
    (fetch as jest.Mock).mockClear()
  })

  it('should make a successful POST request and return encrypted item', async () => {
    // for some reason this line needs the semi colon
    const mockResponse = { body: { encryptedData: 'data', signiture: 'sign' } };

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

