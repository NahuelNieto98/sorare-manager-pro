"use client";

import Link from "next/link";

export default function GalleryEmpty(){

return (

<div
className="
rounded-3xl
border
border-white/10
bg-[#17112F]
p-10
text-center
"
>

<div className="text-5xl">
🚀
</div>


<h2
className="
mt-5
text-3xl
font-black
text-white
"
>
Tu colección está vacía
</h2>


<p
className="
mx-auto
mt-4
max-w-xl
text-zinc-400
"
>
Conecta tu cuenta de Sorare y sincroniza tu colección
para empezar a analizar el valor de tus cartas,
rendimiento y estadísticas.
</p>


<Link

href="/connect-sorare"

className="
mt-8
inline-flex
rounded-xl
bg-purple-600
px-8
py-3
font-bold
text-white
transition
hover:bg-purple-500
"

>

🔗 Conectar Sorare

</Link>


</div>

);

}