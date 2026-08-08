import { notFound } from "next/navigation";


export const locales = [
  "es",
  "en",
  "fr"
];


export default async function getMessages(
  locale?: string
){


  if(!locale || !locales.includes(locale)){


    notFound();


  }



  return (

    await import(
      `./messages/${locale}.json`
    )

  ).default;


}