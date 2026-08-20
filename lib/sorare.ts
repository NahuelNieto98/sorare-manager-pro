import { prisma } from "@/lib/prisma";

const SORARE_API =
  "https://api.sorare.com/graphql";

const SORARE_TOKEN_API =
  "https://api.sorare.com/oauth/token";


async function refreshSorareToken(
  accessToken: string
) {
  const account =
    await prisma.sorareAccount.findFirst({
      where: {
        accessToken,
      },
    });

  if (
    !account?.refreshToken
  ) {
    return null;
  }

  const clientId =
    process.env.SORARE_CLIENT_ID;

  const clientSecret =
    process.env.SORARE_CLIENT_SECRET;

  if (
    !clientId ||
    !clientSecret
  ) {
    throw new Error(
      "Faltan SORARE_CLIENT_ID o SORARE_CLIENT_SECRET"
    );
  }

  const response =
    await fetch(
      SORARE_TOKEN_API,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/x-www-form-urlencoded",
        },

        body:
          new URLSearchParams({
            grant_type:
              "refresh_token",

            client_id:
              clientId,

            client_secret:
              clientSecret,

            refresh_token:
              account.refreshToken,
          }),
      }
    );

  const data =
    await response.json();

  if (!response.ok) {
    console.error(
      "SORARE REFRESH ERROR:",
      data
    );

    throw new Error(
      "No se pudo renovar el token de Sorare"
    );
  }

  const newAccessToken =
    data.access_token;

  const newRefreshToken =
    data.refresh_token ??
    account.refreshToken;

  if (!newAccessToken) {
    throw new Error(
      "Sorare no devolvió un nuevo access token"
    );
  }

  await prisma.sorareAccount.update({
    where: {
      id: account.id,
    },

    data: {
      accessToken:
        newAccessToken,

      refreshToken:
        newRefreshToken,
    },
  });

  return newAccessToken;
}


async function executeRequest(
  query: string,
  variables: any,
  accessToken?: string
) {
  const headers: Record<
    string,
    string
  > = {
    "Content-Type":
      "application/json",

    Accept:
      "application/json",
  };

  if (accessToken) {
    headers.Authorization =
      `Bearer ${accessToken}`;
  }

  const response =
    await fetch(
      SORARE_API,
      {
        method: "POST",

        headers,

        body:
          JSON.stringify({
            query,
            variables,
          }),

        cache: "no-store",
      }
    );

  const text =
    await response.text();

  let json: any = {};

  try {
    json = JSON.parse(text);
  } catch {
    json = {
      raw: text,
    };
  }

  console.log(
    "SORARE API STATUS:",
    response.status
  );

  return {
    response,
    json,
    text,
  };
}


export async function sorareRequest(
  query: string,
  variables = {},
  accessToken?: string
) {
  let currentAccessToken =
    accessToken;

  let result =
    await executeRequest(
      query,
      variables,
      currentAccessToken
    );


  /*
   * Si Sorare rechaza el token,
   * intentamos renovarlo automáticamente.
   */

  const unauthorized =
    result.json?.errors?.some(
      (error: any) =>
        error?.extensions?.code ===
          "UNAUTHORIZED" ||
        String(
          error?.message ?? ""
        ).toLowerCase().includes(
          "invalid token"
        )
    );


  if (
    unauthorized &&
    currentAccessToken
  ) {
    console.log(
      "🔄 Sorare access token inválido. Intentando renovar..."
    );

    const refreshedToken =
      await refreshSorareToken(
        currentAccessToken
      );

    if (refreshedToken) {
      currentAccessToken =
        refreshedToken;

      result =
        await executeRequest(
          query,
          variables,
          currentAccessToken
        );
    }
  }


  if (
    !result.response.ok
  ) {
    const error =
      new Error(
        `Sorare API ${result.response.status}: ${result.text}`
      );

    (error as any).status =
      result.response.status;

    throw error;
  }


  if (
    result.json?.errors?.length
  ) {
    console.error(
      "SORARE GRAPHQL ERRORS:",
      JSON.stringify(
        result.json.errors,
        null,
        2
      )
    );
  }


  return result.json;
}
