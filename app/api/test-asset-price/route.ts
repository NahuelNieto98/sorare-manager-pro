import { NextResponse } from "next/server";
import { getAssetPrice } from "@/lib/sorare/getAssetPrice";


export async function GET() {


  const price =
    await getAssetPrice(
      "0x0400f2f911965148ce8c2e7d7add45dd48a34cd9db628a48b67ef06b0ad41061"
    );


  return NextResponse.json({
    price,
  });

}