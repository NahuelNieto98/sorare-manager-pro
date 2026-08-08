export function calculateMarketScore(
  card:any,
  price:number
){


  let score = 50;



  // Precio respecto al valor estimado

  if(card?.marketValue){


    const discount =
      (
        (card.marketValue - price)
        /
        price
      )
      *
      100;



    if(discount >= 40){

      score += 30;

    }
    else if(discount >= 25){

      score += 20;

    }
    else if(discount >= 10){

      score += 10;

    }


  }




  // Rendimiento del jugador

  const scores = [

    card?.l5Score,
    card?.l10Score,
    card?.l15Score,
    card?.l40Score

  ].filter(
    (value)=>value !== null && value !== undefined
  );




  if(scores.length){


    const average =
      scores.reduce(
        (a:number,b:number)=>a+b,
        0
      )
      /
      scores.length;



    if(average >= 60){

      score += 25;

    }
    else if(average >= 45){

      score += 15;

    }
    else if(average >= 30){

      score += 5;

    }


  }




  // Bonus por rareza

  switch(card?.scarcity){


    case "limited":

      score += 5;
      break;


    case "rare":

      score += 10;
      break;


    case "super_rare":

      score += 15;
      break;


    case "unique":

      score += 20;
      break;


  }





  // Limites

  if(score > 100){

    score = 100;

  }


  if(score < 0){

    score = 0;

  }



  return Math.round(score);


}