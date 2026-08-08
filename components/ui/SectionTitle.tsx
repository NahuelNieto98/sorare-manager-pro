import { ReactNode } from "react";

type Props = {
  title: string;
  subtitle?: string;
  action?: ReactNode;
};

export default function SectionTitle({
  title,
  subtitle,
  action,
}: Props) {
  return (
    <div
      className="
      mb-6
      flex
      items-start
      justify-between
      gap-6
      "
    >
      <div>
        <h2
          className="
          text-2xl
          font-black
          tracking-tight
          text-white
          "
        >
          {title}
        </h2>

        {subtitle && (
          <p
            className="
            mt-2
            text-zinc-400
            "
          >
            {subtitle}
          </p>
        )}
      </div>

      {action && (
        <div className="shrink-0">
          {action}
        </div>
      )}
    </div>
  );
}