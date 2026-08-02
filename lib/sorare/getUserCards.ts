import { sorareRequest } from "../sorare";

const GET_USER_CARDS = `
query GetUserCards($slug:String!){

football{

user(slug:$slug){

cards(first:500){

nodes{

slug

assetId

season

rarity

player{

displayName

position

pictureUrl

activeClub{

name

}

}

}

}

}

}

}
`;

export async function getUserCards(slug: string) {
  const data = await sorareRequest(GET_USER_CARDS, {
    slug,
  });

  return data.data.football.user.cards.nodes;
}
