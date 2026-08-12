import { NextResponse } from "next/server";
import crypto from "crypto";


export async function GET(
request:Request
) {


const clientId =
process.env.SORARE_CLIENT_ID;


const redirectUri =
process.env.SORARE_REDIRECT_URI;



if(
!clientId ||
!redirectUri
){

return NextResponse.json(

{
error:"Faltan variables OAuth de Sorare",
},

{
status:500,
}

);

}





const state =
crypto
.randomBytes(32)
.toString("hex");

const { searchParams } =
new URL(request.url);

const locale =
searchParams.get("locale") || "es";

const safeLocale =
["es", "en", "fr"].includes(locale)
  ? locale
  : "es";





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



url.searchParams.set(
"state",
state
);






console.log(
"🔗 Sorare OAuth URL:",
url.toString()
);





const response =
NextResponse.redirect(
url.toString()
);



// Guardamos el state temporalmente
response.cookies.set(
"sorare_oauth_state",
state,
{
httpOnly:true,
secure:process.env.NODE_ENV==="production",
sameSite:"lax",
maxAge:600,
path:"/",
}
);

response.cookies.set(
"sorare_oauth_locale",
safeLocale,
{
httpOnly:true,
secure:process.env.NODE_ENV==="production",
sameSite:"lax",
maxAge:600,
path:"/",
}
);



return response;


}