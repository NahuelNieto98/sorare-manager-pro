const SORARE_API = "https://api.sorare.com/graphql";


const SIGN_IN = `
mutation SignIn(
  $email: String!,
  $password: String!
) {

  signIn(
    input: {
      email: $email
      password: $password
    }
  ) {

    currentUser {
      slug
    }

    tcuToken

  }

}
`;


export async function getSorareToken() {

  const response = await fetch(
    SORARE_API,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({

        query: SIGN_IN,

        variables: {

          email:
            process.env.SORARE_EMAIL,

          password:
            process.env.SORARE_PASSWORD,

        },

      }),

    }
  );


  const data =
    await response.json();


  console.log(
    "SORARE LOGIN:",
    JSON.stringify(
      data,
      null,
      2
    )
  );


  return data;

}