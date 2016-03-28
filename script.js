var gameDeck = [];
var cardSuits = [ "diamonds" , "clubs" , "hearts" , "spades"];
var cardSuitSymbols = ["♦","♣","♥","♠"];
var cardRanks = [ "2" , "3" , "4" , "5" , "6" , "7" , "8" , "9" , "10" , "J" , "Q" , "K" , "A" ];

function card(rankArg, suitArg) {
  this.rank=rankArg;
  this.suit=suitArg;
  this.suitSym=cardSuitSymbols[cardSuits.indexOf(suitArg)];
}

function buildDeck() {
  gameDeck=[];
  for (rankInc = 0; rankInc <=12; rankInc++){
    for (suitInc = 0; suitInc <=3; suitInc++){
      gameDeck.push( new card( cardRanks[rankInc], cardSuits[suitInc] ) );
    }
  }
}
