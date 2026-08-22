import { prisma } from "@/lib/prisma";

const SORARE_API =
  "https://api.sorare.com/graphql";

const SORARE_TOKEN_API =
  "https://api.sorare.com/oauth/token";

async function refreshSorareToken(
  accessToken: string
) {
  /*
   * =====================================================
   * BUSCAR CUENTA SORARE
   * =====================================================
   *
   * El Market históricamente utiliza SorareAccount,
   * mientras que Auth.js guarda las credenciales OAuth
   * en Account.
   *
   * Primero localizamos SorareAccount por el token que
   * estamos intentando utilizar.
   */

  const sorareAccount =
    await prisma.sorareAccount.findFirst({
      where: {
        accessToken,
      },
    });

  /*
   * =====================================================
   * BUSCAR CREDENCIALES AUTH.JS
   * =====================================================
   */

  const authAccount =
    sorareAccount
      ? await prisma.account.findFirst({
          where: {
            userId:
              sorareAccount.userId,

            provider:
              "sorare",
          },
        })
      : await prisma.account.findFirst({
          where: {
            provider:
              "sorare",

            access_token:
              accessToken,
          },
        });

  /*
   * =====================================================
   * REFRESH TOKEN
   * =====================================================
   *
   * Preferimos el refresh token de Auth.js porque es el
   * sistema que realmente está gestionando el OAuth.
   *
   * Si no existe, utilizamos el de SorareAccount como
   * fallback para mantener compatibilidad con cuentas
   * antiguas.
   */

  const refreshToken =
    authAccount?.refresh_token ??
    sorareAccount?.refreshToken ??
    null;

  if (!refreshToken) {
    console.error(
      "❌ No existe refresh token de Sorare"
    );

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

  /*
   * =====================================================
   * SOLICITAR NUEVO TOKEN
   * =====================================================
   */

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
              refreshToken,
          }),
      }
    );

  const data =
    await response.json();

  if (!response.ok) {
    console.error(
      "❌ SORARE REFRESH ERROR:",
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
    refreshToken;

  if (!newAccessToken) {
    throw new Error(
      "Sorare no devolvió un nuevo access token"
    );
  }

  /*
   * =====================================================
   * CADUCIDAD
   * =====================================================
   */

  const expiresAt =
    data.expires_in
      ? Math.floor(
          Date.now() / 1000
        ) +
        Number(
          data.expires_in
        )
      : null;

  /*
   * =====================================================
   * ACTUALIZAR AUTH.JS
   * =====================================================
   */

  if (authAccount) {
    await prisma.account.update({
      where: {
        provider_providerAccountId: {
          provider:
            authAccount.provider,

          providerAccountId:
            authAccount.providerAccountId,
        },
      },

      data: {
        access_token:
          newAccessToken,

        refresh_token:
          newRefreshToken,

        expires_at:
          expiresAt,

        token_type:
          data.token_type ??
          authAccount.token_type,

        scope:
          data.scope ??
          authAccount.scope,
      },
    });
  }

  /*
   * =====================================================
   * ACTUALIZAR SORARE ACCOUNT
   * =====================================================
   *
   * Mantenemos ambos registros sincronizados porque
   * partes antiguas de la aplicación todavía utilizan
   * SorareAccount.
   */

  if (sorareAccount) {
    await prisma.sorareAccount.update({
      where: {
        id:
          sorareAccount.id,
      },

      data: {
        accessToken:
          newAccessToken,

        refreshToken:
          newRefreshToken,
      },
    });
  }

  console.log(
    "✅ Sorare access token renovado correctamente"
  );

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
    json =
      JSON.parse(text);
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

  /*
   * =====================================================
   * PRIMERA PETICIÓN
   * =====================================================
   */

  let result =
    await executeRequest(
      query,
      variables,
      currentAccessToken
    );

  /*
   * =====================================================
   * DETECTAR TOKEN INVÁLIDO
   * =====================================================
   */

  const unauthorized =
    result.json?.errors?.some(
      (error: any) => {
        const code =
          error?.extensions?.code;

        const message =
          String(
            error?.message ?? ""
          ).toLowerCase();

        return (
          code ===
            "UNAUTHORIZED" ||
          message.includes(
            "invalid token"
          ) ||
          message.includes(
            "not enough or too many segments"
          ) ||
          message.includes(
            "unauthorized"
          )
        );
      }
    );

  /*
   * =====================================================
   * REFRESH AUTOMÁTICO
   * =====================================================
   */

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

      /*
       * Repetimos exactamente la misma consulta
       * utilizando el nuevo token.
       */

      result =
        await executeRequest(
          query,
          variables,
          currentAccessToken
        );
    }
  }

  /*
   * =====================================================
   * ERROR HTTP
   * =====================================================
   */

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

  /*
   * =====================================================
   * ERROR GRAPHQL
   * =====================================================
   */

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