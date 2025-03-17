import { YogaInitialContext, GraphQLParams } from "graphql-yoga";
import { parse, OperationDefinitionNode, Kind, GraphQLError } from "graphql";
import { verifyToken } from '@clerk/backend'

// Define the public fields (case-sensitive)
const PUBLIC_FIELDS = new Set(["login"]);

interface AuthenticatedUser {
  id: string;
}

export interface MyContext extends YogaInitialContext {
  currentUser: AuthenticatedUser | null;
}

async function validateToken(token: string): Promise<AuthenticatedUser | null> {
  try {
    const verifiedToken = await verifyToken(token, {
      jwtKey: process.env.CLERK_JWT_KEY,
    })

    return {
      id: verifiedToken.sub,
    };
  } catch (error) {
    console.log("Error validating token:", error);
    return null;
  }
}

async function isPublicOperation(params: GraphQLParams): Promise<boolean> {
  try {
    if (!params.query) {
      return false;
    }

    // Parse the GraphQL query
    const documentNode = parse(params.query);

    // Check each operation in the document
    for (const definition of documentNode.definitions) {
      if (definition.kind === Kind.OPERATION_DEFINITION) {
        const operation = definition as OperationDefinitionNode;

        // Get the selection set
        const selections = operation.selectionSet.selections;

        // Check if any of the top-level fields are public
        for (const selection of selections) {
          if (selection.kind === Kind.FIELD) {
            const fieldName = selection.name.value;
            if (PUBLIC_FIELDS.has(fieldName)) {
              return true;
            }
          }
        }
      }
    }

    return false;
  } catch (error) {
    console.error("Error parsing GraphQL query:", error);
    return false;
  }
}

export async function createContext(
  initialContext: YogaInitialContext
): Promise<MyContext> {
  const { request, params } = initialContext;

  // Check if it's a public operation by inspecting the actual GraphQL query
  const isPublic = await isPublicOperation(params);
  if (isPublic) {
    return {
      ...initialContext,
      currentUser: null,
    };
  }

  // Check root path
  const path = new URL(request.url).pathname.split("/").pop();
  if (!path || path === "") {
    return {
      ...initialContext,
      currentUser: null,
    };
  }

  // Get authorization header
  const authHeader = request.headers.get("authorization");
  if (!authHeader) {
    // Return a GraphQL error
    throw new GraphQLError("You must be logged in.", {
      extensions: {
        code: "UNAUTHENTICATED",
      },
    });
  }

  // Validate token
  const token = authHeader.split(" ")[1];
  const user = await validateToken(token);

  if (!user) {
    throw new GraphQLError("Invalid token.", {
      extensions: {
        code: "UNAUTHENTICATED",
      },
    });
  }

  return {
    ...initialContext,
    currentUser: user,
  };
}
