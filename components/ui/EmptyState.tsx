import { ReactNode } from "react";

type Props = {
  title: string;
  description: string;
  icon?: ReactNode;
};

export default function EmptyState({
  title,
  description,
  icon,
}: Props) {
  return (
    <div
      className="
      flex
      flex-col
      items-center
      justify-center
      rounded-3xl
      border
      border-dashed
      border-white/10
      bg-[#17112F]
      px-8
      py-16
      text-center
      "
    >
      {icon && (
        <div
          className="
          mb-6
          flex
          h-16
          w-16
          items-center
          justify-center
          rounded-full
          bg-white/5
          text-violet-300
          "
        >
          {icon}
        </div>
      )}

      <h3 className="text-2xl font-black text-white">
        {title}
      </h3>

      <p
        className="
        mt-3
        max-w-md
        text-zinc-400
        "
      >
        {description}
      </p>
    </div>
  );
}