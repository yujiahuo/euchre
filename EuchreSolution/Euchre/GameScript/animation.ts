///////////////////
// UI and Animation
///////////////////

//TODO: make all the card elements at once instead of making them as we deal

declare var controller: Controller | null;

function makeCardElem(cardId: string): HTMLDivElement {
	const card = document.createElement("div");
	card.className = "card";
	card.id = cardId;
	animFlipCard(card, false);

	const cardsContainer = document.getElementById("cardsContainer") as HTMLElement;
	cardsContainer.appendChild(card);

	card.style.zIndex = zIndex.toString();
	zIndex++;

	return card;
}

function animMoveCard(cardOrIdOrElement: Card | string | HTMLDivElement,
	top: string, left: string, z?: string): void {

	const cardElement = getCardElement(cardOrIdOrElement);
	if (!cardElement) { return; }

	cardElement.style.top = top;
	cardElement.style.left = left;
	if (z) {
		cardElement.style.zIndex = z;
	} else {
		cardElement.style.zIndex = zIndex.toString();
		zIndex++;
	}
}

function dealOneRoundToOnePlayer(player: Player, hand: Card[], start: number, end: number,
	isOpenHands: boolean, hasHooman: boolean): void {

	const flippedUp = (isOpenHands || (hasHooman && player === Player.South));
	const cardsToDeal: Card[] = [];

	const playerCopy = player;
	const delegate = () => {
		for (let i = start; i < end; i++) {
			const card = hand[i];
			const cardElem = getCardElement(card) as HTMLDivElement;
			if (hasHooman && playerCopy === Player.South) {
				cardElem.addEventListener("click", clickCard);
			}
			cardsToDeal.push(card);
		}

		for (let i = 0; i < cardsToDeal.length; i++) {
			animDealSingle(playerCopy, cardsToDeal[i], i + start, flippedUp);
		}
	};
	AnimController.queueAnimation(AnimType.DealHands, delegate);
}

function animDeal(hands: Card[][], trumpCandidate: Card, dealer: Player,
	settings: Settings, callback: () => void): void {

	if (!controller || controller.isStatMode()) {
		callback();
		return;
	}

	const isOpenHands = settings.openHands;
	const hasHooman = settings.hasHooman;

	const trumpCandidateId = trumpCandidate.id;
	const startDealDelegate = () => {
		animClearTable();
		animPlaceDealerButt(dealer);
		makeCardElem("deck");
		makeCardElem(trumpCandidateId);
		for (const hand of hands) {
			for (const card of hand) {
				makeCardElem(card.id);
			}
		}
	};
	AnimController.queueAnimation(AnimType.DealHands, startDealDelegate);

	let player = dealer;
	for (let i = 0; i < hands.length; i++) {
		player = getNextPlayer(player);
		const dealThree = (dealer + i) % 2;
		dealOneRoundToOnePlayer(player, hands[player], 0, 2 + dealThree, isOpenHands, hasHooman);
	}
	for (let i = 0; i < hands.length; i++) {
		player = getNextPlayer(player);
		const dealThree = (dealer + i) % 2;
		dealOneRoundToOnePlayer(player, hands[player], 2 + dealThree, hands[player].length, isOpenHands, hasHooman);
	}

	const sortHandsDelegate = () => {
		for (const _ of hands) {
			player = getNextPlayer(player);
			const flippedUp = (isOpenHands || (hasHooman && player === Player.South));

			if (flippedUp) {
				animSortHand(hands[player], player);
			}
		}
	};
	AnimController.queueAnimation(AnimType.DealHands, sortHandsDelegate);

	const showTrumpCandidateDelegate = () => {
		animFlipCard(trumpCandidateId, true);
		callback();
	};
	AnimController.queueAnimation(AnimType.DealHands, showTrumpCandidateDelegate);
}

function animDealSingle(player: Player, cardOrIdOrElement: Card | string | HTMLDivElement,
	cardPos: number, flippedUp: boolean): void {

	const cardElem = getCardElement(cardOrIdOrElement);
	if (!cardElem) {
		return;
	}

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

	if (flippedUp) {
		animFlipCard(cardElem, true);
	}
	animMoveCard(cardElem, top, left);
}

