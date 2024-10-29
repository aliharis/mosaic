export interface Block {
  id: string;
  type:
    | "paragraph"
    | "heading1"
    | "heading2"
    | "heading3"
    | "bulletList"
    | "numberedList"
    | "quote"
    | "code";
  content: string;
}

export interface Label {
  id: string;
  name: string;
  color: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  color: string;
  version: number;
  lastEdited: Date;
  blocks: Block[];
  activeUsers: User[];
}

export interface User {
  id: string;
  name: string;
  color: string;
  lastActive: Date;
}

export interface UpdatePayload {
  noteId: string;
  changes: Partial<Note>;
  version: number;
  userId: string;
}
