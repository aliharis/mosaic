# Architecture Decision Record (ADR): API Project Structure

## Status

Accepted

## Date

2024-10-28

## Context

We need to establish a scalable and maintainable structure for our GraphQL API project that handles all our operations. The system needs to support real-time collaboration, data persistence, and efficient query resolution.

## Decision

We have decided to implement a layered architecture with clear separation of concerns using the following structure:

```
/apps/api/
├── src/
│   ├── config/            # Configuration management
│   │   ├── database.ts    # Database connection configuration
│   │   └── env.ts        # Environment variable validation
│   │
│   ├── db/               # Database layer
│   │   ├── migrations/   # Database migrations
│   │   ├── schema.ts     # Drizzle schema definitions
│   │   └── migrate.ts    # Migration utility
│   │
│   ├── schemas/          # GraphQL schemas
│   │   └── types/
│   │       ├── base.graphql    # Base types and scalars
│   │       ├── user.graphql    # User-related schemas
│   │       ├── note.graphql    # Note-related schemas
│   │       └── block.graphql   # Block-related schemas
│   │
│   ├── resolvers/        # GraphQL resolvers
│   │   ├── index.ts      # Resolver aggregation
│   │   ├── user.ts       # User-related resolvers
│   │   └── note.ts       # Note-related resolvers
│   │
│   ├── services/         # Business logic layer
│   │   ├── user.service.ts
│   │   └── note.service.ts
│   │
│   ├── middleware/       # GraphQL middleware
│   │   ├── auth.ts
│   │   └── logging.ts
│   │
│   └── utils/            # Utility functions
│       ├── errors.ts
│       └── validation.ts
```

### Key Components

1. **Config Layer**

   - Purpose: Centralizes configuration management
   - Components:
     - Database connection setup
     - Environment variable validation
     - Application constants

2. **Database Layer**

   - Technology: Drizzle ORM with PostgreSQL
   - Components:
     - Schema definitions using Drizzle
     - Migration management
     - Type-safe query building
   - Benefits:
     - Type safety
     - Simple migration management
     - Efficient query building
     - JSON column support for blocks

3. **GraphQL Layer**

   - Schema Organization:
     - Modular schema files by domain
     - Base types and scalars
     - Clear type definitions
   - Resolver Organization:
     - Domain-driven resolver separation
     - Efficient data loading
     - Clear responsibility boundaries

4. **Service Layer**

   - Purpose: Business logic isolation
   - Responsibilities:
     - Data validation
     - Business rule implementation
     - Complex operations
   - Benefits:
     - Reusable business logic
     - Easier testing
     - Clear separation from resolvers

5. **Middleware Layer**

   - Purpose: Cross-cutting concerns
   - Components:
     - Authentication/Authorization
     - Logging
     - Error handling
     - Performance monitoring

6. **Utilities Layer**
   - Purpose: Shared functionality
   - Components:
     - Error handling utilities
     - Validation helpers
     - Common functions

## Technical Decisions

1. **GraphQL Implementation**

   - Using GraphQL Yoga for:
     - Modern GraphQL server
     - Built-in WebSocket support
     - Good performance characteristics
     - Easy extensibility

2. **Database Access**

   - Using Drizzle ORM for:
     - Type-safe database operations
     - Simple migration management
     - Efficient query building
     - Good PostgreSQL support

3. **Type Safety**

   - TypeScript throughout the codebase
   - Generated types from GraphQL schema
   - Type-safe database queries with Drizzle

4. **Data Structure**
   - Notes stored with JSON blocks for flexibility
   - Many-to-many relationship for user-note associations
   - Efficient querying of related data

## Consequences

### Positive

- Clear separation of concerns
- Scalable architecture
- Type safety throughout
- Easy to test components
- Modular and maintainable
- Clear data flow
- Easy to add new features

### Negative

- More initial setup required
- Need to maintain type definitions
- Learning curve for new developers
- Multiple layers to navigate

## Future Considerations

1. **Caching Strategy**

   - Implementation of DataLoader
   - Redis caching layer
   - Query result caching

2. **Real-time Updates**

   - WebSocket implementation
   - Subscription resolvers
   - Real-time collaboration

3. **Performance Optimization**

   - Query optimization
   - Connection pooling
   - Batch operations

4. **Monitoring and Logging**
   - Error tracking
   - Performance monitoring
   - Audit logging

## Implementation Notes

1. **Setting Up New Features**

   ```typescript
   // 1. Define GraphQL schema
   // schemas/types/feature.graphql

   // 2. Create resolver
   // resolvers/feature.ts

   // 3. Add service layer
   // services/feature.service.ts

   // 4. Update database schema if needed
   // db/schema.ts
   ```

2. **Best Practices**
   - Keep resolvers thin
   - Business logic in services
   - Use middleware for cross-cutting concerns
   - Follow naming conventions
   - Document complex operations
   - Write tests for all layers
