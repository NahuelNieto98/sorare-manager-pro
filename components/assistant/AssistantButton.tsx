import { Sparkles } from "lucide-react";

type Props = {
  onClick: () => void;
  loading: boolean;
  label: string;
  loadingLabel: string;
};

export default function AssistantButton({
  onClick,
  loading,
  label,
  loadingLabel,
}: Props) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="
      mt-8
      flex
      w-full
      items-center
      justify-center
      gap-3
      rounded-2xl
      bg-violet-600
      py-4
      font-bold
      text-white
      transition
      hover:bg-violet-500
      disabled:opacity-50
      "
    >

      <Sparkles size={20} />

      {loading ? loadingLabel : label}

    </button>
  );
}