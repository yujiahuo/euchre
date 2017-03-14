///////////////////
// UI and Animation
///////////////////

//TODO: make all the card elements at once instead of making them as we deal

function makeCardElem(cardID: string, flippedUp: boolean): HTMLDivElement {
	let card;

	card = document.createElement("div");
	card.className = "card";
	card.id = cardID;

	if (!flippedUp) {
		card.classList.add("cardBack");
	}

	let cardsContainer = document.getElementById("cardsContainer") as HTMLElement;
	cardsContainer.appendChild(card);

	card.style.zIndex = zIndex.toString();
	zIndex++;

	return card;
}

function animMoveCard(cardID: string, top: string, left: string, z?: string): void {
	let div = document.getElementById(cardID) as HTMLDivElement;
	div.style.top = top;
	div.style.left = left;
	if (z) {
		div.style.zIndex = z;
	}
	else {
		div.style.zIndex = zIndex.toString();
	}
	zIndex++;
}

/*function animDeal(hands: Card[][]): void {
	if (game.isStatMode()) return;

	let player: Player;
	let delay: number; //delay to second round deal
	let cardID: string;
	let flippedUp: boolean;
	let dealer: Player;
	let trumpCandidate = game.getTrumpCandidate() as Card

	dealer = game.getDealer();
	player = nextPlayer(dealer);
	delay = 0;

	makeCardElem("deck", false);
	makeCardElem(trumpCandidate.id, false);

	for (let i = 0; i < hands.length; i++) {
		flippedUp = (!game.getAIPlayer(player) || game.isOpenHands());
		if (i % 2 === dealer % 2) delay = 1;
		else delay = 0;

		for (let j = 0; j < hands[i].length; j++) {
			cardID = hands[player][j].id;
			makeCardElem(cardID, flippedUp);
			if (!game.getAIPlayer(player)) {
				//document.getElementById(cardID).addEventListener("click", game.clickCard);
			}

			if (j < 2) {
				setTimeout(animDealSingle, i * 100, player, cardID, j);
			}
			else if (j === 2) {
				setTimeout(animDealSingle, i * 100 + (delay * 500), player, cardID, j);
			}
			else {
				setTimeout(animDealSingle, i * 100 + 500, player, cardID, j);
			}
		}
		player = (player + 1) % 4;
	}

	setTimeout(animFlipCard, 1000, trumpCandidate.id);
}*/

function animDealSingle(player: Player, cardID: string, cardPos: number): void {
	let top;
	let left;

	switch (player) {
		case Player.South:
			top = "450px";
			left = (cardPos * 20) + (320) + "px";
			break;
		case Player.West:
			top = "252px";
			left = (cardPos * 20) + (50) + "px";
			break;
		case Player.North:
			top = "50px";
			left = (cardPos * 20) + (320) + "px";
			break;
		case Player.East:
			top = "252px";
			left = (cardPos * 20) + (600) + "px";
			break;
		default:
			return;
	}

	animMoveCard(cardID, top, left);
}

//gives trump to the dealer
/*function animTakeTrump(toDiscardID: string): void {
	if (game.isStatMode()) return;

	let trumpCandidate = game.getTrumpCandidate() as Card;
	let toDiscardElem = document.getElementById(toDiscardID) as HTMLElement;
	let trumpElem = document.getElementById(trumpCandidate.id) as HTMLElement;
	let top = toDiscardElem.style.top;
	let left = toDiscardElem.style.left;

	toDiscardElem.classList.add("cardBack");
	setTimeout(animMoveCard, 100, toDiscardID, "252px", "364px");
	setTimeout(animHideCard, 400, toDiscardElem);

	if (game.getAIPlayer(game.getDealer()) && !game.isOpenHands()) {
		trumpElem.classList.add("cardBack");
	}
	setTimeout(animMoveCard, 200, trumpCandidate.id, top, left, toDiscardElem.style.zIndex);

}

function animPlaceDealerButt(): void {
	if (game.isStatMode()) return;

	let button;

	button = document.getElementById("dealerButton");
	if (button === null) {
		button = document.createElement("div");
		button.id = "dealerButton";
		let gameSpace = document.getElementById("gameSpace") as HTMLElement;
		gameSpace.appendChild(button);
	}
	switch (game.getDealer()) {
		case Player.South:
			button.style.top = "470px";
			button.style.left = "270px";
			break;
		case Player.West:
			button.style.top = "272px";
			button.style.left = "0px";
			break;
		case Player.North:
			button.style.top = "70px";
			button.style.left = "270px";
			break;
		case Player.East:
			button.style.top = "272px";
			button.style.left = "550px";
			break;
	}
}*/

//sorts human player hand by alphabetical suit (after trump), then rank
//within each suit
function animSortHand(hand: Card[]): void {
	if (game.isStatMode()) return;

	let sortedDict: string[] = [];
	let key: number;
	let suit: Suit;
	let pos: number;

	for (let i = 0; i < 5; i++) {
		key = 0;
		suit = hand[i].suit;
		switch (suit) {
			/*case game.getTrump():
				break;*/
			case Suit.Spades:
				key += 100;
				break;
			case Suit.Diamonds:
				key += 200;
				break;
			case Suit.Clubs:
				key += 300;
				break;
			case Suit.Hearts:
				key += 400;
				break;
		}
		key += (20 - hand[i].rank); //highest ranks come first
		sortedDict[key] = hand[i].id;
	}

	pos = 0;
	for (let key in sortedDict) {
		setTimeout(animDealSingle, 300, Player.South, sortedDict[key], pos);
		pos++;
	}
}

