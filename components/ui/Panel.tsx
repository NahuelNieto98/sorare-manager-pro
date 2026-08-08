import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

export default function Panel({
  children,
  className = "",
}: Props) {
  return (
    <div
      className={`
        rounded-3xl
        border
        border-white/10
        bg-[#17112F]
        p-8
        shadow-xl
        transition-all
        duration-300
        ${className}
      `}
    >
      {children}
    </div>
  );
}