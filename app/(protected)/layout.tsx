import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/common/Header";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  return (
    <main className="min-h-screen bg-[#0F0B1F] text-white flex">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Header />

        <section className="flex-1 p-8">{children}</section>
      </div>
    </main>
  );
}
