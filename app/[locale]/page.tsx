"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useState } from "react";

import {
  BarChart3,
  Bot,
  ChartCandlestick,
  Rocket,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  X,
} from "lucide-react";

export default function HomePage() {
  const t = useTranslations("home");
  const params = useParams();

  const locale = params.locale as string;

  const [showBrowserWarning, setShowBrowserWarning] =
    useState(false);

  function isInAppBrowser() {
    const userAgent =
      navigator.userAgent ||
      navigator.vendor ||
      "";

    return /Twitter|Instagram|FBAN|FBAV|FBIOS|TikTok|Line\/|Snapchat|Pinterest|LinkedInApp|Threads/i.test(
      userAgent
    );
  }

  function handleLogin() {
    if (isInAppBrowser()) {
      setShowBrowserWarning(true);
      return;
    }

    signIn("sorare", {
      callbackUrl: `/${locale}/dashboard`,
    });
  }

  return (
    <main className="relative min-h-screen overflow-hidden">
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
            <Sparkles size={16} />

            {t("badge")}
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
            {t("heroTitle")}

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
              {t("heroTitleHighlight")}
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
            {t("heroDescription")}
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
              type="button"
              onClick={handleLogin}
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
              🚀 {t("login")}
            </button>

            <Link
              href={`/${locale}/dashboard`}
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
              {t("demo")}
            </Link>
          </div>
        </div>
      </section>

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
            title={t("features.dashboard.title")}
            text={t("features.dashboard.text")}
          />

          <Feature
            icon={<TrendingUp />}
            title={t("features.portfolio.title")}
            text={t("features.portfolio.text")}
          />

          <Feature
            icon={<ChartCandlestick />}
            title={t("features.market.title")}
            text={t("features.market.text")}
          />

          <Feature
            icon={<Bot />}
            title={t("features.scout.title")}
            text={t("features.scout.text")}
          />
        </div>
      </section>

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
            <Rocket className="text-violet-400" />

            <h2 className="text-3xl font-black">
              {t("controlCenter")}
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
              title={t("stats.cards")}
              value="250+"
            />

            <PreviewCard
              title={t("stats.value")}
              value="€12.450"
            />

            <PreviewCard
              title={t("stats.roi")}
              value="+24.8%"
            />
          </div>
        </div>
      </section>

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
          {t("betaTitle")}
        </h2>

        <p className="mt-4 text-zinc-400">
          {t("betaDescription")}
        </p>
      </section>

      {showBrowserWarning && (
        <div
          className="
            fixed
            inset-0
            z-[100]
            flex
            items-center
            justify-center
            bg-black/70
            px-5
            backdrop-blur-md
          "
        >
          <div
            className="
              relative
              w-full
              max-w-md
              rounded-3xl
              border
              border-white/10
              bg-[#17112F]
              p-7
              shadow-2xl
            "
          >
            <button
              type="button"
              onClick={() => setShowBrowserWarning(false)}
              aria-label="Close"
              className="
                absolute
                right-5
                top-5
                rounded-xl
                p-2
                text-zinc-500
                transition
                hover:bg-white/5
                hover:text-white
              "
            >
              <X size={20} />
            </button>

            <div
              className="
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-2xl
                bg-violet-500/10
                text-2xl
              "
            >
              🌐
            </div>

            <h2
              className="
                mt-6
                pr-8
                text-2xl
                font-black
                text-white
              "
            >
              {t("mobileBrowser.title")}
            </h2>

            <p
              className="
                mt-4
                text-sm
                leading-6
                text-zinc-400
              "
            >
              {t("mobileBrowser.description")}
            </p>

            <div
              className="
                mt-5
                rounded-2xl
                border
                border-violet-500/20
                bg-violet-500/10
                p-4
              "
            >
              <p
                className="
                  text-sm
                  font-bold
                  leading-6
                  text-violet-200
              "
              >
                💡 {t("mobileBrowser.steps")}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowBrowserWarning(false)}
              className="
                mt-6
                w-full
                rounded-2xl
                bg-gradient-to-r
                from-violet-600
                to-blue-600
                px-6
                py-4
                font-black
                text-white
                transition
                hover:scale-[1.01]
              "
            >
              {t("mobileBrowser.back")}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

function Feature({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div
      className="
        rounded-3xl
        border
        border-white/10
        bg-white/5
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
}: {
  title: string;
  value: string;
}) {
  return (
    <div
      className="
        rounded-2xl
        bg-white/5
        p-5
      "
    >
      <p className="text-zinc-400">
        {title}
      </p>

      <p
        className="
          mt-3
          text-3xl
          font-black
        "
      >
        {value}
      </p>
    </div>
  );
}
