//

export const CREATE_NOTE_MUTATION = `
mutation CreateNote($note: CreateNoteInput!) {
  createNote(note: $note) {
    id
    version
  }
}
`;

export const DELETE_NOTE_MUTATION = `
mutation DeleteNote($id: ID!) {
  deleteNote(id: $id) {
    id
  }
}
`;

export const UPDATE_NOTE_MUTATION = `
mutation UpdateNote($id: ID!, $changes: UpdateNoteInput!) {
  updateNote(id: $id, changes: $changes) {
    id
    version
  }
}
`;
