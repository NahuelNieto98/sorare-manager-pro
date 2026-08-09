import { NextResponse } from "next/server";

export async function GET() {

  const clientId =
    process.env.SORARE_CLIENT_ID;

  const redirectUri =
    process.env.SORARE_REDIRECT_URI;


  if (!clientId || !redirectUri) {

    return NextResponse.json(
      {
        error: "Faltan variables OAuth de Sorare",
      },
      {
        status: 500,
      }
    );

  }


  const url =
    new URL(
      "https://sorare.com/oauth/authorize"
    );


  url.searchParams.set(
    "client_id",
    clientId
  );


  url.searchParams.set(
    "redirect_uri",
    redirectUri.trim()
  );


  url.searchParams.set(
    "response_type",
    "code"
  );


  url.searchParams.set(
    "scope",
    "read"
  );


  url.searchParams.set(
    "prompt",
    "consent"
  );


  console.log(
    "🔗 Sorare OAuth URL:",
    url.toString()
  );


  return NextResponse.redirect(
    url.toString()
  );

}