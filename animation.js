///////////////////
// UI and Animation
///////////////////

//I don't remember why I did this
function animStart(){
	if(statMode) return 0;
	return 1;
}

function makeCardElem(cardID, flippedUp){
	var card;

	card = document.createElement("div");
	card.className = "card";
	card.id = cardID;

	if(!flippedUp && !allFaceUp){
		card.classList.add("cardBack");
	}

	document.getElementById("cardsContainer").appendChild(card);
	
	card.style.zIndex = zIndex;
	zIndex++;
	
	return card;
}

function animMoveCard(cardID, top, left){
	var elem;
	
	elem = document.getElementById(cardID);
	elem.style.top = top;
	elem.style.left = left;
	elem.style.zIndex = zIndex;
	zIndex++;
}

function animDeal(){
	if(!animStart()) return;

	var player;
	var delay; //delay to second round deal
	var cardID;
	var flippedUp;

	player = (dealer+1)%4;;
	delay = 0;

	makeCardElem("deck", false);

	for(var i=0; i<hands.length; i++){
		flippedUp = (player===players.SOUTH);
		if(i%2 === dealer%2) delay = 1;
		else delay = 0;

		for(var j=0; j<hands[i].length; j++){
			cardID = hands[player][j].id;
			makeCardElem(cardID, flippedUp);
			if(flippedUp){
				document.getElementById(cardID).addEventListener("click", clickCard);
			}

			if(j<2){
				setTimeout(animDealSingle, i*100, player, cardID, j);
			}
			else if(j===2){
				setTimeout(animDealSingle, i*100+(delay*500), player, cardID, j);
			}
			else{
				setTimeout(animDealSingle, i*100+500, player, cardID, j);
			}
		}
		player = (player+1)%4;
	}

	setTimeout(animFlipTrump, 1500);
	setTimeout(animSortHand, 1500);
}

function animDealSingle(player, cardID, cardPos){
	var top;
	var left;
	
	switch(player){
		case players.SOUTH:
			top = "450px";
			left = (cardPos*20)+(320) + "px";
			break;
		case players.WEST:
			top = "252px";
			left = (cardPos*20)+(50) + "px";
			break;
		case players.NORTH:
			top = "50px";
			left = (cardPos*20)+(320) + "px";
			break;
		case players.EAST:
			top = "252px";
			left = (cardPos*20)+(600) + "px";
			break;
	}
	
	animMoveCard(cardID, top, left);
}

//eventually do something fancier probably
function animFlipTrump(){
	makeCardElem(trumpCandidate.id, true);
}

//gives trump to the dealer
function animTakeTrump(toDiscardID){
	if(!animStart()) return;
	
	var top;
	var left;
	var toDiscardElem;
	var trumpElem;
	
	toDiscardElem = document.getElementById(toDiscardID);
	trumpElem = document.getElementById(trumpCandidate.id);
	top = toDiscardElem.style.top;
	left = toDiscardElem.style.left;
	
	toDiscardElem.classList.add("cardBack");
	setTimeout(animMoveCard, 100, toDiscardID, "252px", "364px");
	setTimeout(animHideCard, 400, toDiscardElem);
	
	if(dealer!==players.SOUTH){
		trumpElem.classList.add("cardBack");
	}
	trumpElem.style.zIndex = toDiscardElem.style.zIndex;
	setTimeout(animMoveCard, 200, trumpCandidate.id, top, left);
	
}

function animPlaceDealerButt(dealer){
	if(!animStart()) return;

	var button;

	button = document.getElementById("dealerButton");
	if (button===null){
		button = document.createElement("div");
		button.id = "dealerButton";
		document.getElementById("gameSpace").appendChild(button);
	}
	switch(dealer){
		case players.SOUTH:
			button.style.top = "470px";
			button.style.left = "270px";
			break;
		case players.WEST:
			button.style.top = "272px";
			button.style.left = "0px";
			break;
		case players.NORTH:
			button.style.top = "70px";
			button.style.left = "270px";
			break;
		case players.EAST:
			button.style.top = "272px";
			button.style.left = "550px";
			break;
	}
}

//sorts human player hand by alphabetical suit (after trump), then rank
//within each suit
function animSortHand(){
	if(!animStart()) return;

	var sortedDict = [];
	var key;
	var suit;
	var pos;

	for(var i=0; i<5; i++){
		key = 0;
		suit = hands[players.SOUTH][i].suit;
		switch(suit){
			case trump:
				break;
			case suits.CLUBS:
				key += 100;
				break;
			case suits.DIAMONDS:
				key += 200;
				break;
			case suits.HEARTS:
				key += 300;
				break;
			case suits.SPADES:
				key += 400;
				break;
		}
		key += (20 - hands[players.SOUTH][i].rank); //highest ranks come first
		sortedDict[key] = hands[players.SOUTH][i].id;
	}
	
	pos = 0;
	for(key in sortedDict){
		setTimeout(animDealSingle, 300, players.SOUTH, sortedDict[key], pos);
		pos++;
	}
}

