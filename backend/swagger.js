// Static OpenAPI 3.0 document served at /api-docs via swagger-ui-express
const openapiDocument = {
  openapi: '3.0.3',
  info: {
    title: 'DeskFlow API',
    description: 'Internal IT Service Request Portal - REST API',
    version: '1.0.0',
  },
  servers: [{ url: '/api', description: 'Base API path' }],
  tags: [
    { name: 'Auth', description: 'Authentication endpoints' },
    { name: 'Tickets', description: 'IT service request (ticket) endpoints' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
    },
    schemas: {
      LoginRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', example: 'employee@deskflow.com' },
          password: { type: 'string', example: 'password123' },
        },
      },
      LoginResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          token: { type: 'string' },
          user: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              email: { type: 'string' },
              role: { type: 'string', enum: ['Employee', 'Admin'] },
            },
          },
        },
      },
      TicketInput: {
        type: 'object',
        required: ['title', 'description', 'priority'],
        properties: {
          title: { type: 'string', example: 'VPN not connecting' },
          description: { type: 'string', example: 'Cannot connect to the office VPN since this morning.' },
          priority: { type: 'string', enum: ['Low', 'Medium', 'High'], example: 'High' },
        },
      },
      Ticket: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          title: { type: 'string' },
          description: { type: 'string' },
          priority: { type: 'string', enum: ['Low', 'Medium', 'High'] },
          status: { type: 'string', enum: ['Open', 'In Progress', 'Resolved'] },
          createdBy: { type: 'string' },
          createdByName: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      StatusUpdate: {
        type: 'object',
        required: ['status'],
        properties: {
          status: { type: 'string', enum: ['Open', 'In Progress', 'Resolved'] },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string' },
        },
      },
    },
  },
  paths: {
    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Log in as an Employee or Admin',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginRequest' } } },
        },
        responses: {
          200: {
            description: 'Login successful',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginResponse' } } },
          },
          400: { description: 'Missing email or password', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          401: { description: 'Invalid credentials', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
    },
    '/tickets': {
      post: {
        tags: ['Tickets'],
        summary: 'Create a new ticket (Employee only)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/TicketInput' } } },
        },
        responses: {
          201: { description: 'Ticket created', content: { 'application/json': { schema: { $ref: '#/components/schemas/Ticket' } } } },
          400: { description: 'Validation error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          401: { description: 'Not authorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          403: { description: 'Forbidden - not an Employee', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
      get: {
        tags: ['Tickets'],
        summary: "List tickets (Employees see own tickets, Admins see all)",
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'A list of tickets' },
          401: { description: 'Not authorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
    },
    '/tickets/{id}': {
      put: {
        tags: ['Tickets'],
        summary: 'Update a ticket status (Admin only)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        ],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/StatusUpdate' } } },
        },
        responses: {
          200: { description: 'Ticket updated', content: { 'application/json': { schema: { $ref: '#/components/schemas/Ticket' } } } },
          400: { description: 'Invalid status', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          403: { description: 'Forbidden - not an Admin', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          404: { description: 'Ticket not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
    },
  },
};

module.exports = openapiDocument;
