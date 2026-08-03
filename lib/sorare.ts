const SORARE_API = "https://api.sorare.com/graphql";

export async function sorareRequest(query: string, variables = {}) {
  const response = await fetch(SORARE_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query,
      variables,
    }),
    cache: "no-store",
  });

  const text = await response.text();

console.log("STATUS:", response.status);
console.log("BODY:", text);

if (!response.ok) {
  throw new Error(`Sorare API ${response.status}: ${text}`);
}

return JSON.parse(text);
}
