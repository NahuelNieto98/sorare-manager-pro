import { NextResponse } from "next/server";
import { sorareRequest } from "@/lib/sorare";

export async function GET() {

  const query = `

  query {

    __type(name:"AnyCardInterface") {

      fields {

        name

      }

    }

  }

  `;


  const result =
    await sorareRequest(
      query,
      {}
    );


  return NextResponse.json(result);

}