/*******************************
* Get game properties
********************************/

//**NOT TESTING**
function isTrump(card: Card, trump: Suit): boolean {
	return card.suit === trump;
}

//**NOT TESTING**
function followsSuit(card: Card, trickSuit: Suit): boolean {
	if (card.suit === trickSuit) {
		return true;
	}
	return false;
}

/* Returns whether or not it is currently legal for the given player to
   order up a given suit.
   Depends on bidding round */
/*function canOrderUpSuit(playerHand: Card[], suit: Suit): boolean {
	let trumpCandidate = game.getTrumpCandidate() as Card;
	if (game.getGameStage() === HandStage.BidRound1) {
		if (trumpCandidate.suit !== suit) return false;
		if (hasSuit(playerHand, suit)) return true;
	} else if (game.getGameStage() === HandStage.BidRound2) {
		if (trumpCandidate.suit === suit) return false;
		if (hasSuit(playerHand, suit)) return true;
	}
	return false;
}*/

//**NOT TESTING**
//how many cards of a given suit you have
function numCardsOfSuit(playerHand: Card[], suit: Suit): number {
	let count = 0;
	for (let i = 0; i < playerHand.length; i++) {
		if (playerHand[i].suit === suit) count++;
	}
	return count;
}

//**NOT TESTING**
//number of suits you're holding
function countSuits(hand: Card[]): number {
	let suitArray: Suit[] = [];
	for (let i = 0; i < hand.length; i++) {
		suitArray[hand[i].suit] = 1;
	}
	return suitArray[Suit.Clubs] + suitArray[Suit.Diamonds] + suitArray[Suit.Hearts] + suitArray[Suit.Spades];
}

//**NOT TESTING**
function getFirstLegalCard(playerHand: Card[], suitLead?: Suit): Card | undefined {
	for (let i = 0; i < playerHand.length; i++) {
		if (isValidPlay(playerHand, playerHand[i], suitLead)) {
			return playerHand[i];
		}
	}
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
//if a card is undefined, the other card wins
//if both cards are undefined, return null
function greaterCard(card1: Card, card2: Card, trickSuit: Suit, trump: Suit): Card {
	if (card1 === undefined) {
		return card2;
	}
	else if (card2 === undefined) {
		return card1;
	}

	if (isTrump(card1, trump)) {
		if (!isTrump(card2, trump)) {
			return card1;
		}
	}
	else if (isTrump(card2, trump)) {
		return card2;
	}

	if (followsSuit(card1, trickSuit)) {
		if (!followsSuit(card2, trickSuit)) {
			return card1;
		}
	}
	else if (followsSuit(card2, trickSuit)) {
		return card2;
	}

	//both/neither are trump and both/neither follows suit
	if (card1.rank > card2.rank) return card1;
	else return card2;
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
	for (let i = 0; i < hand.length; i++) {
		if (hand[i].suit === suit) return true;
	}
	return false;
}

//**TESTED**
function getCardValue(card: Card, trickSuit?: Suit, trump?: Suit): number {
	let value;

	value = card.rank;
	if (trump && isTrump(card, trump)) value += 1000;
	else if (trickSuit && followsSuit(card, trickSuit)) value += 100;
	return value;
}

//**TESTED**
//returns: the best card of the trick and who played it as a PlayedCard
function getBestCardPlayed(cards: PlayedCard[], trump: Suit): PlayedCard | null {
	if (cards.length === 0) return null;
	if (cards.length === 1) return cards[0];

	let bestCard: Card = cards[0].card;
	let player: Player = cards[0].player;
	let trickSuit: Suit = bestCard.suit;
	let bestValue: number = getCardValue(bestCard, trickSuit, trump);

	for (let i = 1; i < cards.length; i++) {
		if (cards[i].card.suit !== trickSuit && cards[i].card.suit !== trump) {
			continue;
		}
		let value = getCardValue(cards[i].card, trickSuit, trump);
		if (value > bestValue) {
			bestCard = cards[i].card;
			player = cards[i].player;
			bestValue = value;
		}
	}
	return { player: player, card: bestCard };
}

//**TESTED**
//returns: the strongest card in your hand as a Card
function getBestCardInHand(hand: Card[], trickSuit?: Suit, trump?: Suit): Card | null {
	if (hand.length === 0) return null;
	if (hand.length === 1) return hand[0];

	let bestCard: Card = hand[0];
	let bestValue: number = getCardValue(bestCard, trickSuit, trump);

	for (let i = 1; i < hand.length; i++) {
		let value = getCardValue(hand[i], trickSuit, trump);
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
	for (let handCard of hand) {
		if (handCard.id === card.id) return true;
	}
	return false;
}

//TODO: do we need this? Rename to worst card in hand and fix?
function getWorstCard(hand: Card[], trickSuit?: Suit, trump?: Suit, mustBeLegal?: boolean): Card | null {
	let worstCard = null;
	let worstValue = 9999;
	let value;

	for (let i = 0; i < hand.length; i++) {
		if (mustBeLegal && !isValidPlay(hand, hand[i], trickSuit)) continue;
		value = getCardValue(hand[i], trickSuit, trump);
		if (value < worstValue) {
			worstCard = hand[i];
			worstValue = value;
		}
	}
	return worstCard;
}

//**NOT TESTING**
function nextPlayer(currentPlayer: Player): Player {
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
	let dealer;

	//if we have a dealer, get the next dealer
	if (prevDealer !== undefined) {
		dealer = nextPlayer(prevDealer);
	}
	//otherwise just randomly grab one
	else {
		dealer = rng.nextInRange(0, 3);
	}
	return dealer;
}

function copyHand(hand: Card[]): Card[] {
	let newHand: Card[] = [];
	for (let card of hand) {
		newHand.push(new Card(card));
	}
	return newHand;
}