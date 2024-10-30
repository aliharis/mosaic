//

export const UPDATE_NOTE_MUTATION = `
mutation UpdateNote($id: ID!, $changes: UpdateNoteInput!) {
  updateNote(id: $id, changes: $changes) {
    id
    version
  }
}
`;
