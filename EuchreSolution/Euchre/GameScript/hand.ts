enum HandStage {
	Bidding,
	Playing,
	Finished,
}

type ShuffleResult = {
	deck: Card[],
	jacks: Card[],
};

function getShuffledDeck(): ShuffleResult {
	let deck: Card[] = [];
	let jacks: Card[] = [];

	for (let i = 0; i < DECKSIZE; i++) {
		let j = rng.nextInRange(0, i);
		if (j !== i) {
			deck[i] = deck[j];
		}
		deck[j] = new Card(SORTEDDECK[i]);
		if (deck[j].rank === Rank.Jack) {
			jacks[deck[j].suit] = deck[j];
		}
	}

	return {
		deck: deck,
		jacks: jacks,
	};
}

function dealHands(deck: Card[], playerHands: Card[][], dealer: Player): void {
	for (let i = 0; i < 20; i++) {
		let player = (dealer + i) % 4;
		let cardPos = Math.floor(i / 4);
		//TODO: see if skipping the pop makes things faster
		playerHands[player][cardPos] = deck.pop() as Card;
	}
}

function calculatePointGain(tricksTaken: number, maker: boolean): number;
function calculatePointGain(tricksTaken: number, maker: boolean, alone: boolean): number;
function calculatePointGain(tricksTaken: number, maker: boolean, alone: true, defendingAlone: boolean): number;
function calculatePointGain(tricksTaken: number, maker: boolean, alone: false, defendingAlone: false): number;
function calculatePointGain(tricksTaken: number, maker: boolean, alone?: boolean, defendingAlone?: boolean): number {
	if (tricksTaken < 3) return 0;

	if (maker) {
		if (tricksTaken === 5) {
			return alone ? 4 : 2;
		}
		else {
			return 1;
		}
	}
	else {
		return alone && defendingAlone ? 4 : 2;
	}
}

class Hand {
	//General stuff
	private __settings: Settings;
	private __dealer: Player;
	private __playerHands: Card[][]; //2d array of everyone's hands
	private __aiPlayers: (EuchreAI | null)[];
	private __handStage: HandStage;

	//Bidding related
	private __bid: Bid;
	private __bidResult: BidResult | null;
	private __trumpCandidate: Card; //turned up card

	//Playing related
	private __trick: Trick;
	private __numTricksPlayed = 0;
	private __nsTricksWon = 0;
	private __ewTricksWon = 0;
	private __nsPointsWon = 0;
	private __ewPointsWon = 0;

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
	public trumpCandidate(): Card | undefined {
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
	constructor(dealer: Player, aiPlayers: (EuchreAI | null)[], ?settings: Settings) {
		this.__settings = settings;
		this.__dealer = dealer;
		this.__aiPlayers = aiPlayers;
		let player = dealer;
		for (let i = 0; i < 4; i++) {
			player = nextPlayer(player);
			let aiPlayer = aiPlayers[player];
			if (aiPlayer) {
				aiPlayer.init(player);
			}
		}

		//set up the deck and everyone's hands
		let {deck, jacks} = getShuffledDeck();
		this.__playerHands = [[], [], [], []];
		dealHands(deck, this.__playerHands, this.__dealer);
		this.__trumpCandidate = deck.pop() as Card;

		animDeal(this.__playerHands, this.__trumpCandidate, this.__dealer, this.__settings)
		console.log(this.__playerHands);

		//set up bidding
		this.__handStage = HandStage.Bidding;
		this.__bid = new Bid(this.__playerHands, jacks, this.__aiPlayers, this.__dealer, this.__trumpCandidate);
	}

	private advanceHand(): void {
		switch (this.__handStage) {
			case HandStage.Bidding:
				let bidResult = this.__bid.doBidding();
				if (paused) return;
				this.__bidResult = bidResult;
				if (bidResult) {
					this.__trick = new Trick(bidResult.trump, bidResult.alone,
						this.__playerHands, this.__aiPlayers, bidResult.maker,
						nextPlayer(this.__dealer));
					this.__handStage = HandStage.Playing;
				}
				else {
					this.endHand(false);
				}
				break;
			case HandStage.Playing:
				let trickEnded = this.__trick.doTrick();
				if (trickEnded) {
					this.handleEndTrick();
				}
				break;
		}
	}

	private handleEndTrick(): void {
		if (this.__trick.winningTeam() === Team.NorthSouth) {
			this.__nsTricksWon++;
			animShowText("NS won this trick", MessageLevel.Step, 2);
		}
		else {
			this.__ewTricksWon++;
			animShowText("EW won this trick", MessageLevel.Step, 2);
		}
		this.__numTricksPlayed++;
		if (this.__numTricksPlayed >= 5) {
			this.endHand(true);
		} else {
			let bidResult = this.__bidResult as BidResult;
			this.__trick = new Trick(bidResult.trump, bidResult.alone, this.__playerHands,
				this.__aiPlayers, bidResult.maker, this.__trick.currentPlayer());
		}
	}

	private endHand(completed: boolean): void {
		if (!completed || !this.__bidResult) {
			this.__handStage = HandStage.Finished;
			return; //TODO: deal with no one bidding
		}

		let isMaker = (this.__bidResult.maker === Player.North || this.__bidResult.maker === Player.South);
		this.__nsPointsWon = calculatePointGain(this.__nsTricksWon, isMaker, this.__bidResult.alone);
		this.__ewPointsWon = calculatePointGain(this.__ewTricksWon, !isMaker, this.__bidResult.alone);

		this.__handStage = HandStage.Finished;
	}

	/* Public functions */
	public doHand(): void {
		while (!this.isFinished() && !paused) {
			this.advanceHand();
		}
		return;
	}

	public isFinished(): boolean {
		return this.__handStage === HandStage.Finished;
	}
}
