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

	if(flippedUp || allFaceUp){
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
	card.style.zIndex = zIndex;
	zIndex++;
}

function animClearTable(){
	document.getElementById("cardsContainer").innerHTML = "";
}