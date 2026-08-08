"use client";

import { useTranslations } from "next-intl";

import { useAssistant } from "@/hooks/useAssistant";

import AssistantHero from "@/components/assistant/AssistantHero";
import AssistantButton from "@/components/assistant/AssistantButton";
import AssistantResult from "@/components/assistant/AssistantResult";


export default function AssistantPage(){


const t =
useTranslations("assistant");


const {

loading,

analysis,

error,

analyze,

} = useAssistant();



return (

<div className="space-y-8">



<AssistantHero

title={t("title")}

subtitle={t("subtitle")}

/>





<section

className="
rounded-3xl
border
border-white/10
bg-[#17112F]
p-8
"

>


<h2 className="text-2xl font-black text-white">

{t("analyzeTitle")}

</h2>



<p className="mt-3 text-zinc-400">

{t("description")}

</p>



<AssistantButton

onClick={analyze}

loading={loading}

label={t("analyzeButton")}

loadingLabel={t("analyzing")}

/>


</section>





{

error && (

<div

className="
rounded-2xl
border
border-red-500/20
bg-red-500/10
p-5
text-red-400
"

>

{error}

</div>

)

}





<AssistantResult

analysis={analysis}

title={t("result")}

empty={t("empty")}

/>



</div>

);

}