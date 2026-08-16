import { prisma } from "@/lib/prisma";

export async function refreshSorareAccessToken(
  userId: string,
  refreshToken: string
) {
  const clientId = process.env.SORARE_CLIENT_ID;
  const clientSecret = process.env.SORARE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Faltan variables OAuth de Sorare");
  }

  const response = await fetch(
    "https://api.sorare.com/oauth/token",
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
      }),
      cache: "no-store",
    }
  );

  const data = await response.json();

  if (!response.ok || !data.access_token) {
    throw new Error(
      data?.error_description ??
        data?.error ??
        "No se pudo renovar el token Sorare"
    );
  }

  await prisma.sorareAccount.update({
    where: {
      userId,
    },
    data: {
      accessToken: data.access_token,
      ...(data.refresh_token
        ? {
            refreshToken: data.refresh_token,
          }
        : {}),
    },
  });

  console.log("🔄 TOKEN SORARE RENOVADO");

  return data.access_token as string;
}
