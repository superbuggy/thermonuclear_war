var gameDeck = [];
var cardSuits = [ "diamonds" , "clubs" , "hearts" , "spades"];
var cardSuitSymbols = ["♦" , "♣" , "♥" , "♠"];
var cardRanks = [ "2" , "3" , "4" , "5" , "6" , "7" , "8" , "9" , "10" , "J" , "Q" , "K" , "A" ];

function card( rankArg, suitArg ) {
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


//"I had no choice! They arrived right before you did."
//Selects a whole number with an exclusionary upper-bound of 'max', or 52 if no args present
function randoCalrissian( max ){
  if ( max === undefined ){
    return Math.floor(Math.random() * 52);
  } else {
    return Math.floor(Math.random() * max);
  }
}


// Implementation of https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle#Modern_method
// Looked at some code, but it didn't immediately made sense to me, so I navigated to the the above URL.
function shuffle() {
  var shuffledDeck = [];
  var randomCardIndex;
  while ( gameDeck.length > 0 ) {
    randomCardIndex = randoCalrissian( gameDeck.length );
    shuffledDeck.unshift( gameDeck[randomCardIndex] );
    //Consider passing the line below as an argument to the unshift expression above (when I tried, got an array full of NaNs)
    gameDeck.splice(randomCardIndex, 1);
  }
  //Copies shuffled deck to gameDeck
  gameDeck = shuffledDeck.slice(0);
}

function printDeck() {
  var printedDeck = "";
  for (i = 0; i < gameDeck.length - 1; i++ ) {
    printedDeck+=gameDeck[i].rank + gameDeck[i].suitSym + ", ";
  }
  //Prints last item without comma
  printedDeck+=gameDeck[gameDeck.length - 1].rank + gameDeck[gameDeck.length - 1].suitSym;
  return printedDeck;
}

function print( arg ){
  console.log( arg );
}
