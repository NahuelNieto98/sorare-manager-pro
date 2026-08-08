const SORARE_API = "https://api.sorare.com/federation/graphql";



export async function sorareRequest(

  query: string,

  variables = {},

  accessToken?: string

) {



  const headers:any = {

    "Content-Type":
      "application/json",

    Accept:
      "application/json",

  };





  if(accessToken) {


    headers.Authorization =
      `Bearer ${accessToken}`;


  }







  const response = await fetch(

    SORARE_API,

    {

      method:"POST",


      headers,


      body:JSON.stringify({

        query,

        variables,

      }),


      cache:"no-store",

    }

  );







  const text =
    await response.text();







  let json:any = {};



  try {


    json =
      JSON.parse(text);


  } catch {


    json = {

      raw:text

    };


  }







  console.log(

    "STATUS:",

    response.status

  );





  if (

    json?.data?.currentUser?.cards?.nodes?.[0]

  ) {


    const fs =
      await import("fs");


    fs.writeFileSync(

      "sorare-test-card.json",


      JSON.stringify(

        json.data.currentUser.cards.nodes[0],

        null,

        2

      )

    );


  }







  if(!response.ok) {


    throw new Error(

      `Sorare API ${response.status}: ${text}`

    );


  }







  return json;


}