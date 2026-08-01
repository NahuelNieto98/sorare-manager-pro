export const GET_USER_CARDS = `
query GetUserCards($slug: String!) {
  football {
    user(slug: $slug) {
      nickname

      cards(first: 50) {
        nodes {
          slug
          assetId
          season
          rarity

          player {
            displayName
            position
            pictureUrl

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

export const CURRENT_USER = `
query CurrentUser {
  currentUser {
    slug
    nickname
  }
}
`;
