import { NextResponse } from "next/server";
import { auth } from "@/auth";
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


const result = await testPlayerFields(
process.env.SORARE_ACCESS_TOKEN!
);


return NextResponse.json(result);

}