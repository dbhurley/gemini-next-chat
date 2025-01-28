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

// Define valid endpoints and their configurations
const ENDPOINTS = {
  contacts: {
    path: 'contacts',
    searchParam: 'search',
    responseKey: 'contacts'
  },
  segments: {
    path: 'segments',
    searchParam: 'search',
    responseKey: 'lists'
  }
} as const;

type EndpointKey = keyof typeof ENDPOINTS;

export async function handle({ endpoint, query }: { endpoint: EndpointKey | string; query?: string; }): Promise<ZionResponse> {
  const apiUrl = process.env.NEXT_PUBLIC_ZION_API_URL
  const apiUser = process.env.NEXT_PUBLIC_ZION_API_USER
  const apiPassword = process.env.NEXT_PUBLIC_ZION_API_PASSWORD

  if (!apiUrl || !apiUser || !apiPassword) {
    throw new Error('Zion API credentials not configured')
  }

  // Validate and get endpoint configuration
  const endpointConfig = ENDPOINTS[endpoint as EndpointKey];
  if (!endpointConfig) {
    throw new Error(`Invalid endpoint: ${endpoint}. Valid endpoints are: ${Object.keys(ENDPOINTS).join(', ')}`);
  }

  const auth = Buffer.from(`${apiUser}:${apiPassword}`).toString('base64')
  
  // Build URL with proper query parameters
  const queryParams = new URLSearchParams();
  if (query) {
    queryParams.append(endpointConfig.searchParam, query);
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
    
    // Structure the response based on the endpoint
    return {
      contacts: endpointConfig.responseKey === 'contacts' ? result[endpointConfig.responseKey] : undefined,
      lists: endpointConfig.responseKey === 'lists' ? result[endpointConfig.responseKey] : undefined
    };
  } catch (error) {
    console.error('Zion API request failed:', error);
    throw new Error(`Failed to fetch from Zion API: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
