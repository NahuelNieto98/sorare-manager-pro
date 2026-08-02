import { sorareRequest } from "../sorare";

const CURRENT_USER = `
query CurrentUser {
  currentUser {
    slug
    nickname
  }
}
`;

export async function getCurrentUser() {
  const data = await sorareRequest(CURRENT_USER);

  return data.data.currentUser;
}
