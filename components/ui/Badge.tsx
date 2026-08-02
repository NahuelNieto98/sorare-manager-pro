type Props = {
  children: React.ReactNode;
};

export default function Badge({ children }: Props) {
  return (
    <span className="rounded-full bg-violet-600/20 px-3 py-1 text-xs font-semibold text-violet-300">
      {children}
    </span>
  );
}
