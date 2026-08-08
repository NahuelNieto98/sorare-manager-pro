import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { useTranslations } from "next-intl";

import SettingsHero from "@/components/settings/SettingsHero";
import SorareAccountForm from "@/components/settings/SorareAccountForm";


export default async function SettingsPage(){


const t =
useTranslations("settings");


const session =
await auth();



const user =
await prisma.user.findUnique({

where:{
email: session?.user?.email ?? "",
},

include:{
sorareAccount:true,
},

});



const sorareSlug =
user?.sorareAccount?.slug ?? null;



return (

<div className="space-y-8">


<SettingsHero

title={t("title")}

subtitle={t("subtitle")}

/>



<SorareAccountForm

accountLabel={t("account")}

placeholder={t("placeholder")}

buttonLabel={t("button")}

errorMessage={t("error")}

successMessage={t("success")}

currentAccount={sorareSlug}

/>



</div>

);

}