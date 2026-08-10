export default function Loading() {

return (

<main
className="
min-h-screen
bg-[#0b0718]
flex
items-center
justify-center
"
>

<div
className="
text-center
"
>

<h2
className="
text-2xl
font-bold
text-white
"
>
Sorare Manager Pro
</h2>


<p
className="
mt-3
text-zinc-400
"
>
Cargando...
</p>


<div
className="
mx-auto
mt-6
h-8
w-8
animate-spin
rounded-full
border-4
border-violet-500
border-t-transparent
"
/>


</div>

</main>

);

}