//

export const CREATE_USER_MUTATION = `
mutation CreateUser($input: CreateUserInput!) {
  createUser(input: $input) {
    id
  }
}
`;

export const LOGIN_MUTATION = `
mutation Login($input: LoginInput!) {
  login(input: $input) {
    token
    user {
      id
      name
      color
    }
  }
}
`;
