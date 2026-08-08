import { ReactNode } from "react";

type Props = {
  title: string;
  subtitle?: string;
  action?: ReactNode;
};

export default function PageHeader({
  title,
  subtitle,
  action,
}: Props) {
  return (
    <div
      className="
      mb-8
      flex
      flex-col
      gap-6
      lg:flex-row
      lg:items-center
      lg:justify-between
      "
    >
      <div>
        <h1
          className="
          text-4xl
          font-black
          tracking-tight
          text-white
          "
        >
          {title}
        </h1>

        {subtitle && (
          <p
            className="
            mt-3
            max-w-3xl
            text-lg
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