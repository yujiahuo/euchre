/******************************************************
/* Does whatever a test AI does
/*******************************************************/

class TestAI implements EuchreAI {

	init(_me: Player) {
	}

	chooseOrderUp(_hand: Card[], _trumpCandidate: Card, _dealer: Player) {
		return false;
	}

	pickDiscard(hand: Card[], _trump: Suit) {
		return hand[0];
	}

	pickTrump(_hand: Card[], _trumpCandidate: Card) {
		return Suit.Clubs;
	}

	chooseGoAlone(_hand: Card[], _trump: Suit) {
		return false;
	}

	pickCard(hand: Card[], _maker: Player, _trump: Suit, trickSoFar: PlayedCard[]) {
		if (trickSoFar.length === 0) {
			return hand[0];
		}
		let trickSuit = trickSoFar[0].card.suit
		for (let i = 0; i < hand.length; i++) {
			if (isValidPlay(hand, hand[i], trickSuit)) {
				return hand[i];
			}
		}
		//we will never reach this but just in case
		return hand[0];
	}

	trickEnd(_playedCardsCallback: () => PlayedCard[]): void { }
}
