///////////////////
// UI and Animation
///////////////////

function animStart(){
	if(statMode) return 0;
	return 1;
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

function animDeal(){
	if(!animStart()) return;

	var playerID;
	var delay; //delay to second round deal
	var elem
	var flippedUp;

	playerID = dealerID+1;
	delay = 0;

	makeCardElem("deck", false);

	for(var i=0; i<hands.length; i++){
		flippedUp = (i===0);
		if(i%2 === dealerID%2) delay = 1;
		else delay = 0;

		for(var j=0; j<hands[i].length; j++){
			elem = makeCardElem(hands[i][j].id, flippedUp);
			if(j<2){
				setTimeout(animDealSingle, i*100, playerID, elem, j);
			}
			else if(j===2){
				setTimeout(animDealSingle, i*100+(delay*500), playerID, elem, j);
			}
			else{
				setTimeout(animDealSingle, i*100+500, playerID, elem, j);
			}
		}
		playerID = (playerID+1)%4;
	}

	setTimeout(animFlipTrump, 1500)
}

function animDealSingle(playerID, cardElem, cardPos){

	switch(playerID){
		case 0:
			cardElem.style.top = "450px";
			cardElem.style.left = (cardPos*20)+(320) + "px";
			break;
		case 1:
			cardElem.style.top = "252px";
			cardElem.style.left = (cardPos*20)+(50) + "px";
			break;
		case 2:
			cardElem.style.top = "50px";
			cardElem.style.left = (cardPos*20)+(320) + "px";
			break;
		case 3:
			cardElem.style.top = "252px";
			cardElem.style.left = (cardPos*20)+(600) + "px";
			break;
	} 
}

//eventually do something fancier probably
function animFlipTrump(){
	makeCardElem(trumpCandidate.id, true);
}

function animPlaceDealerButt(dealerID){
	if(!animStart()) return;

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

function animPlayCard(playerID, cardID){
	if(!animStart()) return;

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
	if(!animStart()) return;

	var card;
	var top;
	var left;

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
	if(!animStart()) return;

	cardElem.style.display = "none";
}

function animClearTable(){
	if(!animStart()) return;
	document.getElementById("cardsContainer").innerHTML = "";
}

function enableBidding(){
	var elem;

	elem = document.getElementById("orderUpPrompt");
	elem.style.display = "inline";
}

function disableBidding(){
	var elem;
	
	elem = document.getElementById("orderUpPrompt");
	elem.style.display = "none";
}