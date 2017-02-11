/*******************************
* Get game properties
********************************/

//**NOT TESTING**
function myHand(): Card[] {
	return game.myHand();
}

//**NOT TESTING**
function me(): Player {
	return game.getCurrentPlayer();
}

//**NOT TESTING**
function isDealer(player: Player): boolean {
	return player === game.getDealer();
}

//**NOT TESTING**
function isTrump(card: Card, trump: Suit): boolean {
	return card.suit === trump;
}

//**NOT TESTING**
function followsSuit(card: Card, trickSuit: Suit): boolean {
	if (!trickSuit) {
		return true;
	}
	if (card.suit === trickSuit) {
		return true;
	}
	return false;
}

//**NOT TESTING**
/* Returns whether or not it is currently legal for the given player to
   order up a given suit.
   Depends on bidding round */
function canOrderUpSuit(hand: Card[], suit: Suit): boolean {
	if (game.getGameStage() === GameStage.BidRound1) {
		if (game.getTrumpCandidateCard().suit !== suit) return false;
		if (hasSuit(hand, suit)) return true;
	} else if (game.getGameStage() === GameStage.BidRound2) {
		if (game.getTrumpCandidateCard().suit === suit) return false;
		if (hasSuit(hand, suit)) return true;
	}
	return false;
}

//**NOT TESTING**
//how many cards of a given suit you have
function numCardsOfSuit(hand: Card[], suit: Suit): number {
	let count = 0;
	for (let i = 0; i < hand.length; i++) {
		if (hand[i].suit === suit) count++;
	}
	return count;
}

//**NOT TESTING**
//number of suits you're holding
function countSuits(): number {
	let suitArray = [];
	let hand = myHand();
	for (let i = 0; i < hand.length; i++) {
		suitArray[hand[i].suit] = 1;
	}
	return suitArray[Suit.Clubs] + suitArray[Suit.Diamonds] + suitArray[Suit.Hearts] + suitArray[Suit.Spades];
}

//**NOT TESTING**
function getFirstLegalCard(hand: Card[], suitLead: Suit): Card {
	for (let i = 0; i < hand.length; i++) {
		if (isValidPlay(hand, hand[i], suitLead)) {
			return hand[i];
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
function isValidPlay(hand: Card[], card: Card, trickSuit: Suit): boolean {
	if (card == null) { //double equal will also find undefined
		return false;
	}
	if (!hasSuit(hand, trickSuit)) {
		return true;
	}
	if (followsSuit(card, trickSuit)) {
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
function getBestCardPlayed(cards: PlayedCard[], trump: Suit): PlayedCard {
	if (cards.length === 0) return;
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
function getBestCardInHand(hand: Card[], trickSuit?: Suit, trump?: Suit): Card {
	if (hand.length === 0) return;
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

function isInHand(hand: Card[], card: Card): boolean {
	if (!hand || !card) return false;

	for (let i = 1; i < hand.length; i++) {
		if (hand[i].id === card.id) return true;
	}
	return false;
}

//TODO: do we need this? Rename to worst card in hand and fix?
function getWorstCard(hand: Card[], trickSuit?: Suit, trump?: Suit, mustBeLegal?: boolean): Card {
	let worstCard;
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
