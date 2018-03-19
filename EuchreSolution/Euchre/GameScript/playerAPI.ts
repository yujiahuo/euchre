/*******************************
* Get game properties
********************************/

function isTrump(card: Card, trump: Suit): boolean {
	return card.suit === trump;
}

function followsSuit(card: Card, trickSuit: Suit): boolean {
	if (card.suit === trickSuit) {
		return true;
	}
	return false;
}

//**NOT TESTING**
//how many cards of a given suit a hand has
function numCardsOfSuit(hand: Card[], suit: Suit): number {
	let count = 0;
	for (const card of hand) {
		if (card.suit === suit) { count++; }
	}
	return count;
}

//**NOT TESTING**
//number of suits a hand has
function countSuits(hand: Card[]): number {
	const suitArray: Suit[] = [];
	for (const card of hand) {
		suitArray[card.suit] = 1;
	}
	return suitArray[Suit.Clubs] + suitArray[Suit.Diamonds] + suitArray[Suit.Hearts] + suitArray[Suit.Spades];
}

//**NOT TESTING**
function getFirstLegalCard(hand: Card[], suitLead?: Suit): Card | null {
	for (const card of hand) {
		if (isValidPlay(hand, card, suitLead)) {
			return card;
		}
	}
	return null;
}

function getTeam(player: Player): Team {
	switch (player) {
		case Player.North:
		case Player.South:
			return Team.NorthSouth;
		case Player.East:
		case Player.West:
			return Team.EastWest;
	}
}

//**TESTED**
//returns the card that is greater in this trick
function greaterCard(card1: Card, card2: Card, trickSuit: Suit, trump: Suit): Card {
	if (isTrump(card1, trump)) {
		if (!isTrump(card2, trump)) {
			return card1;
		}
	} else if (isTrump(card2, trump)) {
		return card2;
	}

	if (followsSuit(card1, trickSuit)) {
		if (!followsSuit(card2, trickSuit)) {
			return card1;
		}
	} else if (followsSuit(card2, trickSuit)) {
		return card2;
	}

	//both/neither are trump and both/neither follows suit
	if (card1.rank > card2.rank) {
		return card1;
	} else {
		return card2;
	}
}

//**TESTED**
function isValidPlay(playerHand: Card[], card: Card, trickSuit?: Suit): boolean {
	if (trickSuit === undefined) {
		return true;
	}
	if (followsSuit(card, trickSuit)) {
		return true;
	}
	if (!hasSuit(playerHand, trickSuit)) {
		return true;
	}
	return false;
}

//**TESTED**
function hasSuit(hand: Card[], suit: Suit): boolean {
	for (const card of hand) {
		if (card.suit === suit) { return true; }
	}
	return false;
}

//**TESTED**
function getCardValue(card: Card, trickSuit?: Suit, trump?: Suit): number {
	let value = card.rank;
	if (trump !== undefined && isTrump(card, trump)) {
		value += 1000;
	} else if (trickSuit !== undefined && followsSuit(card, trickSuit)) {
		value += 100;
	}
	return value;
}

//**TESTED**
//returns: the best card of the trick and who played it as a PlayedCard
function getBestCardPlayed(cards: PlayedCard[], trump: Suit): PlayedCard | null {
	if (cards.length === 0) { return null; }
	if (cards.length === 1) { return cards[0]; }

	let bestCard: Card = cards[0].card;
	let player: Player = cards[0].player;
	const trickSuit: Suit = bestCard.suit;
	let bestValue: number = getCardValue(bestCard, trickSuit, trump);

	for (let i = 1; i < cards.length; i++) {
		if (cards[i].card.suit !== trickSuit && cards[i].card.suit !== trump) {
			continue;
		}
		const value = getCardValue(cards[i].card, trickSuit, trump);
		if (value > bestValue) {
			bestCard = cards[i].card;
			player = cards[i].player;
			bestValue = value;
		}
	}
	return { player, card: bestCard };
}

//**TESTED**
//returns: the strongest card in your hand as a Card
function getBestCardInHand(hand: Card[], trickSuit?: Suit, trump?: Suit): Card | null {
	if (hand.length === 0) { return null; }
	if (hand.length === 1) { return hand[0]; }

	let bestCard: Card = hand[0];
	let bestValue: number = getCardValue(bestCard, trickSuit, trump);

	for (let i = 1; i < hand.length; i++) {
		const value = getCardValue(hand[i], trickSuit, trump);
		if (value > bestValue) {
			bestCard = hand[i];
			bestValue = value;
		}
	}
	return bestCard;
}

//**TESTED**
//returns: whether the card is in the hand
function isInHand(hand: Card[], card: Card): boolean {
	return !!getCardFromHand(hand, card.id);
}

function getCardFromHand(hand: Card[], cardId: string): Card | null {
	for (const handCard of hand) {
		if (handCard.id === cardId) { return handCard; }
	}
	return null;
}

function getWorstCardInHand(hand: Card[], trickSuit?: Suit, trump?: Suit): Card | null {
	let worstCard = null;
	let worstValue = 9999;

	for (const card of hand) {
		const value = getCardValue(card, trickSuit, trump);
		if (value < worstValue) {
			worstCard = card;
			worstValue = value;
		}
	}
	return worstCard;
}

//**NOT TESTING**
function getNextPlayer(currentPlayer: Player, aloneMaker?: Player): Player {
	const nextPlayer = getNextPlayerNaive(currentPlayer);
	if (aloneMaker === undefined || nextPlayer !== getPartner(aloneMaker)) {
		return nextPlayer;
	}
	return getNextPlayerNaive(nextPlayer);
}

//**NOT TESTING**
function getNextPlayerNaive(currentPlayer: Player): Player {
	switch (currentPlayer) {
		case Player.South:
			return Player.West;
		case Player.West:
			return Player.North;
		case Player.North:
			return Player.East;
		case Player.East:
			return Player.South;
	}
}

//**NOT TESTING**
function getPartner(player: Player): Player {
	switch (player) {
		case Player.South:
			return Player.North;
		case Player.West:
			return Player.East;
		case Player.North:
			return Player.South;
		case Player.East:
			return Player.West;
	}
}

//**NOT TESTING**
function getOppositeSuit(suit: Suit): Suit {
	switch (suit) {
		case Suit.Clubs:
			return Suit.Spades;
		case Suit.Diamonds:
			return Suit.Hearts;
		case Suit.Hearts:
			return Suit.Diamonds;
		case Suit.Spades:
			return Suit.Clubs;
	}
}

//**TESTED**
function getNextDealer(prevDealer?: Player): Player {
	if (prevDealer === undefined) {
		return rng.nextInRange(0, 3);
	}
	return getNextPlayer(prevDealer);
}

function copyHand(hand: Card[]): Card[] {
	const newHand: Card[] = [];
	for (const card of hand) {
		newHand.push(new Card(card));
	}
	return newHand;
}
