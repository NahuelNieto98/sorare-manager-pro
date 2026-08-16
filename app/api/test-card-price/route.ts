import { NextResponse } from "next/server";
import { getCardPrice } from "@/lib/sorare/getCardPrice";

export async function GET() {

  const result =
    await getCardPrice(
      "rob-schoofs-2024-rare-8",
      "",
      "rare"
    );

  return NextResponse.json({
    price: result,
  });

}
