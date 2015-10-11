//Yay Controller

var game;
var currentPlayerID;

//used for bidding
var bidding;
var biddingRound = 1;
var playersBid = 0;

//used for playing hands
var playersPlayed = 0;
var handNum = 0;

function newGame(){
	document.getElementById("cardsContainer").innerHTML = "";
	game = new Game;
	game.initNewGame(); //pick a dealer and create a shuffled deck
	biddingRound = 1;
	playersBid = 0;
	playGame();
}

function playGame(){
	dealHands();

	//do all evil bidding for dark overlord
	currentPlayerID = game.dealerID;
	nextPlayer();
	setTimeout(doBidding, 2500);
}

function dealHands(){
		var player, playerNames, cardNum, card;
		playerNames = ["South", "West", "North", "East"];

		placeDeck();

		for(var i=0; i<20; i++){
			player = (i+game.dealerID)%4;
			
			cardNum = Math.floor(i/4);
			card = game.deck.pop();
			game.hands[player][cardNum] = card;

			setTimeout(animDeal, i*100, playerNames[player], card.id, cardNum);
		}

		game.trumpCandidate = game.deck.pop();
		setTimeout(animFlipTrump, 2100, game.trumpCandidate.id);
	}

function placeDeck(){
	makeCardElem("deck", false);
}

function doBidding(){
	//end of round of bidding
	if(playersBid >= 4){
		if(biddingRound == 1){
			//reset everything and execute rest of the function
			biddingRound = 2;
			playersBid = 0;
			console.log("round 2 bidding starting");
		}
		else{
			//everyone passed, reshuffle
			console.log("everyone passed")
			//NOTE: we need to actually start a new game here
			return;
		}
	}

	if(currentPlayerID == 0){
			console.log("Your turn");
		promptOrderUp();
	}
	else{
		aiDecideOrderUp();
	}
}

function promptOrderUp(){
	var prompt;

	elem = document.getElementById("orderUpPrompt");
	elem.style.display = "inline";
}

function beginHands(){
	//trump is set and all players have their starting hands
	//game.sortHands();
	currentPlayerID = game.dealerID;
	nextPlayer();
	setTimeout(playHand, 1000);
}

function playHand(){
	if(playersPlayed >= 4){
		handNum++;
		if(handNum <= 5){
			playersPlayed = 0;
			playHand();
		}
	}

	if(currentPlayerID == 0){
		console.log("Your turn");
	}
	else{
		aiPlayCard();
	}
}

function nextPlayer(){
	currentPlayerID = (currentPlayerID+1)%4;
}

///////////////////
// Animation
///////////////////

function makeCardElem(cardId, flippedUp){
	var card;

	card = document.createElement("div");
	card.className = "card";
	if(!flippedUp){
		card.classList.add("cardBack");
	}
	card.id = cardId;

	document.getElementById("cardsContainer").appendChild(card);

	return card;
}

function animDeal(playerName, cardId, cardNum){
	//create card
	var card, flippedUp;

	flippedUp = (playerName=="South");
	card = makeCardElem(cardId, flippedUp);

	setTimeout(animDealToPlayer, 50, playerName, card, cardNum);
}

function animDealToPlayer(playerName, card, cardNum){
	switch(playerName){
		case "South":
			card.style.top = "450px";
			card.style.left = (cardNum*20)+(320) + "px";
			break;
		case "West":
			card.style.top = "252px";
			card.style.left = (cardNum*20)+(50) + "px";
			break;
		case "North":
			card.style.top = "50px";
			card.style.left = (cardNum*20)+(320) + "px";
			break;
		case "East":
			card.style.top = "252px";
			card.style.left = (cardNum*20)+(600) + "px";
			break;
	} 
}

//eventually do something fancier probably
function animFlipTrump(cardId){
	var card;

	card = makeCardElem(cardId, true);
}

///////////////////
// AI actions
///////////////////

function aiDiscard(){
	//logic to decide which card to remove
	game.removeFromHand(game.dealerID, 1);
}

function aiDecideOrderUp(){
	//make decision
	console.log("Player " + currentPlayerID + " has passed");
	playersBid += 1;
	nextPlayer();
	setTimeout(doBidding, 1000);
}

function aiPlayCard(){

}

///////////////////
// Player actions
///////////////////

function pickOrderUp(){
	console.log("You ordered up "+game.trumpCandidate.suit);
	if(game.dealerID != 0){
		aiDiscard();
		game.giveDealerTrump();
		game.makerID = currentPlayerID;
		return;
	}
	beginHands();
}

function pickSpades(){
	game.makerID = 0;
	game.trump = "Spades";
	console.log("You ordered up Spades");
	beginHands();
}

function pickClubs(){
	game.makerID = 0;
	game.trump = "Clubs";
	console.log("You ordered up Spades");
	beginHands();
}

function pickHearts(){
	game.makerID = 0;
	game.trump = "Hearts";
	console.log("You ordered up Spades");
	beginHands();
}

function pickDiamonds(){
	game.makerID = 0;
	game.trump = "Diamonds";
	console.log("You ordered up Spades");
	beginHands();
}

function pass(){
	console.log("You passed");
	playersBid += 1;
	nextPlayer();
	setTimeout(doBidding, 1000);
}

function playCard(card){
	//
}

///////////////////
// Testing functions
///////////////////
function test(){
}

function test2(){
}
