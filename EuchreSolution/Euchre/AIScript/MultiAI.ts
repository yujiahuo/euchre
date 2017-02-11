interface BiddingAI {
	init(): void;

	chooseOrderUp(): boolean;

	pickDiscard(): Card | null;

	pickTrump(): Suit | null;

	chooseGoAlone(): boolean;
}

interface PlayingAI {
	init(): void;

	pickCard(): Card | null;

	trickEnd(): void;
}

class MultiAI implements EuchreAI {
	private biddingAI: BiddingAI;
	private playingAI: PlayingAI;

	constructor(biddingAI: BiddingAI, playingAI: PlayingAI) {
		this.biddingAI = biddingAI;
		this.playingAI = playingAI;
	}

	init(): void {
		this.biddingAI.init();
		this.playingAI.init();
	}

	chooseOrderUp(): boolean {
		return this.biddingAI.chooseOrderUp();
	}

	pickDiscard(): Card | null {
		return this.biddingAI.pickDiscard();
	}

	pickTrump(): Suit | null {
		return this.biddingAI.pickTrump();
	}

	chooseGoAlone(): boolean {
		return this.biddingAI.chooseGoAlone();
	}

	pickCard(): Card | null {
		return this.playingAI.pickCard();
	}

	trickEnd(): void {
		this.playingAI.trickEnd();
	}
}