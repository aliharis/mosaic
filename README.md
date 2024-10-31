# Mosaic - Real-time Collaborative Notes System

Mosaic is a modern, real-time collaborative notes system built with scalability and performance in mind. It features a robust architecture that supports simultaneous editing, custom note ordering, and seamless offline capabilities.

🚧 **Coming Soon**

- Smart drag-and-drop note organization using LexoRank
- Optimized performance with debounced sync and efficient caching
- Enhanced collaboration (cursors, rich text, version history)
- Full offline support with CRDT-based sync
- Advanced organization (hierarchical notes, tags, search)
- Security features (E2E encryption, access controls, team sharing)

## Technical Stack

- **Frontend**

  - React
  - TypeScript
  - TailwindCSS
  - GraphQL/WebSocket Client
  - Zustand for state management
  - Vite/Vitest

- **Backend**
  - Node.js
  - TypeScript
  - GraphQL Yoga
  - WebSocket Server
  - PostgreSQL with Drizzle ORM

## Project Status

The project is currently in active development with basic real-time collaboration features implemented.

## Project Structure

```
/
├── apps/
│   ├── web/          # Frontend web application
│   │   └── ...
│   └── api/          # GraphQL API
│       └── ...
├── package.json
└── pnpm-workspace.yaml
```

## Prerequisites

- Node.js 18 or higher
- PNPM 8 or higher

## Getting Started

1. Install dependencies

```bash
pnpm install
```

2. Start all applications

```bash
pnpm dev
```

Or start individual applications:

```bash
# Start web app only
pnpm dev:web

# Start API server only
pnpm dev:api
```

## Available Scripts

- `pnpm dev` - Start all applications in development mode
- `pnpm build` - Build all applications
- `pnpm dev:web` - Start only the web application
- `pnpm dev:api` - Start only the API server

## Applications

### Web Application

- Port: 3000
- Tech Stack: Vite, React, Tailwind

### API Server

- Port: 4000
- GraphQL Playground: http://localhost:4000/graphql
- Tech Stack: GraphQL Yoga, Drizzle

## Development

The project uses PNPM workspaces to manage the monorepo. Dependencies are shared and hoisted to the root when possible.
