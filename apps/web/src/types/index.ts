export interface Block {
  id: string;
  type: 'paragraph' | 'heading1' | 'heading2' | 'heading3' | 'bulletList' | 'numberedList' | 'quote' | 'code';
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
  pinned: boolean;
  labels: Label[];
}

export interface User {
  id: string;
  name: string;
  color: string;
  lastActive: Date;
}

export interface LiveNote extends Note {
  activeUsers: User[];
  lastEdited: Date;
  blocks: Block[];
}