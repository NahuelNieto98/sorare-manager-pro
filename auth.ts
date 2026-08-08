import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";

import { prisma } from "@/lib/prisma";


export const {
  handlers,
  auth,
  signIn,
  signOut,
} = NextAuth({

  debug:true,

  trustHost:true,


  adapter: PrismaAdapter(prisma),


  providers:[

    Google({

      clientId:
        process.env.AUTH_GOOGLE_ID!,

      clientSecret:
        process.env.AUTH_GOOGLE_SECRET!,

    }),

  ],



  session:{

    strategy:"database",

  },


  callbacks: {

    async redirect({ url, baseUrl }) {

      if (url.includes("/api/auth")) {

        return `${baseUrl}/es/connect`;

      }


      if (url.startsWith(baseUrl)) {

        return url;

      }


      return `${baseUrl}/es/connect`;

    },

  },


});