import { sorareClient } from "./client";
import { CURRENT_USER } from "./queries";

export async function getCurrentUser(token: string) {
  sorareClient.setHeader("Authorization", `Bearer ${token}`);

  return sorareClient.request(CURRENT_USER);
}
