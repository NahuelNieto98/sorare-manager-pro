"use client";

import * as React from "react";
import clsx from "clsx";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "default" | "sm" | "lg" | "icon" | "icon-sm";
}

export function Button({
  children,
  variant = "primary",
  size = "default",
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={clsx(
        "inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none",

        // Tamaños
        {
          "px-5 py-3 text-sm": size === "default",
          "px-3 py-2 text-sm": size === "sm",
          "px-6 py-4 text-base": size === "lg",
          "h-10 w-10": size === "icon",
          "h-8 w-8": size === "icon-sm",
        },

        // Variantes
        {
          "bg-violet-600 hover:bg-violet-500 text-white":
            variant === "primary",

          "bg-zinc-800 hover:bg-zinc-700 text-white":
            variant === "secondary",

          "bg-red-600 hover:bg-red-500 text-white":
            variant === "danger",

          "bg-transparent hover:bg-zinc-800 text-zinc-300":
            variant === "ghost",
        },

        className
      )}
    >
      {children}
    </button>
  );
}

export default Button;