function animPlayCard(player, cardID){
	if(!animStart()) return;

	var top;
	var left;

	animFlipCard(document.getElementById(cardID));
	switch(player){
		case players.SOUTH:
			top = "352px";
			left = "364px";
			break;
		case players.WEST:
			top = "252px";
			left = "284px";
			break;
		case players.NORTH:
			top = "152px";
			left = "364px";
			break;
		case players.EAST:
			top = "252px";
			left = "444px";
			break;
	}
	animMoveCard(cardID, top, left);
}

//check for class list and flip the other way too
//correct this in doBidding
function animFlipCard(cardElem){
	cardElem.classList.remove("cardBack");
}

function animWinTrick(player){
	if(!animStart()) return;

	var cardElem;
	var top;
	var left;

	switch(player){
		case players.SOUTH:
			top = "450px";
			left = "320px";
			break;
		case players.WEST:
			top = "252px";
			left = "50px";
			break;
		case players.NORTH:
			top = "50px";
			left = "320px";
			break;
		case players.EAST:
			top = "252px";
			left = "600px";
			break;
	}

	for(var i=0; i<4; i++){
		if(trickPlayedCards[i] === undefined){
			continue;
		}
		cardElem = document.getElementById(trickPlayedCards[i].id);
		cardElem.style.top = top;
		cardElem.style.left = left;
		cardElem.classList.add("cardBack");
		setTimeout(animHideCard, 400, cardElem);
	}
}

function animRemoveKitty(){
	if(!animStart()) return;

	var elem;

	elem = document.getElementById("deck");
	setTimeout(animHideCard, 300, elem);
	if(trumpCandidate.suit !== trump){ //trump candidate wasn't picked up
		elem = document.getElementById(trumpCandidate.id);
		setTimeout(animHideCard, 300, elem);
	}
}

function animHidePartnerHand(){
	var player;

	player = players.props[alonePlayer].partner;
	for(var i=0; i<hands[player].length; i++){
		animHideCard(document.getElementById(hands[player][i].id));
	}
}

function animHideCard(cardElem){
	if(!animStart()) return;

	cardElem.style.display = "none";
}

function animClearTable(){
	if(!animStart()) return;
	document.getElementById("cardsContainer").innerHTML = "";
}

//let human player poke the buttons
function animEnableBidding(){
	document.getElementById("orderUpPrompt").style.display = "inline";
	document.getElementById("pass").style.display = "inline";
	
	if(biddingRound === 1 && hasSuit(trumpCandidate.suit, 0)){
		document.getElementById("orderUp").style.display = "inline";
		document.getElementById("alone").style.display = "inline";
		return;
	}

	if(canOrderUpSuit(suits.SPADES, 0)){
		document.getElementById("pickSpades").style.display = "inline";
		document.getElementById("alone").style.display = "inline";
	}
	if(canOrderUpSuit(suits.CLUBS, 0)){
		document.getElementById("pickClubs").style.display = "inline";
		document.getElementById("alone").style.display = "inline";
	}
	if(canOrderUpSuit(suits.HEARTS, 0)){
		document.getElementById("pickHearts").style.display = "inline";
		document.getElementById("alone").style.display = "inline";
	}
	if(canOrderUpSuit(suits.DIAMONDS, 0)){
		document.getElementById("pickDiamonds").style.display = "inline";
		document.getElementById("alone").style.display = "inline";
	}
}

function animDisableBidding(){
	document.getElementById("orderUpPrompt").style.display = "none";
	document.getElementById("orderUp").style.display = "none";
	document.getElementById("pass").style.display = "none";
	
	document.getElementById("pickSpades").style.display = "none";
	document.getElementById("pickClubs").style.display = "none";
	document.getElementById("pickHearts").style.display = "none";
	document.getElementById("pickDiamonds").style.display = "none";
	document.getElementById("alone").style.display = "none";
	document.getElementById("alone").style.backgroundColor = "green";
}

//flips a button on or off
//needs to be generic but for now flips the 'go alone' button
function animFlipButton(on){
	if(on){
		document.getElementById("alone").style.backgroundColor = "red";
	}
	else{
		document.getElementById("alone").style.backgroundColor = "green";
	}
}

function animShowScore(){
	animShowText("You: " + nsScore + "  Them: " + weScore);
}

function animShowText(text, overwrite){
	var div = document.getElementById("sidebarText");
	div.innerHTML += "<br/>" + text;
	div.scrollTop = div.scrollHeight;
}

function animShowTextTop(text, overwrite){
	document.getElementById("sidebarTop").innerHTML += "<br/>" + text;
}

function OHMYGODCARD(player, card){
	animShowText("HEY " + player + " PLAYED: " + card.suit + card.rank + "(" + card.id + ")");
}
