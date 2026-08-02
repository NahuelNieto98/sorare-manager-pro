export const CURRENT_USER = `
query CurrentUser {
  currentUser {
    slug
    nickname
  }
}
`;

export const GET_USER_CARDS = `
query GetUserCards($slug: String!) {
  football {
    user(slug: $slug) {

      nickname

      cards(first: 200) {

        nodes {

          slug

          assetId

          season

          rarity

          player {

            displayName

            position

            pictureUrl

            averageScore(type: LAST_FIFTEEN)

            activeClub {
              name
            }

          }

        }

      }

    }

  }

}
`;
