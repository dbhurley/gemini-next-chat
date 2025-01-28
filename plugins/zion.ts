type Props = {
  endpoint: string
  query?: string
}

type ZionResponse = {
  contacts?: Array<{
    id: number
    email: string
    firstname?: string
    lastname?: string
  }>
  lists?: Array<{
    id: number
    name: string
    description?: string
  }>
}

export const openapi: OpenAPIDocument = {
  components: {
    schemas: {
      zionResponse: {
        type: 'object',
        description: 'The response from Zion API.',
        properties: {
          contacts: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: {
                  type: 'number',
                  description: 'Contact ID'
                },
                email: {
                  type: 'string',
                  description: 'Contact email address'
                },
                firstname: {
                  type: 'string',
                  description: 'First name'
                },
                lastname: {
                  type: 'string',
                  description: 'Last name'
                }
              }
            }
          },
          lists: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: {
                  type: 'number',
                  description: 'Segment ID'
                },
                name: {
                  type: 'string',
                  description: 'Segment name'
                },
                description: {
                  type: 'string',
                  description: 'Segment description'
                }
              }
            }
          }
        }
      }
    }
  },
  info: {
    title: 'Zion',
    description: 'Plugin for interacting with your Zion contacts and automation',
    version: 'v1'
  },
  openapi: '3.0.1',
  paths: {
    '/': {
      get: {
        operationId: 'zionApi',
        description: 'Get data from Zion',
        parameters: [
          {
            name: 'endpoint',
            in: 'query',
            required: true,
            schema: {
              type: 'string'
            },
            description: 'API endpoint to query (contacts or segments)'
          }
        ],
        responses: {
          '200': {
            description: 'Successful response',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/zionResponse'
                }
              }
            }
          }
        }
      }
    }
  },
  servers: [
    {
      url: '@plugins/zion'
    }
  ]
}

export async function handle({ endpoint, query }: Props): Promise<ZionResponse> {
  const apiUrl = process.env.NEXT_PUBLIC_ZION_API_URL
  const apiUser = process.env.NEXT_PUBLIC_ZION_API_USER
  const apiPassword = process.env.NEXT_PUBLIC_ZION_API_PASSWORD

  if (!apiUrl || !apiUser || !apiPassword) {
    throw new Error('Zion API credentials not configured')
  }

  const auth = Buffer.from(`${apiUser}:${apiPassword}`).toString('base64')

  const response = await fetch(`${apiUrl}/api/${endpoint}${query ? `?search=${query}` : ''}`, {
    method: 'GET',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/json'
    }
  })

  if (!response.ok) {
    throw new Error(`Zion API request failed: ${response.statusText}`)
  }

  const result = await response.json()
  return {
    contacts: result.contacts,
    lists: result.lists
  }
}
