"use client";

import { signIn } from "next-auth/react";

export default function GoogleSignInButton() {
  return (
    <button
      onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
      className="rounded-xl bg-purple-600 px-8 py-4 text-lg font-semibold transition hover:bg-purple-500"
    >
      🚀 Prueba gratis 14 días
    </button>
  );
}