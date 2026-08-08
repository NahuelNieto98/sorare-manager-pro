"use client";

import { useTranslations } from "next-intl";

import SettingsHero from "@/components/settings/SettingsHero";
import SorareAccountForm from "@/components/settings/SorareAccountForm";


export default function SettingsPage(){


const t =
useTranslations("settings");



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

/>



</div>

);

}