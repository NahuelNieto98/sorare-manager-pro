import { NextResponse } from "next/server";
import { getAssetPrice } from "@/lib/sorare/getAssetPrice";

export async function GET() {

  const price =
    await getAssetPrice(
      "0x04006d23c9ea5bd73961e76b41d1bbf4e0ced3187b284f355d9c470a5d955b1f",
      undefined,
      "jorge-resurreccion-merodio",
      2026
    );

  return NextResponse.json({
    price,
  });

}
