import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request
) {

  const session =
    await auth();


  if(!session?.user?.email) {

    return NextResponse.redirect(
      new URL(
        "/login",
        request.url
      )
    );

  }


  const { searchParams } =
    new URL(request.url);


  const code =
    searchParams.get("code");


  if(!code) {

    return NextResponse.json(
      {
        error:"No se recibió código OAuth",
      },
      {
        status:400,
      }
    );

  }


  const clientId =
    process.env.SORARE_CLIENT_ID;


  const clientSecret =
    process.env.SORARE_CLIENT_SECRET;


  const redirectUri =
    process.env.SORARE_REDIRECT_URI;


  if(
    !clientId ||
    !clientSecret ||
    !redirectUri
  ) {

    return NextResponse.json(
      {
        error:"Faltan variables OAuth",
      },
      {
        status:500,
      }
    );

  }


  console.log(
    "🔑 OAuth callback datos:",
    {
      clientId,
      redirectUri,
      codeLength: code.length,
    }
  );


  const tokenResponse =
    await fetch(
      "https://api.sorare.com/oauth/token",
      {
        method:"POST",

        headers:{
          "Content-Type":
            "application/x-www-form-urlencoded",
        },

        body:
          new URLSearchParams({

            grant_type:
              "authorization_code",

            client_id:
              clientId,

            client_secret:
              clientSecret,

            code,

            redirect_uri:
              redirectUri.trim(),

          }),

      }
    );


  const tokenData =
    await tokenResponse.json();


  console.log(
    "🔐 TOKEN RESPONSE:",
    JSON.stringify(
      tokenData,
      null,
      2
    )
  );


  if(!tokenResponse.ok) {

    return NextResponse.json(
      {
        error:"No se pudo obtener token Sorare",
        details:tokenData,
      },
      {
        status:500,
      }
    );

  }


  const accessToken =
    tokenData.access_token;


  const refreshToken =
    tokenData.refresh_token;



  const user =
    await prisma.user.findUnique({

      where:{
        email:
          session.user.email,
      },

    });



  if(!user) {

    return NextResponse.json(
      {
        error:"Usuario no encontrado",
      },
      {
        status:404,
      }
    );

  }



  const meQuery = `
    query {
      currentUser {
        slug
        nickname
      }
    }
  `;



  const meResponse =
    await fetch(
      "https://api.sorare.com/graphql",
      {

        method:"POST",

        headers:{

          "Content-Type":
            "application/json",

          Authorization:
            `Bearer ${accessToken}`,

        },

        body:JSON.stringify({

          query:meQuery,

        }),

      }
    );



  const meData =
    await meResponse.json();



  console.log(
    "👤 SORARE USER COMPLETO:",
    JSON.stringify(
      meData,
      null,
      2
    )
  );



  const currentUser =
    meData.data?.currentUser;



  const slug =
    currentUser?.slug;



  if(!slug) {

    return NextResponse.json(
      {
        error:
          "No se pudo obtener usuario Sorare",
        details:meData,
      },
      {
        status:500,
      }
    );

  }



  await prisma.sorareAccount.upsert({

    where:{
      userId:user.id,
    },


    update:{

      slug,

      accessToken,

      refreshToken,

    },


    create:{

      userId:user.id,

      slug,

      accessToken,

      refreshToken,

    },

  });



  console.log(
    "✅ Sorare conectado:",
    slug
  );



  return NextResponse.redirect(
  new URL(
    "/es/dashboard",
    request.url
  )
);

}