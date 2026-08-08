import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

import { testPlayerFields } from "@/lib/sorare/testPlayerFields";


export async function GET(){


const session = await auth();


if(!session?.user?.email){

return NextResponse.json(

{
error:"No autorizado"
},

{
status:401
}

);

}



const user = await prisma.user.findUnique({

where:{
email:session.user.email
},

include:{
sorareAccount:true
}

});



if(!user?.sorareAccount?.accessToken){

return NextResponse.json(

{
error:"Sin token Sorare"
},

{
status:400
}

);

}



const result = await testPlayerFields(

user.sorareAccount.accessToken

);



return NextResponse.json(result);


}