//gives trump to the dealer
function animTakeTrump(trumpCandidate: Card, discard: Card, isAIPlayer: boolean): void {
	if (!controller || controller.isStatMode()) { return; }

	const discardElement = getCardElement(discard) as HTMLDivElement;
	const trumpCandidateElement = getCardElement(trumpCandidate) as HTMLDivElement;
	const top = discardElement.style.top as string;
	const left = discardElement.style.left as string;
	const zIndex = discardElement.style.zIndex as string;

	animFlipCard(discardElement, false);
	AnimController.queueAnimation(AnimType.Discard, () => {
		animMoveCard(discardElement, "252px", "364px");
	});

	if (isAIPlayer && !controller.isOpenHands()) {
		animFlipCard(trumpCandidateElement, false);
	}
	AnimController.queueAnimation(AnimType.Discard, () => {
		animMoveCard(trumpCandidateElement, top, left, zIndex);
	});
	if (!isAIPlayer) {
		trumpCandidateElement.addEventListener("click", clickCard);
		discardElement.removeEventListener("click", clickCard);
	}
	AnimController.queueAnimation(AnimType.Discard, () => {
		animHideCard(discardElement);
	});
	//TODO: sort the hand again? Probably only if it's visible
	//TODO: make it look the same even if the picked up card gets discarded
}

function animPlaceDealerButt(dealer: Player): void {
	if (!controller || controller.isStatMode()) { return; }

	let button = document.getElementById("dealerButton");
	if (button === null) {
		button = document.createElement("div");
		button.id = "dealerButton";
		const gameSpace = document.getElementById("gameSpace") as HTMLElement;
		gameSpace.appendChild(button);
	}
	switch (dealer) {
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
}

//sorts human player hand by alphabetical suit (after trump), then rank
//within each suit
function animSortHand(hand: Card[], player: Player): void {
	if (!controller || controller.isStatMode()) { return; }

	const cards: { [index: number]: Card } = {};
	const keys: number[] = [];

	for (const card of hand) {
		let key = 0;
		switch (card.suit) {
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
			default:
				break;
		}
		key += (20 - card.rank); //highest ranks come first
		keys.push(key);
		cards[key] = card;
	}

	keys.sort();
	let pos = 0;
	for (const key of keys) {
		animDealSingle(player, cards[key], pos++, false);
	}
	//TODO: make this avoid gaps, always look like things are moving
}

function animPlayCard(player: Player, cardId: string): void {
	if (!controller || controller.isStatMode()) { return; }

	const cardElement = getCardElement(cardId);
	if (!cardElement) { return; }

	let top: string;
	let left: string;

	animFlipCard(cardElement, true);

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
		default:
			return;
	}
	animMoveCard(cardId, top, left);
}

function getCardElement(cardOrIdOrElement: Card | string | HTMLDivElement): HTMLDivElement | null {
	let cardId: string;
	if (typeof (cardOrIdOrElement) === "string") {
		cardId = cardOrIdOrElement;
	} else if (cardOrIdOrElement instanceof Card) {
		cardId = cardOrIdOrElement.id;
	} else {
		return cardOrIdOrElement;
	}
	return document.getElementById(cardId) as HTMLDivElement | null;
}

//check for class list and flip the other way too
//correct this in doBidding
function animFlipCard(cardOrIdOrElement: Card | string | HTMLDivElement, faceUp: boolean): void {
	if (!controller || controller.isStatMode()) { return; }

	const cardElement = getCardElement(cardOrIdOrElement);
	if (!cardElement) {
		return;
	}
	if (faceUp) {
		cardElement.classList.remove("cardBack");
	} else {
		cardElement.classList.add("cardBack");
	}
}

function animWinTrick(player: Player, playedCards: PlayedCard[]): void {
	if (!controller || controller.isStatMode()) { return; }

	const moveDelegate = () => {
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

		for (const playedCard of playedCards) {
			const cardElem = getCardElement(playedCard.card) as HTMLDivElement;
			cardElem.style.top = top;
			cardElem.style.left = left;
			animFlipCard(cardElem, false);
		}
	};
	AnimController.queueAnimation(AnimType.WinTrick, moveDelegate);
	const hideDelegate = () => {
		for (const playedCard of playedCards) {
			animHideCard(playedCard.card);
		}
	};
	AnimController.queueAnimation(AnimType.WinTrick, hideDelegate);
}

/*function animRemoveKitty(trumpCandidate: Card, trumpSuit: Suit): void {
	if (!controller || controller.isStatMode()) { return; }

	const deckElement = document.getElementById("deck") as HTMLDivElement;
	const hideTrumpCandidate = trumpCandidate.suit !== trumpSuit;

	const delegate = () => {
		animHideCard(deckElement);
		if (hideTrumpCandidate) {
			animHideCard(trumpCandidate);
		}
	};
	AnimController.queueAnimation(AnimType.DealHands, delegate);
}*/

function animHidePartnerHand(alonePlayer: Player, hands: Card[][]): void {
	if (!controller || controller.isStatMode()) { return; }

	const player = getPartner(alonePlayer);
	for (const card of hands[player]) {
		animHideCard(card);
	}
}

