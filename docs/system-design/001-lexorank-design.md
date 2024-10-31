# LexoRank System Design

## Overview

This document outlines the system design for implementing LexoRank-based note ordering in Mosaic. The system provides real-time, collaborative note reordering with offline support.

## System Components

```mermaid
flowchart TB
    subgraph Client["Client (React)"]
        UI["UI Components"]
        Store["Zustand Store"]
        LexoRank["LexoRank Utility"]
        Cache["IndexedDB Cache"]
    end

    subgraph Server["Server"]
        API["GraphQL API"]
        Resolver["Resolvers"]
        ORM["Drizzle ORM"]
        DB[(PostgreSQL)]
    end

    UI --> Store
    Store --> LexoRank
    Store --> Cache
    Store <--> API
    API --> Resolver
    Resolver --> ORM
    ORM --> DB
```

## Data Flow - Note Reordering

```mermaid
sequenceDiagram
    participant U as User
    participant C as Client
    participant L as LexoRank
    participant S as Store
    participant A as API
    participant D as Database

    U->>C: Drag note to new position
    C->>L: Calculate new rank
    L-->>C: Return new rank
    C->>S: Update local state
    S->>C: Render updated order
    C->>A: Send reorder mutation
    A->>D: Update note rank
    D-->>A: Confirm update
    A-->>C: Return success
    S->>C: Update sync status

```

## Data Flow - Adding New Note

```mermaid
sequenceDiagram
    participant U as User
    participant C as Client
    participant L as LexoRank
    participant S as Store
    participant A as API
    participant D as Database

    U->>C: Create new note
    C->>L: Generate rank (first/last)
    L-->>C: Return new rank
    C->>S: Add to local state
    S->>C: Render new note
    C->>A: Send create mutation
    A->>D: Insert note
    D-->>A: Return new note
    A-->>C: Confirm creation
    S->>C: Update sync status

```

## Data Model

```mermaid
erDiagram
    Note {
        uuid id PK
        string content
        string rank
        timestamp created_at
        timestamp updated_at
        string status
    }

    SyncQueue {
        uuid id PK
        uuid note_id FK
        string operation
        json payload
        timestamp created_at
        string status
    }

```

## Technical Details

### 1. LexoRank Implementation

```typescript
class LexoRank {
  // Character space for rank generation
  private static DIGITS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  // Core ranking methods
  static between(prev: string | null, next: string | null): string;
  static before(rank: string): string;
  static after(rank: string): string;
}
```

### 2. State Management Flow

```mermaid
stateDiagram-v2
    [*] --> Idle
    Idle --> Reordering: Drag Start
    Reordering --> CalculatingRank: Drop
    CalculatingRank --> UpdatingLocal: New Rank Generated
    UpdatingLocal --> SyncingServer: Optimistic Update
    SyncingServer --> Idle: Success
    SyncingServer --> Error: Network Failure
    Error --> RetryingSync: Retry
    RetryingSync --> SyncingServer
    Error --> Idle: Cancel

```

### 3. Rank Distribution Strategy

```mermaid
graph TD
    A[Initial Ranks] --> B{Empty List?}
    B -->|Yes| C[Use 'M']
    B -->|No| D{Position?}
    D -->|Start| E[Generate Before First]
    D -->|End| F[Generate After Last]
    D -->|Middle| G[Generate Between]
    E --> H[Update Store]
    F --> H
    G --> H

```

## System Characteristics

### Performance

- O(1) rank generation operations
- O(log n) database operations for reordering
- Minimal network payload size

### Scalability

- Supports thousands of notes per user
- Handles concurrent updates
- No global locks required

### Reliability

- Offline-first architecture
- Optimistic updates
- Conflict resolution handling

## Edge Cases and Solutions

### 1. Concurrent Edits

```mermaid
sequenceDiagram
    participant C1 as Client 1
    participant C2 as Client 2
    participant S as Server

    C1->>S: Reorder note A to rank "K"
    C2->>S: Reorder note B to rank "K"
    Note over S: Detect conflict
    S-->>C1: Accept "K"
    S-->>C2: Suggest "L"
    C2->>S: Confirm "L"

```

### 2. Rank Exhaustion

```typescript
// When ranks get too close
'A1' -> 'A2'  // Normal case
'A1' -> 'A1A' // When no room between A1 and A2
'A1' -> 'A1M' // When needing more space
```

### 3. Offline Operations

```mermaid
stateDiagram-v2
    [*] --> Online
    Online --> Offline: Connection Lost
    Offline --> Queueing: User Actions
    Queueing --> Offline
    Offline --> Syncing: Connection Restored
    Syncing --> Resolving: Conflicts Detected
    Resolving --> Online
    Syncing --> Online: No Conflicts

```

## Implementation Considerations

1. **Client-Side**

   - Optimistic updates for instant feedback
   - Local state management with Zustand
   - IndexedDB for offline persistence
   - Batch synchronization handling

2. **Server-Side**

   - Transactional updates
   - Conflict detection and resolution
   - Efficient index usage
   - Real-time event propagation

3. **Database**
   - Indexed rank column
   - Version control for sync
   - Audit trail for changes
   - Conflict resolution data

## Monitoring and Maintenance

### Key Metrics

- Rank generation time
- Sync latency
- Conflict rate
- Storage growth

### Health Checks

- Rank distribution monitoring
- Sync queue length
- Error rates
- Performance metrics
