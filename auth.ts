import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";

import { prisma } from "@/lib/prisma";



const SorareProvider = {

  id: "sorare",

  name: "Sorare",

  type: "oauth" as const,


  authorization: {
    url: "https://sorare.com/oauth/authorize",

    params: {
      scope: "read",
      response_type: "code",
    },

  },


  token: {

    url: "https://api.sorare.com/oauth/token",


  },


  userinfo: {

    url: "https://api.sorare.com/graphql",


    async request({
      tokens,
    }:any) {


      const response =
        await fetch(
          "https://api.sorare.com/graphql",
          {

            method:"POST",

            headers:{

              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${tokens.access_token}`,

            },


            body:JSON.stringify({

              query:`

                query {

                  currentUser {

                    slug

                    nickname

                  }

                }

              `

            })

          }

        );



      const data =
        await response.json();



      const user =
        data.data.currentUser;



      return {

        id:user.slug,

        name:
          user.nickname ??
          user.slug,


        email:
          `${user.slug}@sorare.local`,


      };


    },


  },



  clientId:
    process.env.SORARE_CLIENT_ID,


  clientSecret:
    process.env.SORARE_CLIENT_SECRET,



};


export const {

  handlers,

  auth,

  signIn,

  signOut,

} = NextAuth({



  debug:true,


  trustHost:true,



  adapter:
    PrismaAdapter(prisma),



  providers:[

    SorareProvider,

  ],



  session:{

    strategy:"database",

  },



  callbacks:{



    async redirect({
      baseUrl
    }){


      return `${baseUrl}/es/dashboard`;


    },


  },


});