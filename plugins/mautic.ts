type Props = {
  endpoint: string
  method?: string
  data?: any
}

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

export const openapi: OpenAPIDocument = {
  openapi: '3.0.1',
  info: {
    title: 'Zion',
    description: 'Plugin for interacting with your Zion contacts and automation',
    version: 'v1'
  },
  components: {
    schemas: {
      Contact: {
        type: 'object',
        properties: {
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
        },
        required: ['email']
      }
    }
  },
  paths: {
    '/contacts': {
      get: {
        operationId: 'listContacts',
        description: 'Get a list of contacts from Zion',
        summary: 'List all contacts',
        tags: ['Contacts'],
        parameters: [],
        responses: {
          200: {
            description: 'List of contacts',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    contacts: {
                      type: 'array',
                      items: {
                        $ref: '#/components/schemas/Contact'
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      post: {
        operationId: 'createContact',
        description: 'Create a new contact in Zion',
        summary: 'Create a contact',
        tags: ['Contacts'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Contact'
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Contact created successfully'
          }
        }
      }
    },
    '/segments': {
      get: {
        operationId: 'listSegments',
        description: 'Get a list of segments from Zion',
        summary: 'List all segments',
        tags: ['Segments'],
        parameters: [],
        responses: {
          200: {
            description: 'List of segments',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    lists: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          id: { type: 'number' },
                          name: { type: 'string' },
                          description: { type: 'string' }
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
    }
  },
  servers: [
    {
      url: '@plugins/mautic'
    }
  ]
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
      'Content-Type': 'application/json'
    },
    ...(data && method !== 'GET' ? { body: JSON.stringify(data) } : {})
  })

  if (!response.ok) {
    throw new Error(`Zion API request failed: ${response.statusText}`)
  }

  const result = await response.json()
  return result?.contacts || result?.lists || result
}
