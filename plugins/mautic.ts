type Props = {
  endpoint: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  data?: Record<string, any>
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
    title: 'Zion API',
    description: 'Plugin for interacting with the Zion API system.',
    version: 'v1'
  },
  components: {
    schemas: {
      ZionRequest: {
        type: 'object',
        description: 'Request parameters for Zion API',
        properties: {
          endpoint: {
            type: 'string',
            description: 'API endpoint to call',
            example: 'contacts'
          },
          method: {
            type: 'string',
            description: 'HTTP method',
            enum: ['GET', 'POST', 'PUT', 'DELETE'],
            example: 'GET'
          },
          data: {
            type: 'object',
            description: 'Request payload',
            properties: {
              email: {
                type: 'string',
                description: 'Contact email address',
                example: 'user@example.com'
              }
            }
          }
        },
        required: ['endpoint']
      }
    }
  },
  paths: {
    '/': {
      post: {
        operationId: 'zionApi',
        description: 'Make requests to the Zion API system',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ZionRequest'
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Successful response',
            content: {
              'application/json': {
                schema: {
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
                      description: 'Response data'
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/contacts': {
      get: {
        operationId: 'getContacts',
        description: 'Get contacts from Zion',
        responses: {
          '200': {
            description: 'List of contacts',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    total: {
                      type: 'number',
                      description: 'Total number of contacts'
                    },
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
                            description: 'Contact email'
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
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email'],
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
                }
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'Contact created successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    contact: {
                      type: 'object',
                      properties: {
                        id: {
                          type: 'number',
                          description: 'Contact ID'
                        },
                        email: {
                          type: 'string',
                          description: 'Contact email'
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
  return result
}
