import jwt from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "../config/auth";
import { Plugin } from "graphql-yoga";

// Define which operations are public
const PUBLIC_OPERATIONS = ["LOGIN", "NOTES"];

/**
 * Get the authenticated user from the request
 * @param request
 * @returns
 */
export async function getAuthenticatedUser(
  request: Request
): Promise<string | null> {
  const header = request.headers.get("authorization");
  if (!header) {
    return null;
  }

  const token = header.split(" ")[1];
  const tokenPayload = jwt.verify(token, JWT_SECRET) as JwtPayload;
  const userId = tokenPayload.userId;

  // TODO: Check if the user exists
  // and return the user object

  return userId;
}

/**
 * Envelope middleware to check if the user is authenticated
 * @returns
 */
export function useAuth(): Plugin {
  return {
    async onRequest({ request, fetchAPI, endResponse }) {
      // Check if the request has an authorization header
      const header = request.headers.get("authorization");

      // Allow requests to the root path
      const path = request.url.split("/").pop();
      if (!path || path == "") {
        return;
      }

      if (!header) {
        try {
          // Parse the request body to get the operation name
          const body = await request.json();
          const operationName = body?.operationName?.toUpperCase();

          // If the operation is public, allow it to proceed
          if (operationName && PUBLIC_OPERATIONS.includes(operationName)) {
            return; // short-circuit for public operations
          }
        } catch (error) {
          // Handle invalid JSON or missing body
        }

        // End response immediately with UNAUTHENTICATED status
        return endResponse(
          new fetchAPI.Response(
            JSON.stringify({
              errors: [
                {
                  message: "You must be logged in.",
                  extensions: { code: "UNAUTHENTICATED" },
                },
              ],
            }),
            {
              status: 401,
              headers: { "Content-Type": "application/json" },
            }
          )
        );
      }

      // If an authorization header exists, proceed with token validation
      const token = header.split(" ")[1];
      try {
        const tokenPayload = jwt.verify(token, JWT_SECRET) as JwtPayload;
      } catch (error) {
        return endResponse(
          new fetchAPI.Response(
            JSON.stringify({
              errors: [{ message: "Invalid token." }],
            }),
            { status: 401, headers: { "Content-Type": "application/json" } }
          )
        );
      }
    },
  };
}
