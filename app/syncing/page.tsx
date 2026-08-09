import Link from "next/link";
import GoogleSignInButton from "@/components/auth/GoogleSignInButton";
import { getTranslations } from "next-intl/server";


export default async function HomePage(){


const t = await getTranslations("home");



const features = [
t("featureGallery"),
t("featureROI"),
t("featureRewards"),
t("featureEssence"),
t("featureTransactions"),
t("featureStats"),
t("featureInventory"),
t("featureSync"),
];



return (

<main
className="
min-h-screen
bg-[#0F0B1F]
text-white
"
>




<header
className="
mx-auto
flex
max-w-7xl
items-center
justify-between
px-8
py-6
"
>


<h1 className="text-2xl font-bold text-purple-400">

Sorare Manager Pro

</h1>




<nav className="flex items-center gap-6">


<a
href="#features"
className="text-zinc-300 hover:text-white"
>

{t("features")}

</a>



<a
href="#pricing"
className="text-zinc-300 hover:text-white"
>

{t("pricing")}

</a>



<GoogleSignInButton />



</nav>


</header>









<section
className="
mx-auto
flex
max-w-7xl
flex-col
items-center
px-8
pt-24
text-center
"
>



<span
className="
rounded-full
border
border-purple-700
bg-purple-900/30
px-4
py-2
text-sm
text-purple-300
"
>

🚀 {t("badge")}

</span>







<h2
className="
mt-8
max-w-4xl
text-6xl
font-extrabold
leading-tight
"
>


{t("heroStart")}

{" "}

<span className="text-purple-400">

Sorare

</span>


<br/>


{t("heroEnd")}


</h2>







<p
className="
mt-8
max-w-2xl
text-xl
text-zinc-400
"
>

{t("description")}

</p>







<div
className="
mt-12
flex
gap-4
"
>


<GoogleSignInButton />





<Link
href="/es/dashboard"
className="
rounded-xl
border
border-zinc-700
px-8
py-4
text-lg
hover:border-purple-500
"
>

{t("demo")}

</Link>




</div>



</section>









<section
id="features"
className="
mx-auto
mt-32
grid
max-w-7xl
grid-cols-2
gap-6
px-8
lg:grid-cols-4
"
>


{

features.map((feature)=>(


<div

key={feature}

className="
rounded-2xl
border
border-purple-900
bg-[#17112F]
p-6
"

>


<p className="font-semibold">

{feature}

</p>



</div>


))


}



</section>









<section

id="pricing"

className="
mx-auto
mt-32
mb-24
max-w-3xl
px-8
text-center
"

>



<h3 className="text-4xl font-bold">

{t("startFree")}

</h3>





<p className="mt-4 text-zinc-400">

{t("pricingDescription")}

</p>







<div

className="
mt-10
rounded-3xl
border
border-purple-800
bg-[#17112F]
p-10
"

>



<h4 className="text-2xl font-bold">

{t("proPlan")}

</h4>







<p className="
mt-6
text-6xl
font-extrabold
">

€9.99


<span className="text-xl text-zinc-400">

/mes

</span>


</p>







<button

className="
mt-8
rounded-xl
bg-purple-600
px-8
py-4
font-semibold
hover:bg-purple-500
"

>


{t("trial")}


</button>





</div>




</section>





</main>


);


}