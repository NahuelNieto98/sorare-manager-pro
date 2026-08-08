import Card from "./card";

type Props = {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  subtitle?: string;
  valueColor?: string;
};

export default function StatCard({
  title,
  value,
  icon,
  subtitle,
  valueColor = "text-white",
}: Props) {
  return (
    <Card className="h-full">

      {icon && (
        <div className="mb-5 text-violet-300">
          {icon}
        </div>
      )}

      <p className="text-sm text-zinc-400">
        {title}
      </p>

      <h3
        className={`mt-2 text-4xl font-black ${valueColor}`}
      >
        {value}
      </h3>

      {subtitle && (
        <p className="mt-3 text-sm text-zinc-500">
          {subtitle}
        </p>
      )}

    </Card>
  );
}