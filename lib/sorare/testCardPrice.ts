import { getAssetPrice } from "./getAssetPrice";


export async function test() {

  const price = await getAssetPrice(
    "0x04002bc3a4cfe3a2ac0ebf982fb27d04d43508cbe205cd9edda3c34fdff2d8c9"
  );


  console.log(
    "PRECIO FINAL:",
    price
  );

}