import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
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
  __typename?: 'Block';
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

export type Mutation = {
  __typename?: 'Mutation';
  _empty?: Maybe<Scalars['String']['output']>;
  addUserToNote: Note;
  createNote: Note;
  createUser: User;
  deleteNote: Note;
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


export type MutationUpdateNoteArgs = {
  changes: UpdateNoteInput;
  id: Scalars['ID']['input'];
};

export type Note = {
  __typename?: 'Note';
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
  __typename?: 'Query';
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
  __typename?: 'Subscription';
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
  __typename?: 'User';
  color: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lastActive: Scalars['DateTime']['output'];
  name: Scalars['String']['output'];
};

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Block: ResolverTypeWrapper<Block>;
  BlockInput: BlockInput;
  BlockType: BlockType;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  CreateNoteInput: CreateNoteInput;
  CreateUserInput: CreateUserInput;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']['output']>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Mutation: ResolverTypeWrapper<{}>;
  Note: ResolverTypeWrapper<Note>;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Subscription: ResolverTypeWrapper<{}>;
  UpdateNoteInput: UpdateNoteInput;
  User: ResolverTypeWrapper<User>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Block: Block;
  BlockInput: BlockInput;
  Boolean: Scalars['Boolean']['output'];
  CreateNoteInput: CreateNoteInput;
  CreateUserInput: CreateUserInput;
  DateTime: Scalars['DateTime']['output'];
  ID: Scalars['ID']['output'];
  Int: Scalars['Int']['output'];
  Mutation: {};
  Note: Note;
  Query: {};
  String: Scalars['String']['output'];
  Subscription: {};
  UpdateNoteInput: UpdateNoteInput;
  User: User;
}>;

export type BlockResolvers<ContextType = any, ParentType extends ResolversParentTypes['Block'] = ResolversParentTypes['Block']> = ResolversObject<{
  content?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['BlockType'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  _empty?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  addUserToNote?: Resolver<ResolversTypes['Note'], ParentType, ContextType, RequireFields<MutationAddUserToNoteArgs, 'noteId' | 'userId'>>;
  createNote?: Resolver<ResolversTypes['Note'], ParentType, ContextType, RequireFields<MutationCreateNoteArgs, 'note'>>;
  createUser?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationCreateUserArgs, 'input'>>;
  deleteNote?: Resolver<ResolversTypes['Note'], ParentType, ContextType, RequireFields<MutationDeleteNoteArgs, 'id'>>;
  updateNote?: Resolver<ResolversTypes['Note'], ParentType, ContextType, RequireFields<MutationUpdateNoteArgs, 'changes' | 'id'>>;
}>;

export type NoteResolvers<ContextType = any, ParentType extends ResolversParentTypes['Note'] = ResolversParentTypes['Note']> = ResolversObject<{
  activeUsers?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType>;
  blocks?: Resolver<Array<ResolversTypes['Block']>, ParentType, ContextType>;
  color?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  content?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  created?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  createdBy?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  lastEdited?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  lastEditedBy?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  version?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  _empty?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  note?: Resolver<Maybe<ResolversTypes['Note']>, ParentType, ContextType, RequireFields<QueryNoteArgs, 'id'>>;
  notes?: Resolver<Array<ResolversTypes['Note']>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryUserArgs, 'id'>>;
  users?: Resolver<Maybe<Array<ResolversTypes['User']>>, ParentType, ContextType>;
}>;

export type SubscriptionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = ResolversObject<{
  _empty?: SubscriptionResolver<Maybe<ResolversTypes['String']>, "_empty", ParentType, ContextType>;
  noteUpdated?: SubscriptionResolver<Maybe<ResolversTypes['Note']>, "noteUpdated", ParentType, ContextType, RequireFields<SubscriptionNoteUpdatedArgs, 'id'>>;
}>;

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = ResolversObject<{
  color?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  lastActive?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = any> = ResolversObject<{
  Block?: BlockResolvers<ContextType>;
  DateTime?: GraphQLScalarType;
  Mutation?: MutationResolvers<ContextType>;
  Note?: NoteResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
}>;

