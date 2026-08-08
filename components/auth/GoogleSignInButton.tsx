"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function GoogleSignInButton() {

  const [loading, setLoading] = useState(false);


  async function handleLogin() {

    try {

      setLoading(true);


      await signIn("google", {
        callbackUrl: "/es/connect",
      });


    } catch (error) {

      console.error("Error login Google:", error);
      setLoading(false);

    }

  }



  return (

    <button
      onClick={handleLogin}
      disabled={loading}
      className="
      rounded-xl
      bg-purple-600
      px-8
      py-4
      text-lg
      font-semibold
      transition
      hover:bg-purple-500
      disabled:opacity-50
      "
    >

      {loading
        ? "Conectando..."
        : "🚀 Prueba gratis 14 días"
      }


    </button>

  );

}