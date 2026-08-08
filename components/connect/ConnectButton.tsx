import {
  Link,
} from "lucide-react";


type Props = {

loading:boolean;

onConnect:()=>void;

label:string;

loadingLabel:string;

};



export default function ConnectButton({

loading,

onConnect,

label,

loadingLabel,

}:Props){


return (

<button

onClick={onConnect}

disabled={loading}

className="
mt-8
flex
w-full
items-center
justify-center
gap-3
rounded-2xl
bg-purple-600
py-4
font-bold
text-white
transition
hover:bg-purple-500
disabled:opacity-50
"

>


<Link size={20}/>



{

loading

?

loadingLabel

:

label

}


</button>

);

}