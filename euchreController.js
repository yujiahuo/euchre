//Yay Controller

var game;
var biddingRound = 1;
var playersBid = 0;

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
	setTimeout(doBidding, 2500, (game.dealer+1)%4);
}

function dealHands(){
		var player, playerNames, cardNum, card;
		playerNames = ["South", "West", "North", "East"];

		placeDeck();

		for(var i=0; i<20; i++){
			player = (i+game.dealer)%4;
			
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

//dealer and player are the names of the dealer/player
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

function doBidding(currentPlayer){
	//end of round of bidding
	if(playersBid >= 4){
		if(biddingRound == 1){
			//reset everything and execute rest of the function
			biddingRound = 2;
			playersBid = 0;
			console.log("round 2 bidding starting");
		}
		else{
			console.log("Bidding ends");
			return;
		}
	}

	if(currentPlayer == 0){
		console.log("Your turn");
		promptOrderUp();
	}
	else{
		aiDecideOrderUp(currentPlayer);
	}
}

function promptOrderUp(){
	var prompt;

	elem = document.getElementById("orderUpPrompt");
	elem.style.display = "inline";
}

function aiDecideOrderUp(player){
	//mmake decision
	console.log("Player " + player + " has passed");
	playersBid += 1;
	setTimeout(doBidding, 1000, (player+1)%4);
}

function orderUp(){
	console.log("You ordered up "+game.trumpCandidate.suit);
	playersBid += 1;
	setTimeout(doBidding, 1000, 1);
}

// function pickSpades(){
// 	playersBid += 1;
// 	doBidding(1);
// }

// function pickClubs(){
// 	playersBid += 1;
// 	doBidding(1);
// }

// function pickHearts(){
// 	playersBid += 1;
// 	doBidding(1);
// }

// function pickDiamonds(){
// 	playersBid += 1;
// 	doBidding(1);
// }

// function pass(){
// 	playersBid += 1;
// 	doBidding(1);
// }

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
