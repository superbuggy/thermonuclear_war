//Utility Functions
function printDeck( deck ) {
  var printedDeck = "";
  if ( !deck ) {
    deck = gameDeck;
  }
  for (i = 0; i < deck.length - 1; i++ ) {
    printedDeck+=deck[i].rank + deck[i].suitSym + ", ";
  }
  //Prints last item without comma
  printedDeck+=deck[deck.length - 1].rank + deck[deck.length - 1].suitSym;
  return printedDeck;
}

function print( arg ){
  console.log( arg );
}
//End Utility functions

var gameDeck = [], deckOne = [], deckTwo = [];
var cardSuits = [ "diamonds" , "clubs" , "hearts" , "spades"];
var cardSuitSymbols = ["♦" , "♣" , "♥" , "♠"];
var cardRanks = [ "2" , "3" , "4" , "5" , "6" , "7" , "8" , "9" , "10" , "J" , "Q" , "K" , "A" ];

//define card object; constructor
function card( rankArg, suitArg ) {
  this.rank = rankArg;
  this.rankPower = cardRanks.indexOf(rankArg);
  this.suit = suitArg;
  this.suitSym = cardSuitSymbols[cardSuits.indexOf(suitArg)];
  this.suitPower = cardSuits.indexOf(suitArg);
}

function buildDeck() {
  gameDeck = [];
  for ( rankInc = 0; rankInc <= 12; rankInc++ ){
    for ( suitInc = 0; suitInc <= 3; suitInc++ ){
      gameDeck.push( new card( cardRanks[rankInc], cardSuits[suitInc] ) );
    }
  }
}

// Implementation of "Modern Method" Fisher-Yates procedure outlined on wikipedia:
// https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle#Modern_method
function shuffle(deck, numOfShuffles) {
  if (!deck) {
    deck = gameDeck;
  }
  if (!numOfShuffles) {
     numOfShuffles = 1;
  }
  var tempDeck = deck.slice(0);
  var shuffledDeck = [];
  var randomCardIndex;
  var shuffleCount = 0;

  while (shuffleCount < numOfShuffles) {
    shuffleCount++;
    while (tempDeck.length > 0) {
      randomCardIndex = randoCalrissian( tempDeck.length);
      shuffledDeck = shuffledDeck.concat(tempDeck[randomCardIndex]);
      tempDeck.splice(randomCardIndex, 1);
    }
  }
  return shuffledDeck;
}

function dealCards() {
  //copies the deck and splits it between the two players
  deckOne = deckOne.concat(gameDeck.slice(0).splice(0, 26));
  deckTwo = deckTwo.concat(gameDeck.slice(0).splice(26, 26));
}

//"I had no choice! They arrived right before you did." - Han BFF
//Selects a whole number with an [excluded] upper-bound of 'max', or 52 if no argument is present
function randoCalrissian( max ){
  if ( max === undefined ){
    return Math.floor(Math.random() * 52);
  } else {
    return Math.floor(Math.random() * max);
  }
}

//Function requires 2 card objects being passed in, evaluates the higher-ranked card by
//comparing each card's rank against the master array of card ranks.
function getWinner( playerOneCard , playerTwoCard ) {

  if (playerOneCard.rankPower > playerTwoCard.rankPower) {
    return "one";
  } else if (playerOneCard.rankPower < playerTwoCard.rankPower) {
    return "two";
  } else if (playerOneCard.rankPower === playerTwoCard.rankPower) {
    return "war";//FIX? call war func?
  }
}

//Function that handles war events
function ofCourseYouRealizeThisMeans(){
  var warceptionCounter = 0;
  var warIndexCount = 0;
  var deckOneCards = deckOne.length;
  var deckTwoCards = deckTwo.length;
  //While loop deals with iterative war: double war, triple war, quadruple war, etc
  while ( deckOne[warIndexCount].rankPower === deckTwo[warIndexCount].rankPower ){
    warceptionCounter += 1;
    if ( (deckOne.length > (warIndexCount+4) ) && (deckTwo.length > (warIndexCount+4) ) ){ //FIX: edge case still possible, is it
      print(deckOne[warIndexCount], deckTwo[warIndexCount]);
      warIndexCount += 4;
    } else {
      print("Player " + (deckOne.length < (warIndexCount+4)) ? "1" : ((deckOne.length < (warIndexCount+4)) ? "2" : null ) +
        "has insufficient soldiers to enter into another war. The suit will determine the outcome.");
      if (deckOne[warIndexCount].suitPower > deckTwo[warIndexCount].suitPower) {
        toTheVictorGo (1, warIndexCount);
        print("Player 1 won a " + warceptionCounter + "-iteration-deep war, taking " + warIndexCount + " cards from Player 2.");
      } else if (deckOne[warIndexCount].suitPower < deckTwo[warIndexCount].suitPower) {
        toTheVictorGo (2, warIndexCount);
        print("Player 2 won a  " + warceptionCounter + "iteration-deep war, taking " + warIndexCount + " cards from Player 1.");
      }
    }
  }
  if ( deckOne[warIndexCount].rankPower > deckTwo[warIndexCount].rankPower ) {
      toTheVictorGo(1, warIndexCount);
      print("Player 1 won a " + warceptionCounter + "-iteration-deep war, taking " + warIndexCount + " cards from Player 2.");
  } else if ( deckOne[warIndexCount].rankPower < deckTwo[warIndexCount].rankPower ) {
      toTheVictorGo(2, warIndexCount);
      print("Player 2 won a  " + warceptionCounter + "iteration-deep war, taking " + warIndexCount + " cards from Player 1.");
  }
}

//Plays the game
function playWar() {
  buildDeck();
  gameDeck = shuffle();
  dealCards();

  // Game loop: the above game set-up function calls can be seperated into an initGame function
  // The while loop can be removed while its condition could be placed within an if statement for
  // turn-based play, rather than as a "war outcomes simulator"
  while ( (deckOne.length > 0) && ( deckTwo.length > 0) ) {
    if ( getWinner(deckOne[0], deckTwo[0]) === "one" ) {
      //Player 1 wins; add'l features: number of "battles" won, win-pile, number of win-piles turned over
      print("P1 wins: " + deckOne[0].rank + deckOne[0].suitSym + " beats " + deckTwo[0].rank + deckTwo[0].suitSym );
      toTheVictorGo(1,1);
    } else if ( getWinner(deckOne[0], deckTwo[0]) === "two" ) {
      print("P2 wins: " + deckTwo[0].rank + deckTwo[0].suitSym + " beats " + deckOne[0].rank + deckOne[0].suitSym );
      toTheVictorGo(2,1);
    } else if (getWinner(deckOne[0], deckTwo[0]) === "war" ) {
      ofCourseYouRealizeThisMeans();
    }
  }
  //Checking for a win
  if (deckOne.length === 0) {
    print("Player Two Wins!");
  } else if (deckTwo.length === 0) {
    print("Player One Wins!");
  }
}

//Assigns appropriate cards to the winner
function toTheVictorGo (victoriousPlayer, indexRange){
  if (victoriousPlayer === 1){
    deckOne = deckOne.concat(deckTwo.splice(0,indexRange), deckOne.splice(0,indexRange));
  } else {
    deckTwo = deckTwo.concat(deckOne.splice(0,indexRange), deckTwo.splice(0,indexRange));
  }
}
