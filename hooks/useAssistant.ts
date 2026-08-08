"use client";

import { useState } from "react";


export function useAssistant(){


const [loading,setLoading] =
useState(false);


const [analysis,setAnalysis] =
useState("");



const [error,setError] =
useState<string|null>(null);



async function analyze(){


try{


setLoading(true);

setError(null);



const res =
await fetch("/api/assistant");



if(!res.ok){

throw new Error(
"Assistant request failed"
);

}



const data =
await res.json();



setAnalysis(
data.analysis ?? ""
);



}catch(error){


console.error(error);


setError(
"Error generating analysis"
);



}finally{


setLoading(false);


}


}



return {

loading,

analysis,

error,

analyze,

};


}