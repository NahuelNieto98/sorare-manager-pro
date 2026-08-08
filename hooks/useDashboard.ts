"use client";

import { useEffect, useState } from "react";

import { DashboardData } from "@/types/dashboard";


export function useDashboard() {


const [data,setData] =
useState<DashboardData | null>(null);


const [loading,setLoading] =
useState(true);


const [error,setError] =
useState<string | null>(null);



async function refresh(){


try {


setLoading(true);

setError(null);



const res =
await fetch("/api/dashboard");



if(!res.ok){

throw new Error(
"Dashboard request failed"
);

}



const json =
await res.json();



setData(json);



}catch(error){


console.error(error);


setError(
"Error loading dashboard"
);



}finally{


setLoading(false);


}


}



useEffect(()=>{


refresh();


},[]);



return {

data,

loading,

error,

refresh,

};


}