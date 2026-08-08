type Props = {
  inSeasonValue:number;
  inSeasonCards:number;

  classicValue:number;
  classicCards:number;

  galleryValue:number;
  totalCards:number;
};


export default function GalleryStats({

  inSeasonValue,
  inSeasonCards,

  classicValue,
  classicCards,

  galleryValue,
  totalCards,

}:Props){


return (

<div
className="
mb-8
grid
grid-cols-1
gap-5
md:grid-cols-3
"
>


<div
className="
rounded-3xl
border
border-purple-500/20
bg-purple-500/10
p-6
"
>

<h3 className="text-zinc-400">
In Season
</h3>


<p className="text-3xl font-black text-white">
€{inSeasonValue.toFixed(2)}
</p>


<p className="text-zinc-400">
{inSeasonCards} cartas
</p>


</div>



<div
className="
rounded-3xl
border
border-blue-500/20
bg-blue-500/10
p-6
"
>

<h3 className="text-zinc-400">
Classic
</h3>


<p className="text-3xl font-black text-white">
€{classicValue.toFixed(2)}
</p>


<p className="text-zinc-400">
{classicCards} cartas
</p>


</div>



<div
className="
rounded-3xl
border
border-green-500/20
bg-green-500/10
p-6
"
>

<h3 className="text-zinc-400">
Total
</h3>


<p className="text-3xl font-black text-white">
€{galleryValue.toFixed(2)}
</p>


<p className="text-zinc-400">
{totalCards} cartas
</p>


</div>


</div>

);

}