/******************************************************
/* Bids if it has 3+ of the suit (including left, but not including pickup if first round dealer)
/* Will play the the lowest card that can beat all cards played so far
/* If last player and partner is winning, sluff
/*******************************************************/
class DecentAI implements EuchreAI {
	private handStrength: number;

	//tslint:disable-next-line:no-empty
	public init(_me: Player): void { }

	public chooseOrderUp(hand: Card[], trumpCandidate: Card, _dealer: Player): boolean {
		this.handStrength = this.calculateHandStrength(hand, trumpCandidate.suit);
		if (this.handStrength > 2) { return true; }
		return false;
	}

	public pickDiscard(hand: Card[], trump: Suit): Card | null {
		return getWorstCardInHand(hand, undefined, trump);
	}

	public pickTrump(hand: Card[], trumpCandidate: Card): Suit | null {
		const trumpCandidateSuit = trumpCandidate.suit;
		if (trumpCandidateSuit !== Suit.Clubs) {
			this.handStrength = this.calculateHandStrength(hand, Suit.Clubs);
			if (this.handStrength > 2) { return Suit.Clubs; }
		}

		if (trumpCandidateSuit !== Suit.Diamonds) {
			this.handStrength = this.calculateHandStrength(hand, Suit.Diamonds);
			if (this.handStrength > 2) { return Suit.Diamonds; }
		}

		if (trumpCandidateSuit !== Suit.Spades) {
			this.handStrength = this.calculateHandStrength(hand, Suit.Spades);
			if (this.handStrength > 2) { return Suit.Spades; }
		}

		if (trumpCandidateSuit !== Suit.Hearts) {
			this.handStrength = this.calculateHandStrength(hand, Suit.Hearts);
			if (this.handStrength > 2) { return Suit.Hearts; }
		}

		return null;
	}

	public chooseGoAlone(_hand: Card[], _trump: Suit): boolean {
		return this.handStrength > 4;
	}

	public pickCard(hand: Card[], _maker: Player, trump: Suit, trickSoFar: PlayedCard[]): Card | null {
		let numPlayersPlayed;
		let lowestWinningCard: Card | null = null;
		let lowestWinningValue = 9999;
		let winningValue = 0;
		let value;
		let i;

		numPlayersPlayed = trickSoFar.length;
		if (numPlayersPlayed === 0) {
			return getBestCardInHand(hand, undefined, trump);
		}

		const trickSuit = trickSoFar[0].card.suit;
		//Find currently winning value
		const bestPlayedCard = getBestCardPlayed(trickSoFar, trump) as PlayedCard;
		winningValue = getCardValue(bestPlayedCard.card, trump);

		//If not last player, play the lowest card that can win
		//If we can't win, then sluff
		for (i = 0; i < hand.length; i++) {
			if (!isValidPlay(hand, hand[i], trickSuit)) { continue; }
			value = getCardValue(hand[i], trickSuit, trump);
			if (value > winningValue) {
				if (value < lowestWinningValue) {
					lowestWinningCard = hand[i];
					lowestWinningValue = value;
				}
			}
		}

		if (lowestWinningCard) {
			return lowestWinningCard;
		} else {
			return getWorstCardInHand(hand, trickSuit, trump);
		}
	}

	//tslint:disable-next-line:no-empty
	public trickEnd(_playedCardsCallback: () => PlayedCard[]): void { }

	//Whatever just count trump
	private calculateHandStrength(hand: Card[], trump: Suit) {
		let smartlyCalculatedValue;

		smartlyCalculatedValue = numCardsOfSuit(hand, trump);
		if (this.theyHaveTheLeft(hand, trump)) {
			smartlyCalculatedValue++;
		}

		//just number of trump you're holding yay
		return smartlyCalculatedValue;
	}

	private theyHaveTheLeft(hand: Card[], trump: Suit) {
		for (const card of hand) {
			if (card.rank === Rank.Jack && card.suit === getOppositeSuit(trump)) {
				return true;
			}
		}
		return false;
	}
}
