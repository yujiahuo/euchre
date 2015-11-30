///////////////////
// UI and Animation
///////////////////

function placeDeck(){
	makeCardElem("deck", false);
}

function makeCardElem(cardID, flippedUp){
	var card;

	card = document.createElement("div");
	card.className = "card";
	card.id = cardID;

	if(flippedUp || allFaceUp){
		card.addEventListener("click", pickCard);
	}
	else{
		card.classList.add("cardBack");
	}

	document.getElementById("cardsContainer").appendChild(card);

	return card;
}

function animDeal(playerName, cardID, cardNum){
	//create card
	var card, flippedUp;

	flippedUp = (playerName==="South");
	card = makeCardElem(cardID, flippedUp);

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

function animPlaceDealerButt(dealerID){
	var button;

	button = document.getElementById("dealerButton");
	if (button===null){
		button = document.createElement("div");
		button.id = "dealerButton";
		document.getElementById("gameSpace").appendChild(button);
	}
	switch(dealerID){
		case 0:
			button.style.top = "470px";
			button.style.left = "270px";
			break;
		case 1:
			button.style.top = "272px";
			button.style.left = "0px";
			break;
		case 2:
			button.style.top = "70px";
			button.style.left = "270px";
			break;
		case 3:
			button.style.top = "272px";
			button.style.left = "550px";
			break;
	}
}

//eventually do something fancier probably
function animFlipTrump(cardID){
	var card;

	card = makeCardElem(cardID, true);
}

function animReturnHands(){
	//bluh
}

function animPlayCard(playerID, cardID){
	var card = document.getElementById(cardID);

	switch(playerID){
		case 0:
			card.style.top = "352px";
			card.style.left = "364px";
			break;
		case 1:
			card.style.top = "252px";
			card.style.left = "284px";
			break;
		case 2:
			card.style.top = "152px";
			card.style.left = "364px";
			break;
		case 3:
			card.style.top = "252px";
			card.style.left = "444px";
			break;
	}
	card.style.zIndex = zIndex;
	zIndex++;
}

function animWinTrick(playerID){
	var card;
	var top;
	var left;

	console.log(playerID + "is so good");
	switch(playerID){
		case 0:
			top = "450px";
			left = "320px";
			break;
		case 1:
			top = "252px";
			left = "50px";
			break;
		case 2:
			top = "50px";
			left = "320px";
			break;
		case 3:
			top = "252px";
			left = "600px";
			break;
	}

	for(var i=0; i<4; i++){
		card = document.getElementById(trickPlayedCards[i].id);
		card.style.top = top;
		card.style.left = left;
		card.classList.add("cardBack");
		setTimeout(animHideCards, 400, card);
	}
}

function animHideCards(cardElem){
	cardElem.style.display = "none";
}

function animClearTable(){
	document.getElementById("cardsContainer").innerHTML = "";
}