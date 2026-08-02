"use client";

import clsx from "clsx";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger";
};

export default function Button({
  children,
  variant = "primary",
  className,
  ...props
}: Props) {
  return (
    <button
      {...props}
      className={clsx(
        "rounded-xl px-5 py-3 font-semibold transition-all duration-200 disabled:opacity-50",
        {
          "bg-violet-600 hover:bg-violet-500 text-white": variant === "primary",

          "bg-zinc-800 hover:bg-zinc-700 text-white": variant === "secondary",

          "bg-red-600 hover:bg-red-500 text-white": variant === "danger",
        },
        className,
      )}
    >
      {children}
    </button>
  );
}
