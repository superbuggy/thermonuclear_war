//Utility Functions
function printDeck( deck ) {
  var printedDeck = "";

  for (i = 0; i < deck.length - 1; i++ ) {
    printedDeck += deck[i].rank + deck[i].suit + ", ";
  }
  //Prints last item without comma
  printedDeck+=deck[deck.length - 1].rank + deck[deck.length - 1].suit;
  return printedDeck;
}

function print( arg ){
  var textInput = document.getElementById("konsole-input").value;
  var textOutput = document.querySelector(".konsole-tekst");
  var pToAppend = document.createElement("p");
  pToAppend.innerHTML = arg;
  //  var nodeText = document.createTextNode(arg);
  textOutput.appendChild(pToAppend);
  // wrap the arg text in like a p tag, then append the  p or li tag.
  console.log( arg );
}
//End Utility functions

// perhaps rename vars for clarity (e.g. playerOneDeck)
var gameDeck = [], playerOneDeck = [], playerTwoDeck = [];
var cardSuits = ["♦" , "♣" , "♥" , "♠"];
var cardRanks = [ "2" , "3" , "4" , "5" , "6" , "7" , "8" , "9" , "10" , "J" , "Q" , "K" , "A" ];

//Constructor method for Card objects
function Card( rankArg, suitArg ) {
  this.rank = rankArg;
  this.rankPower = cardRanks.indexOf(rankArg);
  this.suit = suitArg;
  this.suitPower = cardSuits.indexOf(suitArg);
}

function buildDeck() {
  for ( rankInc = 0; rankInc <= 12; rankInc++ ){
    for ( suitInc = 0; suitInc <= 3; suitInc++ ){
      gameDeck.push( new Card( cardRanks[rankInc], cardSuits[suitInc] ) );
    }
  }
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

// Implementation of "Modern Method" Fisher-Yates procedure outlined on wikipedia:
// https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle#Modern_method
function shuffle(deck, numOfShuffles) {
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
  // i might favor 'moving' cards here rather than copying.
  playerOneDeck = playerOneDeck.concat(gameDeck.slice(0).splice(0, 26));
  playerTwoDeck = playerTwoDeck.concat(gameDeck.slice(0).splice(26, 26));
}

//Function that handles war events
function ofCourseYouRealizeThisMeans(){
  var warceptionCounter = 0;
  var warIndexCount = 0;
  var playerOneDeckCards = playerOneDeck.length;
  var playerTwoDeckCards = playerTwoDeck.length;
  var CARDS_DRAWN_PER_WAR = 4;

  //While loop deals with iterative war: double war, triple war, quadruple war, etc
  while ( playerOneDeck[warIndexCount].rankPower === playerTwoDeck[warIndexCount].rankPower ){
    warceptionCounter += 1;
    // maybe change 4 to a named constant
    if ( (playerOneDeck.length > (warIndexCount+CARDS_DRAWN_PER_WAR) ) && (playerTwoDeck.length > (warIndexCount+CARDS_DRAWN_PER_WAR) ) ){ //FIX: edge case still possible, is it
      print(playerOneDeck[warIndexCount], playerTwoDeck[warIndexCount]);
      warIndexCount += CARDS_DRAWN_PER_WAR;
    } else {
      // print("Player " + (playerOneDeck.length < (warIndexCount+CARDS_DRAWN_PER_WAR)) ? "1" : ((playerOneDeck.length < (warIndexCount+CARDS_DRAWN_PER_WAR)) ? "2" : null ) +
      //   "has insufficient soldiers to enter into another war. The suit will determine the outcome.");
      if (playerOneDeck[warIndexCount].suitPower > playerTwoDeck[warIndexCount].suitPower) {
        toTheVictorGo (1, warIndexCount);
        print("Player 1 won a " + warceptionCounter + "-iteration-deep war, taking " + warIndexCount + " cards from Player 2.");
        print("fuckin killin me man");
        break;
      } else if (playerOneDeck[warIndexCount].suitPower < playerTwoDeck[warIndexCount].suitPower) {
        toTheVictorGo (2, warIndexCount);
        print("Player 2 won a  " + warceptionCounter + "iteration-deep war, taking " + warIndexCount + " cards from Player 1.");
        print("fuckin killin me man");
        break;
      }
    }
  }
  if ( playerOneDeck[warIndexCount].rankPower > playerTwoDeck[warIndexCount].rankPower ) {
      toTheVictorGo(1, warIndexCount);
      print("Player 1 won a " + warceptionCounter + "-iteration-deep war, taking " + warIndexCount + " cards from Player 2.");
  } else if ( playerOneDeck[warIndexCount].rankPower < playerTwoDeck[warIndexCount].rankPower ) {
      toTheVictorGo(2, warIndexCount);
      print("Player 2 won a  " + warceptionCounter + "iteration-deep war, taking " + warIndexCount + " cards from Player 1.");
  }
}

//Plays the game
function playWar() {
  buildDeck();
  gameDeck = shuffle(gameDeck, 10);
  dealCards();

  // Game loop: the above game set-up function calls can be seperated into an initGame function
  // The while loop can be removed while its condition could be placed within an if statement for
  // turn-based play, rather than as a "war outcomes simulator"
  while ( (playerOneDeck.length > 0) && ( playerTwoDeck.length > 0) ) {
    // var card1 = playerOne.getCard();
    // var card1 = playerOneDeck.pop();
    // var card2 = playerTwoDeck.pop();

    if ( playerOneDeck[0].rankPower > playerTwoDeck[0]) {
      //Player 1 wins; add'l features: number of "battles" won, win-pile, number of win-piles turned over
      print("P1 wins: " + playerOneDeck[0].rank + playerOneDeck[0].suit + " beats " + playerTwoDeck[0].rank + playerTwoDeck[0].suit );
      toTheVictorGo(1,1);
      // playerOneDeck.unshift(card1).unshift(card2)
      // playerOne.takeCards(card1, card2)
    } else if ( playerTwoDeck[0].rankPower > playerOneDeck[0] ) {
      print("P2 wins: " + playerTwoDeck[0].rank + playerTwoDeck[0].suit + " beats " + playerOneDeck[0].rank + playerOneDeck[0].suit );
      toTheVictorGo(2,1);
    } else if ( playerOneDeck[0].rankPower === playerTwoDeck[0]) {
      ofCourseYouRealizeThisMeans();
    }
  }
  //Checking for a win
  if (playerOneDeck.length === 0) {
    print("Player Two Wins!");
  } else if (playerTwoDeck.length === 0) {
    print("Player One Wins!");
  }
}

//Assigns appropriate cards to the winner
// instead of passing in a number, pass in the from deck, to deck
function toTheVictorGo (victoriousPlayer, indexRange){
  if (victoriousPlayer === 1){
    playerOneDeck = playerOneDeck.concat(playerTwoDeck.splice(0,indexRange), playerOneDeck.splice(0,indexRange));
  } else {
    playerTwoDeck = playerTwoDeck.concat(playerOneDeck.splice(0,indexRange), playerTwoDeck.splice(0,indexRange));
  }
}
