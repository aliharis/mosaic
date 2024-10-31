# Architecture Decision Record: LexoRank for Note Ordering

## Status

Accepted

## Date

31 October 2024

## Context

Mosaic needs to support custom sorting/ordering of notes with drag-and-drop functionality. Requirements include:

- Efficient database operations when reordering
- Support for real-time collaboration in the future
- Integration with existing React DnD implementation
- Compatible with our GraphQL API and Drizzle ORM stack
- Support for offline-first operations in future

## Decision

We will use LexoRank algorithm for generating and managing sort orders in Mosaic.

## Technical Details

### Database Schema (Drizzle ORM)

```typescript
import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";

export const notes = pgTable("notes", {
  id: uuid("id").defaultRandom().primaryKey(),
  content: text("content").notNull(),
  rank: text("rank").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Index for efficient sorting
export const notesIndexes = pgIndex("notes_rank_idx", notes.rank);
```

### Implementation Examples

#### 1. LexoRank Core Implementation

```typescript
/**
 * Represents a lexicographically orderable rank string.
 * Implementation inspired by JIRA's LexoRank algorithm for ordering issues.
 */
interface ILexoRank {
  /**
   * Generates a rank string between two existing ranks.
   * @param prev - The rank string of the previous item (or null if first)
   * @param next - The rank string of the next item (or null if last)
   * @returns A new rank string that sorts between prev and next
   */
  between(prev: string | null, next: string | null): string;

  /**
   * Generates a rank string that comes before the given rank.
   * @param rank - The rank to generate a predecessor for
   * @returns A new rank string that sorts before the input rank
   */
  before(rank: string): string;

  /**
   * Generates a rank string that comes after the given rank.
   * @param rank - The rank to generate a successor for
   * @returns A new rank string that sorts after the input rank
   */
  after(rank: string): string;

  /**
   * Generates a sequence of ranks for an array of items.
   * @param count - Number of ranks to generate
   * @returns Array of evenly spaced rank strings
   */
  initialOrderedRanks(count: number): string[];
}
```

#### 2. GraphQL Schema

```graphql
type Mutation {
  reorderNote(id: ID!, beforeId: ID, afterId: ID): Note!
}
```

#### 3. React DnD Integration

```typescript
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useNotesStore } from "../stores/notesStore";

export const NotesList = () => {
  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const { draggableId, source, destination } = result;

    const sortedNotes = [...notes].sort((a, b) => a.rank.localeCompare(b.rank));
    const beforeId =
      destination.index > 0 ? sortedNotes[destination.index - 1].id : null;
    const afterId =
      destination.index < sortedNotes.length
        ? sortedNotes[destination.index].id
        : null;

    await reorderNote(draggableId, beforeId, afterId);
  };
};
```

## Alternatives Considered

### 1. Integer Positions

- **Approach**: Store position as integers (1, 2, 3...)
- **Pros**:
  - Simple to understand
  - Easy to implement
- **Cons**:
  - Requires updating multiple records when reordering
  - Poor performance at scale
  - Problematic for concurrent updates
- **Why Not**: Would require table locks and multiple updates per reorder

### 2. Floating Point Positions

- **Approach**: Use floating point numbers for positions
- **Pros**:
  - Simple implementation
  - Single record update per reorder
- **Cons**:
  - Potential floating point precision issues
  - May require periodic rebalancing
  - Not ideal for concurrent updates
- **Why Not**: Precision issues could cause problems with frequent reordering

### 3. Linked List

- **Approach**: Store previous/next references
- **Pros**:
  - Natural representation of order
  - Efficient reordering
- **Cons**:
  - Complex queries for getting ordered items
  - Difficult to maintain consistency
  - Poor performance for range queries
- **Why Not**: Query complexity and performance issues

## Consequences

### Positive

- Single database update per reorder operation
- Efficient sorting using standard database indexes
- Natural support for concurrent updates
- No need for periodic rebalancing in practice
- Simple integration with existing stack

### Negative

- Slightly more complex initial implementation
- Rank strings can grow in length over time (though rarely an issue in practice)
- Additional storage space for rank strings (minimal impact)

### Neutral

- Requires understanding of LexoRank algorithm for maintenance
- Need to handle edge cases in rank generation
