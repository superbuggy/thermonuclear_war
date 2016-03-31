//Utility Functions
function printDeck( deck ) {
  var printedDeck = "";

  for (i = 0; i < deck.length - 1; i++ ) {
    printedDeck += deck[i].rank + deck[i].suit + ", ";
  }
  //Prints last item without comma
  printedDeck += deck[deck.length - 1].rank + deck[deck.length - 1].suit;
  return printedDeck;
}

function print( arg ){
  var textOutput = document.querySelector(".konsole-tekst");
  var pToAppend = document.createElement("p");
  pToAppend.innerHTML = arg;
  textOutput.appendChild(pToAppend);
  console.log( arg );
}
//End Utility functions

var gameDeck = [], playerOneDeck = [], playerTwoDeck = [];
var cardSuits = ["♦" , "♣" , "♥" , "♠"];
var cardRanks = [ "2" , "3" , "4" , "5" , "6" , "7" , "8" , "9" , "10" , "J" , "Q" , "K" , "A" ];
var warButton = document.getElementById("play-war");
warButton.addEventListener("click", playWar);
var gameStarted = false;

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

//Divides the gameDeck evenly between the 2 players
function dealCards() {
  playerOneDeck = gameDeck.splice(0, 26);
  playerTwoDeck = gameDeck.splice(0, 26);
}

//Initializes the game
function initGame(){
  buildDeck();
  gameDeck = shuffle(gameDeck, 10);
  dealCards();
}

//Plays the game
function playWar() {
  if (!gameStarted) {
    initGame();
    gameStarted = true;
  }

  var playerOneTopCard = playerOneDeck.shift();
  var playerTwoTopCard = playerTwoDeck.shift();

  if ( (playerOneDeck.length > 0) && ( playerTwoDeck.length > 0) ) {
    if ( playerOneTopCard.rankPower > playerTwoTopCard.rankPower) {
      print("P1 wins: " + playerOneTopCard.rank + playerOneTopCard.suit + " beats " + playerTwoTopCard.rank + playerTwoTopCard.suit );
      playerOneDeck.push(playerOneTopCard, playerTwoTopCard);
    } else if ( playerTwoTopCard.rankPower > playerOneTopCard.rankPower ) {
      print("P2 wins: " + playerTwoTopCard.rank + playerTwoTopCard.suit + " beats " + playerOneTopCard.rank + playerOneTopCard.suit );
      playerTwoDeck.push(playerTwoTopCard, playerOneTopCard);
    } else if ( playerOneTopCard.rankPower === playerTwoTopCard.rankPower) {
      playerOneDeck.unshift(playerOneTopCard);
      playerTwoDeck.unshift(playerTwoTopCard);
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

//Function that handles war events
function ofCourseYouRealizeThisMeans(){
  //warceptionCounter counts the number of consecutive wars
  print("War breaks out!")
  var warceptionCounter = 0;
  var playerOneDeckCards = playerOneDeck.length;
  var playerTwoDeckCards = playerTwoDeck.length;
  var minimumDeck = ((playerOneDeckCards < playerTwoDeckCards) ? playerOneDeckCards : playerTwoDeckCards);
  var CARDS_DRAWN_PER_WAR = 4;
  //While loop deals with iterative war: double war, triple war, quadruple war, etc
  for ( faceUpIndex = 0; faceUpIndex < minimumDeck.length; faceUpIndex += CARDS_DRAWN_PER_WAR ) {
    if (playerOneDeck[faceUpIndex]===playerTwoDeck[faceUpIndex]) {
      warceptionCounter++;
    }
  }

  print("It's war-ception! This war is " + warceptionCounter + "wars deep...");

  indexOfFinalConflict = warceptionCounter * CARDS_DRAWN_PER_WAR + CARDS_DRAWN_PER_WAR;
    if ( playerOneDeckCards < indexOfFinalConflict || playerTwoDeckCards < indexOfFinalConflict ) {
      // At least one player does have enough cards to continue the war
      var playerOneBottomCard = playerOneDeck.shift();
      var playerTwoBottomCard = playerTwoDeck.shift();
      if (playerOneBottomCard.rankPower > playerTwoBottomCard.rankPower) {
        playerOneDeck.push(playerOneBottomCard, playerTwoBottomCard);
        print("Player One Wins!");
      } else if (playerTwoBottomCard.rankPower > playerOneBottomCard.rankPower) {
        playerTwoDeck.push(playerTwoBottomCard, playerOneBottomCard);
        print("Player Two Wins!");
      } else if (playerOneBottomCard.rankPower === playerTwoBottomCard.rankPower) {
        if (playerOneBottomCard.suitPower > playerTwoBottomCard.suitPower){
          print("Player One Wins based on suit-- a rare and narrow victory!");
        } else {
          print("Player Two Wins based on suit-- a rare and narrow victory!");
        }
      }
    } else {
      var playerOneDecisiveCard = playerOneDeck[indexOfFinalConflict].rankPower;
      var playerTwoDecisiveCard = playerTwoDeck[indexOfFinalConflict].rankPower;

      if (warceptionCounter === 2 ) {
        print("Double your treasure! Except for the loser.");
      } else if (warceptionCounter === 3 ) {
        print("Wow, this war is pretty nuts.");
      } else if (warceptionCounter === 4 ) {
        print("The insane brutality actually possesses a sublime quality.");
      } else if (warceptionCounter === 5) {
        print("More like 'zero-sun game' amirite? #NuclearWinter");
      } else if (warceptionCounter === 6 ) {
        print("GLOBAL THERMONUCLEAR WAR!!!!");
        print("Seriously, the odds of this having occurred are like absurdly low.");
        print("Holy shhhh");
      }

      if (playerOneDecisiveCard > playerTwoDecisiveCard) {
        print ("Player 1 emerges victorious, capturing " + indexOfFinalConflict +" cards.");
        playerOneDeck.concat(playerOneDeck.splice(0,indexOfFinalConflict), playerTwoDeck.splice(0,indexOfFinalConflict));
      } else {
        print ("Player 2 emerges victorious, capturing " + indexOfFinalConflict +" cards.");
        playerTwoDeck.concat(playerTwoDeck.splice(0,indexOfFinalConflict), playerOneDeck.splice(0,indexOfFinalConflict));
      }
    }
  }
