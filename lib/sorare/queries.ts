import { gql } from "graphql-request";

export const CURRENT_USER = gql`
  query CurrentUser {
    currentUser {
      slug
      nickname
    }
  }
`;
