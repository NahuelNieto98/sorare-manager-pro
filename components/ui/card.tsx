type Props = {
  children: React.ReactNode;
  className?: string;
};

export default function Card({ children, className = "" }: Props) {
  return (
    <div
      className={`
      rounded-3xl
      border
      border-violet-700/30
      bg-gradient-to-br
      from-[#181530]
      via-[#211A43]
      to-[#141127]
      p-6
      shadow-lg
      ${className}
      `}
    >
      {children}
    </div>
  );
}
