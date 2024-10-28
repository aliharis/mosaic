# mosaic

This monorepo for Mosaic contains a web application and GraphQL API server.

## Project Structure

```
/
├── apps/
│   ├── web/          # Frontend web application
│   │   └── ...
│   └── api/          # GraphQL Yoga server
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
