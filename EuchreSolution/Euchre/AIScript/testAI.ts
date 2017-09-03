/******************************************************
/* Does whatever a test AI does
/*******************************************************/

class TestAI implements EuchreAI {
	//tslint:disable-next-line:no-empty
	public init(_me: Player) {
	}

	public chooseOrderUp(_hand: Card[], _trumpCandidate: Card, _dealer: Player) {
		return false;
	}

	public pickDiscard(hand: Card[], _trump: Suit) {
		return hand[0];
	}

	public pickTrump(_hand: Card[], _trumpCandidate: Card) {
		return Suit.Clubs;
	}

	public chooseGoAlone(_hand: Card[], _trump: Suit) {
		return false;
	}

	public pickCard(hand: Card[], _maker: Player, _trump: Suit, trickSoFar: PlayedCard[]) {
		if (trickSoFar.length === 0) {
			return hand[0];
		}
		let trickSuit = trickSoFar[0].card.suit;
		for (let card of hand) {
			if (isValidPlay(hand, card, trickSuit)) {
				return card;
			}
		}
		//we will never reach this but just in case
		return hand[0];
	}

	//tslint:disable-next-line:no-empty
	public trickEnd(_playedCardsCallback: () => PlayedCard[]): void { }
}
