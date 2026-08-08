import { ReactNode } from "react";

type Color =
  | "green"
  | "red"
  | "yellow"
  | "blue"
  | "purple"
  | "gray";

type Props = {
  children: ReactNode;
  color?: Color;
};

const colors: Record<Color, string> = {
  green:
    "bg-green-500/10 text-green-400 border-green-500/20",

  red:
    "bg-red-500/10 text-red-400 border-red-500/20",

  yellow:
    "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",

  blue:
    "bg-blue-500/10 text-blue-400 border-blue-500/20",

  purple:
    "bg-violet-500/10 text-violet-300 border-violet-500/20",

  gray:
    "bg-white/5 text-zinc-300 border-white/10",
};

export default function Badge({
  children,
  color = "gray",
}: Props) {
  return (
    <span
      className={`
        inline-flex
        items-center
        rounded-full
        border
        px-3
        py-1
        text-xs
        font-bold
        ${colors[color]}
      `}
    >
      {children}
    </span>
  );
}