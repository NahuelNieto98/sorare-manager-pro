import { GraphQLClient } from "graphql-request";

export const sorareClient = new GraphQLClient(
  "https://api.sorare.com/federation/graphql",
);
