import {
  Sparkles,
  Brain,
} from "lucide-react";

type Props = {
  title: string;
  subtitle: string;
  description: string;
};

export default function AssistantHero({
  title,
  subtitle,
  description,
}: Props) {
  return (
    <section
      className="
      rounded-3xl
      border
      border-white/10
      bg-gradient-to-br
      from-[#17112F]
      via-[#221B45]
      to-[#141127]
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

        <div
          className="
          flex
          h-14
          w-14
          items-center
          justify-center
          rounded-2xl
          bg-violet-500/20
          text-violet-300
          "
        >
          <Sparkles size={28} />
        </div>

        <div>

          <span
            className="
            text-xs
            font-bold
            uppercase
            tracking-widest
            text-violet-300
            "
          >
            AI SCOUT
          </span>

          <h1
            className="
            mt-1
            text-4xl
            font-black
            text-white
            "
          >
            {title}
          </h1>

        </div>

      </div>

      <p
        className="
        mt-6
        max-w-3xl
        text-lg
        text-zinc-400
        "
      >
        {subtitle}
      </p>

      <div
        className="
        mt-8
        flex
        items-center
        gap-3
        rounded-2xl
        bg-white/5
        p-4
        "
      >

        <Brain
          size={24}
          className="text-cyan-400"
        />

        <p className="text-sm text-zinc-300">
          {description}
        </p>

      </div>

    </section>
  );
}