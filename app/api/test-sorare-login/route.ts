import { NextResponse } from "next/server";
import { getSorareToken } from "@/lib/sorare/auth";


export async function GET() {

  const result = await getSorareToken();


  return NextResponse.json(
    result
  );

}