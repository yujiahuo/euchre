enum HandStage {
	Dealing,
	Bidding,
	Playing,
	Finished,
}

// tslint:disable-next-line:interface-over-type-literal
type ShuffleResult = {
	deck: Card[],
	jacks: Card[],
};

class Hand {
	//General stuff
	private __settings: Settings;
	private __dealer: Player;
	private __playerHands: Card[][] = [[], [], [], []]; //2d array of everyone's hands
	private __aiPlayers: (EuchreAI | null)[];
	private __handStage = HandStage.Dealing;
	private __waiting = false;

	//Bidding related
	private __bid: Bid | null = null;
	private __bidResult: BidResult | null = null;
	private __trumpCandidate: Card | null = null; //turned up card

	//Playing related
	private __trick: Trick | null = null;
	private __numTricksPlayed = 0;
	private __nsTricksWon = 0;
	private __ewTricksWon = 0;
	private __nsPointsWon = 0;
	private __ewPointsWon = 0;
	private __doneCallback: () => void;

	/* Properties */
	public handStage(): HandStage {
		return this.__handStage;
	}
	public dealer(): Player {
		return this.__dealer;
	}
	public playerHands(): Card[][] {
		return this.__playerHands;
	}
	public trumpCandidate(): Card | null {
		return this.__trumpCandidate;
	}
	public numTricksPlayed(): number {
		return this.__numTricksPlayed;
	}
	public nsTricksWon(): number {
		return this.__nsTricksWon;
	}
	public ewTricksWon(): number {
		return this.__ewTricksWon;
	}
	public nsPointsWon(): number {
		return this.__nsPointsWon;
	}
	public ewPointsWon(): number {
		return this.__ewPointsWon;
	}

	/* constructor */
	constructor(doneCallback: () => void, dealer: Player,
		aiPlayers: (EuchreAI | null)[], settings: Settings) {
		this.__doneCallback = doneCallback;
		this.__dealer = dealer;
		this.__aiPlayers = aiPlayers;
		this.__settings = settings;

		let player = this.__dealer;
		for (let i = 0; i < 4; i++) {
			player = getNextPlayer(player);
			const aiPlayer = this.__aiPlayers[player];
			if (aiPlayer) {
				aiPlayer.init(player);
			}
		}
	}

	public static getShuffledDeck(): ShuffleResult {
		const deck: Card[] = [];
		const jacks: Card[] = [];

		for (let i = 0; i < DECKSIZE; i++) {
			const j = rng.nextInRange(0, i);
			if (j !== i) {
				deck[i] = deck[j];
			}
			deck[j] = new Card(SORTEDDECK[i]);
			if (deck[j].rank === Rank.Jack) {
				jacks[deck[j].suit] = deck[j];
			}
		}

		return { deck, jacks };
	}

	public static dealHands(deck: Card[], playerHands: Card[][], dealer: Player): void {
		for (let i = 0; i < 20; i++) {
			const player = (dealer + i + 1) % 4;
			const cardPos = Math.floor(i / 4);
			//TODO: see if skipping the pop makes things faster
			playerHands[player][cardPos] = deck.pop() as Card;
		}
	}

	public static calculatePointGain(tricksTaken: number, maker: boolean, alone?: boolean): number;
	public static calculatePointGain(tricksTaken: number, maker: boolean, alone: true, defendingAlone: boolean): number;
	public static calculatePointGain(tricksTaken: number, maker: boolean, alone: false, defendingAlone: false): number;
	public static calculatePointGain(tricksTaken: number, maker: boolean, alone?: boolean,
		defendingAlone?: boolean): number {

		if (tricksTaken < 3) { return 0; }

		if (maker) {
			if (tricksTaken === 5) {
				return alone ? 4 : 2;
			} else {
				return 1;
			}
		} else {
			return alone && defendingAlone ? 4 : 2;
		}
	}

	private bidComplete = (result: BidResult | null): void => {
		this.__waiting = false;
		this.__bidResult = result;
		if (result) {
			const nextPlayer = getNextPlayer(this.__dealer, result.alone ? result.maker : undefined);
			this.__trick = new Trick(this.handleEndTrick, result.trump, result.alone,
				this.__playerHands, this.__aiPlayers, result.maker, nextPlayer);
			this.__handStage = HandStage.Playing;
		} else {
			this.endHand(false);
		}
		this.doHand();
	}

	private dealDone = (jacks: Card[]): void => {
		this.__waiting = false;
		this.__bid = new Bid(this.bidComplete, this.__playerHands, jacks,
			this.__aiPlayers, this.__dealer, this.__trumpCandidate as Card);
		this.__handStage = HandStage.Bidding;
		this.doHand();
	}

	private advanceHand(): void {
		switch (this.__handStage) {
			case HandStage.Dealing:
				//set up the deck and everyone's hands
				const { deck, jacks } = Hand.getShuffledDeck();
				this.__playerHands = [[], [], [], []];
				Hand.dealHands(deck, this.__playerHands, this.__dealer);
				this.__trumpCandidate = deck.pop() as Card;
				this.__waiting = true;
				const wrapper = () => this.dealDone(jacks);
				animDeal(this.__playerHands, this.__trumpCandidate, this.__dealer, this.__settings, wrapper);
				break;
			case HandStage.Bidding:
				(this.__bid as Bid).doBidding();
				break;
			case HandStage.Playing:
				(this.__trick as Trick).doTrick();
				break;
			default:
				break;
		}
	}

	private handleEndTrick = (): void => {
		this.__waiting = false;
		if (!this.__trick) {
			return;
		}
		if (this.__trick.winningTeam() === Team.NorthSouth) {
			this.__nsTricksWon++;
			animShowText("NS won this trick", MessageLevel.Step, 2);
		} else {
			this.__ewTricksWon++;
			animShowText("EW won this trick", MessageLevel.Step, 2);
		}
		this.__numTricksPlayed++;
		if (this.__numTricksPlayed >= 5) {
			this.endHand(true);
			return;
		}
		const bidResult = this.__bidResult as BidResult;
		this.__trick = new Trick(this.handleEndTrick, bidResult.trump, bidResult.alone,
			this.__playerHands, this.__aiPlayers, bidResult.maker, this.__trick.winner() as Player);
	}

	private endHand = (completed: boolean): void => {
		if (!completed || !this.__bidResult) {
			this.__handStage = HandStage.Finished;
			return; //TODO: deal with no one bidding
		}

		const isMaker = (this.__bidResult.maker === Player.North || this.__bidResult.maker === Player.South);
		this.__nsPointsWon = Hand.calculatePointGain(this.__nsTricksWon, isMaker, this.__bidResult.alone);
		this.__ewPointsWon = Hand.calculatePointGain(this.__ewTricksWon, !isMaker, this.__bidResult.alone);

		this.__handStage = HandStage.Finished;
	}

	/* Public functions */
	public doHand(): void {
		while (!this.isFinished() && !pausedForHuman) {
			this.advanceHand();
			if (this.__waiting) {
				break;
			}
		}
		if (this.isFinished()) {
			this.__doneCallback();
		}
	}

	public isFinished(): boolean {
		return this.__handStage === HandStage.Finished;
	}
}
