export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
};

export type Block = {
  content: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  type: BlockType;
};

export type BlockInput = {
  content: Scalars['String']['input'];
  id: Scalars['ID']['input'];
  type: BlockType;
};

export enum BlockType {
  BulletList = 'bulletList',
  Code = 'code',
  Heading1 = 'heading1',
  Heading2 = 'heading2',
  Heading3 = 'heading3',
  NumberedList = 'numberedList',
  Paragraph = 'paragraph',
  Quote = 'quote'
}

export type CreateNoteInput = {
  blocks: Array<BlockInput>;
  color: Scalars['String']['input'];
  content: Scalars['String']['input'];
  created: Scalars['DateTime']['input'];
  createdBy: Scalars['String']['input'];
  id: Scalars['String']['input'];
  lastEdited: Scalars['DateTime']['input'];
  lastEditedBy: Scalars['String']['input'];
  title: Scalars['String']['input'];
  version: Scalars['Int']['input'];
};

export type CreateUserInput = {
  color: Scalars['String']['input'];
  id: Scalars['ID']['input'];
  lastActive: Scalars['DateTime']['input'];
  name: Scalars['String']['input'];
};

export type LoginInput = {
  color: Scalars['String']['input'];
  id: Scalars['ID']['input'];
  lastActive: Scalars['DateTime']['input'];
  name: Scalars['String']['input'];
};

export type LoginResponse = {
  token: Scalars['String']['output'];
  user: User;
};

export type Mutation = {
  _empty?: Maybe<Scalars['String']['output']>;
  addUserToNote: Note;
  createNote: Note;
  /** @deprecated Use login instead */
  createUser: User;
  deleteNote: Note;
  login: LoginResponse;
  updateNote: Note;
};


export type MutationAddUserToNoteArgs = {
  noteId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
};


export type MutationCreateNoteArgs = {
  note: CreateNoteInput;
};


export type MutationCreateUserArgs = {
  input: CreateUserInput;
};


export type MutationDeleteNoteArgs = {
  id: Scalars['ID']['input'];
};


export type MutationLoginArgs = {
  input: LoginInput;
};


export type MutationUpdateNoteArgs = {
  changes: UpdateNoteInput;
  id: Scalars['ID']['input'];
};

export type Note = {
  activeUsers: Array<User>;
  blocks: Array<Block>;
  color: Scalars['String']['output'];
  content: Scalars['String']['output'];
  created: Scalars['DateTime']['output'];
  createdBy: Scalars['ID']['output'];
  id: Scalars['ID']['output'];
  lastEdited: Scalars['DateTime']['output'];
  lastEditedBy: Scalars['ID']['output'];
  title: Scalars['String']['output'];
  version: Scalars['Int']['output'];
};

export type Query = {
  _empty?: Maybe<Scalars['String']['output']>;
  note?: Maybe<Note>;
  notes: Array<Note>;
  user?: Maybe<User>;
  users?: Maybe<Array<User>>;
};


export type QueryNoteArgs = {
  id: Scalars['ID']['input'];
};


export type QueryUserArgs = {
  id: Scalars['ID']['input'];
};

export type Subscription = {
  _empty?: Maybe<Scalars['String']['output']>;
  noteUpdated?: Maybe<Note>;
};


export type SubscriptionNoteUpdatedArgs = {
  id: Scalars['ID']['input'];
};

export type UpdateNoteInput = {
  blocks?: InputMaybe<Array<BlockInput>>;
  color?: InputMaybe<Scalars['String']['input']>;
  lastEdited?: InputMaybe<Scalars['DateTime']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  version: Scalars['Int']['input'];
};

export type User = {
  color: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lastActive: Scalars['DateTime']['output'];
  name: Scalars['String']['output'];
};
