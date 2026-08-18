import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

import { getUserCards } from "@/lib/sorare/getUserCards";
import { refreshSorareAccessToken } from "@/lib/sorare/refreshAccessToken";
import { importGallery } from "@/lib/sorare/importGallery";
import { calculateGalleryValue } from "@/lib/gallery";

import { getSeason } from "@/lib/transactions/seasons";


export async function POST() {

  console.log(
    "🚀 API SYNC LLAMADA"
  );

  try {

    const session =
      await auth();

    console.log(
      "SESSION:",
      session?.user?.email
    );

    if (!session?.user?.email) {

      return NextResponse.json(
        {
          error: "No autorizado",
        },
        {
          status: 401,
        }
      );

    }

    const user =
      await prisma.user.findUnique({

        where: {
          email:
            session.user.email,
        },

        include: {
          sorareAccount: true,
        },

      });

    if (!user) {

      return NextResponse.json(
        {
          error: "Usuario no encontrado",
        },
        {
          status: 404,
        }
      );

    }

    console.log(
      "SORARE ACCOUNT:",
      user.sorareAccount?.slug
    );

    if (!user.sorareAccount) {

      return NextResponse.json(
        {
          error: "Sin cuenta Sorare",
        },
        {
          status: 400,
        }
      );

    }

    const accessToken =
      user.sorareAccount.accessToken;

    if (!accessToken) {

      return NextResponse.json(
        {
          error:
            "La cuenta Sorare no tiene token OAuth",
        },
        {
          status: 400,
        }
      );

    }

    console.log(
      "🔐 Usando OAuth Sorare"
    );

    console.time(
      "⏱️ GET USER CARDS"
    );

    let cards;

    try {

      cards =
        await getUserCards(
          accessToken
        );

    } catch (error: any) {

      const message =
        error?.message ?? "";

      if (
        message.includes("Unauthorized") ||
        message.includes("Invalid token")
      ) {

        const refreshToken =
          user.sorareAccount.refreshToken;

        if (!refreshToken) {

          throw new Error(
            "El token Sorare ha caducado y no existe refresh token. Vuelve a conectar Sorare."
          );

        }

        console.log(
          "🔄 Access token inválido. Renovando OAuth..."
        );

        const newAccessToken =
          await refreshSorareAccessToken(
            user.id,
            refreshToken
          );

        cards =
          await getUserCards(
            newAccessToken
          );

      } else {

        throw error;

      }

    }

    console.timeEnd(
      "⏱️ GET USER CARDS"
    );

    console.log(
      "🃏 CARTAS RECIBIDAS:",
      cards.length
    );

    console.time(
      "⏱️ IMPORT GALLERY"
    );

    await importGallery(
      user.id,
      cards
    );

    console.timeEnd(
      "⏱️ IMPORT GALLERY"
    );


    /*
     * ============================================================
     * SNAPSHOT INICIAL DE TEMPORADA
     * ============================================================
     *
     * Solo se crea si todavía no existe un snapshot
     * para esta temporada.
     *
     * La sincronización de galería es el punto de partida.
     */

    const now =
      new Date();

    const season =
      [
        "2026-27",
        "2025-26",
        "2024-25",
        "2023-24",
      ]
        .map((id) =>
          getSeason(id)
        )
        .find((item) => {

          if (!item) {
            return false;
          }

          const timestamp =
            now.getTime();

          return (
            timestamp >=
              new Date(
                item.start
              ).getTime() &&
            timestamp <
              new Date(
                item.end
              ).getTime()
          );

        }) ?? null;


    if (season) {

      const existingSnapshot =
        await prisma.portfolioSnapshot.findFirst({

          where: {
            userId:
              user.id,

            seasonId:
              season.id,
          },

          orderBy: {
            createdAt: "asc",
          },

        });


      if (!existingSnapshot) {

        const syncedCards =
          await prisma.card.findMany({

            where: {
              ownerId:
                user.id,
            },

          });


        const galleryValue =
          calculateGalleryValue(
            syncedCards
          );


        await prisma.portfolioSnapshot.create({

          data: {

            userId:
              user.id,

            galleryValue,

            roi: 0,

            profit: 0,

            seasonId:
              season.id,

          },

        });


        console.log(
          "📸 SNAPSHOT INICIAL CREADO:",
          season.id,
          "| GALERÍA:",
          galleryValue
        );

      } else {

        console.log(
          "📸 SNAPSHOT INICIAL YA EXISTE:",
          season.id
        );

      }

    }


    console.log(
      "✅ SYNC FINALIZADA"
    );

    return NextResponse.json({

      success: true,

      cards:
        cards.length,

    });

  } catch (error: any) {

    console.error(
      "❌ ERROR SYNC:",
      error
    );

    return NextResponse.json(
      {
        error:
          error.message,
      },
      {
        status: 500,
      }
    );

  }

}
