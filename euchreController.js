//Yay Controller
var tempZ = 10;


var game;
var currentPlayerID;
var playerNames = ["South", "West", "North", "East"];

//used for bidding
var bidding;
var biddingRound = 1;
var playersBid = 0;

//used for playing tricks
var playersPlayed = 0;
var handNum = 0;
var trickNum = 0;
var trickSuit = "";
var trickPlayedCards = new Array(4);

function newGame(){
	handNum = 0;
	clearTable();
	game = new Game;
	game.initNewGame(); //does nothing right now
	
	//place to play with settings
	game.allFaceUp = true;

	newHand(0);
}

function dealHands(){
	var player, cardNum, card;

	placeDeck();
	biddingRound = 1;
	playersBid = 0;

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

function doBidding(){
	//end of round of bidding
	if(playersBid > 3){
		if(biddingRound == 1){
			//reset everything and execute rest of the function
			biddingRound = 2;
			playersBid = 0;
			console.log("round 2 bidding starting");
		}
		else{
			//everyone passed, reshuffle
			console.log("everyone passed")
			setTimeout(redeal, 1000);
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
	var elem;

	elem = document.getElementById("orderUpPrompt");
	elem.style.display = "inline";
}

//The beginning of a hand. A hand involves picking a dealer,
//bidding, and playing until someone wins the hand.
//This resets all the relevant variables
function newHand(redealing){
	//trump is set and all players have their starting hands
	//game.sortHands(); eventually
	clearTable();

	if(!redealing){
		handNum = handNum + 1;
	}
	console.log("starting hand " + handNum + ", redealing = " + redealing);
	game.pickDealer();
	game.getShuffledDeck();

	dealHands();

	for(var i=0; i<4; i++){
		console.log(game.hands[i][0].id + " " + game.hands[i][1].id + " " + game.hands[i][2].id + " " + game.hands[i][3].id + " " + game.hands[i][4].id + " ");
	}

	currentPlayerID = game.dealerID;
	nextPlayer();
	setTimeout(doBidding, 2300);
}

function endHand(){
	//determine winner
}

function clearTable(){
	animClearTable();
}

function redeal(){
	console.log("redealing");
	game.resetHands();
	animReturnHands();

	newHand(1);
}

function startTricks(){
	console.log("starting tricks");
	trickNum = 1;
	playersPlayed = 0;
	trickSuit = "";
	trickPlayedCards = [];
	currentPlayerID = game.dealerID;
	nextPlayer();

	setTimeout(playTrick, 1000);
}

function playTrick(){
	var cardID;

	console.log("playing trick " + trickNum);
	if(playersPlayed > 3){
		if(trickNum < 5){
			playersPlayed = 0;
			console.log("trick ended");
			trickNum++;
			setTimeout(playTrick, 1000);
			return;
		}
		else{
			console.log("hand ended");
			endHand();
			newHand(0);
			return
		}
	}

	if(currentPlayerID == 0){
		console.log("Your turn");
	}
	else{
		console.log(currentPlayerID + " is playing");
		cardID = aiPickCard(currentPlayerID);
		console.log(currentPlayerID + " played " + cardID);
		if(playersPlayed == 0){
			trickSuit = cardID[0];
		}
		trickPlayedCards[currentPlayerID] = cardID;
		game.removeFromHand(currentPlayerID, cardID);
		animPlayCard(currentPlayerID, cardID);
		playersPlayed++;
		nextPlayer();
		setTimeout(playTrick, 1000);
	}
}

function endTrick(){

}

function nextPlayer(){
	currentPlayerID = (currentPlayerID+1)%4;
}

///////////////////
// UI and Animation
///////////////////

function placeDeck(){
	makeCardElem("deck", false);
}

function makeCardElem(cardId, flippedUp){
	var card;

	card = document.createElement("div");
	card.className = "card";
	card.id = cardId;

	if(flippedUp || game.allFaceUp){
		card.addEventListener("click", pickCard);
	}
	else{
		card.classList.add("cardBack");
	}

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

//called by animDeal
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

function animReturnHands(){
	//bluh
}

function animPlayCard(playerID, cardID){
	var card = document.getElementById(cardID);

	card.style.top = "252px";
	card.style.left = "364px";
	card.style.zIndex = tempZ;
	tempZ++;
}

function animClearTable(){
	document.getElementById("cardsContainer").innerHTML = "";
}

///////////////////
// Player actions
///////////////////

function pickOrderUp(){
	console.log("You ordered up "+game.trumpCandidate.suitName);
	var elem;

	elem = document.getElementById("orderUpPrompt");
	elem.style.display = "hidden";
	if(game.dealerID != 0){
		aiDiscard();
		game.giveDealerTrump();
		game.makerID = currentPlayerID;
	}
	setTimeout(startTricks, 1000);
}

function pickSpades(){
	var elem;
	
	elem = document.getElementById("orderUpPrompt");
	elem.style.display = "none";
	game.makerID = 0;
	game.trump = "Spades";
	console.log("You ordered up Spades");
	startTricks();
}

function pickClubs(){
	var elem;
	
	elem = document.getElementById("orderUpPrompt");
	elem.style.display = "none";
	game.makerID = 0;
	game.trump = "Clubs";
	console.log("You ordered up Clubs");
	startTricks();
}

function pickHearts(){
	var elem;
	
	elem = document.getElementById("orderUpPrompt");
	elem.style.display = "none";
	game.makerID = 0;
	game.trump = "Hearts";
	console.log("You ordered up Hearts");
	startTricks();
}

function pickDiamonds(){
	var elem;
	
	elem = document.getElementById("orderUpPrompt");
	elem.style.display = "none";
	game.makerID = 0;
	game.trump = "Diamonds";
	console.log("You ordered up Diamonds");
	startTricks();
}

function pass(){
	var elem;
	
	elem = document.getElementById("orderUpPrompt");
	elem.style.display = "none";
	console.log("You passed");
	playersBid += 1;
	nextPlayer();
	setTimeout(doBidding, 1000);
}

function pickCard(){
	console.log("you played " + this.id);

	if(playersPlayed == 0){
		trickSuit = this.id[0];
	}
	trickPlayedCards[0] = this.id;
	animPlayCard(0, this.id);
	playersPlayed++;
	nextPlayer();

	setTimeout(playTrick, 1000);
}

///////////////////
// Testing functions
///////////////////
function test(){
	test2()
}

//What the fuck I've done so far and needs to be done next
/*
 * Tricks work
 * Next steps: 	Enforce suit following for player
 *				Recognize that the left follow trump suit
 *				Factor out animation code because there will be a ton of it
*/




