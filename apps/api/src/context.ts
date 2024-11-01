import { YogaInitialContext } from "graphql-yoga";
import { getAuthenticatedUser } from "./utils/auth";

export interface MyContext {
  currentUser: null | string;
}

export async function createContext(
  initialContext: YogaInitialContext
): Promise<MyContext> {
  return {
    currentUser: await getAuthenticatedUser(initialContext.request),
  };
}
