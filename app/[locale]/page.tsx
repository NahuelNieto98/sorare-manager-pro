"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import {
  BarChart3,
  Bot,
  ChartCandlestick,
  Layers,
  Rocket,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";

export default function HomePage() {
  return (
    <main
      className="
      min-h-screen
      overflow-hidden
      bg-[#090714]
      text-white
      "
    >

      {/* HERO */}

      <section
        className="
        relative
        px-8
        py-24
        "
      >

        <div
          className="
          absolute
          -right-40
          -top-40
          h-96
          w-96
          rounded-full
          bg-violet-600/20
          blur-3xl
          "
        />

        <div
          className="
          absolute
          -left-40
          top-40
          h-96
          w-96
          rounded-full
          bg-blue-600/20
          blur-3xl
          "
        />


        <div
          className="
          relative
          mx-auto
          max-w-6xl
          text-center
          "
        >

          <div
            className="
            inline-flex
            items-center
            gap-2
            rounded-full
            border
            border-violet-500/30
            bg-violet-500/10
            px-5
            py-2
            text-sm
            font-bold
            text-violet-300
            "
          >
            <Sparkles size={16}/>

            Sorare Manager Pro Beta
          </div>



          <h1
            className="
            mt-8
            text-5xl
            font-black
            tracking-tight
            md:text-7xl
            "
          >
            Gestiona tu colección Sorare
            <span
              className="
              block
              bg-gradient-to-r
              from-violet-400
              to-blue-400
              bg-clip-text
              text-transparent
              "
            >
              como un profesional
            </span>
          </h1>



          <p
            className="
            mx-auto
            mt-8
            max-w-3xl
            text-xl
            leading-8
            text-zinc-400
            "
          >
            Analiza tu portfolio, controla tus cartas,
            descubre oportunidades de mercado y
            toma mejores decisiones con inteligencia.
          </p>



          <div
            className="
            mt-10
            flex
            flex-col
            justify-center
            gap-4
            sm:flex-row
            "
          >

            <button
              onClick={() =>
                signIn("google", {
                  callbackUrl: "/es/connect",
                })
              }
              className="
              rounded-2xl
              bg-gradient-to-r
              from-violet-600
              to-blue-600
              px-8
              py-4
              font-black
              transition
              hover:scale-105
              "
            >
              🚀 Empieza gratis
            </button>



            <Link
              href="/es/dashboard"
              className="
              rounded-2xl
              border
              border-white/10
              bg-white/5
              px-8
              py-4
              font-black
              transition
              hover:bg-white/10
              "
            >
              Ver demo
            </Link>

          </div>

        </div>

      </section>



      {/* FEATURES */}

      <section
        className="
        mx-auto
        max-w-6xl
        px-8
        pb-24
        "
      >

        <div
          className="
          grid
          gap-6
          md:grid-cols-2
          lg:grid-cols-4
          "
        >

          <Feature
            icon={<BarChart3 />}
            title="Dashboard"
            text="Toda tu colección controlada desde un solo lugar."
          />


          <Feature
            icon={<TrendingUp />}
            title="Portfolio"
            text="Analiza valor, ROI y rendimiento."
          />


          <Feature
            icon={<ChartCandlestick />}
            title="Market"
            text="Encuentra oportunidades en el mercado."
          />


          <Feature
            icon={<Bot />}
            title="Scout IA"
            text="Recomendaciones inteligentes para tu colección."
          />

        </div>

      </section>



      {/* PREVIEW */}

      <section
        className="
        mx-auto
        max-w-6xl
        px-8
        pb-24
        "
      >

        <div
          className="
          rounded-3xl
          border
          border-white/10
          bg-gradient-to-br
          from-[#17112F]
          to-[#0f0b1f]
          p-8
          "
        >

          <div
            className="
            flex
            items-center
            gap-3
            "
          >

            <Rocket className="text-violet-400"/>

            <h2 className="text-3xl font-black">
              Tu centro de control Sorare
            </h2>

          </div>


          <div
            className="
            mt-8
            grid
            gap-5
            md:grid-cols-3
            "
          >

            <PreviewCard
              title="Cartas"
              value="250+"
            />

            <PreviewCard
              title="Valor colección"
              value="€12.450"
            />

            <PreviewCard
              title="ROI"
              value="+24.8%"
            />

          </div>


        </div>

      </section>



      {/* ROADMAP */}

      <section
        className="
        mx-auto
        max-w-6xl
        px-8
        pb-24
        "
      >

        <div
          className="
          rounded-3xl
          border
          border-white/10
          bg-white/5
          p-8
          "
        >

          <h2 className="text-3xl font-black">
            🚀 Roadmap
          </h2>


          <div className="mt-8 space-y-4">

            <Roadmap
              title="Dashboard Premium"
              status="Completado"
              done
            />

            <Roadmap
              title="Portfolio Intelligence"
              status="En desarrollo"
            />

            <Roadmap
              title="Scout IA"
              status="Próximamente"
            />

            <Roadmap
              title="Market Scanner Pro"
              status="Próximamente"
            />

          </div>

        </div>

      </section>



      {/* CTA */}

      <section
        className="
        px-8
        pb-24
        text-center
        "
      >

        <ShieldCheck
          className="
          mx-auto
          text-green-400
          "
          size={40}
        />

        <h2 className="mt-6 text-4xl font-black">
          Únete a la beta pública
        </h2>


        <p className="mt-4 text-zinc-400">
          Ayuda a construir la herramienta definitiva para managers Sorare.
        </p>

      </section>


    </main>
  );
}



function Feature({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title:string;
  text:string;
}) {

  return (
    <div
      className="
      rounded-3xl
      border
      border-white/10
      bg-[#17112F]
      p-6
      "
    >

      <div className="text-violet-400">
        {icon}
      </div>


      <h3 className="mt-5 text-xl font-black">
        {title}
      </h3>


      <p className="mt-3 text-zinc-400">
        {text}
      </p>

    </div>
  );
}



function PreviewCard({
  title,
  value,
}:{
  title:string;
  value:string;
}) {

  return (
    <div
      className="
      rounded-2xl
      bg-white/5
      p-6
      "
    >
      <p className="text-zinc-400">
        {title}
      </p>

      <p className="mt-3 text-3xl font-black">
        {value}
      </p>

    </div>
  );
}



function Roadmap({
  title,
  status,
  done=false,
}:{
  title:string;
  status:string;
  done?:boolean;
}) {

  return (
    <div
      className="
      flex
      items-center
      justify-between
      rounded-2xl
      bg-white/5
      p-5
      "
    >

      <span className="font-bold">
        {done ? "✅" : "🚧"} {title}
      </span>

      <span className="text-sm text-zinc-400">
        {status}
      </span>

    </div>
  );
}