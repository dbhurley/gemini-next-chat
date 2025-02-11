// Mautic API endpoint configurations with their related terms and response mapping
const MAUTIC_ENDPOINTS = {
  contacts: {
    terms: ['contact', 'contacts', 'lead', 'leads', 'person', 'people'],
    endpoint: '/api/contacts',
    responseKey: 'contacts',
    mapping: (data: any) => ({
      contacts: data.contacts.map((contact: any) => ({
        id: contact.id,
        email: contact.fields.all.email,
        firstname: contact.fields.all.firstname,
        lastname: contact.fields.all.lastname
      }))
    })
  },
  segments: {
    terms: ['segment', 'segments', 'list', 'lists'],
    endpoint: '/api/segments',
    responseKey: 'lists',
    mapping: (data: any) => ({
      lists: data.lists.map((segment: any) => ({
        id: segment.id,
        name: segment.name,
        description: segment.description
      }))
    })
  },
  campaigns: {
    terms: ['campaign', 'campaigns', 'automation', 'automations'],
    endpoint: '/api/campaigns',
    responseKey: 'campaigns',
    mapping: (data: any) => ({
      campaigns: data.campaigns.map((campaign: any) => ({
        id: campaign.id,
        name: campaign.name,
        description: campaign.description,
        isPublished: campaign.isPublished
      }))
    })
  },
  forms: {
    terms: ['form', 'forms'],
    endpoint: '/api/forms',
    responseKey: 'forms',
    mapping: (data: any) => ({
      forms: data.forms.map((form: any) => ({
        id: form.id,
        name: form.name,
        description: form.description
      }))
    })
  },
  assets: {
    terms: ['asset', 'assets', 'download', 'downloads'],
    endpoint: '/api/assets',
    responseKey: 'assets',
    mapping: (data: any) => ({
      assets: data.assets.map((asset: any) => ({
        id: asset.id,
        title: asset.title,
        description: asset.description,
        downloadCount: asset.downloadCount
      }))
    })
  },
  pages: {
    terms: ['page', 'pages', 'landing page', 'landing pages'],
    endpoint: '/api/pages',
    responseKey: 'pages',
    mapping: (data: any) => ({
      pages: data.pages.map((page: any) => ({
        id: page.id,
        title: page.title,
        content: page.content
      }))
    })
  }
}

interface MauticEndpoint {
  terms: string[]
  endpoint: string
  responseKey: string
  mapping: (data: any) => Partial<MollyResponse>
}

export const openapi: OpenAPIDocument = {
  components: {
    schemas: {
      mollyResponse: {
        type: 'object',
        description: 'The response from Molly API.',
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
          },
          campaigns: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: {
                  type: 'number',
                  description: 'Campaign ID'
                },
                name: {
                  type: 'string',
                  description: 'Campaign name'
                },
                description: {
                  type: 'string',
                  description: 'Campaign description'
                },
                isPublished: {
                  type: 'boolean',
                  description: 'Whether the campaign is published'
                }
              }
            }
          },
          assets: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: {
                  type: 'number',
                  description: 'Asset ID'
                },
                title: {
                  type: 'string',
                  description: 'Asset title'
                },
                description: {
                  type: 'string',
                  description: 'Asset description'
                },
                downloadCount: {
                  type: 'number',
                  description: 'Asset download count'
                }
              }
            }
          },
          reports: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: {
                  type: 'number',
                  description: 'Report ID'
                },
                name: {
                  type: 'string',
                  description: 'Report name'
                },
                description: {
                  type: 'string',
                  description: 'Report description'
                },
                data: {
                  type: 'object',
                  description: 'Report data'
                }
              }
            }
          },
          emails: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: {
                  type: 'number',
                  description: 'Email ID'
                },
                subject: {
                  type: 'string',
                  description: 'Email subject'
                },
                content: {
                  type: 'string',
                  description: 'Email content'
                }
              }
            }
          },
          pages: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: {
                  type: 'number',
                  description: 'Page ID'
                },
                title: {
                  type: 'string',
                  description: 'Page title'
                },
                content: {
                  type: 'string',
                  description: 'Page content'
                }
              }
            }
          },
          forms: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: {
                  type: 'number',
                  description: 'Form ID'
                },
                name: {
                  type: 'string',
                  description: 'Form name'
                },
                description: {
                  type: 'string',
                  description: 'Form description'
                }
              }
            }
          }
        }
      }
    }
  },
  info: {
    title: 'Molly',
    description: 'Plugin for interacting with your Molly contacts and automation',
    version: 'v1'
  },
  openapi: '3.0.1',
  paths: {
    '/': {
      get: {
        operationId: 'mollyApi',
        description: 'Get data from Molly',
        parameters: [
          {
            name: 'query',
            in: 'query',
            required: true,
            schema: {
              type: 'string'
            },
            description: 'Natural language query to determine the endpoint and parameters'
          },
          {
            name: 'limit',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 1,
              maximum: 100
            },
            description: 'Maximum number of results to return'
          },
          {
            name: 'offset',
            in: 'query',
            schema: {
              type: 'integer',
              minimum: 0
            },
            description: 'Offset for pagination'
          }
        ],
        responses: {
          '200': {
            description: 'Successful response',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/mollyResponse'
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
      url: '@plugins/molly'
    }
  ]
}

// Helper function to determine the most likely endpoint based on the query
function determineEndpoint(query: string | undefined): MauticEndpoint | null {
  if (!query) return null

  const normalizedQuery = query.toLowerCase()
  
  // First try exact matches with Mautic endpoint terms
  for (const [key, config] of Object.entries(MAUTIC_ENDPOINTS)) {
    if (config.terms.some(term => normalizedQuery.includes(term))) {
      return config
    }
  }

  // If no exact match, check for semantic similarity with endpoint terms
  for (const [key, config] of Object.entries(MAUTIC_ENDPOINTS)) {
    const words = normalizedQuery.split(' ')
    for (const word of words) {
      if (config.terms.some(term => term.startsWith(word) || word.startsWith(term))) {
        return config
      }
    }
  }

  return null
}

export type MollyResponse = {
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
  campaigns?: Array<{
    id: number
    name: string
    description?: string
    isPublished?: boolean
  }>
  assets?: Array<{
    id: number
    title: string
    description?: string
    downloadCount?: number
  }>
  reports?: Array<{
    id: number
    name: string
    description?: string
    data?: any
  }>
  emails?: Array<{
    id: number
    subject: string
    content?: string
  }>
  pages?: Array<{
    id: number
    title: string
    content?: string
  }>
  forms?: Array<{
    id: number
    name: string
    description?: string
  }>
};

export async function handle({ query, limit, offset }: { query?: string, limit?: number, offset?: number }): Promise<MollyResponse> {
  const endpoint = determineEndpoint(query)
  
  if (!endpoint) {
    throw new Error('Unable to determine appropriate Mautic endpoint from query')
  }

  try {
    // Make request to Mautic API
    const response = await fetch(`${process.env.MAUTIC_BASE_URL}${endpoint.endpoint}`, {
      headers: {
        'Authorization': `Basic ${Buffer.from(`${process.env.MAUTIC_USERNAME}:${process.env.MAUTIC_PASSWORD}`).toString('base64')}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`Mautic API request failed: ${response.statusText}`)
    }

    const data = await response.json()
    return endpoint.mapping(data)
  } catch (error) {
    console.error('Error calling Mautic API:', error)
    throw new Error('Failed to fetch data from Mautic API')
  }
}
