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
            name: 'query',
            in: 'query',
            required: true,
            schema: {
              type: 'string'
            },
            description: 'Natural language query to determine the endpoint and parameters'
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

// Mautic API endpoint configurations with their related terms and response mapping
const MAUTIC_ENDPOINTS = {
  contacts: {
    path: 'contacts',
    responseKey: 'contacts',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    terms: ['contact', 'contacts'],
    searchParams: {
      search: 'search',
      filters: 'filters'
    }
  },
  segments: {
    path: 'segments',
    responseKey: 'lists',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    terms: ['list', 'segment', 'segments'],
    searchParams: {
      search: 'search',
      filters: 'filters'
    }
  },
  campaigns: {
    path: 'campaigns',
    responseKey: 'campaigns',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    terms: ['campaign', 'campaigns'],
    searchParams: {
      search: 'search',
      filters: 'filters'
    }
  },
  assets: {
    path: 'assets',
    responseKey: 'assets',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    terms: ['asset', 'assets'],
    searchParams: {
      search: 'search',
      filters: 'filters'
    }
  },
  reports: {
    path: 'reports',
    responseKey: 'reports',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    terms: ['report', 'reports'],
    searchParams: {
      search: 'search',
      filters: 'filters'
    }
  },
  emails: {
    path: 'emails',
    responseKey: 'emails',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    terms: ['email', 'emails'],
    searchParams: {
      search: 'search',
      filters: 'filters'
    }
  },
  pages: {
    path: 'pages',
    responseKey: 'pages',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    terms: ['page', 'pages'],
    searchParams: {
      search: 'search',
      filters: 'filters'
    }
  },
  forms: {
    path: 'forms',
    responseKey: 'forms',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    terms: ['form', 'forms'],
    searchParams: {
      search: 'search',
      filters: 'filters'
    }
  }
} as const;

type MauticEndpoint = keyof typeof MAUTIC_ENDPOINTS;

// Helper function to determine the most likely endpoint based on the query
function determineEndpoint(query: string | undefined): MauticEndpoint {
  if (!query || typeof query !== 'string') {
    return 'contacts'; // Default to contacts if no query or invalid query
  }

  const normalizedQuery = query.toLowerCase();
  const words = normalizedQuery.split(/\s+/);
  
  // Score each endpoint based on matching terms
  const scores = Object.entries(MAUTIC_ENDPOINTS).map(([endpoint, config]) => {
    const matchCount = config.terms.reduce((count, term) => {
      return count + words.filter(word => word.includes(term) || term.includes(word)).length;
    }, 0);
    return { endpoint, score: matchCount };
  });

  // Sort by score and get the highest scoring endpoint
  const bestMatch = scores.sort((a, b) => b.score - a.score)[0];
  
  // Default to contacts if no clear match
  return (bestMatch.score > 0 ? bestMatch.endpoint : 'contacts') as MauticEndpoint;
}

export async function handle({ query }: { query?: string }): Promise<ZionResponse> {
  const apiUrl = process.env.NEXT_PUBLIC_ZION_API_URL
  const apiUser = process.env.NEXT_PUBLIC_ZION_API_USER
  const apiPassword = process.env.NEXT_PUBLIC_ZION_API_PASSWORD

  if (!apiUrl || !apiUser || !apiPassword) {
    throw new Error('Zion API credentials not configured')
  }

  // Determine the appropriate endpoint based on the query
  const endpoint = determineEndpoint(query);
  const endpointConfig = MAUTIC_ENDPOINTS[endpoint];
  
  const auth = Buffer.from(`${apiUser}:${apiPassword}`).toString('base64')
  
  // Build search parameters based on the query and endpoint configuration
  const queryParams = new URLSearchParams();
  if (query) {
    queryParams.append(endpointConfig.searchParams.search, query);
  }
  
  const url = `${apiUrl}/api/${endpointConfig.path}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    // Structure the response based on the determined endpoint
    return {
      contacts: endpoint === 'contacts' ? result[endpointConfig.responseKey] : undefined,
      lists: endpoint === 'segments' ? result[endpointConfig.responseKey] : undefined,
      campaigns: endpoint === 'campaigns' ? result[endpointConfig.responseKey] : undefined,
      assets: endpoint === 'assets' ? result[endpointConfig.responseKey] : undefined,
      reports: endpoint === 'reports' ? result[endpointConfig.responseKey] : undefined,
      emails: endpoint === 'emails' ? result[endpointConfig.responseKey] : undefined,
      pages: endpoint === 'pages' ? result[endpointConfig.responseKey] : undefined,
      forms: endpoint === 'forms' ? result[endpointConfig.responseKey] : undefined
    };
  } catch (error) {
    console.error('Mautic API request failed:', error);
    throw new Error(`Failed to fetch from Mautic API: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