function animPlayCard(player: Player, cardID: string, flipCard: boolean): void {
	if (game.isStatMode()) return;

	let top = "";
	let left = "";

	if (flipCard && !game.isOpenHands()) animFlipCard(cardID);

	switch (player) {
		case Player.South:
			top = "352px";
			left = "364px";
			break;
		case Player.West:
			top = "252px";
			left = "284px";
			break;
		case Player.North:
			top = "152px";
			left = "364px";
			break;
		case Player.East:
			top = "252px";
			left = "444px";
			break;
	}
	animMoveCard(cardID, top, left);
}

//check for class list and flip the other way too
//correct this in doBidding
function animFlipCard(cardID: string): void {
	if (game.isStatMode()) return;

	let cardElement = document.getElementById(cardID);
	if (cardElement) {
		cardElement.classList.toggle("cardBack");
	}
}

function animWinTrick(player: Player, cards: Card[]): void {
	if (game.isStatMode()) return;

	let cardElem;
	let top;
	let left;

	switch (player) {
		case Player.South:
			top = "450px";
			left = "320px";
			break;
		case Player.West:
			top = "252px";
			left = "50px";
			break;
		case Player.North:
			top = "50px";
			left = "320px";
			break;
		case Player.East:
			top = "252px";
			left = "600px";
			break;
		default:
			return;
	}

	for (let i = 0; i < 4; i++) {
		if (cards[i] === null) {
			//TODO: either mark the parameter as (Card | null)[], or remove this check
			continue;
		}
		cardElem = document.getElementById(cards[i].id) as HTMLElement;
		cardElem.style.top = top;
		cardElem.style.left = left;
		cardElem.classList.add("cardBack");
		setTimeout(animHideCard, 400, cardElem);
	}
}

/*function animRemoveKitty(): void {
	if (game.isStatMode()) return;

	let elem;
	let trumpCandidate;

	trumpCandidate = game.getTrumpCandidate() as Card;
	elem = document.getElementById("deck");
	setTimeout(animHideCard, 300, elem);
	if (trumpCandidate.suit !== game.getTrump()) { //trump candidate wasn't picked up
		elem = document.getElementById(trumpCandidate.id);
		setTimeout(animHideCard, 300, elem);
	}
}*/

function animHidePartnerHand(alonePlayer: Player, hands: Card[][]): void {
	if (game.isStatMode()) return;

	let player = getPartner(alonePlayer);
	for (let i = 0; i < hands[player].length; i++) {
		animHideCard(document.getElementById(hands[player][i].id) as HTMLElement);
	}
}

function animHideCard(cardElem: HTMLElement): void {
	if (game.isStatMode()) return;

	cardElem.style.display = "none";
}

function animClearTable(): void {
	if (game.isStatMode()) return;

	let cardsContainer = document.getElementById("cardsContainer")
	if (cardsContainer) {
		cardsContainer.innerHTML = "";
	}
}

/*
//let human player poke the buttons
function animEnableBidding(hand: Card[]): void {
	if (game.isStatMode()) return;

	document.getElementById("orderUpPrompt").style.display = "inline";
	document.getElementById("pass").style.display = "inline";

	if (game.getGameStage() === GameStage.BidRound1 && hasSuit(hand, game.getTrumpCandidate().suit)) {
		document.getElementById("orderUp").style.display = "inline";
		document.getElementById("alone").style.display = "inline";
		return;
	}

	if (canOrderUpSuit(hand, Suit.Spades)) {
		document.getElementById("pickSpades").style.display = "inline";
		document.getElementById("alone").style.display = "inline";
	}
	if (canOrderUpSuit(hand, Suit.Clubs)) {
		document.getElementById("pickClubs").style.display = "inline";
		document.getElementById("alone").style.display = "inline";
	}
	if (canOrderUpSuit(hand, Suit.Hearts)) {
		document.getElementById("pickHearts").style.display = "inline";
		document.getElementById("alone").style.display = "inline";
	}
	if (canOrderUpSuit(hand, Suit.Diamonds)) {
		document.getElementById("pickDiamonds").style.display = "inline";
		document.getElementById("alone").style.display = "inline";
	}
}

function animDisableBidding(): void {
	if (game.isStatMode()) return;

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
function animFlipButton(on: boolean): void {
	if (game.isStatMode()) return;

	if (on) {
		document.getElementById("alone").style.backgroundColor = "red";
	}
	else {
		document.getElementById("alone").style.backgroundColor = "green";
	}
}
*/

function animShowText(text: string, messageLevel: MessageLevel, nest?: number, overwrite?: boolean): void {
	let allowedLevel: MessageLevel = game && game.getMessageLevel() || MessageLevel.Step;
	let logText = "";

	if (messageLevel < allowedLevel) return;

	if (!nest) {
		nest = 0;
	}
	for (let i = 0; i < nest; i++) {
		logText += "&nbsp;&nbsp;";
	}

	logText += text + "<br>";

	if (game && game.isStatMode()) {
		if (overwrite) {
			game.logText = logText;
		} else {
			game.logText += logText
		}
	} else {
		updateLog(logText, overwrite);
	}
}

function updateLog(text: string, overwrite?: boolean): void {
	let div = document.getElementById("sidebarText");
	if (!div) {
		return;
	}
	if (overwrite) {
		div.innerHTML = text;
	} else {
		div.innerHTML += text;
	}
	div.scrollTop = div.scrollHeight;
}

function animShowTextTop(text: string, overwrite?: boolean): void {
	let div = document.getElementById("sidebarTop");
	if (!div) {
		return;
	}
	if (overwrite) {
		div.innerHTML = "";
	}
	div.innerHTML += text + "<br>";
}

function disableActions(): void {
	let blanket = document.getElementById("blanket");
	if (blanket) {
		blanket.style.display = "inline";
	}
}

function enableActions(): void {
	let blanket = document.getElementById("blanket");
	if (blanket) {
		blanket.style.display = "none";
	}
}
