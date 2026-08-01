type Props = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
};

export default function Section({ title, subtitle, children }: Props) {
  return (
    <section className="mb-10">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-white">{title}</h2>

        {subtitle && <p className="mt-2 text-zinc-400">{subtitle}</p>}
      </div>

      {children}
    </section>
  );
}
