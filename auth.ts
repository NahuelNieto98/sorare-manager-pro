import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  debug: true,

  adapter: PrismaAdapter(prisma),

  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],

  session: {
    strategy: "database",
  },

  pages: {
    error: "/auth/error",
  },

  logger: {
    error(error: Error) {
      console.error("[AUTH ERROR]", error);
    },

    warn(code: string) {
      console.warn("[AUTH WARN]", code);
    },

    debug(code: string, metadata?: unknown) {
      console.log("[AUTH DEBUG]", code, metadata);
    },
  },
});