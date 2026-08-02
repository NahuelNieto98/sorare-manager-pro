"use client";

type Props = React.SelectHTMLAttributes<HTMLSelectElement>;

export default function Select(props: Props) {
  return (
    <select
      {...props}
      className="w-full rounded-xl border border-violet-700/30 bg-[#211A43] px-4 py-3 text-white outline-none transition focus:border-violet-500"
    />
  );
}
