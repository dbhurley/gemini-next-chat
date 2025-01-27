interface MauticContact {
  id: number
  fields: {
    all: {
      email: string
      firstname?: string
      lastname?: string
      [key: string]: any
    }
  }
}

interface MauticSegment {
  id: number
  name: string
  alias: string
}

interface MauticCampaign {
  id: number
  name: string
  description: string
}

type Props = {
  endpoint: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  data?: any
}

export const openapi: OpenAPIDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Zion API Plugin',
    version: '1.0.0',
    description: 'Plugin for interacting with the Zion API'
  },
  components: {
    schemas: {
      MauticRequest: {
        type: 'object',
        required: ['endpoint'],
        properties: {
          endpoint: {
            type: 'string',
            description: 'Zion API endpoint path (e.g., contacts, segments, campaigns)',
            example: 'contacts'
          },
          method: {
            type: 'string',
            enum: ['GET', 'POST', 'PUT', 'DELETE'],
            default: 'GET',
            example: 'GET'
          },
          data: {
            type: 'object',
            description: 'Data payload for POST/PUT requests',
            properties: {
              fields: {
                type: 'object',
                properties: {
                  email: {
                    type: 'string',
                    description: 'Email address',
                    example: 'user@example.com'
                  },
                  firstname: {
                    type: 'string',
                    description: 'First name',
                    example: 'John'
                  },
                  lastname: {
                    type: 'string',
                    description: 'Last name',
                    example: 'Doe'
                  }
                }
              }
            }
          }
        }
      },
      MauticResponse: {
        type: 'object',
        properties: {
          code: { 
            type: 'number',
            example: 200
          },
          status: { 
            type: 'number',
            example: 1
          },
          data: { 
            type: 'object',
            properties: {
              id: {
                type: 'number',
                example: 1
              },
              fields: {
                type: 'object',
                properties: {
                  all: {
                    type: 'object',
                    properties: {
                      email: {
                        type: 'string',
                        example: 'user@example.com'
                      },
                      firstname: {
                        type: 'string',
                        example: 'John'
                      },
                      lastname: {
                        type: 'string',
                        example: 'Doe'
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  paths: {
    '/mautic': {
      post: {
        summary: 'Make a request to the Zion API',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/MauticRequest',
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Successful response from Zion API',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/MauticResponse',
                },
              },
            },
          },
        },
      },
    },
  },
}

export async function handle({ endpoint, method = 'GET', data }: Props) {
  const apiUrl = process.env.MAUTIC_API_URL
  const apiUser = process.env.MAUTIC_API_USER
  const apiPassword = process.env.MAUTIC_API_PASSWORD

  if (!apiUrl || !apiUser || !apiPassword) {
    throw new Error('Zion API credentials not configured')
  }

  const auth = Buffer.from(`${apiUser}:${apiPassword}`).toString('base64')
  
  const response = await fetch(`${apiUrl}/api/${endpoint}`, {
    method,
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/json',
    },
    ...(data && method !== 'GET' ? { body: JSON.stringify(data) } : {}),
  })

  const result = await response.json()

  return {
    code: response.status,
    status: response.ok ? 1 : 0,
    data: result,
  }
}
