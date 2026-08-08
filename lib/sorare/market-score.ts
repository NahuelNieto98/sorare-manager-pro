export function calculateMarketScore(card:any, price:number){


  let score = 50;



  // 1. Diferencia precio vs valor estimado

  if(card?.marketValue){

    const discount =
      ((card.marketValue - price) / price) * 100;


    if(discount >= 40)
      score += 30;

    else if(discount >= 25)
      score += 20;

    else if(discount >= 10)
      score += 10;


  }




  // 2. Rendimiento reciente

  const scores = [
    card?.l5Score,
    card?.l10Score,
    card?.l15Score,
    card?.l40Score
  ].filter(Boolean);



  if(scores.length){

    const average =
      scores.reduce(
        (a:number,b:number)=>a+b,
        0
      )
      /
      scores.length;



    if(average >= 60)
      score += 25;

    else if(average >= 45)
      score += 15;

    else if(average >= 30)
      score += 5;

  }





  // 3. Rareza

  if(card?.scarcity === "limited")
    score += 5;


  if(card?.scarcity === "rare")
    score += 10;


  if(card?.scarcity === "super_rare")
    score += 15;




  // limitar

  if(score > 100)
    score = 100;


  if(score < 0)
    score = 0;



  return score;


}