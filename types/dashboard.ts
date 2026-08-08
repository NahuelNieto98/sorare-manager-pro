export type DashboardData = {

  galleryValue:number;

  average:number;

  totalCards:number;

  totalBought:number;

  totalSold:number;

  profit:number;

  roi:number;

  scarcity:{
    limited:number;
    rare:number;
    superRare:number;
    unique:number;
  };

  topCards:{
    playerName:string;
    marketValue:number|null;
  }[];

  recentTransactions:{
    id:string;
    type:string;
    playerName:string;
    rarity:string;
    price:number;
  }[];

  needsConnection?:boolean;

};