class MultiAI implements EuchreAI {
	private biddingAI: BiddingAI;
	private playingAI: PlayingAI;

	constructor(biddingAI: BiddingAI, playingAI: PlayingAI) {
		this.biddingAI = biddingAI;
		this.playingAI = playingAI;
	}

	init(me: Player): void {
		this.biddingAI.init(me);
		this.playingAI.init(me);
	}

	chooseOrderUp(hand: Card[], trumpCandidate: Card, dealer: Player): boolean {
		return this.biddingAI.chooseOrderUp(hand, trumpCandidate, dealer);
	}

	pickDiscard(hand: Card[], trump: Suit): Card | null {
		return this.biddingAI.pickDiscard(hand, trump);
	}

	pickTrump(hand: Card[], trumpCandidate: Card): Suit | null {
		return this.biddingAI.pickTrump(hand, trumpCandidate);
	}

	chooseGoAlone(hand: Card[], trump: Suit): boolean {
		return this.biddingAI.chooseGoAlone(hand, trump);
	}

	pickCard(hand: Card[], maker: Player, trump: Suit, trickSoFar: PlayedCard[]): Card | null {
		return this.playingAI.pickCard(hand, maker, trump, trickSoFar);
	}

	trickEnd(playedCardsCallback: () => PlayedCard[]): void {
		this.playingAI.trickEnd(playedCardsCallback);
	}
}