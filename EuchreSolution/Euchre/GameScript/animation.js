///////////////////
// UI and Animation
///////////////////

function makeCardElem(cardID, flippedUp){
	var card;

	card = document.createElement("div");
	card.className = "card";
	card.id = cardID;

	if(!flippedUp){
		card.classList.add("cardBack");
	}

	document.getElementById("cardsContainer").appendChild(card);

	card.style.zIndex = zIndex;
	zIndex++;

	return card;
}

function animMoveCard(cardID, top, left, z){
	var elem;

	elem = document.getElementById(cardID);
	elem.style.top = top;
	elem.style.left = left;
	if(z){
		elem.style.zIndex = z;
	}
	else{
		elem.style.zIndex = zIndex;
	}
	zIndex++;
}

function animDeal(hands){
	if(game.isStatMode()) return;

	var player;
	var delay; //delay to second round deal
	var cardID;
	var flippedUp;
	var dealer;

	dealer = game.getDealer();
	player = (dealer+1)%4;;
	delay = 0;

	makeCardElem("deck", false);
	makeCardElem(game.getTrumpCandidateCard().id, false);

	for(var i=0; i<hands.length; i++){
		flippedUp = (!game.isAiPlayer(player) || game.isOpenHands());
		if(i%2 === dealer%2) delay = 1;
		else delay = 0;

		for(var j=0; j<hands[i].length; j++){
			cardID = hands[player][j].id;
			makeCardElem(cardID, flippedUp);
			if(!game.isAiPlayer(player)){
				document.getElementById(cardID).addEventListener("click", game.clickCard);
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

//gives trump to the dealer
function animTakeTrump(toDiscardID){
	if(game.isStatMode()) return;

	var top;
	var left;
	var toDiscardElem;
	var trumpElem;
	var trumpCandidate;

	trumpCandidate = game.getTrumpCandidate();
	toDiscardElem = document.getElementById(toDiscardID);
	trumpElem = document.getElementById(trumpCandidate.id);
	top = toDiscardElem.style.top;
	left = toDiscardElem.style.left;

	toDiscardElem.classList.add("cardBack");
	setTimeout(animMoveCard, 100, toDiscardID, "252px", "364px");
	setTimeout(animHideCard, 400, toDiscardElem);

	if(game.isAiPlayer(game.getDealer()) && !game.isOpenHands()){
		trumpElem.classList.add("cardBack");
	}
	setTimeout(animMoveCard, 200, trumpCandidate.id, top, left, toDiscardElem.style.zIndex);

}

function animPlaceDealerButt(){
	if(game.isStatMode()) return;

	var button;

	button = document.getElementById("dealerButton");
	if (button===null){
		button = document.createElement("div");
		button.id = "dealerButton";
		document.getElementById("gameSpace").appendChild(button);
	}
	switch(game.getDealer()){
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
function animSortHand(hand){
	if(game.isStatMode()) return;

	var sortedDict = [];
	var key;
	var suit;
	var pos;

	for(var i=0; i<5; i++){
		key = 0;
		suit = hand[i].suit;
		switch(suit){
			case game.getTrump():
				break;
			case suits.SPADES:
				key += 100;
				break;
			case suits.DIAMONDS:
				key += 200;
				break;
			case suits.CLUBS:
				key += 300;
				break;
			case suits.HEARTS:
				key += 400;
				break;
		}
		key += (20 - hand[i].rank); //highest ranks come first
		sortedDict[key] = hand[i].id;
	}

	pos = 0;
	for(key in sortedDict){
		setTimeout(animDealSingle, 300, players.SOUTH, sortedDict[key], pos);
		pos++;
	}
}

function animPlayCard(player, cardID, flipCard){
	if(game.isStatMode()) return;

	var top;
	var left;

	if(flipCard && !game.isOpenHands()) animFlipCard(cardID);

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
function animFlipCard(cardID){
	if(game.isStatMode()) return;

	document.getElementById(cardID).classList.toggle("cardBack");
}

function animWinTrick(player, cards){
	if(game.isStatMode()) return;

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
		if(cards[i] === null){
			continue;
		}
		cardElem = document.getElementById(cards[i].id);
		cardElem.style.top = top;
		cardElem.style.left = left;
		cardElem.classList.add("cardBack");
		setTimeout(animHideCard, 400, cardElem);
	}
}

function animRemoveKitty(){
	if(game.isStatMode()) return;

	var elem;
	var trumpCandidate;

	trumpCandidate = game.getTrumpCandidate();
	elem = document.getElementById("deck");
	setTimeout(animHideCard, 300, elem);
	if(trumpCandidate.suit !== game.getTrump()){ //trump candidate wasn't picked up
		elem = document.getElementById(trumpCandidate.id);
		setTimeout(animHideCard, 300, elem);
	}
}

function animHidePartnerHand(hands){
	if(game.isStatMode()) return;

	var player;

	player = players.props[game.getAlonePlayer()].partner;
	for(var i=0; i<hands[player].length; i++){
		animHideCard(document.getElementById(hands[player][i].id));
	}
}

function animHideCard(cardElem){
	if(game.isStatMode()) return;

	cardElem.style.display = "none";
}

function animClearTable(){
	if(game.isStatMode()) return;
	document.getElementById("cardsContainer").innerHTML = "";
}

//let human player poke the buttons
function animEnableBidding(){
	if(game.isStatMode()) return;

	document.getElementById("orderUpPrompt").style.display = "inline";
	document.getElementById("pass").style.display = "inline";

	if(game.getBiddingRound() === 1 && hasSuit(game.getTrumpCandidate().suit)){
		document.getElementById("orderUp").style.display = "inline";
		document.getElementById("alone").style.display = "inline";
		return;
	}

	if(canOrderUpSuit(suits.SPADES)){
		document.getElementById("pickSpades").style.display = "inline";
		document.getElementById("alone").style.display = "inline";
	}
	if(canOrderUpSuit(suits.CLUBS)){
		document.getElementById("pickClubs").style.display = "inline";
		document.getElementById("alone").style.display = "inline";
	}
	if(canOrderUpSuit(suits.HEARTS)){
		document.getElementById("pickHearts").style.display = "inline";
		document.getElementById("alone").style.display = "inline";
	}
	if(canOrderUpSuit(suits.DIAMONDS)){
		document.getElementById("pickDiamonds").style.display = "inline";
		document.getElementById("alone").style.display = "inline";
	}
}

function animDisableBidding(){
	if(game.isStatMode()) return;

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
	if(game.isStatMode()) return;

	if(on){
		document.getElementById("alone").style.backgroundColor = "red";
	}
	else{
		document.getElementById("alone").style.backgroundColor = "green";
	}
}

function animShowScore(){
	animShowText("You: " + game.getNsScore() + "  Them: " + game.getEwScore());
}

function animShowText(text, nest, overwrite){
	var div = document.getElementById("sidebarText");
	if(overwrite){
		div.innerHTML = "";
	}
	if(!nest){
		nest = 0;
	}
	for(var i=0; i<nest; i++){
		div.innerHTML += "&nbsp&nbsp";
	}
	div.innerHTML += text + "<br>";
	div.scrollTop = div.scrollHeight;
}

function animShowTextTop(text, overwrite){
	var div = document.getElementById("sidebarTop");
	if(overwrite){
		div.innerHTML = "";
	}
	div.innerHTML += text + "<br>";
}

function disableActions(){
	document.getElementById("blanket").style.display = "inline";
}

function enableActions(){
	document.getElementById("blanket").style.display = "none";
}
