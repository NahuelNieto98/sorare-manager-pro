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

    <main
      className="
      flex
      min-h-screen
      bg-[#0F0B1F]
      text-white
      "
    >


      <Sidebar />



      <div
        className="
        flex
        min-h-screen
        flex-1
        flex-col
        "
      >


        <div
          className="
          sticky
          top-0
          z-50
          "
        >

          <Header />

        </div>





        <section
          className="
          flex-1
          overflow-y-auto
          bg-[#0F0B1F]
          p-8
          "
        >


          <div
            className="
            mx-auto
            max-w-[1600px]
            "
          >

            {children}

          </div>


        </section>


      </div>


    </main>

  );
}