function animHideCard(cardOrIdOrElement: Card | string | HTMLDivElement): void {
	if (!controller || controller.isStatMode()) { return; }

	const cardElement = getCardElement(cardOrIdOrElement);
	if (!cardElement) {
		return;
	}
	cardElement.style.display = "none";
}

function animClearTable(): void {
	if (!controller || controller.isStatMode()) { return; }

	const cardsContainer = document.getElementById("cardsContainer");
	if (cardsContainer) {
		cardsContainer.innerHTML = "";
	}
}

//let human player poke the buttons
function animEnableBidding(hand: Card[], bidStage: BidStage, trumpCandidate: Card): void {
	if (controller && controller.isStatMode()) { return; }

	// Make typescript happy
	const orderUpPrompt = document.getElementById("orderUpPrompt");
	if (!orderUpPrompt) {
		return;
	}

	const orderUpButton = document.getElementById("orderUp") as HTMLElement;
	const spadesButton = document.getElementById("pickSpades") as HTMLElement;
	const clubsButton = document.getElementById("pickClubs") as HTMLElement;
	const heartsButton = document.getElementById("pickHearts") as HTMLElement;
	const diamondsButton = document.getElementById("pickDiamonds") as HTMLElement;

	orderUpPrompt.style.display = "inline";

	// Bidding round 1
	if (bidStage === BidStage.Round1) {
		if (hasSuit(hand, trumpCandidate.suit)) {
			orderUpButton.style.display = "inline";
		}
		return;
	}

	// Bidding round 2
	if (trumpCandidate.suit !== Suit.Spades && hasSuit(hand, Suit.Spades)) {
		spadesButton.style.display = "inline";
	}
	if (trumpCandidate.suit !== Suit.Clubs && hasSuit(hand, Suit.Clubs)) {
		clubsButton.style.display = "inline";
	}
	if (trumpCandidate.suit !== Suit.Hearts && hasSuit(hand, Suit.Hearts)) {
		heartsButton.style.display = "inline";
	}
	if (trumpCandidate.suit !== Suit.Diamonds && hasSuit(hand, Suit.Diamonds)) {
		diamondsButton.style.display = "inline";
	}
}

function animDisableBidding(): void {
	if (controller && controller.isStatMode()) { return; }

	// Make typescript happy
	const orderUpPrompt: HTMLElement = document.getElementById("orderUpPrompt") as HTMLElement;
	const orderUpButton: HTMLElement = document.getElementById("orderUp") as HTMLElement;
	const spadesButton: HTMLElement = document.getElementById("pickSpades") as HTMLElement;
	const clubsButton: HTMLElement = document.getElementById("pickClubs") as HTMLElement;
	const heartsButton: HTMLElement = document.getElementById("pickHearts") as HTMLElement;
	const diamondsButton: HTMLElement = document.getElementById("pickDiamonds") as HTMLElement;
	const aloneButton: HTMLElement = document.getElementById("alone") as HTMLElement;

	orderUpPrompt.style.display = "none";
	orderUpButton.style.display = "none";

	spadesButton.style.display = "none";
	clubsButton.style.display = "none";
	heartsButton.style.display = "none";
	diamondsButton.style.display = "none";
	aloneButton.style.backgroundColor = "green";
}

function animShowText(text: string, messageLevel: MessageLevel,
	nest?: number, overwrite?: boolean): void {

	let allowedLevel: MessageLevel = MessageLevel.Step;
	if (controller) {
		allowedLevel = controller.getMessageLevel();
	}
	let logText = "";

	if (messageLevel < allowedLevel) { return; }

	if (nest === undefined) {
		nest = 0;
	}
	for (let i = 0; i < nest; i++) {
		logText += "&nbsp;&nbsp;";
	}

	logText += text + "<br>";

	if (controller && controller.isStatMode()) {
		if (overwrite) {
			controller.logText = logText;
		} else {
			controller.logText += logText;
		}
	} else {
		updateLog(logText, overwrite);
	}
}

function updateLog(text: string, overwrite?: boolean): void {
	const div = document.getElementById("sidebarText");
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
	const div = document.getElementById("sidebarTop");
	if (!div) {
		return;
	}
	if (overwrite) {
		div.innerHTML = "";
	}
	div.innerHTML += text + "<br>";
}

function disableActions(): void {
	const blanket = document.getElementById("blanket");
	if (blanket) {
		blanket.style.display = "inline";
	}
}

function enableActions(): void {
	const blanket = document.getElementById("blanket");
	if (blanket) {
		blanket.style.display = "none";
	}
}
